const urlParams = new URLSearchParams(window.location.search);
const tokenId = urlParams.get('tokenId');
let latestAuction; 
let gbmPresetNames;
let gbmPresets;

Array.from(document.getElementsByClassName("gbm-select-neo")).forEach((_selectElement) => {
    _selectElement.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();
        let targeted = document.getElementById(e.target.getAttribute('for'));
        targeted.checked = true;
        if (targeted.value !== targeted.parentElement.getAttribute('selected-value')) {
            targeted.parentElement.setAttribute('selected-value', targeted.value)
            targeted.parentElement.setAttribute('selected-index', targeted.getAttribute('index'))
            generateBreakdown();
        }
        _selectElement.classList.toggle('expanded');
    }
});

document.onclick = function(e) {
    Array.from(document.getElementsByClassName("gbm-select-neo")).forEach((_selectElement) => {
        _selectElement.classList.remove('expanded');
    });
}

onScriptLoad() 

async function onScriptLoad() {
    document.getElementById('start-date-selector').style.display = 'none';

    const title = document.getElementById('token-title');
    title.innerHTML = `GBM Whale #${tokenId}`;

    const image = document.getElementsByClassName('token-media')[0];
    image.src = `/whale/${tokenId}/image`;
    latestAuction = await gbmContracts.methods.getTotalNumberOfSales().call();

    await populatePresets();
    generateBreakdown();
}

