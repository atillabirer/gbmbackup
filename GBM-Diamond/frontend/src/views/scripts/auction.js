let highestBid = 0;
let countdown;
let currencyName;
let stepMin;
let minimumBid = 0.01;
let incentiveMax = 0;
let _localPageAuction = {};
let fetchedMetadata;
let saleId;
let bids = [];
let standards = {
  "0x73ad2146": "ERC-721",
  "0x973bb640": "ERC-1155",
};

const bidInput = document.getElementsByClassName("bid-input")[0];
bidInput.addEventListener("input", updatePotentialIncentive);

onScriptLoad();

async function onScriptLoad() {
  const urlParams = new URLSearchParams(window.location.search);
  saleId = urlParams.get("saleId");
  const auction = await auctionFunctions.getAuctionInfo(saleId);
  _localPageAuction = auction;
  console.log(auction);
  fetchedMetadata = await (
    await fetch(`/whale/${auction.tokenID}/json`)
  ).json();
  await generateSaleElements(auction);
  populateNFTDetails(auction, fetchedMetadata);
  finalizeLoading();
  subscribeToNewBids(updateHighestBid, startElementCountdownTimer);
  await initializeBidHistory(saleId);
}

function finalizeLoading() {
  const loader = document.getElementsByClassName("loading-container");
  const container = document.getElementsByClassName("auction-container");
  loader[0].style.display = "none";
  container[0].style.display = "flex";
}

async function initializeBidHistory(_saleId) {
  const bidsNo = await auctionFunctions.getNumberOfBids(_saleId);
  bids = await auctionFunctions.loadBids(_saleId, bidsNo);
  if (bids.length > 0) {
    document.getElementsByClassName("bid-history-container")[0].style.display =
      "block";
    generateBidHistoryElementLoop();
  }
}

function generateBidHistoryElementLoop() {
  document.getElementsByClassName("bids")[0].innerHTML = "";
  for (i = 0; i < bids.length; i++) {
    if (i === 0) {
      document.getElementsByClassName("bid-history")[0].innerHTML =
        "Bid History";
    }
    generateBidHistoryElement(bids[i], i);
  }
  reverseChildren(document.getElementsByClassName("bids")[0]);
}

function updateHighestBid(_newBidValue) {
  const infoValueContainers = document.getElementsByClassName("info-value");
  infoValueContainers[0].innerHTML = `${_newBidValue} ${currencyName}`;
  highestBid = _newBidValue;

  minimumBid = parseFloat(_newBidValue) * (parseFloat(stepMin) / 100000 + 1);
  const minimumBidContainer = document.getElementsByClassName("minimum-bid");
  minimumBidContainer[0].innerHTML = `Minimum bid: ${minimumBid} ${currencyName}`;
}

async function generateSaleElements(_sale) {
  _localPageSale = _sale;
  incentiveMax = _sale.gbmPreset.incentiveMax;
  stepMin = _sale.gbmPreset.stepMin;
  currencyName = _sale.highestBidCurrencyName;

  let collectionName =
    standards[_sale.tokenKind] === "ERC-721"
      ? await erc721contract.methods.name().call()
      : "GBM Whales 1155";
  document.getElementsByClassName(
    "collection-and-id"
  )[0].innerHTML = `${collectionName}`;
  document.getElementsByClassName("token-name")[0].innerHTML = `${
    standards[_sale.tokenKind] === "ERC-1155"
      ? `<div style="color: var(--primary); margin-right: 10px;">${_sale.tokenAmount}x</div> `
      : ""
  }GBM Whale #${_sale.tokenID}`;

  document.getElementById("description-container").innerHTML = "Welcome to the GBM Whales collection, a captivating world of unique and adorable NFT whales. Each meticulously crafted with love and imagination, these one-of-a-kind digital creatures possess their own charm, vibrant colors, and delightful details. As proud owners of these scarce and authenticated NFTs, immerse yourself in the magic of these cute whales, connect with a passionate community, and embark on an enchanting journey filled with wonder and joy."
    // fetchedMetadata.description;
  document.getElementById("bidOrPrice").value =
    /* _sale.saleKind === '' ? "Price" : */ "Current bid";
  document.getElementById(
    "bidOrPriceAmount"
  ).innerHTML = `${_sale.highestBidValue} ${_sale.highestBidCurrencyName}`;

  let presetDetected = globalConf[
    window.ethereum.networkVersion
  ].incentivePresets.find((preset) => {
    return (
      preset.incentiveMin === `${_sale.gbmPreset.incentiveMin}` &&
      preset.incentiveMax === `${_sale.gbmPreset.incentiveMax.toString()}` &&
      preset.incentiveGrowthMultiplier ===
        `${_sale.gbmPreset.incentiveGrowthMultiplier.toString()}`
    );
  });

  document.getElementById("incentive-box-type").innerHTML =
    presetDetected === undefined ? "English" : presetDetected.incentivePrefix;

  minimumBid =
    parseFloat(_sale.highestBidValue) !== 0
      ? _sale.highestBidValue * (parseFloat(stepMin) / 100000 + 1)
      : 0.01;
  document.getElementById(
    "minimum-bid-message"
  ).innerHTML = `Minimum bid: ${minimumBid} ${_sale.highestBidCurrencyName}`;

  highestBid = _sale.highestBidValue;

  if (highestBid === "0")
    document.getElementsByClassName(
      "incentive-text"
    )[0].innerHTML = `The first bidder will earn <strong>${
      parseFloat(_sale.gbmPreset.incentiveMin) / 100
    } ${_localPageAuction.currencyName}%</strong> if outbid.`;

  document.getElementsByClassName(
    "media-container"
  )[0].style = `background-image: url('/whale/${_sale.tokenID}/image')`;

  startElementCountdownTimer(_localPageSale);
}

