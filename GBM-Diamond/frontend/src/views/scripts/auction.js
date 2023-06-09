
let highestBid = 0;
let countdown;
let currencyName;
let stepMin;
let minimumBid = 0.01;
let incentiveMax = 0;
let _localPageAuction = {};
let fetchedMetadata;

const bidInput = document.getElementsByClassName("bid-input")[0];
bidInput.addEventListener('input', updatePotentialIncentive);

onScriptLoad();

async function onScriptLoad() {
  const urlParams = new URLSearchParams(window.location.search);
  const saleId = urlParams.get('saleId');
  const auction = await getAuctionInfo(saleId);
  fetchedMetadata = await (await fetch(`/whale/${auction.tokenID}/json`)).json()
  generateAuctionElements(auction);
  const loader = document.getElementsByClassName("loading-container");
  const container = document.getElementsByClassName("auction-container");
  loader[0].style.display = 'none';
  container[0].style.visibility = 'visible';
  subscribeToNewBids(updateHighestBid, startElementCountdownTimer, auction);
  const bidsNo = await getNumberOfBids(saleId);
  const previousBids = await loadBids(saleId, bidsNo);
  for (i = 0; i < previousBids.length; i++) {
      if (i === 0) {
          document.getElementsByClassName("bid-history")[0].innerHTML = 'Bid History';
      }
      generateBidHistoryElement(previousBids[i]);
  }
}

function timecalc(x, v) {
  return Math.floor(x / v);
}

function updateHighestBid(newBidValue) {
  const infoValueContainers = document.getElementsByClassName('info-value');
  infoValueContainers[0].innerHTML = `${newBidValue} ${currencyName}`
  highestBid = newBidValue;

  minimumBid = parseFloat(newBidValue) * ((parseFloat(stepMin) / 100000) + 1)
  const minimumBidContainer = document.getElementsByClassName('minimum-bid');
  minimumBidContainer[0].innerHTML = `Minimum bid: ${minimumBid} ${currencyName}`
}

function generateAuctionElements(auction) {
  _localPageAuction = auction;
  incentiveMax = auction.gbmPreset.incentiveMax;
  stepMin = auction.gbmPreset.stepMin;
  currencyName = auction.highestBidCurrencyName;
  const collectionContainer = document.getElementsByClassName('collection-and-id');
  collectionContainer[0].innerHTML = `GBM Whale #${auction.tokenID}`;

  const descriptionContainer = document.getElementsByClassName('token-name');
  descriptionContainer[0].innerHTML = fetchedMetadata.description;

  const infoValueContainers = document.getElementsByClassName('info-value');
  infoValueContainers[0].innerHTML = `${auction.highestBidValue} ${auction.highestBidCurrencyName}`

  minimumBid = parseFloat(auction.highestBidValue) !== 0 ? (auction.highestBidValue) * ((parseFloat(stepMin) / 100000) + 1) : 0.01;
  const minimumBidContainer = document.getElementsByClassName('minimum-bid');
  minimumBidContainer[0].innerHTML = `Minimum bid: ${minimumBid} ${auction.highestBidCurrencyName}`

  highestBid = auction.highestBidValue;

  document.getElementsByClassName('media-container')[0].style = `background-image: url('/whale/${auction.tokenID}/image')`

  startElementCountdownTimer(_localPageAuction)
}

function startElementCountdownTimer(_auction) {

  const labelContainers = document.getElementsByClassName('label');
  const infoValueContainers = document.getElementsByClassName('info-value');

  let tsToUse;

  if (_auction.startTimestamp * 1000 - Date.now() > 0) {
      tsToUse = _auction.startTimestamp;
      labelContainers[1].innerHTML = "Starts in"
      bidInput.placeholder = 'This auction has yet to start...'
  } else if (_auction.endTimestamp * 1000 - Date.now() > 0) {
      tsToUse = _auction.endTimestamp;
      labelContainers[1].innerHTML = "Ends in"
      bidInput.disabled = false;
      bidInput.placeholder = 'Input your bid here'
  } else if ((parseInt(_auction.endTimestamp) + parseInt(_auction.gbmPreset[2]))*1000 - Date.now() > 0) {
      tsToUse = parseInt(_auction.endTimestamp) + parseInt(_auction.gbmPreset[2]);
      labelContainers[1].innerHTML = "Claimable in"
      bidInput.disabled = false;
      bidInput.placeholder = 'This auction has ended.'
      const bidButton = document.getElementsByClassName('bid-btn')[0];
      bidButton.disabled = true;
      bidButton.innerHTML = "Please wait...";
  } else {
      infoValueContainers[1].innerHTML = `This auction has ended!`;
      bidInput.placeholder = 'This auction has ended.'
      bidInput.disabled = true;

      const bidButton = document.getElementsByClassName('bid-btn')[0];
      bidButton.disabled = false;
      bidButton.innerHTML = "Claim Token";
      bidButton.onclick = () => { claim() }
  }

  var timestamp = tsToUse * 1000 - Date.now();
  timestamp /= 1000;
  if (timestamp > 0) {
      countdown = setInterval(function () {
          timestamp--;
          var days = timecalc(timestamp, 24 * 60 * 60),
              hours = timecalc(timestamp, 60 * 60) % 24,
              minutes = timecalc(timestamp, 60) % 60,
              seconds = timecalc(timestamp, 1) % 60;
          infoValueContainers[1].innerHTML = `${hours}h ${minutes}m ${seconds}s`;

          if (timecalc(timestamp, 1) < 1) {
              clearInterval(countdown);
              startElementCountdownTimer(_auction);
          }
      }, 1000);
  }
}

