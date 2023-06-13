let tokenUris;

let auctionTypeCount = {
  live: 0,
  upcoming: 0,
}
let currentView = 0;

Array.from(document.getElementsByClassName("filter-btn")).forEach((_element, index) => {
  _element.onclick = function() {
      currentView = index;
      toggleNFTView(index)
  }
});

onScriptLoad() 

async function onScriptLoad() {
  await generateTokens();
  subscribeToTransfers();
  updateCounters();
  toggleNFTView(0);
}

function updateCounters() {
  document.getElementById("auction-number").innerHTML = Array.from(document.getElementsByClassName("nft-on-auction")).length;
  // document.getElementById("direct-number").innerHTML = Array.from(document.getElementsByClassName("nft-on-fixed")).length;
  document.getElementById("escrowed-number").innerHTML = Array.from(document.getElementsByClassName("nft-escrowed")).length;
  document.getElementById("owned-number").innerHTML = Array.from(document.getElementsByClassName("nft-owned")).length;
  document.getElementById("all-number").innerHTML = Array.from(document.getElementsByClassName("nft-all")).length;
}

async function generateTokens() {
  const { uris, owners, escrowed } = await getTokens();
  tokenUris = uris;
  const auctions = await getOngoingAuctions();
  const beneficiaries = await getAuctionBeneficiaries(auctions);
  const container = document.getElementById("nft-container");
  container.innerHTML = '';
  await generateTokensOnSale(beneficiaries);
  await generateTokensInEscrow(escrowed, beneficiaries);
  await generateTokensOwned(owners);
  await generateAllTokens(owners);
}

async function getOngoingAuctions() {
  const salesAmount = await gbmContracts.methods.getTotalNumberOfSales().call();
  const keysArray = [...Array(parseInt(salesAmount)+1).keys()].slice(1)
  let ongoingAuctions = await Promise.all(keysArray.map(async (item) => {
    const check = await gbmContracts.methods.getSale_Claimed(item).call();
    return !check ? item : 0
  }));

  ongoingAuctions = ongoingAuctions.filter((item) => item > 0)
  return ongoingAuctions;
}

const getAuctionBeneficiaries = async (saleIDs) => (await Promise.all(saleIDs.map(async (item) => {
  return {
          beneficiary: await gbmContracts.methods.getSale_Beneficiary(item).call(),
          saleId: item
  }
})))

async function getTokens() {
  const tokenAmount = await erc721contract.methods.totalSupply().call();
  const keysArray = [...Array(parseInt(tokenAmount)+1).keys()].slice(1)

  const tokensURIs= Promise.all(keysArray.map(async (item) => await erc721contract.methods.tokenURI(item).call()));
  const tokenOwners = Promise.all(keysArray.map(async (item) => await erc721contract.methods.ownerOf(item).call()));
  const escrowed = Promise.all(keysArray.map(async (item) => await gbmContracts.methods.getERC721Token_depositor(erc721contractAddress, item).call()));

  return {
    uris: (await tokensURIs), 
    owners: (await tokenOwners),
    escrowed: (await escrowed),
  }
}

async function generateTokensOnSale(beneficiaries) {
  let ownedTokens = (await Promise.all(beneficiaries.map(async (item, index) => {
      return { 
        owner: item.beneficiary, 
        saleId: item.saleId, 
        tokenId: await gbmContracts.methods.getSale_TokenID(item.saleId).call(),
        tokenKind: await gbmContracts.methods.getSale_TokenKind(item.saleId).call()
      }
     }))).filter((item) => 
     item.owner.toLowerCase() === window.ethereum.selectedAddress.toLowerCase() && item.tokenKind === "0x73ad2146");
  
  for (i = 0; i < ownedTokens.length; i++) {
    let fetchedData = await getNFTAndCacheMedia(tokenUris[parseInt(ownedTokens[i].tokenId)-1]);

    let tokenToPass = {
      tokenId: ownedTokens[i].tokenId,
      name: fetchedData.name,
      description: fetchedData.description,
      image: fetchedData.image,
    }

    generateTokenElement(tokenToPass, "nft-on-auction", "View Auction", `redirectToAuction(${ownedTokens[i].saleId})`)
  }
}

