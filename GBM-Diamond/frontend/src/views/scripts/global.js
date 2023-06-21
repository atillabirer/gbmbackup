let deploymentStatus = localStorage.getItem("deploymentStatus");
let web3;
let abis;
let gbmContracts;
let erc721contracts;
let erc721contractAddresses;
let erc1155contracts;
let erc1155contractAddresses;
let diamondAddress;
let metamaskEnabled;
let metamaskTrigger;
let tokenImages = {};
let tokenNames = {};
let logo = "./images/gbm-logo.png";

// Functions to run on page load

const pageInitializer = {
  init: async function () {
    this.loadContractAddresses();
    this.loadCustomCss();
    this.addNavBar();
    this.addFooter();
    this.setUpMetamask();
    await this.isConnected();
    this.checkDeploymentState();
  },
  loadContractAddresses: function () {
    if (!deploymentStatus) return;
    deploymentStatus = JSON.parse(deploymentStatus);
    diamondAddress = deploymentStatus.deployedFacets["Diamond"];
    erc721contractAddresses = deploymentStatus.ERC721;
    erc1155contractAddresses = deploymentStatus.ERC1155;
  },
  loadCustomCss: function () {
    if (!deploymentStatus) return;
    if (!deploymentStatus.colours) return;

    const r = document.querySelector(":root");
    r.style.setProperty("--primary", deploymentStatus.colours.primary);
    r.style.setProperty("--secondary", deploymentStatus.colours.secondary);
    r.style.setProperty("--tertiary", deploymentStatus.colours.tertiary);
    r.style.setProperty("--background", deploymentStatus.colours.background);
    r.style.setProperty("--selection", deploymentStatus.colours.selection);
    r.style.setProperty("--text", deploymentStatus.colours.text);
    logo = deploymentStatus.logo;
  },
  addNavBar: function () {
    let navBar = document.createElement("div");
    navBar.classList.add("nav-bar");
    navBar.innerHTML = `
      <div class="flex-row opposite-ends pad-vertical-2">
        <div style="display: flex;">
            <img id="nav-bar-logo" class="h-3" src="${logo}" style="margin: auto;"/>
        </div>
        <div class="nav-metamask">
            <div class="metamask-missing">
                <button id="metamask-enable" class="gbm-btn">Connect MetaMask</button>
            </div>
            <div class="metamask-found" hidden>
                <div class="items-center flex-row">
                  <p id="active-metamask-account"></p>
                  <button id="metamask-disable" class="gbm-btn transparent ml-75" hidden>Disconnect</button>
                  <button id="metamask-refresh" class="gbm-btn ml-75">⟳</button>
                </div>
            </div>
        </div>
      </div>
      <div class="nav-bottom-row">
        <div class="deployment-found" hidden>
          <div class="flex-row">
              <a class="nav-link link-${
                window.location.pathname === "/auctions"
                  ? `stay"`
                  : `leave" href="/auctions"`
              }>Browse Auctions</a>
              <a class="nav-link link-${
                window.location.pathname === "/tokens"
                  ? `stay"`
                  : `leave" href="/tokens"`
              }>My NFTs</a>
              <a class="nav-link link-${
                window.location.pathname === "/admin"
                  ? `stay"`
                  : `leave" href="/admin"`
              }>Admin Panel</a>
              <a class="nav-link link-${
                window.location.pathname === "/" ? `stay"` : `leave" href="/"`
              }>Deployment</a>
              <a class="nav-link link-${
                window.location.pathname === "/tokenSale"
                  ? `stay"`
                  : `leave" href="/tokenSale"`
              }>Token Sale</a>
          </div>
        </div>
      </div>
    `;

    this.addTitleAndFavicon();

    this.addCSS("global");
    this.addCSS(
      window.location.pathname.substring(1) === ""
        ? "deployment"
        : window.location.pathname.substring(1)
    );

    document.body.insertBefore(navBar, document.body.children[0]);

    metamaskTrigger = document.getElementById("metamask-enable");
    metamaskTrigger.onclick = enableMetamask;
  },
  addTitleAndFavicon: function () {
    var favicon = document.createElement("link");
    favicon.type = "image/png";
    favicon.rel = "icon";
    favicon.href = "./images/favicon.png";
    document.head.appendChild(favicon);

    var pageTitle = document.createElement("title");
    pageTitle.innerHTML = "GBM dApp";
    document.head.appendChild(pageTitle);
  },
  addCSS: function (_filename) {
    var pageCSS = document.createElement("link");
    pageCSS.type = "text/css";
    pageCSS.rel = "stylesheet";
    pageCSS.href = `styles/${_filename}.css`;

    document.head.appendChild(pageCSS);
  },
  addFooter: function () {
    let footer = document.createElement("div");
    footer.classList.add("footer");
    footer.innerHTML = `
      <img src="images/section-divider-vector.svg" loading="lazy" alt="" class="section-divider-bottom">
      <div class="copyright">© Copyright 2018-2023 GBM. All rights reserved.</div>
    `;
    document.body.appendChild(footer);
  },
  setUpMetamask: function () {
    if (ethereum && ethereum.on) {
      const handleConnect = () => {
        console.log("Handling 'connect' event");
      };

      const handleChainChanged = (chainId) => {
        console.log("Handling 'chainChanged' event with payload", chainId);
      };

      const handleAccountsChanged = (accounts) => {
        console.log("Handling 'accountsChanged' event with payload", accounts);
        window.location.reload();
      };

      ethereum.on("connect", handleConnect);
      ethereum.on("disconnect", () => {
        window.location.reload();
      });
      ethereum.on("chainChanged", handleChainChanged);
      ethereum.on("accountsChanged", handleAccountsChanged);

      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener("connect", handleConnect);
          ethereum.removeListener("chainChanged", handleChainChanged);
          ethereum.removeListener("accountsChanged", handleAccountsChanged);
        }
      };
    }
  },
  isConnected: async function () {
    const accounts = await ethereum.request({ method: "eth_accounts" });
    if (accounts.length) {
      await this.loadContracts();
      ethereum
        .request({ method: "eth_requestAccounts" })
        .then(() => this.enableWeb3DependentElements())
        .catch((err) => {
          console.error(err);
        });

      // Hacky way to detect that metamask has desynced from the demo node.
      const chainIdInUse = await web3.eth.getChainId();

      if (
        chainIdInUse === 31337 &&
        localStorage.getItem("metamaskNonce") === null
      ) {
        const nonceCheck = web3.eth
          .getTransactionCount(window.ethereum.selectedAddress)
          .then()
          .catch((error) => {
            localStorage.clear();
            localStorage.setItem(
              "metamaskNonce",
              error.message.match(/\d+/g)[1]
            );
            window.location.reload();
          });
      }
    } else {
      metamaskTrigger.checked = false;
      console.log("Metamask is not connected");
    }
  },
  loadContracts: async function () {
    abis = await (await fetch("../config/abis.json")).json();

    web3 = new Web3(window.ethereum);
    gbmContracts = new web3.eth.Contract(abis["gbm"], diamondAddress);
    erc721contracts = erc721contractAddresses
      ? erc721contractAddresses.map(
          (_address) => new web3.eth.Contract(abis["erc721"], _address)
        )
      : undefined;
    erc1155contracts = erc1155contractAddresses
      ? erc1155contractAddresses.map(
          (_address) => new web3.eth.Contract(abis["erc1155"], _address)
        )
      : undefined;
  },
  checkDeploymentState: function () {
    if (deploymentStatus?.finished) this.flipVisibility();
  },
  flipVisibility: function () {
    let elements = document.getElementsByClassName("deployment-found");
    for (let i = 0; i < elements.length; i++) {
      elements[i].hidden = false;
    }

    let elements2 = document.getElementsByClassName("deployment-missing");
    for (let i = 0; i < elements2.length; i++) {
      elements2[i].hidden = true;
    }
  },
  enableWeb3DependentElements: async function () {
    // Toggle between no-metamask/metamask states
    Array.from(document.getElementsByClassName("metamask-missing")).forEach(
      (_element) => (_element.hidden = true)
    );
    Array.from(document.getElementsByClassName("metamask-found")).forEach(
      (_element) => (_element.hidden = false)
    );

    document.getElementById(
      "active-metamask-account"
    ).innerHTML = `Connected: ${shortenAddress(
      window.ethereum.selectedAddress
    )}`;
    const forceBtn = document.getElementById("metamask-refresh");
    forceBtn.onclick = chainZigZag;

    var nftFetcher = document.createElement("script");
    nftFetcher.type = "text/javascript";
    nftFetcher.src = `scripts/nftjsonfetcher.js`;

    document.body.appendChild(nftFetcher);

    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = `scripts/${
      window.location.pathname.substring(1) === ""
        ? "deployment"
        : window.location.pathname.substring(1)
    }.js`;

    document.body.appendChild(script);
  },
};

const shortenAddress = (_address) =>
  `${_address.substring(0, 6)}...${_address.substring(_address.length - 6)}`;

/*
  Basic function to request MetaMask access, then add & switch the network to the
  local hardhat node for convenience.
*/
function enableMetamask() {
  ethereum
    .request({ method: "eth_requestAccounts" })
    .then(() => enableWeb3DependentElements())
    .catch((err) => {
      console.error(err);
    });

  requestChainAddition("0x7a69");
}

/* 
  Simple helper function to request a network change on metamask. Requires knowing the change id. 
  The error clause is only here to add the hardhat network since it's not available by default, and should 
  only be kept for demo purposes.
*/
async function requestChainAddition(_chain) {
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: _chain }],
    });
  } catch (err) {
    // This error code indicates that the chain has not been added to MetaMask
    if (err.code === 4902) {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainName: "Local Hardhat",
            chainId: `0x7a69`,
            nativeCurrency: {
              name: "fETH",
              decimals: 18,
              symbol: "fETH",
            },
            rpcUrls: ["http://localhost:8545"],
          },
        ],
      });
    } else if (err.code === 4001) {
      throw new Error("Chain change rejected!");
    }
  }
}

/*
  Very dirty workaround for metamask to force a refresh for the hardhat node.
  That cache is very persistent but metamask plays by the rules if it switches networks back and forth.
*/
async function chainZigZag() {
  await requestChainAddition("0x1");
  await requestChainAddition("0x7a69");
  window.location.reload();
}

/*

*/
function generateSelectDropdown(
  _spanId,
  _options,
  _display,
  _onclick,
  _checkOverride
) {
  var gbmCSS = window.document.styleSheets[0];
  const selectContainer = document.getElementById(_spanId);
  selectContainer.innerHTML = "";
  gbmCSS.insertRule(
    `#${_spanId}.expanded { height: ${3 * _options.length}rem; }`,
    gbmCSS.cssRules.length
  );
  selectContainer.setAttribute("selected-value", _options[_checkOverride ?? 0]);
  selectContainer.setAttribute("selected-index", _checkOverride ?? 0);
  for (i = 0; i < _options.length; i++) {
    selectContainer.innerHTML += `<input type="radio" name="${_spanId}" index="${i}" value="${
      _options[i]
    }" id="${_options[i]}" ${
      i === (_checkOverride ?? 0) ? "checked" : ""
    }/><label for="${_options[i]}">${_display[i]}</label>`;
  }

  document.getElementById(_spanId).onclick = function (e) {
    e.preventDefault();
    e.stopPropagation();
    let targeted = document.getElementById(e.target.getAttribute("for"));
    targeted.checked = true;
    if (
      targeted.value !== targeted.parentElement.getAttribute("selected-value")
    ) {
      targeted.parentElement.setAttribute("selected-value", targeted.value);
      targeted.parentElement.setAttribute(
        "selected-index",
        targeted.getAttribute("index")
      );
      _onclick();
    }
    selectContainer.classList.toggle("expanded");
  };

  document.onclick = function (e) {
    Array.from(document.getElementsByClassName("gbm-select")).forEach(
      (_selectElement) => {
        _selectElement.classList.remove("expanded");
      }
    );
  };
}