function generateBidHistoryElement(bid) {
  const bidsContainer = document.getElementsByClassName("bids");
  const bidEl = document.createElement('div');
  bidEl.classList.add("previous-bid");

  const bidInnerHTML = `
          <div class="previous-bid-row1">
              <div class="previous-bidder">${bid.bidBidder.substring(0, 4)}...${bid.bidBidder.substring(bid.bidBidder.length - 3)}</div>
              <div class="previous-bid-value">${bid.bidValue} ${bid.bidCurrencyName}</div>
          </div>
          <div class="previous-bid-row2">
               <div class="previous-bid-incentive">${bid.bidIncentive}</div>
          </div>
      `

  bidEl.innerHTML = bidInnerHTML;
  bidsContainer[0].appendChild(bidEl);
}

function subscribeToNewBids(callback, callback2, auction) {
  gbmContracts.events.AuctionBid_Placed({}, function(error, event) {
    // console.log(event);
  }).on('data', function(event) {
    callback(web3.utils.fromWei(event.returnValues.bidamount))
  }).on('changed', function(event) {
    // console.log(event);
  }).on('error', console.error);

  gbmContracts.events.AuctionRegistration_EndTimeUpdated({}, function(error, event) {
  }).on('data', function(event) {
    clearInterval(countdown);
    auction.endTimestamp = event.returnValues.endTimeStamp;
    callback2(auction);
  }).on('changed', function(event) {
    // console.log(event);
  }).on('error', console.error);
}

async function getNumberOfBids(saleId) {
  const availableBids = await gbmContracts.methods.getSale_NumberOfBids(saleId).call();
  return availableBids;
}

async function loadBids(saleId, noOfBids) {
  const bidsArray = Promise.all([...Array(parseInt(noOfBids)+1).keys()].map(async (item, index) => await getBidInfo(saleId, index)));
  return (await bidsArray).slice(1);
}

async function getAuctionInfo(saleID) {
  let _highBidValueRaw = await gbmContracts.methods.getSale_HighestBid_Value(saleID).call();
    return {
        saleKind: await gbmContracts.methods.getSale_SaleKind(saleID).call(),
        tokenAddress: await gbmContracts.methods.getSale_TokenAddress(saleID).call(),
        tokenID: await gbmContracts.methods.getSale_TokenID(saleID).call(),
        tokenAmount: await gbmContracts.methods.getSale_TokenAmount(saleID).call(),
        tokenKind: await gbmContracts.methods.getSale_TokenKind(saleID).call(),
        gbmPreset: await gbmContracts.methods.getSale_GBMPreset(saleID).call(), // can break this down further
        currencyID: await gbmContracts.methods.getSale_CurrencyID(saleID).call(),
        currencyName: await gbmContracts.methods.getSale_Currency_Name(saleID).call(),
        currencyAddress: await gbmContracts.methods.getSale_Currency_Address(saleID).call(),
        startTimestamp: await gbmContracts.methods.getSale_StartTimestamp(saleID).call(),
        endTimestamp: await gbmContracts.methods.getSale_EndTimestamp(saleID).call(),
        beneficiary: await gbmContracts.methods.getSale_Beneficiary(saleID).call(),
        debt: await gbmContracts.methods.getSale_Debt(saleID).call(),
        highestBidValue: web3.utils.fromWei(_highBidValueRaw),
        highestBidValueRaw : _highBidValueRaw,
        highestBidBidder: await gbmContracts.methods.getSale_HighestBid_Bidder(saleID).call(),
        highestBidIncentive: await gbmContracts.methods.getSale_HighestBid_Incentive(saleID).call(),
        highestBidCurrencyIndex: await gbmContracts.methods.getSale_HighestBid_CurrencyIndex(saleID).call(),
        highestBidCurrencyAddress: await gbmContracts.methods.getSale_HighestBid_Currency_Address(saleID).call(),
        highestBidCurrencyName: await gbmContracts.methods.getSale_HighestBid_Currency_Name(saleID).call(),
        duration: await gbmContracts.methods.getSale_GBMPreset_AuctionDuration(saleID).call()
    }
}