async function populatePresets() {
    const { names, presets } = await getPresets();
    gbmPresetNames = names;
    gbmPresets = presets;
    
    let incentivePresets = names.map((_element) => _element.split("_")[0])
    let timePresets = names.map((_element) => _element.split("_")[1])
    incentivePresets = [...new Set(incentivePresets)].splice(1);
    timePresets = [...new Set(timePresets)].splice(2);

    var gbmCSS = window.document.styleSheets[0];
    const selectDuration = document.getElementById('select-duration');
    selectDuration.innerHTML = '';
    gbmCSS.insertRule(`#select-duration.expanded { height: ${3*timePresets.length}rem; }`, gbmCSS.cssRules.length)
    selectDuration.setAttribute('selected-value', timePresets[0])
    selectDuration.setAttribute('selected-index', 0);
    const selectIncentive = document.getElementById('select-incentive');
    selectIncentive.innerHTML = '';
    gbmCSS.insertRule(`#select-incentive.expanded { height: ${3*timePresets.length}rem; }`, gbmCSS.cssRules.length)
    selectIncentive.setAttribute('selected-value', incentivePresets[0])
    selectIncentive.setAttribute('selected-index', 0);

    for (i = 0; i < timePresets.length; i++) {
        selectDuration.innerHTML += `<input type="radio" name="duration" index="${i}" value="${timePresets[i]}" id="${timePresets[i]}" ${i === 0 ? 'checked' : ''}/><label for="${timePresets[i]}">${globalConf[window.ethereum.networkVersion].timePresets[i].displayName}</label>`
    }
    for (i = 0; i < timePresets.length; i++) {
        selectIncentive.innerHTML += `<input type="radio" name="incentive" index="${i}" value="${incentivePresets[i]}" id="${incentivePresets[i]}" ${i === 0 ? 'checked' : ''}/><label for="${incentivePresets[i]}">${globalConf[window.ethereum.networkVersion].incentivePresets[i].displayName}</label>`
    }
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

const convertToMinutes = (_secondsString) => parseInt(_secondsString) / 60; 
const convertToPercentage = (_valueInK) => parseInt(_valueInK) / 1000; 

function generateBreakdown() {
    let selectDuration = document.getElementById('select-duration');
    let selectIncentive = document.getElementById('select-incentive');
    let timePreset = globalConf[window.ethereum.networkVersion].timePresets[parseInt(selectDuration.getAttribute("selected-index"))];
    let incentivePreset = globalConf[window.ethereum.networkVersion].incentivePresets[parseInt(selectIncentive.getAttribute("selected-index"))];
    let startTime = new Date();

    if (document.getElementById('start-date-selector').style.display !== 'none') {
        let timePicker = document.getElementsByClassName('gbm-time-picker')[0].value;
        let datePicker = document.getElementsByClassName('gbm-date-picker')[0].value;
        let time = timePicker === '' ? ["23","00"] : timePicker.split(":") 
        let date = datePicker === '' ? [startTime.getFullYear(), startTime.getMonth(), startTime.getDate()] : datePicker.split("-")
        
        startTime = new Date(
                parseInt(date[0]),
                parseInt(date[1])-1,
                parseInt(date[2]),
                parseInt(time[0]),
                parseInt(time[1]),
                )
    }

    document.getElementById('time-specifics').innerHTML = `
        End date: ${new Date(startTime.getTime() + parseInt(timePreset.auctionDuration)*1000).toUTCString()} </br>
        Hammer time: ${convertToMinutes(timePreset.hammerTimeDuration)} minutes </br>
        Cancellation period: ${convertToMinutes(timePreset.cancellationPeriodDuration)} minutes
    `;

    document.getElementById('incentive-specifics').innerHTML = `
        Bidders will make between ${convertToPercentage(incentivePreset.incentiveMin)}% and ${convertToPercentage(incentivePreset.incentiveMax)}% return on their bid. In total, bidders will receive up to ${convertToPercentage(incentivePreset.totalOfWinning)}% of the winning bid.
    `;

    document.getElementById('cancellation-text1-2').innerHTML = `
        ${convertToPercentage(incentivePreset.incentiveMin)}%-${convertToPercentage(incentivePreset.incentiveMax)}% of winning bid
    `;

    document.getElementById('cancellation-text2').innerHTML = `
        If you are not happy with the final sale price, you will have ${convertToMinutes(timePreset.cancellationPeriodDuration)}mins after the end of the auction to cancel, by paying the cancellation fee.
    `;
}

async function createAuctionAndRedirect() {
    const nextAuction = parseInt(latestAuction)+1;

    let startTime = Math.ceil(Date.now() / 1000) + 30;

    let selectDuration = document.getElementById('select-duration');
    let selectIncentive = document.getElementById('select-incentive');
    let minBid = document.getElementById('min-bid');

    let presetName = `${selectIncentive.getAttribute("selected-value")}_${selectDuration.getAttribute("selected-value")}`;
    let presetNumber = gbmPresetNames.indexOf(presetName) + 1;
    
    console.log(document.getElementById('start-date-selector').style.display)

    if (document.getElementById('start-date-selector').style.display !== 'none') {
        let time = document.getElementsByClassName('gbm-time-picker')[0].value.split(":");
        let date = document.getElementsByClassName('gbm-date-picker')[0].value.split("-");
        startTime = Math.floor(
            new Date(
                parseInt(date[0]),
                parseInt(date[1])-1,
                parseInt(date[2]),
                parseInt(time[0]),
                parseInt(time[1]),
                ).getTime() / 1000
        )
    }

    console.log(startTime)

    if (minBid.value !== "1" || minBid.value !== "") {
        await startNewAuctionCustom(
            tokenId, 
            erc721contractAddress, 
            presetNumber,
            startTime, 
            0, 
            window.ethereum.selectedAddress,
            parseInt(minBid.value));
    } else {
        await startNewAuction(
            tokenId, 
            erc721contractAddress, 
            presetNumber,
            Math.ceil(Date.now() / 1000) + 30, 
            0, 
            window.ethereum.selectedAddress);
    }
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

async function startNewAuctionCustom(tokenID, tokenContractAddress, gbmPreset, startTimestamp, currencyID, beneficiary, minimumBid) {
    await gbmContracts.methods.safeRegister721Auction_Custom(tokenID, tokenContractAddress, gbmPreset, startTimestamp, currencyID, beneficiary, 0, minimumBid).send({ from: window.ethereum.selectedAddress });
}

function toggleStartDateSelection(_visible){
    document.getElementById('start-date-selector').style.display = _visible ? 'flex' : 'none';
    generateBreakdown();
}