async function populateNFTDetails(_sale, _metadata) {
  let tokenURI = await erc721contract.methods.tokenURI(_sale.tokenID).call();

  document.getElementById("details-token-id").innerHTML = _sale.tokenID;
  document.getElementById("details-mint-date").innerHTML = "-";
  document.getElementById("details-token-standard").innerHTML =
    standards[_sale.tokenKind];
  document.getElementById("details-blockchain").innerHTML = "Local Hardhat";
  document.getElementById("details-smart-contract").innerHTML =
    deploymentStatus.ERC721[0]; //TODO pick the correct contract
  document.getElementById(
    "details-token-uri"
  ).innerHTML = `${tokenURI.substring(0, 25)}...${tokenURI.substring(
    tokenURI.length - 20
  )}`;
}

const stateSwitcher = {
  switchToUpcoming: function () {
    document.getElementById("timerMessage").innerHTML = "Auction starts in";
    document.getElementsByClassName("cost-message")[0].style.display = "none";
    document.getElementsByClassName("bid-btn")[0].style.display = "none";
    document.getElementById("minimum-bid-message").style.display = "none";
    bidInput.style.display = "none";
  },

  switchToOngoing: function (
    _sale //any
  ) {
    document.getElementById("timerMessage").innerHTML = "Ends in";
    document.getElementsByClassName("cost-message")[0].style.display = "block";
    document.getElementById("minimum-bid-message").style.display = "block";
    bidInput.style.display = "block";
    bidInput.disabled = false;
    bidInput.placeholder = "Enter bid";
    if (
      _sale.highestBidBidder.toLowerCase() === window.ethereum.selectedAddress
    ) {
      document.getElementById("bids-enabled").style.display = "none";
      document.getElementsByClassName("bid-btn")[0].style.display = "none";
      document.getElementById("bids-disabled").style.display = "block";
      document.getElementById("bids-disabled-upper-msg").innerHTML =
        "You are the highest bidder!";
      document.getElementsByClassName(
        "incentive-text"
      )[0].innerHTML = `You will earn <strong>${web3.utils.fromWei(
        _localPageAuction.highestBidIncentive
      )} ${_localPageAuction.currencyName}</strong> if outbid or the sale is cancelled by the seller.`;
    } else {
      document.getElementById("bids-enabled").style.display = "block";
      document.getElementsByClassName("bid-btn")[0].style.display = "block";
      document.getElementById("bids-disabled").style.display = "none";
    }
  },

  switchToCancellation: function (
    _sale //any
  ) {
    document.getElementById("timerMessage").innerHTML =
      "Cancellation period ends in";
    document.getElementById("bidOrPrice").innerHTML = "Winning bid";
    document.getElementsByClassName("cost-message")[0].style.display = "block";
    document.getElementById("minimum-bid-message").style.display = "block";
    bidInput.style.display = "none";
    document.getElementById("bids-enabled").style.display = "none";
    document.getElementById("bids-disabled").style.display = "block";
    document.getElementById("bids-disabled-lower-msg").innerHTML =
      "The seller has the remaining time to accept or cancel the sale.";
    document.getElementsByClassName("bid-btn")[0].style.display = "none";
    if (
      _sale.highestBidBidder.toLowerCase() === window.ethereum.selectedAddress
    ) {
      document.getElementById("bids-disabled-upper-msg").innerHTML =
        "You have won this auction!";
      document.getElementsByClassName(
        "incentive-text"
      )[0].innerHTML = `You will earn ${web3.utils.fromWei(
        _localPageAuction.highestBidIncentive
      )} ${_localPageAuction.currencyName} if the sale is cancelled.`;
    } else {
      document.getElementById("bids-disabled-upper-msg").innerHTML =
        "Auction ended";
      document.getElementsByClassName("incentive")[0].style.display = "none";
    }
  },

  switchToSettlement: function (
    _sale //any
  ) {
    document.getElementById("timerMessage").innerHTML = "Buyer";
    document.getElementById(
      "timerCountdown"
    ).innerHTML = `${_sale.highestBidBidder.substring(
      0,
      6
    )}...${_sale.highestBidBidder.substring(
      _sale.highestBidBidder.length - 6
    )}`;
    document.getElementById("bidOrPrice").innerHTML = "Winning bid";
    document.getElementsByClassName("cost-message")[0].style.display = "block";
    document.getElementById("minimum-bid-message").style.display = "block";
    bidInput.style.display = "none";
    document.getElementById("bids-enabled").style.display = "none";
    document.getElementById("bids-disabled").style.display = "block";
    document.getElementsByClassName("incentive")[0].style.display = "none";
    if (
      _sale.highestBidBidder.toLowerCase() === window.ethereum.selectedAddress
    ) {
      document.getElementsByClassName("bid-btn")[0].style.display = "block";
      document.getElementsByClassName("bid-btn")[0].disabled = false;
      document.getElementsByClassName("bid-btn")[0].innerHTML =
        "Settle auction";
      document.getElementsByClassName("bid-btn")[0].onclick = () => {
        claim();
      };
      document.getElementById("bids-disabled-upper-msg").innerHTML = "";
      document.getElementById("bids-disabled-lower-msg").innerHTML =
        "The auction must be settled for the buyer to receive the NFT and the seller to receive payment.";
    } else {
      document.getElementsByClassName("bid-btn")[0].style.display = "none";
      document.getElementById("bids-disabled-upper-msg").innerHTML =
        "Auction ended";
      document.getElementById("bids-disabled-lower-msg").innerHTML =
        "The sale was accepted by the seller.";
    }
  },
};