async function getBidInfo(saleID, bidIndex) {
    return {
        bidValue: web3.utils.fromWei(await gbmContracts.methods.getSale_Bid_Value(saleID, bidIndex).call()),
        bidBidder: await gbmContracts.methods.getSale_Bid_Bidder(saleID, bidIndex).call(),
        bidIncentive: web3.utils.fromWei(await gbmContracts.methods.getSale_Bid_Incentive(saleID, bidIndex).call()),
        bidCurrencyIndex: await gbmContracts.methods.getSale_Bid_CurrencyIndex(saleID, bidIndex).call(),
        bidCurrencyAddress: await gbmContracts.methods.getSale_Bid_Currency_Address(saleID, bidIndex).call(),
        bidCurrencyName: await gbmContracts.methods.getSale_Bid_Currency_Name(saleID, bidIndex).call()
    }
}

async function submitBid(auctionId, newBidAmount, previousHighestBidAmount) {
    const newAmount = web3.utils.toWei(newBidAmount);
    const oldAmount = web3.utils.toWei(previousHighestBidAmount);
    await gbmContracts.methods.bid(auctionId, newAmount, oldAmount).send({from: window.ethereum.selectedAddress, to: diamondAddress, value: newAmount, gasLimit: 300000 })
}

function placeBid() {
  const bidInput = document.getElementsByClassName('bid-input')[0].value;
  const urlParams = new URLSearchParams(window.location.search);
  const saleId = urlParams.get('saleId');
  submitBid(parseInt(saleId), bidInput, highestBid);
}

async function claimToken(saleId) {
  await gbmContracts.methods.claim(saleId).send({from: window.ethereum.selectedAddress})
}

async function claim() {
  const urlParams = new URLSearchParams(window.location.search);
  const saleId = urlParams.get('saleId');
  await claimToken(saleId);
  location.href = `${window.location.protocol}//${window.location.host}/tokens`;
}

function updatePotentialIncentive(e) {
  const incentiveContainer = document.getElementsByClassName('incentive');
  const bidButton = document.getElementsByClassName('bid-btn')[0];
  const currentBidInput = parseFloat(e.target.value || 0)
  let decimals = new web3.utils.BN('100000');
  let _newbid = new web3.utils.BN(web3.utils.toWei("" + currentBidInput, 'ether'));

  try {
      const incentivePercentage = incentiveCalculator.calculateIncentivesPercentReturnFromBidAndPreset(
          decimals, //_bidDecimals
          new web3.utils.BN(_localPageAuction.gbmPreset.incentiveMin), //_incentiveMin
          new web3.utils.BN(_localPageAuction.gbmPreset.incentiveMax), //_incentiveMax
          new web3.utils.BN(_localPageAuction.gbmPreset.stepMin), //_stepMin
          new web3.utils.BN(_localPageAuction.gbmPreset.incentiveGrowthMultiplier), //_bidMultiplier
          new web3.utils.BN(_localPageAuction.highestBidValueRaw), //_previousBid
          _newbid, //_newBid
      );

      const earnableIncentives = web3.utils.fromWei(incentiveCalculator.calculateIncentivesRawFromBidAndPreset(
          decimals, //_bidDecimals
          new web3.utils.BN(_localPageAuction.gbmPreset.incentiveMin), //_incentiveMin
          new web3.utils.BN(_localPageAuction.gbmPreset.incentiveMax), //_incentiveMax
          new web3.utils.BN(_localPageAuction.gbmPreset.stepMin), //_stepMin
          new web3.utils.BN(_localPageAuction.gbmPreset.incentiveGrowthMultiplier), //_bidMultiplier
          new web3.utils.BN(_localPageAuction.highestBidValueRaw), //_previousBid
          _newbid, //_newBid
      ));



      const incentiveContainer = document.getElementsByClassName('incentive');
      incentiveContainer[0].innerHTML = `<img class="incentive-logo" src="./images/gbm-logo.svg" />You will earn ${earnableIncentives} (${incentivePercentage}%) if outbid.`;
      bidButton.disabled = currentBidInput <= minimumBid;
  } catch {
      incentiveContainer[0].innerHTML = `<img class="incentive-logo" src="./images/gbm-logo.svg" />You will earn 0 (0%) if outbid.`
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
      _newBid, //etherjsBigNumber
  ) {
      try {
          // returns the raw incentive amount earned
          let baseBid = _previousBid.mul(_bidDecimals.add(_stepMin)).div(_bidDecimals);

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

  calculateIncentivesPercentReturnFromBidAndPreset: function (
      _bidDecimals, //etherjsBigNumber
      _incentiveMin, //etherjsBigNumber
      _incentiveMax, //etherjsBigNumber
      _stepMin, //etherjsBigNumber
      _bidMultiplier, //etherjsBigNumber
      _previousBid, //etherjsBigNumber
      _newBid, //etherjsBigNumber
  ) {
      try {
          // returns the raw incentive amount earned
          let baseBid = _previousBid.mul(_bidDecimals.add(_stepMin)).div(_bidDecimals);

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
              ((decimaledRatio.toNumber() * 1.0) / _bidDecimals.toNumber() / _bidDecimals.toNumber()) *
              100.0
          );
      } catch {
          return new web3.utils.BN("0");
      }
  },
};

function copyToClipboard() {
   navigator.clipboard.writeText(window.location);
}