
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

const bidInput = document.getElementsByClassName("bid-input")[0];
bidInput.addEventListener('input', updatePotentialIncentive);

onScriptLoad();

async function onScriptLoad() {
  const urlParams = new URLSearchParams(window.location.search);
  saleId = urlParams.get('saleId');
  const auction = await getAuctionInfo(saleId);
  _localPageAuction = auction;
  console.log(auction);
  fetchedMetadata = await (await fetch(`/whale/${auction.tokenID}/json`)).json()
  await generateSaleElements(auction);
  populateNFTDetails(auction, fetchedMetadata);
  finalizeLoading();
  subscribeToNewBids(updateHighestBid, startElementCountdownTimer);
  await initializeBidHistory(saleId);
}

function finalizeLoading() {
  const loader = document.getElementsByClassName("loading-container");
  const container = document.getElementsByClassName("auction-container");
  loader[0].style.display = 'none';
  container[0].style.display = 'flex';
}

async function initializeBidHistory(_saleId) {
  const bidsNo = await getNumberOfBids(_saleId);
  bids = await loadBids(_saleId, bidsNo);
  generateBidHistoryElementLoop()
}

function generateBidHistoryElementLoop() {
  document.getElementsByClassName("bids")[0].innerHTML = "";
  for (i = 0; i < bids.length; i++) {
    if (i === 0) {
        document.getElementsByClassName("bid-history")[0].innerHTML = 'Bid History';
    }
    generateBidHistoryElement(bids[i], i);
  }
  reverseChildren(document.getElementsByClassName("bids")[0]);
}