function startElementCountdownTimer(_sale) {
  const infoValueContainers = document.getElementsByClassName("info-value");

  let tsToUse;

  if (_sale.startTimestamp * 1000 - Date.now() > 0) {
    tsToUse = _sale.startTimestamp;
    stateSwitcher.switchToUpcoming();
  } else if (_sale.endTimestamp * 1000 - Date.now() > 0) {
    tsToUse = _sale.endTimestamp;
    stateSwitcher.switchToOngoing(_sale);
  } else if (
    (parseInt(_sale.endTimestamp) + parseInt(_sale.gbmPreset[2])) * 1000 -
      Date.now() >
    0
  ) {
    tsToUse = parseInt(_sale.endTimestamp) + parseInt(_sale.gbmPreset[2]);
    stateSwitcher.switchToCancellation(_sale);
  } else {
    stateSwitcher.switchToSettlement(_sale);
  }

  var timestamp = tsToUse * 1000 - Date.now();
  timestamp /= 1000;
  if (timestamp > 0) {
    infoValueContainers[1].innerHTML = countdownDisplay(timestamp);
    countdown = setInterval(function () {
      timestamp--;
      infoValueContainers[1].innerHTML = countdownDisplay(timestamp);

      if (timecalc(timestamp, 1) < 1) {
        clearInterval(countdown);
        startElementCountdownTimer(_sale);
      }
    }, 1000);
  }
}

