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
let adminAddress;
let diamondOwnerAddress;
let logo = "./images/logo.svg";
window.COLOR_PALLETE = {
  primary: "#E2107B",
  secondary: "#000000",
  tertiary: "#FF5959",
  background: "#1E193E",
  text: "#FFFFFF",
  selection: "#FACF5A"
}

function onClosePopup() {
  const freezerIcon = document.querySelector(".freeze-icon")
  freezerIcon.innerHTML = `
    <div class="lds-roller" style="margin:0;">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>`

  const freezerText = document.querySelector(".freeze-text")
  freezerText.classList.remove('error')
  freezerText.innerText = 'Please check your MetaMask.'

  const freezer = document.querySelector(".freeze");
  freezer.style.display = "none";
}

// Functions to run on page load

const pageInitializer = {
  init: async function() {
    this.setDeploymentStatus();
    this.loadContractAddresses();
    this.setUpMetamask();
    this.addNavBar();
    this.addFooter();
    this.addFreezeBar();
    await this.checkDeploymentState();
    await this.isConnected();
    this.loadCustomCss(deploymentStatus);

    await this.setGlobalAdminAddress();
    await this.setGlobalDiamondOwnerAddress();
  },

  setDeploymentStatus() {
    //if (!deploymentStatus || deploymentStatus === "undefined") return;

    deploymentStatus = JSON.parse(deploymentStatus);
    fetch('/v1/dapp/config/config2.json')

      .then((blob) => blob.json())
      .then((json) => {
        deploymentStatus = json;
        localStorage.setItem('deploymentStatus', JSON.stringify(json));
        //deploymentStatus = JSON.parse(localStorage.getItem('deploymentStatus'));
        console.log(json);
        //storeNewDeploymentStatusInServerMemory(json)

      })
  },

  handleMobile: function() {
    window.addEventListener('ethereum#initialized', function() {
      alert('mobile browser detected');
      this.setUpMetamask();
      this.isConnected();
    }, { once: true })
  },

  async fetchDeploymentStatus() {
    if (!deploymentStatus?.commandHistory?.length) {
      const response = await fetch("/v1/dapp/config/config2.json");
      const data = await response.json();

      return data?.commandHistory?.length ? data : null;
    }
  },

  loadContractAddresses: function() {
    try {
      diamondAddress = deploymentStatus.deployedFacets["Diamond"];
      erc721contractAddresses = deploymentStatus.ERC721;
      erc1155contractAddresses = deploymentStatus.ERC1155;
    } catch { }
  },

  loadCustomCss: function(data) {
    if (!data) return;
    if (!data.colours) return;

    const r = document.querySelector(":root");
    r.style.setProperty("--primary", data.colours.primary);
    r.style.setProperty("--secondary", data.colours.secondary);
    r.style.setProperty("--tertiary", data.colours.tertiary);
    r.style.setProperty("--background", data.colours.background);
    r.style.setProperty("--selection", data.colours.selection);
    r.style.setProperty("--text", data.colours.text);
    const logoImg = document.querySelector("#nav-bar-logo");
    logoImg.src = data.logo || logo;
  },
  addNavBar: function() {
    const pathname = window.location.pathname
    const connectedAddress = window.ethereum.selectedAddress
    const header = document.createElement("header")
    const button = document.createElement("button")
    button.setAttribute('id', 'connect-wallet')
    if (connectedAddress) {
      button.classList.add('connected')
      button.innerHTML = `
        <p>${shortenAddress(window.ethereum.selectedAddress)}</p>
        <img src="images/metamask-fox.svg" width="20px" height="20px" alt="Metamask"/>
      `
    } else {
      button.innerText = `Connect to a wallet`
    }
    header.innerHTML = `
      <section class="header-left">
        <div class="header-logo-container">
          <a href="https://gbmdapp.link/ido">
            <img
              id="nav-bar-logo"
              src="images/logo.svg"
              width="200px"
              height="40px"
              alt="Stellaswap"
            />
          </a>
        </div>
        <div class="nav-item">
          <a href="https://gbmdapp.link/ido">
            IDO Home
          </a>
        </div>
        <div class="nav-item">
          <a href="https://gbmdapp.link/v1/dapp/tokens" class="${pathname.endsWith('/dapp/tokens') ? 'active' : ''}">
            My Bids
          </a>
        </div>
        <div class="nav-item">
          <a href="https://gbmdapp.link/v1/dapp/tokenAuctions" class="${pathname.endsWith('/dapp/tokenAuctions') ? 'active' : ''}">
            Token Auctions
          </a>
        </div>
      </section>

      <section class='header-right'>
        ${button.outerHTML}
      </section>`;

    this.addTitleAndFavicon();
    document.body.insertBefore(header, document.body.children[0]);
    if (!connectedAddress) {
      metamaskTrigger = document.getElementById("connect-wallet");
      metamaskTrigger.onclick = enableMetamask;
    }
  },
  addFreezeBar: function() {
    let freeze = document.createElement("div");
    freeze.classList.add("freeze");
    document.body.insertBefore(freeze, document.body.children[0]);
    freeze.innerHTML = `
      <div class="freeze-container">
        <div class="freeze-box">
          <div class="freeze-icon">
            <div class="lds-roller" style="margin:0;">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
          <p class="freeze-text">Please check your MetaMask.</p>
          <button 
            class="gbm-btn red h-3"
            onClick="onClosePopup()"
          >Cancel</button>
        </div>
      </div>
    `;
    // document.body.insertBefore(freeze, document.body.children[0]);
  },
  addTitleAndFavicon: function() {
    var favicon = document.createElement("link");
    favicon.type = "image/x-icon";
    favicon.rel = "icon";
    favicon.href = "./images/favicon.ico";
    document.head.appendChild(favicon);

    var pageTitle = document.createElement("title");
    pageTitle.innerHTML = "Stellaswap GBM dApp";
    document.head.appendChild(pageTitle);
  },
  addFooter: function() {
    let footer = document.createElement("div");
    footer.classList.add("footer");
    // footer.innerHTML = `
    //   <a href="https://www.gbm.auction" target="_blank">
    //     <img src="images/PoweredbyGBMBadge-LightGreen.svg" loading="lazy" alt="" class="copyright">
    //   </a>
    //   <div class="copyright">© Copyright 2018-2023 Stellaswap. All rights reserved.</div>
    // `;
    footer.innerHTML = `
      <div class="copyright">© Copyright 2018-2023 Stellaswap. All rights reserved.</div>
    `;
    document.body.appendChild(footer);
  },
  setUpMetamask: function() {
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
  isConnected: async function() {
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
  loadContracts: async function() {
    abis = await (await fetch("/v1/dapp/config/abis.json")).json();

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

  async checkDeploymentState() {
    const onMemoryDeploymentStatus = await this.fetchDeploymentStatus();

    if (onMemoryDeploymentStatus)
      this.handleShowOptionToUseDeployedApp(onMemoryDeploymentStatus);
    else if (deploymentStatus?.finished) this.flipVisibility();
    else if (
      (!deploymentStatus || deploymentStatus === "undefined") &&
      window.location.pathname !== "/"
    )
      return;
  },

  handleShowOptionToUseDeployedApp(data) {
    if (window.location.pathname === "/")
      this.showOptionToUseDeployedDApp(data);
    else window.location.assign("/");
  },

  showOptionToUseDeployedDApp(data) {
    const useDeployDAppView = document.querySelector(".dApp-exists");

    useDeployDAppView.hidden = false;

    const useDeployedDAppButton = useDeployDAppView.querySelector(
      "#deployExistingDApp"
    );

    useDeployedDAppButton.onclick = () => {
      localStorage.setItem("deploymentStatus", JSON.stringify(data));

      useDeployDAppView.hidden = true;
      this.showDeploymentFoundElements();
      displayDeployedDAppStatus(data);
      this.loadCustomCss(data);
    };

    this.hideDeploymentMissingElements();
  },

  flipVisibility: function() {
    this.showDeploymentFoundElements();
    this.hideDeploymentMissingElements();
  },

  hideDeploymentMissingElements() {
    let elements2 = document.getElementsByClassName("deployment-missing");
    for (let i = 0; i < elements2.length; i++) {
      elements2[i].hidden = true;
    }
  },

  showDeploymentFoundElements() {
    let elements = document.getElementsByClassName("deployment-found");
    for (let i = 0; i < elements.length; i++) {
      elements[i].hidden = false;
    }
  },

  enableWeb3DependentElements: async function() {
    // Toggle between no-metamask/metamask states
    Array.from(document.getElementsByClassName("metamask-missing")).forEach(
      (_element) => (_element.hidden = true)
    );
    Array.from(document.getElementsByClassName("metamask-found")).forEach(
      (_element) => (_element.hidden = false)
    );

    const nftFetcher = document.createElement("script");
    nftFetcher.type = "text/javascript";
    nftFetcher.src = `/v1/dapp/scripts/nftjsonfetcher.js`;

    document.body.appendChild(nftFetcher);

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = `scripts/${window.location.pathname.substring(9) === ""
      ? "deployment"
      : window.location.pathname.substring(9)
      }.js`;
    document.body.appendChild(script);
  },

  async setGlobalDiamondOwnerAddress() {
    diamondOwnerAddress = (await this.getGBMAdmin())?.toLowerCase();

    if (
      diamondOwnerAddress &&
      deploymentStatus &&
      deploymentStatus?.details.admin?.toLowerCase() !== diamondOwnerAddress
    ) {
      await storeNewDeploymentStatus({
        ...deploymentStatus,
        details: {
          ...deploymentStatus.details,
          deployer: diamondOwnerAddress,
        },
      });
    }
  },

  async getGBMDiamondOwner() {
    return await gbmContracts.methods.owner().call();
  },

  async setGlobalAdminAddress() {
    adminAddress = (await this.getGBMAdmin())?.toLowerCase();
    if (
      adminAddress &&
      deploymentStatus &&
      deploymentStatus?.details.admin?.toLowerCase() !== adminAddress
    ) {
      await storeNewDeploymentStatus({
        ...deploymentStatus,
        details: {
          ...deploymentStatus.details,
          admin: adminAddress,
        },
      });
    }
  },

  async getGBMAdmin() {
    if (gbmContracts) {
      return await gbmContracts.methods.getGBMAdmin().call();
    }
  },

  isMetamaskAccountOwnerOrAdmin() {
    return {
      admin: window?.ethereum?.selectedAddress?.toLowerCase() === adminAddress,
      diamondOwner:
        window?.ethereum?.selectedAddress?.toLowerCase() ===
        diamondOwnerAddress,
    };
  },
};

const shortenAddress = (_address) =>
  `${_address.substring(0, 6)}...${_address.substring(_address.length - 4)}`;

/*
  Basic function to request MetaMask access, then add & switch the network to the
  local hardhat node for convenience.
*/
function enableMetamask() {
  ethereum
    .request({ method: "eth_requestAccounts" })
    .then(() => this.enableWeb3DependentElements())
    .catch((err) => {
      console.error(err);
    });

  requestChainAddition("0x507");
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
    // metamask mobile returns -32603 instead of 4902 if chain doesnt exist
    if (err.code === 4902 || err.code == -32603) {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainName: "mbase",
            chainId: `0x507`,
            nativeCurrency: {
              name: "fETH",
              decimals: 18,
              symbol: "fETH",
            },
            rpcUrls: ["https://moonbase-alpha.blastapi.io/10dcf058-6db2-4fa6-a575-7a46cbc3aed2"]
          },
        ],
      });
      enableMetamask();
      chainZigZag()
    } else if (err.code === 4001) {
      alert("Chain change rejected!");
    } else {
      alert(JSON.stringify(err))
    }
  }
}