async function generateTokensInEscrow(escrowed, beneficiaries) {
  let tokensOnSale = (await Promise.all(beneficiaries.map(async (item, index) => await gbmContracts.methods.getSale_TokenID(item.saleId).call())));

  let ownedTokens = escrowed.map((item, index) => { return {owner: item, tokenId: index+1} }).filter((item) => 
    item.owner.toLowerCase() === window.ethereum.selectedAddress.toLowerCase() && !tokensOnSale.includes(item.tokenId.toString())
  );

  for (i = 0; i < ownedTokens.length; i++) {
    let fetchedData = await getNFTAndCacheMedia(tokenUris[parseInt(ownedTokens[i].tokenId)-1]);

    let tokenToPass = {
      tokenId: ownedTokens[i].tokenId,
      name: fetchedData.name,
      description: fetchedData.description,
      image: fetchedData.image,
    }

    generateTokenElement(tokenToPass, "nft-escrowed", "Start new auction", `createNewAuction(${ownedTokens[i].tokenId})`)
  }
}

async function generateTokensOwned(tokens) { 
  let ownedTokens = tokens.map((item, index) => { return {owner: item, tokenId: index+1} }).filter((item) => item.owner.toLowerCase() === window.ethereum.selectedAddress.toLowerCase());

  for (i = 0; i < ownedTokens.length; i++) {
    let fetchedData = await getNFTAndCacheMedia(tokenUris[parseInt(ownedTokens[i].tokenId)-1]);

    let tokenToPass = {
      tokenId: ownedTokens[i].tokenId,
      name: fetchedData.name,
      description: fetchedData.description,
      image: fetchedData.image,
    }

    generateTokenElement(tokenToPass, "nft-owned", "Put in NFT Contract Drop", `sendToEscrow(${ownedTokens[i].tokenId})`);
  }
}

async function generateAllTokens(owners) {
  for (i = 0; i < owners.length; i++) {
    let fetchedData = await getNFTAndCacheMedia(tokenUris[i]);

    let tokenToPass = {
      tokenId: i+1,
      name: fetchedData.name,
      description: fetchedData.description,
      image: fetchedData.image,
    }

    generateTokenElement(tokenToPass,`nft-all`, ``, `none`)
  }
}

function generateTokenElement(_token, _className, _buttonText, _buttonCallback) {
  const container = document.getElementById("nft-container");

  const tokenEl = document.createElement('div');
  tokenEl.classList.add('nft');
  tokenEl.classList.add(_className);

  const tokenInnerHTML = `
    <img class="nft-media" src="/whale/${_token.tokenId}/image">
    <div class="nft-info">
        <div class="nft-name">GBM Whale #${_token.tokenId}</div>
        <div class="nft-company">
            <img class="nft-company-image" src="images/hardhat.svg">
            <div class="nft-company-name">GBM</div>
        </div>
        ${_buttonCallback !== 'none' ? `<button class="gbm-btn nft-btn" onclick="${_buttonCallback}">${_buttonText}</button>`:``}
    </div>
  `;

  tokenEl.innerHTML = tokenInnerHTML;
  container.appendChild(tokenEl);
}

function shortenAddress(address) {
  return `${address.substring(0,6)}...${address.substring(address.length-6)}` 
}

async function createNewAuction(tokenId) {
  location.href = `${window.location.protocol}//${window.location.host}/create?tokenId=${tokenId}`;
}

async function sendToEscrow(tokenId) {
  await erc721contract.methods.safeTransferFrom(window.ethereum.selectedAddress, diamondAddress, tokenId).send({ from: window.ethereum.selectedAddress });
}

function subscribeToTransfers() {
  erc721contract.events.Transfer({}, function(error, event) {
    // console.log(event);
  }).on('data', async function(event) {
    await generateTokens();
    updateCounters();
    toggleNFTView(currentView);
  }).on('changed', function(event) {
    // console.log(event);
  }).on('error', console.error);
}

function redirectToAuction(number) {
  location.href = `${window.location.protocol}//${window.location.host}/auction?saleId=${number}`;
}

function toggleNFTView(_filterButtonIndex) {
  Array.from(document.getElementsByClassName("filter-btn")).forEach((_element) => _element.classList.remove('active'));
  Array.from(document.getElementsByClassName("nft-on-auction")).forEach((_element) => _element.style.display = _filterButtonIndex == 0 ? `block` : `none`);
  Array.from(document.getElementsByClassName("nft-escrowed")).forEach((_element) => _element.style.display = _filterButtonIndex == 1 ? `block` : `none`);
  Array.from(document.getElementsByClassName("nft-owned")).forEach((_element) => _element.style.display = _filterButtonIndex == 2 ? `block` : `none`);
  Array.from(document.getElementsByClassName("nft-all")).forEach((_element) => _element.style.display = _filterButtonIndex == 3 ? `block` : `none`);
  document.getElementsByClassName("filter-btn")[currentView].classList.add('active');
}