function generateBidHistoryElement(_bid, _index) {
  const bidsContainer = document.getElementsByClassName("bids");
  const bidEl = document.createElement("div");
  bidEl.classList.add("previous-bid");

  const bidInnerHTML = `
          <div class="previous-bid-row flex-row opposite-ends">
              <div class="flex-row">
                <div class="green-dot"></div>
                <div class="previous-bidder">${_bid.bidBidder.substring(
                  0,
                  7
                )}...${_bid.bidBidder.substring(
    _bid.bidBidder.length - 5
  )}</div>
              </div>
              <div class="previous-bid-value">${_bid.bidValue} ${
    _bid.bidCurrencyName
  }</div>
          </div>
          <div class="previous-bid-row smaller-row">
               <div class="previous-bid-incentive">${
                 bids.length - 1 === _index
                   ? "Reward if outbid"
                   : "Earned when outbid"
               }: ${_bid.bidIncentive} ${_bid.bidCurrencyName}</div>
          </div>
      `;

  bidEl.innerHTML = bidInnerHTML;
  bidsContainer[0].appendChild(bidEl);
}

function generateBidHistoryElementFromEvent(_newBid) {
  let newBid = {
    bidBidder: _newBid.bidder,
    bidValue: web3.utils.fromWei(_newBid.bidamount),
    bidCurrencyName: currencyName,
    bidCurrencyIndex: bids.length,
    bidIncentive: web3.utils.fromWei(_newBid.incentivesDue),
  };

  bids.push(newBid);
  bids = [...new Set(bids)]; // hacky way to prevent duplicate events
  document.getElementsByClassName("bid-history-container")[0].style.display =
    "block";
  generateBidHistoryElementLoop();
}

function subscribeToNewBids(callback, callback2) {
  gbmContracts.events
    .AuctionBid_Placed({}, function (error, event) {
      // console.log(event);
    })
    .on("data", function (event) {
      console.log(event.returnValues);
      if (saleId !== event.returnValues.saleID) return;
      _localPageAuction.highestBidBidder = event.returnValues.bidder;
      _localPageAuction.highestBidIncentive = event.returnValues.incentivesDue;
      callback(web3.utils.fromWei(event.returnValues.bidamount));
      generateBidHistoryElementFromEvent(event.returnValues);
      clearInterval(countdown);
      callback2(_localPageAuction);
    })
    .on("changed", function (event) {
      // console.log(event);
    })
    .on("error", console.error);

  gbmContracts.events
    .AuctionRegistration_EndTimeUpdated({}, function (error, event) {})
    .on("data", function (event) {
      if (saleId !== event.returnValues.saleID) return;
      clearInterval(countdown);
      _localPageAuction.endTimestamp = event.returnValues.endTimeStamp;
      callback2(_localPageAuction);
    })
    .on("changed", function (event) {
      // console.log(event);
    })
    .on("error", console.error);
}

function placeBid() {
  const bidInput = document.getElementsByClassName("bid-input")[0].value;
  const urlParams = new URLSearchParams(window.location.search);
  const saleId = urlParams.get("saleId");
  auctionFunctions.submitBid(parseInt(saleId), bidInput, highestBid);
}

async function claim() {
  const urlParams = new URLSearchParams(window.location.search);
  const saleId = urlParams.get("saleId");
  await auctionFunctions.claimToken(saleId);
  location.href = `${window.location.protocol}//${window.location.host}/tokens`;
}

