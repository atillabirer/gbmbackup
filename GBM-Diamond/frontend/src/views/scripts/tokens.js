let tokenUris;
let tokenUris1155;
let collectionNames1155;
let tokens1155;
let auctionTypeCount = {
  live: 0,
  upcoming: 0,
};
let currentView = 0;

Array.from(document.getElementsByClassName("filter-btn")).forEach(
  (_element, index) => {
    _element.onclick = function () {
      currentView = index;
      toggleNFTView(index);
    };
  }
);

const TokenFetcherProto = {
  getTokens: async function () {
    const [token721Result, tokens1155Result] = await Promise.all([
      this.get721Tokens(),
      this.get1155Tokens(),
    ]);

    return {
      tokens721: token721Result,
      tokens1155: tokens1155Result,
    };
  },
  get721Tokens: async function () {
    let keysArray = [];

    for (let i = 0; i < erc721contracts.length; i++) {
      const tokenAmount = await erc721contracts[i].methods.totalSupply().call();

      keysArray = [
        ...keysArray,
        ...[...Array(parseInt(tokenAmount) + 1).keys()]
          .slice(1)
          .map((item) => ({ contractIndex: i, key: item })),
      ];
    }

    const [uris721, owners721, escrowed721] = await Promise.allSettled([
      this.getErc721TokensURIs(keysArray),
      this.getErc721TokenOwners(keysArray),
      this.getErc721Escrowed(keysArray),
    ]);

    return {
      uris721: uris721.value?.map((v) => v?.value),
      owners721: owners721.value?.map((v) => v?.value),
      escrowed721: escrowed721.value?.map((v) => v?.value),
    };
  },
  get1155Tokens: async function () {
    const getErc1155TokensIDs = await this.getErc1155TokenIDs();

    const keysArray = getErc1155TokensIDs.reduce((acc, currValue, index) => {
      const modifiedCurrentValue = currValue?.value
        ? currValue.value.map((v) => ({
            contractIndex: index,
            key: parseInt(v),
          }))
        : [];

      return [...acc, ...modifiedCurrentValue];
    }, []);

    // Constructing the array to make it easier to get balance of the batch
    const arrayToGetBatchBalances = keysArray.reduce((acc, curr) => {
      acc[curr.contractIndex] ||= [];

      acc[curr.contractIndex] = [...acc[curr.contractIndex], curr.key];

      return acc;
    }, []);

    const [itemUris1155, itemOwned1155, itemEscrowed1155] =
      await Promise.allSettled([
        this.getErc1155TokensURIs(keysArray),
        this.getErc1155OwnerAmounts(arrayToGetBatchBalances),
        this.getErc1155Escrowed(keysArray),
      ]);

    return {
      uris1155: itemUris1155?.value?.map((v) => v.value),
      owned1155: itemOwned1155?.value?.reduce(
        (acc, currValue) => [...acc, ...(currValue?.value || [])],
        []
      ),
      escrowed1155: itemEscrowed1155?.value?.map((v) => v.value),
    };
  },
  getCollectionNames: async function () {
    return Promise.all(
      erc1155contracts.map(async (contract) => contract.methods.name().call())
    );
  },
  // HELPER FUNCTIONS
  async getErc721TokensURIs(keysArray) {
    return await Promise.allSettled(
      keysArray.map(async (item) => {
        const tokenUri = await erc721contracts[item.contractIndex].methods
          .tokenURI(item.key)
          .call();

        return {
          tokenAddress:
            erc721contracts[item.contractIndex]._address.toLowerCase(),
          tokenId: item.key,
          tokenUri,
        };
      })
    );
  },

  async getErc721TokenOwners(keysArray) {
    return await Promise.allSettled(
      keysArray.map(async (item) => {
        const owner = await erc721contracts[item.contractIndex].methods
          .ownerOf(item.key)
          .call();

        return {
          tokenAddress:
            erc721contracts[item.contractIndex]._address.toLowerCase(),
          tokenId: item.key,
          owner: owner?.toLowerCase(),
        };
      })
    );
  },

  async getErc721Escrowed(keysArray) {
    return await Promise.allSettled(
      keysArray.map(async (item) => {
        const depositor = await gbmContracts.methods
          .getERC721Token_depositor(
            erc721contractAddresses[item.contractIndex],
            item.key
          )
          .call();

        return {
          tokenAddress:
            erc721contracts[item.contractIndex]._address.toLowerCase(),
          tokenId: item.key,
          depositor: depositor?.toLowerCase(),
        };
      })
    );
  },

  async getErc1155TokenIDs() {
    return await Promise.allSettled(
      erc1155contracts?.map(
        async (sContract) => await sContract.methods.getTokenIDArray().call()
      )
    );
  },

  async getErc1155TokensURIs(keysArray) {
    return await Promise.allSettled(
      keysArray.map(async (item) => {
        const tokenUri = await erc1155contracts[item.contractIndex].methods
          .uri(item.key)
          .call();

        return {
          tokenAddress:
            erc1155contracts[item.contractIndex]._address.toLowerCase(),
          tokenId: item.key,
          tokenUri,
        };
      })
    );
  },

  async getErc1155OwnerAmounts(arrayToGetBalances) {
    return await Promise.allSettled(
      arrayToGetBalances.map(async (itemKeyArray, itemIndex) => {
        const res = await erc1155contracts[itemIndex].methods
          .balanceOfBatch([window.ethereum.selectedAddress], itemKeyArray)
          .call();

        return res.map((item, index) => ({
          tokenAddress: erc1155contracts[itemIndex]._address.toLowerCase(),
          owner: window.ethereum.selectedAddress.toLowerCase(),
          tokenId: itemKeyArray[index],
          amount: parseInt(item),
        }));
      })
    );
  },

  async getErc1155Escrowed(keysArray) {
    return await Promise.allSettled(
      keysArray.map(async (item) => {
        const res = await gbmContracts.methods
          .getERC1155Token_depositor(
            deploymentStatus.ERC1155[item.contractIndex],
            item.key,
            window.ethereum.selectedAddress
          )
          .call();

        return {
          tokenAddress:
            deploymentStatus.ERC1155[item.contractIndex].toLowerCase(),
          depositor: window.ethereum.selectedAddress.toLowerCase(),
          tokenId: item.key,
          amount: parseInt(res),
        };
      })
    );
  },
};

