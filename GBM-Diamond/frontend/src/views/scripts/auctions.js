onScriptLoad();

let auctionTypeCount = {
    live: 0,
    upcoming: 0,
}
let countdowns = [];
let currentView = 0;

Array.from(document.getElementsByClassName("filter-btn")).forEach((_element, index) => {
    _element.onclick = function() {
        currentView = index;
        toggleAuctions(index)
    }
});

async function onScriptLoad() {
    const auctionNo = await getNumberOfAuctions();
    const auctions = await loadAuctions(auctionNo);
    const loader = document.getElementsByClassName('loading-container');
    loader[0].style.display = 'none';
    for (i = 0; i < auctions.length; i++) {
        generateAuctionElement(auctions[i], i);
    }
    updateCounters();
    toggleAuctions(0);
    reverseChildren(document.getElementsByClassName("auction-grid-rows-container")[0]);
    subscribeToNewAuctions(retrieveNewAuction);
};

function updateCounters() {
    document.getElementById("live-number").innerHTML = Array.from(document.getElementsByClassName("auction-live")).length;
    document.getElementById("upcoming-number").innerHTML = Array.from(document.getElementsByClassName("auction-upcoming")).length;
}

function reverseChildren(parent) {
    for (var i = 1; i < parent.childNodes.length; i++){
        parent.insertBefore(parent.childNodes[i], parent.firstChild);
    }
}

function redirectToAuction(number) {
    location.href = `${window.location.protocol}//${window.location.host}/auction?saleId=${number}`;
}

function shortenAddress(address) {
    return `${address.substring(0,6)}...${address.substring(address.length-6)}` 
}

async function getNumberOfAuctions() {
   return (await gbmContracts.methods.getTotalNumberOfSales().call());
} 

async function loadAuctions(noOfAuctions) {
  const auctionsArray = Promise.all([...Array(parseInt(noOfAuctions)+1).keys()].map(async (item, index) => await getAuctionInfoMinimal(index)));
  return (await auctionsArray).slice(1);
}

async function getAuctionInfoMinimal(saleID) {
    const gbmPresetIndex = await gbmContracts.methods.getSale_GBMPresetIndex(saleID).call();
    let _highBidValueRaw = await gbmContracts.methods.getSale_HighestBid_Value(saleID).call();

    return {
      saleKind: await gbmContracts.methods.getSale_SaleKind(saleID).call(),
      tokenID: await gbmContracts.methods.getSale_TokenID(saleID).call(),
      tokenAmount: await gbmContracts.methods.getSale_TokenAmount(saleID).call(),
      tokenKind: await gbmContracts.methods.getSale_TokenKind(saleID).call(),
      currencyName: await gbmContracts.methods.getSale_Currency_Name(saleID).call(),
      currencyAddress: await gbmContracts.methods.getSale_Currency_Address(saleID).call(),
      startTimestamp: await gbmContracts.methods.getSale_StartTimestamp(saleID).call(),
      endTimestamp: await gbmContracts.methods.getSale_EndTimestamp(saleID).call(),
      highestBidValue: web3.utils.fromWei(_highBidValueRaw),
      highestBidValueRaw : _highBidValueRaw,
      highestBidBidder: await gbmContracts.methods.getSale_HighestBid_Bidder(saleID).call(),
    //   gbmPreset: await gbmContracts.methods.getSale_GBMPreset(saleID).call(), // can break this down further
    //   gbmPresetName: await gbmContracts.methods.getGBMPreset_Name(gbmPresetIndex).call(),
    }
}

function generateAuctionElement(auction, index) {
    const auctionsContainer = document.getElementsByClassName('auction-grid-rows-container')
    const auctionEl = document.createElement('div');
    auctionEl.classList.add(`auction-${index}`);

    const auctionInnerHTML = `
        <div class="auction-grid-row auction-grid-item">
            <div class="auction-item-flex"><img src="/whale/${auction.tokenID}/image" loading="lazy" alt="" class="nft-image">
            <div>
                <div class="auction-item-name">${auction.tokenAmount > 1 ? `${auction.tokenAmount}x `: ''}GBM Whale #${auction.tokenID}</div>
                <div class="auction-item-flex subtitle"><img src="images/hardhat.svg" loading="lazy" alt="" class="company-icon">
                <div class="text-block">GBM</div>
                </div>
            </div>
            </div>
            <div class="auction-item-current-bid">
            <div class="auction-item-name">${auction.highestBidValue} ${auction.currencyName}</div>
            <div class="auction-item-bidder">${shortenAddress(auction.highestBidBidder)}</div>
            </div>
            <div class="auction-item-current-timer">
            <div class="time-flex-wrap">
                <div id="circle-${index}" class="auction-time-circle" style="display: none"></div>
                <div id="timer-${index}" class="auction-item-name countdown">Loading...</div>
            </div>
            <button id="button-${index}" class="gbm-btn bid-now-btn" onclick="redirectToAuction(${i+1})" style="display: none">Bid now</a>
            </div>
        </div>
    `;

    auctionEl.innerHTML = auctionInnerHTML;
    auctionsContainer[0].appendChild(auctionEl);

    startElementCountdownTimer(auction, index);
}