function reverseChildren(_parent) {
  for (var i = 1; i < _parent.childNodes.length; i++) {
    _parent.insertBefore(_parent.childNodes[i], _parent.firstChild);
  }
}

function timecalc(x, v) {
  return Math.floor(x / v);
}

function copyToClipboard() {
  navigator.clipboard.writeText(window.location);
}

function countdownDisplay(_timestamp) {
  var days = timecalc(_timestamp, 24 * 60 * 60),
    hours = timecalc(_timestamp, 60 * 60) % 24,
    minutes = timecalc(_timestamp, 60) % 60,
    seconds = timecalc(_timestamp, 1) % 60;
  return `${days > 0 ? `${days}d ` : ""}${hours > 0 ? `${hours}h ` : ""}${
    minutes > 0 ? `${minutes}m ` : ""
  }${seconds > 0 ? `${seconds}s` : ""}`;
}

const auctionFunctions = {
  getAuctionInfo: async function (_saleID) {
    let _highBidValueRaw = await gbmContracts.methods
      .getSale_HighestBid_Value(_saleID)
      .call();
    return {
      saleKind: await gbmContracts.methods.getSale_SaleKind(_saleID).call(),
      tokenAddress: await gbmContracts.methods
        .getSale_TokenAddress(_saleID)
        .call(),
      tokenID: await gbmContracts.methods.getSale_TokenID(_saleID).call(),
      tokenAmount: await gbmContracts.methods
        .getSale_TokenAmount(_saleID)
        .call(),
      tokenKind: await gbmContracts.methods.getSale_TokenKind(_saleID).call(),
      gbmPreset: await gbmContracts.methods.getSale_GBMPreset(_saleID).call(), // can break this down further
      gbmPresetIndex: await gbmContracts.methods
        .getSale_GBMPresetIndex(_saleID)
        .call(), // can break this down further
      currencyID: await gbmContracts.methods.getSale_CurrencyID(_saleID).call(),
      currencyName: await gbmContracts.methods
        .getSale_Currency_Name(_saleID)
        .call(),
      currencyAddress: await gbmContracts.methods
        .getSale_Currency_Address(_saleID)
        .call(),
      startTimestamp: await gbmContracts.methods
        .getSale_StartTimestamp(_saleID)
        .call(),
      endTimestamp: await gbmContracts.methods
        .getSale_EndTimestamp(_saleID)
        .call(),
      beneficiary: await gbmContracts.methods
        .getSale_Beneficiary(_saleID)
        .call(),
      debt: await gbmContracts.methods.getSale_Debt(_saleID).call(),
      highestBidValue: web3.utils.fromWei(_highBidValueRaw),
      highestBidValueRaw: _highBidValueRaw,
      highestBidBidder: await gbmContracts.methods
        .getSale_HighestBid_Bidder(_saleID)
        .call(),
      highestBidIncentive: await gbmContracts.methods
        .getSale_HighestBid_Incentive(_saleID)
        .call(),
      highestBidCurrencyIndex: await gbmContracts.methods
        .getSale_HighestBid_CurrencyIndex(_saleID)
        .call(),
      highestBidCurrencyAddress: await gbmContracts.methods
        .getSale_HighestBid_Currency_Address(_saleID)
        .call(),
      highestBidCurrencyName: await gbmContracts.methods
        .getSale_HighestBid_Currency_Name(_saleID)
        .call(),
      duration: await gbmContracts.methods
        .getSale_GBMPreset_AuctionDuration(_saleID)
        .call(),
      startingBid: web3.utils.fromWei(
        await gbmContracts.methods.getSale_StartingBid(_saleID).call()
      ),
    };
  },
  getNumberOfBids: async function (_saleId) {
    const availableBids = await gbmContracts.methods
      .getSale_NumberOfBids(_saleId)
      .call();
    return availableBids;
  },
  loadBids: async function (_saleId, _noOfBids) {
    const bidsArray = Promise.all(
      [...Array(parseInt(_noOfBids) + 1).keys()].map(
        async (item, index) => await this.getBidInfo(_saleId, index)
      )
    );
    return (await bidsArray).slice(1);
  },
  getBidInfo: async function (_saleID, _bidIndex) {
    return {
      bidValue: web3.utils.fromWei(
        await gbmContracts.methods.getSale_Bid_Value(_saleID, _bidIndex).call()
      ),
      bidBidder: await gbmContracts.methods
        .getSale_Bid_Bidder(_saleID, _bidIndex)
        .call(),
      bidIncentive: web3.utils.fromWei(
        await gbmContracts.methods
          .getSale_Bid_Incentive(_saleID, _bidIndex)
          .call()
      ),
      bidCurrencyIndex: await gbmContracts.methods
        .getSale_Bid_CurrencyIndex(_saleID, _bidIndex)
        .call(),
      bidCurrencyAddress: await gbmContracts.methods
        .getSale_Bid_Currency_Address(_saleID, _bidIndex)
        .call(),
      bidCurrencyName: await gbmContracts.methods
        .getSale_Bid_Currency_Name(_saleID, _bidIndex)
        .call(),
      bidTimestamp: await gbmContracts.methods
        .getSale_Bid_Timestamp(_saleID, _bidIndex)
        .call(),
    };
  },
  submitBid: async function (
    _auctionId,
    _newBidAmount,
    _previousHighestBidAmount
  ) {
    const newAmount = web3.utils.toWei(_newBidAmount);
    const oldAmount = web3.utils.toWei(_previousHighestBidAmount);
    await gbmContracts.methods.bid(_auctionId, newAmount, oldAmount).send({
      from: window.ethereum.selectedAddress,
      to: diamondAddress,
      value: newAmount,
      gasLimit: 300000,
    });
  },
  claimToken: async function (_saleId) {
    await gbmContracts.methods
      .claim(_saleId)
      .send({ from: window.ethereum.selectedAddress });
  },
};