function createTokenFetcher() {
  return Object.create(TokenFetcherProto);
}

const LiveAuctionsHandlerProto = {
  async getTokensOnSale(_beneficiaries) {
    const tokensOnSale = await Promise.allSettled(
      _beneficiaries.map(async (item) => {
        const [tokenAddress, tokenId, tokenKind, amount] = await Promise.all([
          this.getSaleTokenAddress(item.saleId),
          this.getSaleTokenId(item.saleId),
          this.getSaleTokenKind(item.saleId),
          this.getSaleTokenAmount(item.saleId),
        ]);

        return {
          owner: item.beneficiary,
          saleId: item.saleId,
          tokenAddress,
          tokenId,
          tokenKind,
          amount,
        };
      })
    );

    return tokensOnSale.map((t) => t?.value);
  },

  async getOngoingAuctions() {
    const salesAmount = await this.getTotalNumberOfSales();
    const keysArray = [...Array(parseInt(salesAmount) + 1).keys()].slice(1);
    let ongoingAuctions = await Promise.all(
      keysArray.map(async (item) => {
        const check = await this.getSaleTokenClaimed(item);

        return !check ? item : 0;
      })
    );

    ongoingAuctions = ongoingAuctions.filter((item) => item > 0);
    return ongoingAuctions;
  },

  async getAuctionBeneficiaries(saleIDs) {
    return await Promise.all(
      saleIDs.map(async (saleId) => ({
        beneficiary: await this.getSaleTokenBeneficiary(saleId),
        saleId,
      }))
    );
  },

  async getTotalNumberOfSales() {
    return await gbmContracts.methods.getTotalNumberOfSales().call();
  },

  async getSaleTokenClaimed(item) {
    return await gbmContracts.methods.getSale_Claimed(item).call();
  },

  async getSaleTokenBeneficiary(saleId) {
    return await gbmContracts.methods.getSale_Beneficiary(saleId).call();
  },

  async getSaleTokenAddress(saleId) {
    return await gbmContracts.methods.getSale_TokenAddress(saleId).call();
  },

  async getSaleTokenId(saleId) {
    return await gbmContracts.methods.getSale_TokenID(saleId).call();
  },

  async getSaleTokenKind(saleId) {
    return await gbmContracts.methods.getSale_TokenKind(saleId).call();
  },

  async getSaleTokenAmount(saleId) {
    return await gbmContracts.methods.getSale_TokenAmount(saleId).call();
  },
};

