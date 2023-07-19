onScriptLoad();

let auctionTypeCount = {
  live: 0,
  upcoming: 0,
};
let countdowns = [];
let currentView = 0;

let auctions = [];
let baseAuctions = [];
let currentHighestBid = 0;
let currentBiggestBundle = 0;
let currentLowestBundle = 99999;
let currentBidRange = [0];
let currentBundleRange = [0];

const range = document.querySelector(".range-selected");

let sortOptions = [
  "tokenPriceAsc",
  "tokenPriceDesc",
  "endsSoonest",
  "endsLatest",
  "bundleSizeDesc",
  "bundleSizeAsc",
  "currentBidDesc",
  "currentBidAsc",
];
let sortLabels = [
  "Sort by: Price per token (lowest)",
  "Sort by: Price per token (highest)",
  "Sort by: Ends (soonest)",
  "Sort by: Ends (last)",
  "Sort by: Bundle size (biggest)",
  "Sort by: Bundle size (smallest)",
  "Sort by: Current bid (highest)",
  "Sort by: Current bid (lowest)",
];

generateSelectDropdown("select-sort", sortOptions, sortLabels, () =>
  displayWithPreferredSort()
);

async function onScriptLoad() {
  await loadGBMAuctions();
}

async function loadGBMAuctions() {
  try {
    const auctionNo = await getNumberOfAuctions();
    auctions = await loadAuctions(auctionNo);
    auctions = auctions.filter((_auction) => _auction); // Filter out undefined (meaning non-token) auctions
    baseAuctions = auctions;

    generateFilterConditions();

    const loader = document.getElementsByClassName("loading-container");
    loader[0].style.display = "none";
    document.getElementsByClassName(
      "auction-filters-container"
    )[0].style.display = "block";
    sortAuctions("tokenPriceDesc");
    displayAuctions();
    subscribeToNewAuctions(retrieveNewAuction); // ToDo fix?
  } catch {
    setTimeout(async () => {
      await loadGBMAuctions();
    }, 2000);
  }
}

function generateFilterConditions() {
  auctions.forEach((_auction) => {
    if (parseFloat(_auction.highestBidValue) > currentHighestBid)
      currentHighestBid = parseFloat(_auction.highestBidValue);
    if (parseInt(_auction.tokenID) > currentBiggestBundle)
      currentBiggestBundle = parseInt(_auction.tokenID);
    if (parseInt(_auction.tokenID) < currentLowestBundle)
      currentLowestBundle = parseInt(_auction.tokenID);
  });
  currentBidRange = [...Array(11).keys()].map((key) =>
    (key * currentHighestBid * 0.1).toFixed(2)
  );
  currentBundleRange = [...Array(11).keys()].map((key) =>
    (key * currentBiggestBundle * 0.1).toFixed(0)
  );
  currentBundleRange[0] = currentLowestBundle.toFixed(0);

  document.getElementById("bundle-size-min").value = 0;
  document.getElementById("bundle-size-display-min").value =
    currentBundleRange[0];
  document.getElementById("bundle-size-max").value = 10;
  document.getElementById("bundle-size-display-max").value =
    currentBundleRange[10];
  document.getElementById("current-bid").value = 10;
  document.getElementById("current-bid-display").value = currentBidRange[10];

  document.getElementById("bundle-size-min").onchange = function (event) {
    if (
      parseInt(event.target.value) >
      parseInt(document.getElementById("bundle-size-max").value)
    ) {
      let temp = document.getElementById("bundle-size-max").value;
      document.getElementById("bundle-size-max").value = event.target.value;
      document.getElementById("bundle-size-display-max").value =
        currentBundleRange[event.target.value];
      event.target.value = temp;
    }
    document.getElementById("bundle-size-display-min").value =
      currentBundleRange[event.target.value];
    range.style.left = (event.target.value / 10) * 100 + "%";
    range.style.right =
      100 - (document.getElementById("bundle-size-max").value / 10) * 100 + "%";
    document.getElementsByClassName(
      "auction-grid-rows-container"
    )[0].innerHTML = "";
    filterAuctions();
  };

  document.getElementById("bundle-size-max").onchange = function (event) {
    if (
      parseInt(event.target.value) <
      parseInt(document.getElementById("bundle-size-min").value)
    ) {
      let temp = document.getElementById("bundle-size-min").value;
      document.getElementById("bundle-size-min").value = event.target.value;
      document.getElementById("bundle-size-display-min").value =
        currentBundleRange[event.target.value];
      event.target.value = temp;
    }
    document.getElementById("bundle-size-display-max").value =
      currentBundleRange[event.target.value];
      range.style.left = (document.getElementById("bundle-size-min").value / 10) * 100 + "%";
      range.style.right =
        100 - (event.target.value / 10) * 100 + "%";
    document.getElementsByClassName(
      "auction-grid-rows-container"
    )[0].innerHTML = "";
    filterAuctions();
  };

  document.getElementById("current-bid").onchange = function (event) {
    document.getElementById("current-bid-display").value =
      currentBidRange[event.target.value];
    document.getElementsByClassName(
      "auction-grid-rows-container"
    )[0].innerHTML = "";
    filterAuctions();
  };

  document.getElementById("show-cheapest").checked = false;
  document.getElementById("show-cheapest").onchange = function (event) {
    filterAuctions();
  };
}