function reverseChildren(parent) {
  for (var i = 1; i < parent.childNodes.length; i++){
      parent.insertBefore(parent.childNodes[i], parent.firstChild);
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

async function generateSaleElements(_sale) {
  _localPageSale = _sale;
  incentiveMax = _sale.gbmPreset.incentiveMax;
  stepMin = _sale.gbmPreset.stepMin;
  currencyName = _sale.highestBidCurrencyName;

  let collectionName = await erc721contract.methods.name().call();
  document.getElementsByClassName('collection-and-id')[0].innerHTML = `${collectionName}`;
  document.getElementsByClassName('token-name')[0].innerHTML = `${collectionName} #${_sale.tokenID}`;

  document.getElementById('description-container').innerHTML = fetchedMetadata.description;
  document.getElementById('bidOrPrice').value = /* _sale.saleKind === '' ? "Price" : */ "Current bid";
  document.getElementById('bidOrPriceAmount').innerHTML = `${_sale.highestBidValue} ${_sale.highestBidCurrencyName}`


  let auctionTypes = ['English', 'Low', 'Medium', 'High', 'Degen'];
  let presetNum = Math.abs((_sale.gbmPresetIndex - 3)%5);

  document.getElementById('incentive-box-type').innerHTML = auctionTypes[presetNum];

  minimumBid = parseFloat(_sale.highestBidValue) !== 0 ? (_sale.highestBidValue) * ((parseFloat(stepMin) / 100000) + 1) : 0.01;
  document.getElementById('minimum-bid-message').innerHTML = `Minimum bid: ${minimumBid} ${_sale.highestBidCurrencyName}`

  highestBid = _sale.highestBidValue;

  if (highestBid === "0") document.getElementsByClassName('incentive-text')[0].innerHTML = `The first bidder will earn <strong>${parseFloat(_sale.gbmPreset.incentiveMin) / 100}%</strong> if outbid.`;

  document.getElementsByClassName('media-container')[0].style = `background-image: url('/whale/${_sale.tokenID}/image')`

  startElementCountdownTimer(_localPageSale);
}

async function populateNFTDetails(_sale, _metadata) {
  let tokenURI = await erc721contract.methods.tokenURI(_sale.tokenID).call();
  
  document.getElementById('details-token-id').innerHTML = _sale.tokenID;
  document.getElementById('details-mint-date').innerHTML = '-';
  document.getElementById('details-token-standard').innerHTML = 'ERC-721';
  document.getElementById('details-blockchain').innerHTML = 'Local Hardhat';
  document.getElementById('details-smart-contract').innerHTML = localStorage.getItem("erc721contract");
  document.getElementById('details-token-uri').innerHTML = `${tokenURI.substring(0,25)}...${tokenURI.substring(tokenURI.length-20)}`
}

const stateSwitcher = {
  switchToUpcoming: function () {
    document.getElementById('timerMessage').innerHTML = "Auction starts in";
    document.getElementsByClassName('cost-message')[0].style.display = 'none';
    document.getElementsByClassName('bid-btn')[0].style.display = 'none';
    document.getElementById('minimum-bid-message').style.display = 'none';
    bidInput.style.display = 'none';
  },

  switchToOngoing: function (
    _sale, //any
  ) {
    document.getElementById('timerMessage').innerHTML = "Ends in";
    document.getElementsByClassName('cost-message')[0].style.display = 'block';
    document.getElementById('minimum-bid-message').style.display = 'block';
    bidInput.style.display = 'block';
    bidInput.disabled = false;
    bidInput.placeholder = 'Input your bid here';
    if (_sale.highestBidBidder.toLowerCase() === window.ethereum.selectedAddress) {
      document.getElementById('bids-enabled').style.display = 'none';
      document.getElementsByClassName('bid-btn')[0].style.display = 'none';
      document.getElementById('bids-disabled').style.display = 'block';
      document.getElementById('bids-disabled-upper-msg').innerHTML = 'You are the highest bidder!';
      document.getElementsByClassName('incentive-text')[0].innerHTML = `You will earn ${web3.utils.fromWei(_localPageAuction.highestBidIncentive)} if outbid or the sale is cancelled by the seller.`;
    } else {
      document.getElementById('bids-enabled').style.display = 'block';
      document.getElementsByClassName('bid-btn')[0].style.display = 'block';
      document.getElementById('bids-disabled').style.display = 'none';
    }
  },

  switchToCancellation: function (
    _sale, //any
  ) {
    document.getElementById('timerMessage').innerHTML = "Cancellation period ends in";
    document.getElementById('bidOrPrice').innerHTML = "Winning bid";
    document.getElementsByClassName('cost-message')[0].style.display = 'block';
    document.getElementById('minimum-bid-message').style.display = 'block';
    bidInput.style.display = 'none';
    document.getElementById('bids-enabled').style.display = 'none';
    document.getElementById('bids-disabled').style.display = 'block';
    document.getElementById('bids-disabled-lower-msg').innerHTML = 'The seller has the remaining time to accept or cancel the sale.';
    document.getElementsByClassName('bid-btn')[0].style.display = 'none';
    if (_sale.highestBidBidder.toLowerCase() === window.ethereum.selectedAddress) {
      document.getElementById('bids-disabled-upper-msg').innerHTML = 'You have won this auction!';
      document.getElementsByClassName('incentive-text')[0].innerHTML = `You will earn ${web3.utils.fromWei(_localPageAuction.highestBidIncentive)} if the sale is cancelled.`;
    } else {
      document.getElementById('bids-disabled-upper-msg').innerHTML = 'Auction ended';
      document.getElementsByClassName('incentive')[0].style.display = 'none';
    }
  },

  switchToSettlement: function (
    _sale, //any
  ) {
    document.getElementById('timerMessage').innerHTML = "Buyer";
    document.getElementById('timerCountdown').innerHTML = `${_sale.highestBidBidder.substring(0,6)}...${_sale.highestBidBidder.substring(_sale.highestBidBidder.length - 6)}`;
    document.getElementById('bidOrPrice').innerHTML = "Winning bid";
    document.getElementsByClassName('cost-message')[0].style.display = 'block';
    document.getElementById('minimum-bid-message').style.display = 'block';
    bidInput.style.display = 'none';
    document.getElementById('bids-enabled').style.display = 'none';
    document.getElementById('bids-disabled').style.display = 'block';
    document.getElementsByClassName('incentive')[0].style.display = 'none';
    if (_sale.highestBidBidder.toLowerCase() === window.ethereum.selectedAddress) {
      document.getElementsByClassName('bid-btn')[0].style.display = 'block';
      document.getElementsByClassName('bid-btn')[0].disabled = false;
      document.getElementsByClassName('bid-btn')[0].innerHTML = "Settle auction";
      document.getElementsByClassName('bid-btn')[0].onclick = () => { claim() }
      document.getElementById('bids-disabled-upper-msg').innerHTML = '';
      document.getElementById('bids-disabled-lower-msg').innerHTML = 'The auction must be settled for the buyer to receive the NFT and the seller to receive payment.';
    } else {
      document.getElementsByClassName('bid-btn')[0].style.display = 'none';
    }
  }
}

function startElementCountdownTimer(_sale) {
  const infoValueContainers = document.getElementsByClassName('info-value');

  let tsToUse;

  if (_sale.startTimestamp * 1000 - Date.now() > 0) {
      tsToUse = _sale.startTimestamp;
      stateSwitcher.switchToUpcoming();
  } else if (_sale.endTimestamp * 1000 - Date.now() > 0) {
      tsToUse = _sale.endTimestamp;
      stateSwitcher.switchToOngoing(_sale);
  } else if ((parseInt(_sale.endTimestamp) + parseInt(_sale.gbmPreset[2]))*1000 - Date.now() > 0) {
      tsToUse = parseInt(_sale.endTimestamp) + parseInt(_sale.gbmPreset[2]);
      stateSwitcher.switchToCancellation(_sale);
  } else {
      stateSwitcher.switchToSettlement(_sale);
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
          infoValueContainers[1].innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;

          if (timecalc(timestamp, 1) < 1) {
              clearInterval(countdown);
              startElementCountdownTimer(_sale);
          }
      }, 1000);
  }
}