/*
  Very dirty workaround for metamask to force a refresh for the hardhat node.
  That cache is very persistent but metamask plays by the rules if it switches networks back and forth.
*/
async function chainZigZag() {
  await requestChainAddition(`0x1`);
  await requestChainAddition(`0x507`);
  //window.location.reload();
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
    selectContainer.innerHTML += `<input type="radio" name="${_spanId}" index="${i}" value="${_options[i]
      }" id="${_options[i]}" ${i === (_checkOverride ?? 0) ? "checked" : ""
      }/><label for="${_options[i]}">${_display[i]}</label>`;
  }

  document.getElementById(_spanId).onclick = function(e) {
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
      _onclick(e);
    }
    selectContainer.classList.toggle("expanded");
  };

  document.onclick = function(e) {
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

function copyUrlPathToClipboard() {
  navigator.clipboard.writeText(window.location);
}

function countdownDisplay(_timestamp) {
  var days = timecalc(_timestamp, 24 * 60 * 60),
    hours = timecalc(_timestamp, 60 * 60) % 24,
    minutes = timecalc(_timestamp, 60) % 60,
    seconds = timecalc(_timestamp, 1) % 60;
  return `${days > 0 ? `${days}d ` : ""}${hours > 0 ? `${hours}h ` : ""}${minutes > 0 ? `${minutes}m ` : ""
    }${seconds > 0 ? `${seconds}s` : ""}`;
}

const auctionFunctions = {
  getAuctionInfo: async function(_saleID) {
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
  getNumberOfBids: async function(_saleId) {
    const availableBids = await gbmContracts.methods
      .getSale_NumberOfBids(_saleId)
      .call();
    return availableBids;
  },
  loadBids: async function(_saleId, _noOfBids) {
    const bidsArray = Promise.all(
      [...Array(parseInt(_noOfBids) + 1).keys()].map(
        async (item, index) => await this.getBidInfo(_saleId, index)
      )
    );
    return (await bidsArray).slice(1);
  },
  getBidInfo: async function(_saleID, _bidIndex) {
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
  submitBid: async function(
    _auctionId,
    _newBidAmount,
    _previousHighestBidAmount,
    _currencyAddress
  ) {
    const newAmount = web3.utils.toWei(_newBidAmount);
    const oldAmount = web3.utils.toWei(_previousHighestBidAmount);
    if (_currencyAddress !== "0x0000000000000000000000000000000000000000") {
      let erc20contractToBid = new web3.eth.Contract(
        abis["erc20"],
        _currencyAddress
      );

      let approvedAmount = await erc20contractToBid.methods
        .allowance(window.ethereum.selectedAddress, diamondAddress)
        .call();

      if (
        web3.utils.toBN(approvedAmount).cmp(web3.utils.toBN(newAmount)) === -1
      ) {
        await freezeAndSendToMetamask(() =>
          erc20contractToBid.methods
            .approve(diamondAddress, newAmount)
            .send({ from: window.ethereum.selectedAddress })
        );
      }
    }
    await freezeAndSendToMetamask(() =>
      gbmContracts.methods.bid(_auctionId, newAmount, oldAmount).send({
        from: window.ethereum.selectedAddress,
        to: diamondAddress,
        value:
          _currencyAddress !== "0x0000000000000000000000000000000000000000"
            ? 0
            : newAmount,
        gasLimit: 300000,
      })
    );
  },
  claimToken: async function(_saleId) {
    await freezeAndSendToMetamask(() =>
      gbmContracts.methods
        .claim(_saleId)
        .send({ from: window.ethereum.selectedAddress })
    );
  },
  addCurrencyToMetamask: async function(_currency) {
    if (_currency.address !== "0x0000000000000000000000000000000000000000") {
      const params = {
        type: "ERC20",
        options: {
          address: _currency.address,
          symbol: _currency.name,
          decimals: 18,
          image: "https://i.imgur.com/kvjZZ3s.png",
        },
      };

      window.ethereum
        .request({ method: "wallet_watchAsset", params })
        .then(() => console.log("Success, Token added!"))
        .catch((error) => console.log(`Error: ${error.message}`));
    }
  },
};

const convertToMinutes = (_secondsString) => parseInt(_secondsString) / 60;
const convertToPercentage = (_valueInK) => parseInt(_valueInK) / 1000;

const creationFunctions = {
  pageInitSpecifics: async function() {
    document.getElementById("start-date-selector").style.display = "none";
    await this.populatePresets();
    this.generateBreakdown();
  },
  populatePresets: async function() {
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
  getPresets: async function() {
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
  generateBreakdown: function() {
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
  toggleStartDateSelection: function(_visible) {
    document.getElementById("start-date-selector").style.display = _visible
      ? "flex"
      : "none";
    this.generateBreakdown();
  },
};

async function freezeAndSendToMetamask(_functionCall) {
  const freezer = document.querySelector(".freeze");
  freezer.style.display = "block";

  const freezerIcon = document.querySelector(".freeze-icon")
  const freezerText = document.querySelector(".freeze-text")
  await _functionCall()
    .then(() => {
      freezerText.classList.remove('error')
      freezerText.innerText = 'Transaction success.'
    })
    .catch(e => {
      console.error(e)
      freezerText.classList.add('error')
      freezerText.innerText = e.message
    })
    .finally(() => {
      freezerIcon.innerHTML = '<img src="/v1/dapp/images/metamask-fox.svg" />'
    });
}

function displayDeployedDAppStatus(data) {
  // Display the values from the previous deployment
  document.getElementById("deployed-network").innerHTML = data.details.network;

  document.getElementById("deployed-version").innerHTML = data.details.version;

  document.getElementById("deployed-deployer").innerHTML =
    data.details.deployer;

  document.getElementById("deployed-admin").innerHTML = data.details.admin;
}

async function storeNewDeploymentStatus(data) {
  const jsonDeploymentStatus = JSON.stringify(data);

  localStorage.setItem("deploymentStatus", jsonDeploymentStatus);

  await storeNewDeploymentStatusInServerMemory(jsonDeploymentStatus);
}

async function storeNewDeploymentStatusInServerMemory(jsonDeploymentStatus) {
  try {
    const response = await fetch("/updateDeploymentStatus", {
      method: "POST",
      body: jsonDeploymentStatus,
      headers: new Headers({ "Content-Type": "application/json" }),
    });

    const data = await response.json();

    if (!data?.updated)
      alert("ERROR: Deployment status update in backend failed!");
  } catch (error) {
    console.error(error);
    alert("ERROR: Deployment status update in backend failed!");
  }
}

pageInitializer.init();