const convertToMinutes = (_secondsString) => parseInt(_secondsString) / 60;
const convertToPercentage = (_valueInK) => parseInt(_valueInK) / 1000;

const creationFunctions = {
  pageInitSpecifics: async function () {
    document.getElementById("start-date-selector").style.display = "none";
    await this.populatePresets();
    this.generateBreakdown();
  },
  populatePresets: async function () {
    const { names, presets } = await this.getPresets();
    gbmPresetNames = names;
    gbmPresets = presets;

    let presetsFromDeployment = Object.values(
      deploymentStatus.registeredPresets
    ).splice(2);

    // let incentivePresets = names.map((_element) => _element.split("_")[0]);
    let incentivePresets = presetsFromDeployment.map(
      (_element) => _element.name.split("_")[0]
    );
    let incentivePresetNames = presetsFromDeployment.map(
      (_element) => _element.displayName
    );
    // let timePresets = names.map((_element) => _element.split("_")[1]);
    let timePresets = presetsFromDeployment.map(
      (_element) => _element.name.split("_")[1]
    );
    let timePresetNames = presetsFromDeployment.map(
      (_element) => _element.displayTime
    );

    incentivePresets = [...new Set(incentivePresets)];
    incentivePresetNames = [...new Set(incentivePresetNames)];
    timePresets = [...new Set(timePresets)];
    timePresetNames = [...new Set(timePresetNames)];

    generateSelectDropdown(
      "select-duration",
      timePresets,
      timePresetNames,
      this.generateBreakdown
    );
    generateSelectDropdown(
      "select-incentive",
      incentivePresets,
      incentivePresetNames,
      this.generateBreakdown,
      2
    );
  },
  getPresets: async function () {
    const presetAmount = await gbmContracts.methods
      .getGBMPresetsAmount()
      .call();

    const presetsArray = Promise.all(
      [...Array(parseInt(presetAmount) + 1).keys()].map(
        async (item, index) =>
          await gbmContracts.methods.getGBMPreset(index).call()
      )
    );
    const presetsNames = Promise.all(
      [...Array(parseInt(presetAmount) + 1).keys()].map(
        async (item, index) =>
          await gbmContracts.methods.getGBMPreset_Name(index).call()
      )
    );

    return {
      presets: (await presetsArray).slice(1),
      names: (await presetsNames).slice(1),
    };
  },
  generateBreakdown: function () {
    let selectDuration = document.getElementById("select-duration");
    let selectIncentive = document.getElementById("select-incentive");

    let preset = Object.values(deploymentStatus.registeredPresets)
      .splice(2)
      .find(
        (element) =>
          element.name ===
          `${selectIncentive.getAttribute(
            "selected-value"
          )}_${selectDuration.getAttribute("selected-value")}`
      );

    let startTime = new Date();

    if (
      document.getElementById("start-date-selector").style.display !== "none"
    ) {
      let timePicker =
        document.getElementsByClassName("gbm-time-picker")[0].value;
      let datePicker =
        document.getElementsByClassName("gbm-date-picker")[0].value;
      let time = timePicker === "" ? ["23", "00"] : timePicker.split(":");
      let date =
        datePicker === ""
          ? [startTime.getFullYear(), startTime.getMonth(), startTime.getDate()]
          : datePicker.split("-");

      startTime = new Date(
        parseInt(date[0]),
        parseInt(date[1]) - 1,
        parseInt(date[2]),
        parseInt(time[0]),
        parseInt(time[1])
      );
    }
    document.getElementById("time-specifics").innerHTML = `
        End date: ${new Date(
          startTime.getTime() + parseInt(preset.auctionDuration) * 1000
        ).toUTCString()} </br>
        Hammer time: ${convertToMinutes(
          preset.hammerTimeDuration
        )} minutes <div class="gbm-tooltip">ⓘ
            <span class="gbm-tooltip-text">Any bid placed in the last 20mins of the auction will reset the auction timer to 20mins. This gives everyone a chance to keep bidding and win.</span>
        </div>
    `;

    document.getElementById("incentive-specifics").innerHTML = `
        Bidders will make between ${convertToPercentage(
          preset.incentiveMin
        )}% and ${convertToPercentage(
      preset.incentiveMax
    )}% return on their bid. In total, bidders will receive up to ${convertToPercentage(
      preset.potentialTotal
    )}% of the winning bid.
    `;
  },
  toggleStartDateSelection: function (_visible) {
    document.getElementById("start-date-selector").style.display = _visible
      ? "flex"
      : "none";
    this.generateBreakdown();
  },
};

pageInitializer.init();