function filterAuctions() {
  let upperBidBound = parseFloat(
    document.getElementById("current-bid-display").value
  );
  let lowerBundleSizeLimit = parseInt(
    document.getElementById("bundle-size-display-min").value
  );
  let upperBundleSizeLimit = parseInt(
    document.getElementById("bundle-size-display-max").value
  );

  auctions = baseAuctions.filter((_auction) => {
    return (
      parseFloat(_auction.highestBidValue) <= upperBidBound &&
      parseInt(_auction.tokenID) <= upperBundleSizeLimit &&
      parseInt(_auction.tokenID) >= lowerBundleSizeLimit
    );
  });

  if (document.getElementById("show-cheapest").checked) {
    let selectedBundles = [];
    sortAuctions("currentBidAsc");
    auctions = auctions.filter((_auction) => {
      if (selectedBundles.includes(_auction.tokenID)) return false;
      selectedBundles.push(_auction.tokenID);
      return true;
    });
  }

  displayWithPreferredSort();
}

function sortAuctions(_sortType) {
  switch (_sortType) {
    case "tokenPriceAsc":
      auctions = auctions.sort((a, b) => a.pricePerToken.cmp(b.pricePerToken));
      break;
    case "tokenPriceDesc":
      auctions = auctions.sort((a, b) => b.pricePerToken.cmp(a.pricePerToken));
      break;
    case "endsSoonest":
      auctions = auctions.sort((a, b) => a.endTimestamp < b.endTimestamp);
      break;
    case "endsLatest":
      auctions = auctions.sort((a, b) => a.endTimestamp > b.endTimestamp);
      break;
    case "bundleSizeDesc":
      auctions = auctions.sort((a, b) => {
        if (a.tokenID > b.tokenID) return -1;
        else return 1;
      });
      break;
    case "bundleSizeAsc":
      auctions = auctions.sort((a, b) => {
        if (a.tokenID < b.tokenID) return -1;
        else return 1;
      });
      break;
    case "currentBidDesc":
      auctions = auctions.sort((a, b) =>
        web3.utils
          .toBN(b.highestBidValueRaw)
          .cmp(web3.utils.toBN(a.highestBidValueRaw))
      );
      break;
    case "currentBidAsc":
      auctions = auctions.sort((a, b) =>
        web3.utils
          .toBN(a.highestBidValueRaw)
          .cmp(web3.utils.toBN(b.highestBidValueRaw))
      );
      break;
    default:
  }
}

function displayAuctions() {
  for (i = 0; i < auctions.length; i++) {
    generateAuctionElement(auctions[i], i);
  }
}

function displayWithPreferredSort() {
  sortAuctions(
    document.getElementById("select-sort").getAttribute("selected-value")
  );
  for (i = 0; i < countdowns.length; i++) {
    clearInterval[countdowns[i]];
  }
  countdowns = [];
  document.getElementsByClassName("auction-grid-rows-container")[0].innerHTML =
    "";
  displayAuctions();
}

function reverseChildren(parent) {
  for (var i = 1; i < parent.childNodes.length; i++) {
    parent.insertBefore(parent.childNodes[i], parent.firstChild);
  }
}

function redirectToAuction(number) {
  location.href = `${window.location.protocol}//${window.location.host}/auction?saleId=${number}`;
}

