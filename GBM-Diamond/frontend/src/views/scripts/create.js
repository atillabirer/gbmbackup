const urlParams = new URLSearchParams(window.location.search);
const tokenId = urlParams.get('tokenId');
let latestAuction; 
const erc721contractAddress = localStorage.getItem('erc721contract');

onScriptLoad() 

async function onScriptLoad() {
    const title = document.getElementById('token-title');
    title.innerHTML = `GBM Whale #${tokenId}`;

    const image = document.getElementsByClassName('token-media')[0];
    image.src = `/whale/${tokenId}/image`;
    latestAuction = await gbmContracts.methods.getTotalNumberOfSales().call();

    await populatePresets();
}

async function populatePresets() {
    const { names, presets } = await getPresets();

    const selectElement = document.getElementsByClassName('gbm-select')[0];
    selectElement.onchange = (_event) => showPreset(presets[_event.target.selectedIndex])
    selectElement.innerHTML = '';

    for (i = 0; i < presets.length; i++) {
        const optionEl = document.createElement('option');
        optionEl.value = i+1;
        optionEl.innerHTML = names[i].replace("_", " ");
        selectElement.appendChild(optionEl);
    }

    showPreset(presets[0]);
}

function showPreset(preset) {
    const presetValues = document.getElementsByClassName('auction-input');
    presetValues[0].value = preset.auctionDuration;
    presetValues[1].value = preset.cancellationPeriodDuration;
    presetValues[2].value = preset.hammerTimeDuration;
    presetValues[3].value = preset.incentiveGrowthMultiplier;
    presetValues[4].value = preset.incentiveMax;
    presetValues[5].value = preset.incentiveMin;
    presetValues[6].value = preset.stepMin;
}

async function getPresets() {
    const presetAmount = await gbmContracts.methods.getGBMPresetsAmount().call();
  
    const presetsArray = Promise.all([...Array(parseInt(presetAmount)+1).keys()].map(async (item, index) => await gbmContracts.methods.getGBMPreset(index).call()));
    const presetsNames = Promise.all([...Array(parseInt(presetAmount)+1).keys()].map(async (item, index) => await gbmContracts.methods.getGBMPreset_Name(index).call()));
  
    return {
      presets: (await presetsArray).slice(1), 
      names: (await presetsNames).slice(1)
    }
}

async function createAuctionAndRedirect() {
    const nextAuction = parseInt(latestAuction)+1;
    await startNewAuction(
        tokenId, 
        erc721contractAddress, 
        document.getElementsByClassName('gbm-select')[0].value,
        Math.ceil(Date.now() / 1000) + 30, 
        0, 
        window.ethereum.selectedAddress);
    location.href = `${window.location.protocol}//${window.location.host}/auction?saleId=${nextAuction}`;
}

async function startNewAuction(tokenID, tokenContractAddress, gbmPreset, startTimestamp, currencyID, beneficiary) {
    /*
    /// @param tokenID The token ID of the ERC721 NFT for sale
    /// @param tokenContractAddress The address of the smart contract of the NFT for sale
    /// @param gbmPreset The id of the GBM preset used for this auction. 0 to use the default one.
    /// @param startTimestamp The timestamp of when the auction should start.
    /// @param currencyID The ID of the currency this auction accept. 0 to use the default one.
    /// @param beneficiary The address of whom should the proceed from the sales goes to.
    */
    //console.log(gbmContracts.methods.safeRegister721Auction(${tokenID}, ${tokenContractAddress}, ${gbmPreset}, ${startTimestamp}, ${currencyID}, ${beneficiary})`)
    await gbmContracts.methods.safeRegister721Auction(tokenID, tokenContractAddress, gbmPreset, startTimestamp, currencyID, beneficiary).send({ from: window.ethereum.selectedAddress });
}