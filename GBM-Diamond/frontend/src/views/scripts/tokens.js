let tokenUris;
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

const tokenFetcher = {
  getTokens: async function () {
    // tokens1155 = (await Promise.allSettled(erc1155contracts.map(
    //   async (item, index) => await this.get1155Tokens(index)
    // ))).map(result => result.value);

    return {
      tokens721: await this.get721Tokens(),
      tokens1155: [await this.get1155Tokens(0)],
    };
  },
  get721Tokens: async function () {
    const tokenAmount = await erc721contracts[0].methods.totalSupply().call();
    const keysArray = [...Array(parseInt(tokenAmount) + 1).keys()].slice(1);

    const tokensURIs = Promise.all(
      keysArray.map(
        async (item) => await erc721contracts[0].methods.tokenURI(item).call()
      )
    );
    const tokenOwners = Promise.all(
      keysArray.map(
        async (item) => await erc721contracts[0].methods.ownerOf(item).call()
      )
    );
    const escrowed = Promise.all(
      keysArray.map(
        async (item) =>
          await gbmContracts.methods
            .getERC721Token_depositor(erc721contractAddresses[0], item)
            .call()
      )
    );

    return {
      uris721: await tokensURIs,
      owners721: await tokenOwners,
      escrowed721: await escrowed,
    };
  },
  get1155Tokens: async function (_erc1155contractIndex) {
    // const tokenAmount = await erc1155contracts[_erc1155contractIndex].methods.getTokenIDArray().call();
    // console.log(tokenAmount);
    // const keysArray = [...Array(parseInt(tokenAmount) + 1).keys()].slice(1);
    /*
      Missing a way to get the tokens present in the contract (and URIs)
    */
    const keysArray = [11, 12, 13, 14, 15];

    const owned = (
      await erc1155contracts[_erc1155contractIndex].methods
        .balanceOfBatch([window.ethereum.selectedAddress], keysArray)
        .call()
    ).map((item, index) => {
      return {
        tokenId: keysArray[index],
        amount: parseInt(item),
      };
    });

    let escrowed = await Promise.all(
      keysArray.map(async (item) => ({
        tokenId: item,
        amount: await gbmContracts.methods
          .getERC1155Token_depositor(
            deploymentStatus.ERC1155[_erc1155contractIndex],
            item,
            window.ethereum.selectedAddress
          )
          .call(),
      }))
    );

    return {
      owned1155: owned,
      escrowed1155: escrowed,
    };
  },
  getCollectionNames: async function () {
    return Promise.all(
      erc1155contracts.map(async (contract) => contract.methods.name().call())
    );
  },
};