function updatePotentialIncentive(e) {
  const incentiveContainer = document.getElementsByClassName("incentive-text");
  const bidButton = document.getElementsByClassName("bid-btn")[0];
  const currentBidInput = parseFloat(e.target.value || 0);
  let decimals = new web3.utils.BN("100000");
  let _newbid = new web3.utils.BN(
    web3.utils.toWei("" + currentBidInput, "ether")
  );

  try {
    const incentivePercentage =
      incentiveCalculator.calculateIncentivesPercentReturnFromBidAndPreset(
        decimals, //_bidDecimals
        new web3.utils.BN(_localPageAuction.gbmPreset.incentiveMin), //_incentiveMin
        new web3.utils.BN(_localPageAuction.gbmPreset.incentiveMax), //_incentiveMax
        new web3.utils.BN(_localPageAuction.gbmPreset.stepMin), //_stepMin
        new web3.utils.BN(
          _localPageAuction.gbmPreset.incentiveGrowthMultiplier
        ), //_bidMultiplier
        new web3.utils.BN(_localPageAuction.highestBidValueRaw), //_previousBid
        _newbid //_newBid
      );

    const earnableIncentives = web3.utils.fromWei(
      incentiveCalculator.calculateIncentivesRawFromBidAndPreset(
        decimals, //_bidDecimals
        new web3.utils.BN(_localPageAuction.gbmPreset.incentiveMin), //_incentiveMin
        new web3.utils.BN(_localPageAuction.gbmPreset.incentiveMax), //_incentiveMax
        new web3.utils.BN(_localPageAuction.gbmPreset.stepMin), //_stepMin
        new web3.utils.BN(
          _localPageAuction.gbmPreset.incentiveGrowthMultiplier
        ), //_bidMultiplier
        new web3.utils.BN(_localPageAuction.highestBidValueRaw), //_previousBid
        _newbid //_newBid
      )
    );

    incentiveContainer[0].innerHTML = `You will earn <strong>${earnableIncentives} (${incentivePercentage}%)</strong> if outbid.`;
    bidButton.disabled = currentBidInput <= minimumBid;
  } catch {
    incentiveContainer[0].innerHTML = `You will earn 0 (0%) if outbid.`;
    bidButton.disabled = true;
  }
}

const incentiveCalculator = {
  calculateIncentivesRawFromBidAndPreset: function (
    _bidDecimals, //etherjsBigNumber
    _incentiveMin, //etherjsBigNumber
    _incentiveMax, //etherjsBigNumber
    _stepMin, //etherjsBigNumber
    _bidMultiplier, //etherjsBigNumber
    _previousBid, //etherjsBigNumber
    _newBid //etherjsBigNumber
  ) {
    try {
      // returns the raw incentive amount earned
      let baseBid = _previousBid
        .mul(_bidDecimals.add(_stepMin))
        .div(_bidDecimals);

      if (baseBid.eq(new web3.utils.BN("0"))) {
        baseBid = new web3.utils.BN("1");
      }

      const a = _newBid.sub(baseBid);
      const b = _bidDecimals.mul(_bidMultiplier).mul(a);
      const c = b.div(baseBid);
      const d = _incentiveMin.mul(_bidDecimals);
      const e = c.add(d);

      let decimaledRatio = e;

      if (decimaledRatio.gt(_incentiveMax.mul(_bidDecimals))) {
        decimaledRatio = _incentiveMax.mul(_bidDecimals);
      }

      if (decimaledRatio.lt(new web3.utils.BN("0"))) {
        decimaledRatio = new web3.utils.BN("0");
      }

      return decimaledRatio.mul(_newBid).div(_bidDecimals.mul(_bidDecimals));
    } catch {
      return new web3.utils.BN("0");
    }
  },

  calculateIncentivesPercentReturnFromBidAndPreset(
    _bidDecimals, //etherjsBigNumber
    _incentiveMin, //etherjsBigNumber
    _incentiveMax, //etherjsBigNumber
    _stepMin, //etherjsBigNumber
    _bidMultiplier, //etherjsBigNumber
    _previousBid, //etherjsBigNumber
    _newBid //etherjsBigNumber
  ) {
    try {
      // returns the raw incentive amount earned
      let baseBid = _previousBid
        .mul(_bidDecimals.add(_stepMin))
        .div(_bidDecimals);

      if (baseBid.eq(new web3.utils.BN("0"))) {
        baseBid = new web3.utils.BN("1");
      }

      const a = _newBid.sub(baseBid);
      const b = _bidDecimals.mul(_bidMultiplier).mul(a);
      const c = b.div(baseBid);
      const d = _incentiveMin.mul(_bidDecimals);
      const e = c.add(d);

      let decimaledRatio = e;

      if (decimaledRatio.gt(_incentiveMax.mul(_bidDecimals))) {
        decimaledRatio = _incentiveMax.mul(_bidDecimals);
      }

      if (decimaledRatio.lt(new web3.utils.BN("0"))) {
        decimaledRatio = new web3.utils.BN("0");
      }

      return (
        ((decimaledRatio.toNumber() * 1.0) /
          _bidDecimals.toNumber() /
          _bidDecimals.toNumber()) *
        100.0
      );
    } catch {
      return new web3.utils.BN("0");
    }
  },
};