function generateBidHistoryElement(bid, index) {
  const bidsContainer = document.getElementsByClassName("bids");
  const bidEl = document.createElement('div');
  bidEl.classList.add("previous-bid");

  const bidInnerHTML = `
          <div class="previous-bid-row flex-row opposite-ends">
              <div class="flex-row">
                <div class="green-dot"></div>
                <div class="previous-bidder">${bid.bidBidder.substring(0, 7)}...${bid.bidBidder.substring(bid.bidBidder.length - 5)}</div>
              </div>
              <div class="previous-bid-value">${bid.bidValue} ${bid.bidCurrencyName}</div>
          </div>
          <div class="previous-bid-row smaller-row">
               <div class="previous-bid-incentive">${bids.length - 1 === index ? "Reward if outbid" : "Earned when outbid"}: ${bid.bidIncentive} ${bid.bidCurrencyName}</div>
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
  }

  bids.push(newBid);
  bids = [...new Set(bids)]; // hacky way to prevent duplicate events
  generateBidHistoryElementLoop();
}

function subscribeToNewBids(callback, callback2) {
  gbmContracts.events.AuctionBid_Placed({}, function(error, event) {
    // console.log(event);
  }).on('data', function(event) {
    if (saleId !== event.returnValues.saleID) return;
    _localPageAuction.highestBidBidder = event.returnValues.bidder;
    _localPageAuction.highestBidIncentive = event.returnValues.incentivesDue;
    callback(web3.utils.fromWei(event.returnValues.bidamount))
    generateBidHistoryElementFromEvent(event.returnValues);
    clearInterval(countdown);
    callback2(_localPageAuction);
  }).on('changed', function(event) {
    // console.log(event);
  }).on('error', console.error);

  gbmContracts.events.AuctionRegistration_EndTimeUpdated({}, function(error, event) {
  }).on('data', function(event) {
    if (saleId !== event.returnValues.saleID) return;
    clearInterval(countdown);
    _localPageAuction.endTimestamp = event.returnValues.endTimeStamp;
    callback2(_localPageAuction);
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
        gbmPresetIndex: await gbmContracts.methods.getSale_GBMPresetIndex(saleID).call(), // can break this down further
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
  const incentiveContainer = document.getElementsByClassName('incentive-text');
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

      incentiveContainer[0].innerHTML = `You will earn ${earnableIncentives} (${incentivePercentage}%) if outbid.`;
      bidButton.disabled = currentBidInput <= minimumBid;
  } catch {
      incentiveContainer[0].innerHTML = `You will earn 0 (0%) if outbid.`
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

  calculateIncentivesPercentReturnFromBidAndPreset(
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