const cardGenerator = {
  generateAllCards: async function (
    _beneficiaries,
    _escrowed721,
    _owners721,
    _escrowed1155,
    _owned1155
  ) {
    const container = document.getElementById("nft-container");
    container.innerHTML = "";
    await this.generateTokensOnSale(_beneficiaries);
    await this.generateTokensInEscrow721(_escrowed721, _beneficiaries);
    for (x = 0; x < _escrowed1155.length; x++) {
      await this.generateTokensInEscrow1155(
        _escrowed1155[x],
        _beneficiaries,
        x
      );
    }
    await this.generateTokensOwned721(_owners721);
    for (x = 0; x < _owned1155.length; x++) {
      await this.generateTokensOwned1155(_owned1155[x], x);
    }
  },
  generateTokensOnSale: async function (_beneficiaries) {
    let ownedTokens = await Promise.all(
      _beneficiaries.map(async (item, index) => {
        return {
          owner: item.beneficiary,
          saleId: item.saleId,
          tokenAddress: await gbmContracts.methods
            .getSale_TokenAddress(item.saleId)
            .call(),
          tokenId: await gbmContracts.methods
            .getSale_TokenID(item.saleId)
            .call(),
          tokenKind: await gbmContracts.methods
            .getSale_TokenKind(item.saleId)
            .call(),
          tokenAmount: await gbmContracts.methods
            .getSale_TokenAmount(item.saleId)
            .call(),
        };
      })
    );

    ownedTokens = ownedTokens.filter(
      (item) =>
        item.owner.toLowerCase() ===
          window.ethereum.selectedAddress.toLowerCase() &&
        deploymentStatus.ERC1155.indexOf(item.tokenAddress) < 1
    );

    for (i = 0; i < ownedTokens.length; i++) {
      // let fetchedData = await getNFTAndCacheMedia(
      //   tokenUris[parseInt(ownedTokens[i].tokenId) - 1]
      // );
      let fetchedData = await (
        await fetch(`/whale/${ownedTokens[i].tokenId}/json`)
      ).json();

      let tokenToPass = {
        tokenId: ownedTokens[i].tokenId,
        name: fetchedData.name || "GBM Whale",
        description: fetchedData.description,
        image: fetchedData.image,
      };

      //TODO Name if 1155

      this.generateTokenElement(
        tokenToPass,
        "nft-on-auction",
        "View Auction",
        `redirectToAuction(${ownedTokens[i].saleId})`,
        ownedTokens[i].tokenKind === "0x73ad2146"
          ? undefined
          : ownedTokens[i].tokenAmount
      );
    }
  },
  generateTokensInEscrow721: async function (_escrowed, _beneficiaries) {
    let tokensOnSale = await Promise.all(
      _beneficiaries.map(
        async (item, index) =>
          await gbmContracts.methods.getSale_TokenID(item.saleId).call()
      )
    );

    let ownedTokens = _escrowed
      .map((item, index) => {
        return { owner: item, tokenId: index + 1 };
      })
      .filter(
        (item) =>
          item.owner.toLowerCase() ===
            window.ethereum.selectedAddress.toLowerCase() &&
          !tokensOnSale.includes(item.tokenId.toString())
      );

    for (i = 0; i < ownedTokens.length; i++) {
      let fetchedData = await getNFTAndCacheMedia(
        tokenUris[parseInt(ownedTokens[i].tokenId) - 1]
      );

      let tokenToPass = {
        tokenId: ownedTokens[i].tokenId,
        name: fetchedData.name || "GBM Whale",
        description: fetchedData.description,
        image: fetchedData.image,
      };

      this.generateTokenElement(
        tokenToPass,
        "nft-escrowed",
        "Start new auction",
        `createNewAuction(${ownedTokens[i].tokenId}, 'ERC721')`
      );
    }
  },
  generateTokensInEscrow1155: async function (
    _escrowed,
    _beneficiaries,
    index
  ) {
    let tokensOnSale = (
      await Promise.all(
        _beneficiaries.map(async (item, index) => {
          return {
            tokenId: parseInt(
              await gbmContracts.methods.getSale_TokenID(item.saleId).call()
            ),
            tokenKind: await gbmContracts.methods
              .getSale_TokenKind(item.saleId)
              .call(),
            tokenAmount: parseInt(
              await gbmContracts.methods.getSale_TokenAmount(item.saleId).call()
            ),
          };
        })
      )
    )
      .filter((item) => item.tokenKind === "0x973bb640")
      .forEach((item) => {
        let check = _escrowed.findIndex(
          (token) => token.tokenId === item.tokenId
        );
        if (check === -1) return;
        _escrowed[check].amount -= item.tokenAmount;
      });

    _escrowed = _escrowed.filter((item) => item.amount > 0);

    for (i = 0; i < _escrowed.length; i++) {
      let fetchedData = await (
        await fetch(`/whale/${_escrowed[i].tokenId}/json`)
      ).json();

      let tokenToPass = {
        tokenId: _escrowed[i].tokenId,
        name: collectionNames1155[index],
        description: fetchedData.description,
        image: fetchedData.image,
      };

      this.generateTokenElement(
        tokenToPass,
        "nft-escrowed",
        "Start new auction",
        `createNewAuction(${_escrowed[i].tokenId}, 'ERC1155', ${index})`,
        _escrowed[i].amount
      );
    }
  },
  generateTokensOwned721: async function (_tokens) {
    let ownedTokens = _tokens
      .map((item, index) => {
        return { owner: item, tokenId: index + 1 };
      })
      .filter(
        (item) =>
          item.owner.toLowerCase() ===
          window.ethereum.selectedAddress.toLowerCase()
      );

    for (i = 0; i < ownedTokens.length; i++) {
      let fetchedData = await getNFTAndCacheMedia(
        tokenUris[parseInt(ownedTokens[i].tokenId) - 1]
      );

      let tokenToPass = {
        tokenId: ownedTokens[i].tokenId,
        name: fetchedData.name || "GBM Whale",
        description: fetchedData.description,
        image: fetchedData.image,
      };

      this.generateTokenElement(
        tokenToPass,
        "nft-owned",
        "Put in NFT Contract Drop",
        `sendToEscrow(${ownedTokens[i].tokenId})`
      );
    }
  },
  generateTokensOwned1155: async function (_tokens, index) {
    let ownedTokens = _tokens.filter((item) => item.amount > 0);
    for (i = 0; i < ownedTokens.length; i++) {
      let fetchedData = await (
        await fetch(`/whale/${ownedTokens[i].tokenId}/json`)
      ).json();

      let tokenToPass = {
        tokenId: ownedTokens[i].tokenId,
        name: collectionNames1155[index],
        description: fetchedData.description,
        image: fetchedData.image,
      };

      this.generateTokenElement(
        tokenToPass,
        "nft-owned",
        "Put in NFT Contract Drop",
        `sendToEscrow1155(${ownedTokens[i].tokenId}, ${index})`,
        ownedTokens[i].amount
      );
    }
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
              ? `<div style="color: var(--primary); font-weight: 400">${_amount}x&nbsp;</div>`
              : ""
          }${_token.name} #${_token.tokenId}</div>
          <div class="flex-row" style="margin-top: 15px;">
          ${
            //     <div class="nft-company">
            //     <img class="nft-company-image" src="images/hardhat.svg">
            //     <div class="nft-company-name">GBM</div>
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
};

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
  const owned1155All = tokens1155.map((contract) => contract.owned1155);
  const escrowed1155All = tokens1155.map((contract) => contract.escrowed1155);

  tokenUris = uris721;
  const auctions = await getOngoingAuctions();
  const beneficiaries = await getAuctionBeneficiaries(auctions);
  await cardGenerator.generateAllCards(
    beneficiaries,
    escrowed721,
    owners721,
    escrowed1155All,
    owned1155All
  );
}