function createLiveAuctionsHandler() {
  return Object.create(LiveAuctionsHandlerProto);
}

const CardGeneratorProto = {
  generateAllCards: async function (
    _beneficiaries,
    _escrowed721,
    _owners721,
    _escrowed1155,
    _owned1155
  ) {
    const container = document.getElementById("nft-container");
    container.innerHTML = "";

    const tokensOnSale = await liveAuctionsHandler.getTokensOnSale(
      _beneficiaries
    );

    await this.generateTokensOnSale(tokensOnSale);
    await this.generateTokensInEscrow721(_escrowed721, tokensOnSale);
    await this.generateTokensInEscrow1155(_escrowed1155, tokensOnSale);
    await this.generateTokensOwned721(_owners721);
    await this.generateTokensOwned1155(_owned1155);
  },

  generateTokensOnSale: async function (_tokensOnSale) {
    const ownedTokens = _tokensOnSale.filter(
      (item) =>
        item?.owner?.toLowerCase() ===
        window.ethereum.selectedAddress.toLowerCase()
      //    && deploymentStatus.ERC1155.indexOf(item.tokenAddress) < 1 [QUESTION] DON'T really understand why is this here removing it for now
    );

    await Promise.allSettled(
      ownedTokens.map(
        async (ownedToken) =>
          await this.treatTokenElement(
            ownedToken,
            "nft-on-auction",
            "View Auction",
            `redirectToAuction`
          )
      )
    );

    // Leaving the for loop option on just in case we want to revert back to it
    // for (i = 0; i < ownedTokens.length; i++) {
    //   await this.treatTokenElement(
    //     ownedTokens[i],
    //     "nft-on-auction",
    //     "View Auction",
    //     `redirectToAuction(${ownedTokens[i].saleId})`
    //   );
    // }
  },

  generateTokensInEscrow721: async function (_escrowed, _tokensOnSale) {
    const ownedTokens = _escrowed.filter(
      (item) =>
        item?.depositor === window.ethereum.selectedAddress.toLowerCase() &&
        !_tokensOnSale.includes(item?.tokenId.toString())
    );

    await Promise.allSettled(
      ownedTokens.map(
        async (ownedToken) =>
          await this.treatTokenElement(
            { ...ownedToken, tokenKind: "0x73ad2146" /*ERC721*/ },
            "nft-escrowed",
            "Start new auction",
            `createNewAuction`
          )
      )
    );
  },

  generateTokensInEscrow1155: async function (_escrowed, _tokensOnSale) {
    const inEscrow1155 = _escrowed;
    _tokensOnSale
      .filter((item) => item.tokenKind === "0x973bb640")
      .forEach((item) => {
        let check = inEscrow1155.findIndex(
          (token) => token?.tokenId === item?.tokenId
        );
        if (check === -1) return;
        inEscrow1155[check].amount -= item.amount;
      });

    const ownedTokens = inEscrow1155.filter(
      (item) =>
        item?.amount > 0 &&
        item.depositor === window.ethereum.selectedAddress.toLowerCase()
    );

    await Promise.allSettled(
      ownedTokens.map(
        async (ownedToken) =>
          await this.treatTokenElement(
            { ...ownedToken, tokenKind: "0x973bb640" /*ERC1155*/ },
            "nft-escrowed",
            "Start new auction",
            `createNewAuction`
          )
      )
    );
  },

  generateTokensOwned721: async function (_tokens) {
    const ownedTokens = _tokens.filter(
      (item) => item.owner === window.ethereum.selectedAddress.toLowerCase()
    );

    await Promise.allSettled(
      ownedTokens.map(
        async (ownedToken) =>
          await this.treatTokenElement(
            { ...ownedToken, tokenKind: "0x73ad2146" /*ERC721*/ },
            "nft-owned",
            "Put in NFT Contract Drop",
            `sendToEscrow`
          )
      )
    );
  },

  generateTokensOwned1155: async function (_tokens) {
    const ownedTokens = _tokens.filter((item) => item.amount > 0);

    await Promise.allSettled(
      ownedTokens.map(
        async (ownedToken) =>
          await this.treatTokenElement(
            { ...ownedToken, tokenKind: "0x973bb640" /*ERC1155*/ },
            "nft-owned",
            "Put in NFT Contract Drop",
            `sendToEscrow1155`
          )
      )
    );
  },

  // Helper functions
  async treatTokenElement(
    _ownedToken,
    _className,
    _buttonText,
    _buttonCallbackSignature
  ) {
    const metadataURI = [
      ...(_ownedToken?.tokenKind === "0x73ad2146" ? tokenUris : tokenUris1155),
    ].find(
      (t) =>
        t?.tokenId === parseInt(_ownedToken?.tokenId) &&
        t?.tokenAddress === _ownedToken?.tokenAddress.toLowerCase()
    )?.tokenUri;

    const erc1155ContractIndex = erc1155contracts.findIndex(
      (sContract) =>
        sContract._address.toLowerCase() ===
        _ownedToken?.tokenAddress.toLowerCase()
    );

    const fetchedData = await getNFTAndCacheMedia(metadataURI);

    let tokenToPass = {
      tokenId: _ownedToken.tokenId,
      name:
        _ownedToken?.tokenKind === "0x73ad2146"
          ? fetchedData.name || "Stellaswap GBM Whale"
          : collectionNames1155[erc1155ContractIndex],
      description: fetchedData.description,
      image: fetchedData.image,
    };

    const buttonCallback = this.generateButtonCallbackSignature(
      _buttonCallbackSignature,
      _ownedToken.tokenKind,
      _ownedToken.tokenId,
      erc1155ContractIndex,
      _ownedToken.saleId
    );

    this.generateTokenElement(
      tokenToPass,
      _className,
      _buttonText,
      buttonCallback,
      _ownedToken.tokenKind === "0x73ad2146" ? undefined : _ownedToken.amount
    );
  },

  generateTokenElement: function (
    _token,
    _className,
    _buttonText,
    _buttonCallback,
    _amount
  ) {
    const container = document.getElementById("nft-container");

    const tokenEl = document.createElement("div");
    tokenEl.classList.add("nft");
    tokenEl.classList.add(_className);

    const tokenInnerHTML = `
      <img class="nft-media" src="/whale/${_token.tokenId}/image">
      <div class="nft-info">
          <div class="nft-name flex-row">${
            _amount !== undefined
              ? `<div style="color: ${window.COLOR_PALLETE.primary}; font-weight: 400">${_amount}x&nbsp;</div>`
              : ""
          }${_token.name} #${_token.tokenId}</div>
          <div class="flex-row" style="margin-top: 15px;">
          ${
            //     <div class="nft-company">
            //     <img class="nft-company-image" src="images/hardhat.svg">
            //     <div class="nft-company-name">Stellaswap GBM</div>
            // </div>

            //   _amount !== undefined && _className == 'nft-escrowed' ? `<button
            //   class="gbm-btn quantity-control"
            //   onclick="changeQuantity(-1)"
            //   style="margin-left: 10px;"
            // >
            //   -
            // </button>
            // <div>
            //   <input
            //     id="quantity-input"
            //     class="gbm-input-boxed quantity-box"
            //     type="text"
            //     value="1"
            //     disabled
            //   />
            // </div>
            // <button
            //   class="gbm-btn quantity-control"
            //   onclick="changeQuantity(1)"
            // >
            //   +
            // </button>` : ''
            ""
          }
          ${
            _buttonCallback !== "none"
              ? `<button class="gbm-btn nft-btn" onclick="${_buttonCallback}">${_buttonText}</button>`
              : ``
          }
        </div>
      </div>
    `;

    tokenEl.innerHTML = tokenInnerHTML;
    container.appendChild(tokenEl);
  },

  generateButtonCallbackSignature(
    _signature,
    _tokenKind,
    _tokenId,
    _contractIndex,
    _saleId
  ) {
    const signaturesMap = {
      redirectToAuction: `redirectToAuction(${_saleId})`,
      createNewAuction:
        _tokenKind === "0x73ad2146"
          ? `createNewAuction(${_tokenId}, 'ERC721')`
          : `createNewAuction(${_tokenId}, 'ERC1155', ${_contractIndex})`,
      sendToEscrow: `sendToEscrow(${_tokenId})`,
      sendToEscrow1155: `sendToEscrow1155(${_tokenId}, ${_contractIndex})`,
    };

    return signaturesMap[_signature];
  },
};

function createCardGenerator() {
  return Object.create(CardGeneratorProto);
}

const tokenFetcher = createTokenFetcher();
const liveAuctionsHandler = createLiveAuctionsHandler();
const cardGenerator = createCardGenerator();

onScriptLoad();

async function onScriptLoad() {
  await generateTokens();
  subscribeToTransfers();
  updateCounters();
  toggleNFTView(0);
}

function updateCounters() {
  let onAuction = Array.from(
    document.getElementsByClassName("nft-on-auction")
  ).length;
  let inEscrow = Array.from(
    document.getElementsByClassName("nft-escrowed")
  ).length;
  let owned = Array.from(document.getElementsByClassName("nft-owned")).length;
  document.getElementById("auction-number").innerHTML = onAuction;
  // document.getElementById("direct-number").innerHTML = Array.from(document.getElementsByClassName("nft-on-fixed")).length;
  document.getElementById("escrowed-number").innerHTML = inEscrow;
  document.getElementById("owned-number").innerHTML = owned;
  document.getElementById("all-number").innerHTML =
    onAuction + inEscrow + owned;
}

async function generateTokens() {
  let { tokens721, tokens1155 } = await tokenFetcher.getTokens();
  collectionNames1155 = await tokenFetcher.getCollectionNames();

  const { uris721, owners721, escrowed721 } = tokens721;
  const { uris1155, owned1155, escrowed1155 } = tokens1155;

  tokenUris = uris721;
  tokenUris1155 = uris1155;
  const auctions = await liveAuctionsHandler.getOngoingAuctions();

  const beneficiaries = await liveAuctionsHandler.getAuctionBeneficiaries(
    auctions
  );

  await cardGenerator.generateAllCards(
    beneficiaries,
    escrowed721,
    owners721,
    escrowed1155,
    owned1155
  );
}

async function createNewAuction(_tokenId, _tokenKind, _index) {
  location.href = `${window.location.protocol}//${window.location.host}/create?tokenId=${_tokenId}&tokenKind=${_tokenKind}&contractIndex=${_index}`;
}