async function getNumberOfAuctions() {
  return await gbmContracts.methods.getTotalNumberOfSales().call();
}

async function loadAuctions(noOfAuctions) {
  const auctionsArray = Promise.all(
    [...Array(parseInt(noOfAuctions) + 1).keys()].map(
      async (item, index) => await getAuctionInfoMinimal(index)
    )
  );
  return (await auctionsArray).slice(1);
}

async function getAuctionInfoMinimal(saleID) {
  const gbmPresetIndex = await gbmContracts.methods
    .getSale_GBMPresetIndex(saleID)
    .call();
  let _highBidValueRaw = await gbmContracts.methods
    .getSale_HighestBid_Value(saleID)
    .call();

  let tokenAddressFetched = await gbmContracts.methods
    .getSale_TokenAddress(saleID)
    .call();
  let tokenIDFetched = parseInt(
    await gbmContracts.methods.getSale_TokenID(saleID).call()
  );

  if (
    deploymentStatus.tokens &&
    !deploymentStatus.tokens.includes(tokenAddressFetched)
  )
    return;
  let imageLink = tokenImages[tokenAddressFetched];
  if (imageLink === undefined) {
    if (deploymentStatus.tokens.indexOf(tokenAddressFetched) >= 0) {
      let tokenContract = new web3.eth.Contract(
        abis["tokenCoupon"],
        tokenAddressFetched
      );
      let tokenURI = await tokenContract.methods.tokenURI(0).call();
      let fetched = await getNFTAndCacheMedia(tokenURI);
      tokenImages[tokenAddressFetched] = fetched.image;
      imageLink = tokenImages[tokenAddressFetched];
    } else {
      tokenImages[
        `${tokenAddressFetched}-${tokenIDFetched}`
      ] = `/whale/${tokenIDFetched}/image`;
      imageLink = tokenImages[`${tokenAddressFetched}-${tokenIDFetched}`];
    }
  }
  let tokenName = tokenNames[tokenAddressFetched];
  if (tokenName === undefined) {
    if (deploymentStatus.tokens.indexOf(tokenAddressFetched) > -1) {
      let tokenContract = new web3.eth.Contract(
        abis["tokenCoupon"],
        tokenAddressFetched
      );
      tokenName = await tokenContract.methods.name().call();
      tokenNames[tokenAddressFetched] = tokenName;
    } else {
      tokenNames[tokenAddressFetched] = `Stellaswap GBM Whales`;
      tokenName = `Stellaswap GBM Whales`;
    }
  }

  return {
    saleID,
    saleKind: await gbmContracts.methods.getSale_SaleKind(saleID).call(),
    tokenID: tokenIDFetched,
    tokenImage: imageLink,
    tokenAddress: tokenAddressFetched,
    tokenName,
    tokenAmount: await gbmContracts.methods.getSale_TokenAmount(saleID).call(),
    tokenKind: await gbmContracts.methods.getSale_TokenKind(saleID).call(),
    currencyName: await gbmContracts.methods
      .getSale_Currency_Name(saleID)
      .call(),
    currencyAddress: await gbmContracts.methods
      .getSale_Currency_Address(saleID)
      .call(),
    startTimestamp: parseFloat(
      await gbmContracts.methods.getSale_StartTimestamp(saleID).call()
    ),
    endTimestamp: parseFloat(
      await gbmContracts.methods.getSale_EndTimestamp(saleID).call()
    ),
    highestBidValue: web3.utils.fromWei(_highBidValueRaw),
    highestBidValueRaw: _highBidValueRaw,
    highestBidBidder: await gbmContracts.methods
      .getSale_HighestBid_Bidder(saleID)
      .call(),
    pricePerToken: web3.utils
      .toBN(_highBidValueRaw)
      .div(web3.utils.toBN(tokenIDFetched)),
    //   gbmPreset: await gbmContracts.methods.getSale_GBMPreset(saleID).call(), // can break this down further
    //   gbmPresetName: await gbmContracts.methods.getGBMPreset_Name(gbmPresetIndex).call(),
  };
}