async function getOngoingAuctions() {
  const salesAmount = await gbmContracts.methods.getTotalNumberOfSales().call();
  const keysArray = [...Array(parseInt(salesAmount) + 1).keys()].slice(1);
  let ongoingAuctions = await Promise.all(
    keysArray.map(async (item) => {
      const check = await gbmContracts.methods.getSale_Claimed(item).call();
      return !check ? item : 0;
    })
  );

  ongoingAuctions = ongoingAuctions.filter((item) => item > 0);
  return ongoingAuctions;
}

const getAuctionBeneficiaries = async (saleIDs) =>
  await Promise.all(
    saleIDs.map(async (item) => {
      return {
        beneficiary: await gbmContracts.methods
          .getSale_Beneficiary(item)
          .call(),
        saleId: item,
      };
    })
  );

async function createNewAuction(_tokenId, _tokenKind, _index) {
  location.href = `${window.location.protocol}//${window.location.host}/create?tokenId=${_tokenId}&tokenKind=${_tokenKind}&contractIndex=${_index}`;
}

async function sendToEscrow(tokenId) {
  await freezeAndSendToMetamask(() => erc721contracts[0].methods
    .safeTransferFrom(window.ethereum.selectedAddress, diamondAddress, tokenId)
    .send({ from: window.ethereum.selectedAddress }))
  // await erc721contracts[0].methods
  //   .safeTransferFrom(window.ethereum.selectedAddress, diamondAddress, tokenId)
  //   .send({ from: window.ethereum.selectedAddress });
}

//TODO implement amount
async function sendToEscrow1155(tokenId, index) {
  await erc1155contracts[index].methods
    .safeTransferFrom(
      window.ethereum.selectedAddress,
      diamondAddress,
      tokenId,
      1,
      0
    )
    .send({ from: window.ethereum.selectedAddress });
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
  location.href = `${window.location.protocol}//${window.location.host}/auction?saleId=${number}`;
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