async function sendToEscrow(tokenId) {
  await freezeAndSendToMetamask(() =>
    erc721contracts[0].methods
      .safeTransferFrom(
        window.ethereum.selectedAddress,
        diamondAddress,
        tokenId
      )
      .send({ from: window.ethereum.selectedAddress })
  );
  // await erc721contracts[0].methods
  //   .safeTransferFrom(window.ethereum.selectedAddress, diamondAddress, tokenId)
  //   .send({ from: window.ethereum.selectedAddress });
}

//TODO implement amount
async function sendToEscrow1155(tokenId, index) {
  await freezeAndSendToMetamask(() =>
    erc1155contracts[index].methods
      .safeTransferFrom(
        window.ethereum.selectedAddress,
        diamondAddress,
        tokenId,
        1,
        0
      )
      .send({ from: window.ethereum.selectedAddress })
  );
}

//TODO apply for 1155
function subscribeToTransfers() {
  erc721contracts[0].events
    .Transfer({}, function (error, event) {
      // console.log(event);
    })
    .on("data", async function (event) {
      await generateTokens();
      updateCounters();
      toggleNFTView(currentView);
    })
    .on("changed", function (event) {
      // console.log(event);
    })
    .on("error", console.error);

  for (i = 0; i < erc1155contracts.length; i++) {
    erc1155contracts[i].events
      .TransferSingle({}, function (error, event) {
        // console.log(event);
      })
      .on("data", async function (event) {
        await generateTokens();
        updateCounters();
        toggleNFTView(currentView);
      })
      .on("changed", function (event) {
        // console.log(event);
      })
      .on("error", console.error);
  }
}

function redirectToAuction(number) {
  location.href = `${window.location.protocol}//${window.location.host}/dapp/auction?saleId=${number}`;
}

function toggleNFTView(_filterButtonIndex) {
  Array.from(document.getElementsByClassName("filter-btn")).forEach(
    (_element) => _element.classList.remove("active")
  );
  Array.from(document.getElementsByClassName("nft-on-auction")).forEach(
    (_element) =>
      (_element.style.display =
        _filterButtonIndex == 0 || _filterButtonIndex == 3 ? `block` : `none`)
  );
  Array.from(document.getElementsByClassName("nft-escrowed")).forEach(
    (_element) =>
      (_element.style.display =
        _filterButtonIndex == 1 || _filterButtonIndex == 3 ? `block` : `none`)
  );
  Array.from(document.getElementsByClassName("nft-owned")).forEach(
    (_element) =>
      (_element.style.display =
        _filterButtonIndex == 2 || _filterButtonIndex == 3 ? `block` : `none`)
  );
  document
    .getElementsByClassName("filter-btn")
    [currentView].classList.add("active");
}