async function generateAuctionElement(auction, index) {
  if (!auction) return;
  const auctionsContainer = document.getElementsByClassName(
    "auction-grid-rows-container"
  );
  const auctionEl = document.createElement("div");
  auctionEl.classList.add(`auction-${auction.saleID}`);

  const auctionInnerHTML = `
        <div class="auction-grid-row auction-grid-item">
          <div class="auction-item-flex"><img src="${
            auction.tokenImage
          }" loading="lazy" alt="" class="nft-image">
            <div>
                <div class="auction-item-name">${auction.tokenID}</div>
                <div class="auction-item-flex subtitle">
                  <div class="text-block">${auction.tokenName}</div>
                </div>
            </div>
          </div>
          <div class="auction-item-current-bid">
            <div class="auction-item-name">${web3.utils.fromWei(
              auction.pricePerToken.toString()
            )} ${auction.currencyName}</div>
            <div class="auction-item-flex subtitle">per ${auction.tokenName}</div>
            </div>
            <div class="auction-item-current-bid">
              <div class="auction-item-name">${auction.highestBidValue} ${
                auction.currencyName
              }</div>
              <div class="auction-item-flex subtitle">${shortenAddress(
                auction.highestBidBidder
              )}</div>
            </div>
            <div class="auction-item-current-timer">
              <div class="time-flex-wrap">
                <div id="circle-${index}" class="auction-time-circle" style="display: none"></div>
                <div id="timer-${index}" class="auction-item-name countdown">Loading...</div>
            </div>
            <button id="button-${index}" class="gbm-btn bid-now-btn" onclick="redirectToAuction(${
              auction.saleID
            })" style="display: none">Bid now</a>
          </div>
        </div>
    `;

  auctionEl.innerHTML = auctionInnerHTML;
  auctionsContainer[0].appendChild(auctionEl);

  startElementCountdownTimer(auction, index);
}

async function retrieveNewAuction(newAuction) {
  const { names, presets } = await getPresets(newAuction.gbmPresetIndex);
  const adjustedNewAuction = {
    startTimestamp: newAuction.startTimestamp,
    endTimestamp: newAuction.endTimeStamp,
    tokenID: newAuction.tokenID,
    tokenAmount: newAuction.tokenAmount,
    highestBidValue: 0,
    highestBidBidder: "Nobody   yet!",
    saleKind: newAuction.saleKind ?? "GBM",
    currencyName: newAuction.currencyName ?? "FakETH",
    gbmPreset: presets[newAuction.gbmPresetIndex - 1] ?? {},
    gbmPresetName: names[newAuction.gbmPresetIndex - 1] ?? "GBM_Classic",
  };
  reverseChildren(document.getElementsByClassName("auction-container")[0]);
  generateAuctionElement(adjustedNewAuction, newAuction.saleID);
  reverseChildren(document.getElementsByClassName("auction-container")[0]);
}

function subscribeToNewAuctions(callback) {
  gbmContracts.events
    .AuctionRegistration_NewAuction({}, function (error, event) {
      // console.log(event);
    })
    .on("data", function (event) {
      callback(event.returnValues);
    })
    .on("changed", function (event) {
      // console.log(event);
    })
    .on("error", console.error);
}

function timecalc(x, v) {
  return Math.floor(x / v);
}

function startElementCountdownTimer(_auction, _index) {
  const auctionEl = document.getElementsByClassName(
    `auction-${_auction.saleID}`
  )[0];
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
    circle.style.display = "block";
    auctionStatus = "auction-live";
  }

  var timestamp = tsToUse * 1000 - Date.now();
  timestamp /= 1000;
  if (timestamp > 0) {
    if (auctionStatus === "auction-live") bidBtn.style.display = "block";
    auctionEl.classList.add(auctionStatus);
    timer.classList.remove('ended');
    timer.innerHTML = `${messagePrefix} in ${countdownDisplay(timestamp)}`;
    countdowns[_index] = setInterval(function () {
      timestamp--;
      if (timestamp >= 0)
        timer.innerHTML = `${messagePrefix} in ${countdownDisplay(timestamp)}`;

      if (timecalc(timestamp, 1) < 1) {
        if (auctionStatus !== "auction-upcoming") bidBtn.style.display = "none";
        clearInterval(countdowns[_index]);
        auctionEl.classList.remove(auctionStatus);
        startElementCountdownTimer(_auction, _index);
      }
    }, 1000);
  } else {
    auctionStatus = "auction-ended";
    auctionEl.classList.add(auctionStatus);
    circle.style.display = "none";
    timer.classList.add('ended');
    timer.innerHTML = "Ended";
  }
}