async function retrieveNewAuction(newAuction) {
    const {names, presets} = await getPresets(newAuction.gbmPresetIndex);
    const adjustedNewAuction = {
        startTimestamp: newAuction.startTimestamp,
        endTimestamp: newAuction.endTimeStamp,
        tokenID: newAuction.tokenID,
        tokenAmount: newAuction.tokenAmount,
        highestBidValue: 0,
        highestBidBidder: "Nobody   yet!",
        saleKind: newAuction.saleKind ?? 'GBM',
        currencyName: newAuction.currencyName ?? 'FakETH',
        gbmPreset: presets[newAuction.gbmPresetIndex-1] ?? {},
        gbmPresetName: names[newAuction.gbmPresetIndex-1] ?? 'GBM_Classic',
    }
    reverseChildren(document.getElementsByClassName("auction-container")[0]);
    generateAuctionElement(adjustedNewAuction, newAuction.saleID);
    reverseChildren(document.getElementsByClassName("auction-container")[0]);
}

function subscribeToNewAuctions(callback) {
    gbmContracts.events.AuctionRegistration_NewAuction({}, function(error, event) {
      // console.log(event);
    }).on('data', function(event) {
      callback(event.returnValues)
    }).on('changed', function(event) {
      // console.log(event);
    }).on('error', console.error);
}

function toggleAuctions(_filterButtonIndex) {
  Array.from(document.getElementsByClassName("filter-btn")).forEach((_element) => _element.classList.remove('active'));
  Array.from(document.getElementsByClassName("auction-upcoming")).forEach((_element) => _element.style.display = _filterButtonIndex == 1 ? `block` : `none`);
  Array.from(document.getElementsByClassName("auction-live")).forEach((_element) => _element.style.display = _filterButtonIndex == 0 ? `block` : `none`);
  Array.from(document.getElementsByClassName("auction-ended")).forEach((_element) => _element.style.display = `none`);
  document.getElementsByClassName("filter-btn")[currentView].classList.add('active');
}

function timecalc(x, v) {
    return Math.floor(x / v);
}

function startElementCountdownTimer(_auction, _index) {
    const auctionEl = document.getElementsByClassName(`auction-${_index}`)[0];
    const timer = document.getElementById(`timer-${_index}`);
    const circle = document.getElementById(`circle-${_index}`);
    const bidBtn = document.getElementById(`button-${_index}`);

    let messagePrefix;
    let auctionStatus;

    if (_auction.startTimestamp * 1000 - Date.now() > 0) {
        tsToUse = _auction.startTimestamp;
        messagePrefix = "Starts";
        auctionStatus = "auction-upcoming";
    } else {
        tsToUse = _auction.endTimestamp;
        messagePrefix = "Ends";
        circle.style.display = 'block';
        auctionStatus = "auction-live";
    }

    var timestamp = tsToUse * 1000 - Date.now();
    timestamp /= 1000;
    if (timestamp > 0) {
        if (auctionStatus === "auction-live") 
            bidBtn.style.display = 'block';
        auctionEl.classList.add(auctionStatus);
        updateCounters();
        toggleAuctions(currentView);
        countdowns[_index] = setInterval(function () {
            timestamp--;
            var days = timecalc(timestamp, 24 * 60 * 60),
                hours = timecalc(timestamp, 60 * 60) % 24,
                minutes = timecalc(timestamp, 60) % 60,
                seconds = timecalc(timestamp, 1) % 60;
                timer.innerHTML = `${messagePrefix} in ${hours}h ${minutes}m ${seconds}s`;

            if (timecalc(timestamp, 1) < 1) {
                if (auctionStatus !== "auction-upcoming") 
                    bidBtn.style.display = 'none';
                clearInterval(countdowns[_index]);
                auctionEl.classList.remove(auctionStatus);
                startElementCountdownTimer(_auction, _index);
            }
        }, 1000);
    } else {
        updateCounters();
        toggleAuctions(currentView);
        auctionStatus = "auction-ended";
        auctionEl.classList.add(auctionStatus);
        circle.style.display = 'none';
        timer.innerHTML = "Ended";
    }
}
