// CREATE OF FACTORY FUNCTIONS

if (deploymentStatus?.finished) displayDeployedDAppStatus();
else initDeploymentPage();

generateSelectDropdown(
  "select-network",
  ["hardhat", "mainnet"],
  ["Local Hardhat", "Live Blockchain - 👷 ⚙️ 🦊"],
  () => {}
);

async function generateTheDeployOptions() {
  let deploymentConf = await (
    await fetch("../config/deploymentConf.json")
  ).json();

  console.log(deploymentConf);

  let idList = Object.keys(deploymentConf);
  let dispNames = [];

  for (let i = 0; i < idList.length; i++) {
    dispNames[i] = deploymentConf[idList[i]].displayName;
  }

  generateSelectDropdown("select-version", idList, dispNames, () => {});
}

generateTheDeployOptions();

async function initDeploymentPage() {
  // If logged on to metamask, populate the deployer address
  document.getElementById("deployer-address").placeholder =
    window.ethereum.selectedAddress ??
    "Please connect to your MetaMask account";

  // Reset the checkboxes to unchecked, then add their onchange handlers
  document.getElementById("use-deployer").checked = true;
  document.getElementById("admin-address").disabled = true;
  document.getElementById("admin-address").value =
    window.ethereum.selectedAddress ??
    "Please connect to your MetaMask account";
  document.getElementById("run-tests").checked = true;
  document.getElementById("enable-customization").checked = false;

  document.getElementById("use-deployer").onchange = isAdminDeployer;
  document.getElementById("enable-customization").onchange =
    enableCustomization;

  // Set default preset values
  defaultPresets = await (await fetch("/presets")).json();

  await colorActions.init();
  await logoActions.init();
}

function isAdminDeployer(_onChangeValue) {
  if (_onChangeValue.target.checked) {
    document.getElementById("admin-address").disabled = true;
    document.getElementById("admin-address").value =
      window.ethereum.selectedAddress ??
      "Please connect to your MetaMask account";
  } else {
    document.getElementById("admin-address").disabled = false;
    document.getElementById("admin-address").value = "";
  }
}

function enableCustomization(_onChangeValue) {
  document.getElementById("default-preset-container").hidden =
    !_onChangeValue.target.checked;
}

async function connectToDeployer() {
  if (
    !document.getElementById("use-deployer").checked &&
    document.getElementById("admin-address").value.match(/^0x[a-fA-F0-9]{40}$/g)
      .length === 0
  ) {
    document.getElementById("admin-address").focus();
    console.log("invalid hex");
    return;
  }

  localStorage.clear();

  terminal.innerHTML = "";
  displayNewMessageOnTerminal("Starting Deployment ⬆️");

  const deployButton = document.getElementById("deploy-btn");
  deployButton.classList.add("deploying");
  deployButton.disabled = true;
  deployButton.innerHTML = "Deploying...";

  defaultPresets.RunTestAuction = document.getElementById("run-tests").checked;
  defaultPresets.UseSameAddressForDeployerAndGbmAdmin =
    document.getElementById("use-deployer").checked;
  defaultPresets.GBMAdminOverrideAddress =
    !defaultPresets.UseSameAddressForDeployerAndGbmAdmin
      ? document.getElementById("admin-address").value
      : defaultPresets.GBMAdminOverrideAddress;

  let deploymentConf = await (
    await fetch("../config/deploymentConf.json")
  ).json();

  const webSocket = new WebSocket("wss://gbmdapp.link/websocket");

  let deploymentSteps =
    deploymentConf[
      document.getElementById("select-version").getAttribute("selected-value")
    ].deploymentSteps;

  if (
    document.getElementById("select-network").getAttribute("selected-value") ==
    "hardhat"
  ) {
    deploymentSteps = ["d_h_b_" + window.ethereum.selectedAddress].concat(
      deploymentSteps
    );
  }
  let step = (deploymentStatus && deploymentStatus.commandHistory) ? deploymentStatus.commandHistory.length : 0;

  webSocket.onopen = (event) => {
    let lastDeploymentState = localStorage.getItem("deploymentStatus");
    if (lastDeploymentState) {
      webSocket.send(`RESUME || ${lastDeploymentState}`);
    } else {
      webSocket.send(`PURGE`);
    }
    webSocket.send(`DEPLOY || ${deploymentSteps[step]}`);
  };

  webSocket.onclose = (event) => {
    let msgToDisplay = `${new Date().toLocaleTimeString()} - ⚠️⚠️⚠️ ERROR: The deployer stopped responding! ⚠️⚠️⚠️`;
    terminal.innerHTML += msgToDisplay + "<br/>";
    terminal.scrollTop = terminal.scrollHeight;
  };

  webSocket.onmessage = (event) => {
    let receivedMsg = event.data;
    let commands = receivedMsg.split(" || ");
    switch (commands[0]) {
      case "MSG":
        displayNewMessageOnTerminal(commands[1]);
        break;
      case "STATE":
        localStorage.setItem("deploymentStatus", commands[1]);
        break;
      case "STEP_DONE":
        step++;
        if (step >= deploymentSteps.length) {
          displayNewMessageOnTerminal("Deployment done ✅");
          finalizeDeployment();
          setTimeout(() => {
            pageInitializer.loadCustomCss();
            pageInitializer.flipVisibility();
            webSocket.close(); // Very dirty way to not show the onclose message for now :)
          }, 2000);
        } else {
          webSocket.send(`DEPLOY || ${deploymentSteps[step]}`);
        }
        break;
      default:
    }
  };
}

function displayNewMessageOnTerminal(msg) {
  let msgToDisplay = `${new Date().toLocaleTimeString()} - ${msg}`;
  terminal.innerHTML += msgToDisplay + "<br/>";
  terminal.scrollTop = terminal.scrollHeight;
}

function finalizeDeployment() {
  localStorage.setItem(
    "deploymentStatus",
    `${localStorage
      .getItem("deploymentStatus")
      .slice(0, -1)}, "finished": true}`
  );

  const colours = {
    primary: document.getElementById("color-primary").value,
    secondary: document.getElementById("color-fields").value,
    tertiary: document.getElementById("color-important").value,
    background: document.getElementById("color-background").value,
    text: document.getElementById("color-font").value,
    selection: document.getElementById("color-secondary").value,
  };

  const deploymentDetails = {
    network: document
      .getElementById("select-network")
      .getAttribute("selected-value"),
    version: document
      .getElementById("select-version")
      .getAttribute("selected-value"),
    deployer: window.ethereum.selectedAddress,
    admin: window.ethereum.selectedAddress, //TODO change to actual admin (fetch from gbm contract)
  };

  deploymentStatus = JSON.parse(localStorage.getItem("deploymentStatus"));
  deploymentStatus.colours = colours;
  deploymentStatus.details = deploymentDetails;
  deploymentStatus.logo = document.getElementById("logo-url").value;

  localStorage.setItem("deploymentStatus", JSON.stringify(deploymentStatus));
  displayDeployedDAppStatus();
}

function displayDeployedDAppStatus() {
  // Display the values from the previous deployment
  document.getElementById("deployed-network").innerHTML =
    deploymentStatus.details.network;
  document.getElementById("deployed-version").innerHTML =
    deploymentStatus.details.version;
  document.getElementById("deployed-deployer").innerHTML =
    deploymentStatus.details.deployer;
  document.getElementById("deployed-admin").innerHTML =
    deploymentStatus.details.admin;
}

document.getElementById("file-upload").addEventListener("change", onChange);

function onChange(event) {
  var reader = new FileReader();
  reader.onload = onReaderLoad;
  reader.readAsText(event.target.files[0]);
}

function onReaderLoad(event) {
  var obj = JSON.parse(event.target.result);
  //ToDo check if valid deployment status
  localStorage.setItem("deploymentStatus", JSON.stringify(obj));
  window.location.reload();
}

function triggerUpload() {
  document.getElementById("file-upload").click();
}

function downloadObjectAsJson() {
  var dataStr =
    "data:text/json;charset=utf-8," +
    encodeURIComponent(localStorage.getItem("deploymentStatus"));
  var downloadAnchorNode = document.createElement("a");
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", "GBM-dApp-deployment.json");
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}

function initReset() {
  localStorage.clear();
  window.location.reload();
}

const logoActionsProto = {
  init: async function () {
    document.getElementById("logo-update-first").checked = true;
    document.getElementById("logo-update-second").false = false;
    document.getElementById("logo-url").hidden = false;
    document.getElementById("logo-upload").hidden = true;
    document.getElementById("logo-url").value = "./images/logo.svg";
    document
      .getElementById("image-upload")
      .addEventListener("change", this.imgFound);
  },
  toggleLogoUploadField: function () {
    document.getElementById("logo-url").hidden =
      !document.getElementById("logo-url").hidden;
    document.getElementById("logo-upload").hidden =
      !document.getElementById("logo-upload").hidden;
  },
  updateLogoByLink: function () {
    document.getElementById("logo-upload-success").hidden = false;
    this.updateCSS();
  },
  imageUpload: function () {
    document.getElementById("image-upload").click();
  },
  imgFound: function (event) {
    var reader = new FileReader();
    reader.onload = function (event) {
      document.getElementById("logo-url").value = event.target.result;
      document.getElementById("logo-upload-success").hidden = false;
      logoActions.updateCSS();
      deploymentStatus =
        JSON.parse(localStorage.getItem("deploymentStatus")) || {};
      deploymentStatus.logo = document.getElementById("logo-url").value;
      localStorage.setItem(
        "deploymentStatus",
        JSON.stringify(deploymentStatus)
      );
    };
    reader.readAsDataURL(event.target.files[0]);
  },
  resetToDefault: function () {
    document.getElementById("logo-url").value = "./images/logo.svg";
    document.getElementById("logo-upload-success").hidden = true;
    this.updateCSS();
  },
  updateCSS: function () {
    document.getElementById("nav-bar-logo").src =
      document.getElementById("logo-url").value;
  },
};

function createLogoActions() {
  return Object.create(logoActionsProto);
}

const colorActionsProto = {
  currentColors: {},
  colourMapping: {
    "color-background": "background",
    "color-font": "text",
    "color-primary": "primary",
    "color-secondary": "selection",
    "color-fields": "secondary",
    "color-important": "tertiary",
  },
  returnDefaultColours: function () {
    return {
      background: "#1E193E",
      text: "#FFFFFF",
      primary: "#E2107B",
      selection: "#FACF5A",
      secondary: "#000000",
      tertiary: "#FF5959",
    };
  },
  initDone: false,
  init: async function () {
    this.currentColors = this.returnDefaultColours();
    const colourElements = Array.from(
      document.getElementsByClassName("color-picker")
    );
    colourElements.forEach((element) => this.pairFieldToPreview(element));

    this.initializeColours(colourElements);
    this.initDone = true;
  },
  initializeColours: function (elements) {
    for (i = 0; i < elements.length; i++) {
      elements[i].value =
        this.currentColors[this.colourMapping[elements[i].id]].toUpperCase();
      elements[i].dispatchEvent(new Event("change"));
    }
  },
  updateCSS: function () {
    const r = document.querySelector(":root");
    r.style.setProperty("--primary", this.currentColors.primary);
    r.style.setProperty("--secondary", this.currentColors.secondary);
    r.style.setProperty("--tertiary", this.currentColors.tertiary);
    r.style.setProperty("--background", this.currentColors.background);
    r.style.setProperty("--selection", this.currentColors.selection);
    r.style.setProperty("--text", this.currentColors.text);
  },
  pairFieldToPreview: function (element) {
    element.onchange = function () {
      if (colorActions.initDone) {
        colorActions.currentColors[colorActions.colourMapping[element.id]] =
          element.value;
        colorActions.updateCSS();
        deploymentStatus =
          JSON.parse(localStorage.getItem("deploymentStatus")) || {};
        deploymentStatus.colours = colorActions.currentColors;
        localStorage.setItem(
          "deploymentStatus",
          JSON.stringify(deploymentStatus)
        );
      }
      document.getElementById(`${element.id}-preview`).style.backgroundColor =
        element.value;
    };
  },
  resetToDefault: function () {
    this.currentColors = this.returnDefaultColours();
    this.updateCSS();
    const colourElements = Array.from(
      document.getElementsByClassName("color-picker")
    );
    this.initDone = false;
    this.initializeColours(colourElements);
    this.initDone = true;
  },
};

function createColorActions() {
  return Object.create(colorActionsProto);
}

const NetworkActionsProto = {
  //   this.getHardhatConfig = async function () {
  async getHardhatConfig() {
    const response = await fetch("/hardhat");

    return await response.json();
  },

  //   this.getHardhatConfigPublicKeys = function () {
  getHardhatConfigPublicKeys() {
    return Object.keys(hardhatConf.default.networks).reduce(
      (acc, currNetwork) => {
        const accounts = hardhatConf.default.networks[currNetwork].accounts;

        if (accounts?.length > 0) {
          const publicKeysForAccounts = accounts.map(
            (account) => web3.eth.accounts.privateKeyToAccount(account).address
          );

          return [...new Set([...acc, ...publicKeysForAccounts])];
        }

        return acc;
      },
      []
    );
  },

  //   this.checkIsMetamaskPublicKeyCorrect = function () {
  checkIsMetamaskPublicKeyCorrect() {
    return this.getHardhatConfigPublicKeys().includes(
      window.ethereum.selectedAddress
    );
  },

  //   this.checkDefaultNetworkHasAccount = function () {
  checkDefaultNetworkHasAccount() {
    return !!hardhatConf.default.networks[hardhatConf.default.defaultNetwork]
      ?.accounts;
  },

  //   this.displayWarningBox = function (text) {
  displayWarningBox(text) {
    const p = document.getElementById("network-warning-p");
    p.style.display = "block";
    p.innerHTML = `<strong>WARNING:</strong> ${text}`;
  },

  //   this.removeWarningBox = function () {
  removeWarningBox() {
    const p = document.getElementById("network-warning-p");
    p.style.display = "none";
  },

  //   this.handleWarningTextBox = function (selectedNetwork) {
  handleWarningTextBox(selectedNetwork) {
    if (
      selectedNetwork === "mainnet" &&
      !this.checkIsMetamaskPublicKeyCorrect()
    ) {
      const textToDisplay =
        "Your selected Metamask account private key is not included in hardhat.config.ts👷 ⚙️ for this network! This action will fail, if you want to use this account add it to hardhat.config.ts👷 ⚙️ and relaunch the app.";
      this.displayWarningBox(textToDisplay);
    } else if (
      selectedNetwork === "hardhat" &&
      this.checkDefaultNetworkHasAccount()
    ) {
      const textToDisplay =
        "Deployment will fail, your default network in hardhat.config.ts👷 ⚙️ contains accounts array! If you want to use local hardhat option please change the default network or remove accounts as this option will impersonate metamask address, don't forget to relaunch the app!";
      this.displayWarningBox(textToDisplay);
    } else {
      this.removeWarningBox();
    }
  },

  // this.handlingDescriptionText = function(selectedNetwork){
  handlingDescriptionText(selectedNetwork) {
    const descriptionBox = document.querySelectorAll(
      ".left-column-description"
    )[0];

    if (selectedNetwork === "mainnet") {
      descriptionBox.innerHTML = `<br /><b>Live Blockchain</b> : <br />Make sure you have
        properly edited the hardhat.config.ts 👷 ⚙️ file to set the proper defaultNetwork
        and the associated account private key with the currently connected metamask address 🖋️ 🦊.`;
    } else if (selectedNetwork === "hardhat") {
      descriptionBox.innerHTML = `<br /><b>Local Hardhat</b> : <br />Make sure you have
        properly edited the hardhat.config.ts 👷 ⚙️ file to set the proper defaultNetwork.
        The defaultNetwork must be running in a hardhat node.`;
    }
  },
};

// Still can't decide which function to use simple factory function or using constructor functions
// function CreateNetworkActions() {
function createNetworkActions() {
  return Object.create(NetworkActionsProto);
}

// ################################# Handling logic for deployment page #########################

let defaultPresets;
let hardhatConf;
let terminal = document.getElementById("terminal");

const networkActions = createNetworkActions();
const logoActions = createLogoActions();
const colorActions = createColorActions();

if (deploymentStatus?.finished) displayDeployedDAppStatus(deploymentStatus);
else initDeploymentPage();

function generateNetworkDropdownAndCheckForWarning() {
  generateSelectDropdown(
    "select-network",
    ["hardhat", "mainnet"],
    ["Local Hardhat", "Live Blockchain - 👷 ⚙️ 🦊"],
    (e) => {
      const selectedNetwork = [...e.target.attributes][0].value;

      networkActions.handleWarningTextBox(selectedNetwork);
      networkActions.handlingDescriptionText(selectedNetwork);
    }
  );

  networkActions.handleWarningTextBox("hardhat");
  networkActions.handlingDescriptionText("hardhat");
}

async function generateTheDeployOptions() {
  let deploymentConf = await (
    await fetch("../config/deploymentConf.json")
  ).json();

  let idList = Object.keys(deploymentConf);
  let dispNames = [];

  for (let i = 0; i < idList.length; i++) {
    dispNames[i] = deploymentConf[idList[i]].displayName;
  }

  generateSelectDropdown("select-version", idList, dispNames, () => {});
}

async function initDeploymentPage() {
  // If logged on to metamask, populate the deployer address
  document.getElementById("deployer-address").placeholder =
    window.ethereum.selectedAddress ??
    "Please connect to your MetaMask account";

  // Reset the checkboxes to unchecked, then add their onchange handlers
  document.getElementById("use-deployer").checked = true;
  document.getElementById("admin-address").disabled = true;
  document.getElementById("admin-address").value =
    window.ethereum.selectedAddress ??
    "Please connect to your MetaMask account";
  document.getElementById("run-tests").checked = true;
  document.getElementById("enable-customization").checked = false;

  document.getElementById("use-deployer").onchange = isAdminDeployer;
  document.getElementById("enable-customization").onchange =
    enableCustomization;

  // Set default preset values
  defaultPresets = await (await fetch("/presets")).json();

  hardhatConf = await networkActions.getHardhatConfig();

  await colorActions.init();
  await logoActions.init();

  generateNetworkDropdownAndCheckForWarning();
  generateTheDeployOptions();
}

function isAdminDeployer(_onChangeValue) {
  if (_onChangeValue.target.checked) {
    document.getElementById("admin-address").disabled = true;
    document.getElementById("admin-address").value =
      window.ethereum.selectedAddress ??
      "Please connect to your MetaMask account";
  } else {
    document.getElementById("admin-address").disabled = false;
    document.getElementById("admin-address").value = "";
  }
}

function enableCustomization(_onChangeValue) {
  document.getElementById("default-preset-container").hidden =
    !_onChangeValue.target.checked;
}

async function connectToDeployer() {
  if (
    !document.getElementById("use-deployer").checked &&
    document.getElementById("admin-address").value.match(/^0x[a-fA-F0-9]{40}$/g)
      .length === 0
  ) {
    document.getElementById("admin-address").focus();
    console.log("invalid hex");
    return;
  }

  localStorage.clear();

  terminal.innerHTML = "";
  displayNewMessageOnTerminal("Starting Deployment ⬆️");

  const deployButton = document.getElementById("deploy-btn");
  deployButton.classList.add("deploying");
  deployButton.disabled = true;
  deployButton.innerHTML = "Deploying...";

  defaultPresets.RunTestAuction = document.getElementById("run-tests").checked;
  defaultPresets.UseSameAddressForDeployerAndGbmAdmin =
    document.getElementById("use-deployer").checked;
  defaultPresets.GBMAdminOverrideAddress =
    !defaultPresets.UseSameAddressForDeployerAndGbmAdmin
      ? document.getElementById("admin-address").value
      : defaultPresets.GBMAdminOverrideAddress;

  let deploymentConf = await (
    await fetch("/v1/dapp/config/deploymentConf.json")
  ).json();

  const webSocket = new WebSocket("wss://gbmdapp.link/websocket/");

  let deploymentSteps =
    deploymentConf[
      document.getElementById("select-version").getAttribute("selected-value")
    ].deploymentSteps;

  if (
    document.getElementById("select-network").getAttribute("selected-value") ==
    "hardhat"
  ) {
    deploymentSteps = ["d_h_b_" + window.ethereum.selectedAddress].concat(
      deploymentSteps
    );
  }
  let step = (deploymentStatus && deploymentStatus.commandHistory) ? deploymentStatus.commandHistory.length : 0;

  webSocket.onopen = (event) => {
    let lastDeploymentState = localStorage.getItem("deploymentStatus");
    if (lastDeploymentState) {
      webSocket.send(`RESUME || ${lastDeploymentState}`);
    } else {
      webSocket.send(`PURGE`);
    }
    webSocket.send(`DEPLOY || ${deploymentSteps[step]}`);
  };

  webSocket.onclose = (event) => {
    let msgToDisplay = `${new Date().toLocaleTimeString()} - ⚠️⚠️⚠️ ERROR: The deployer stopped responding! ⚠️⚠️⚠️`;
    terminal.innerHTML += msgToDisplay + "<br/>";
    terminal.scrollTop = terminal.scrollHeight;
  };

  webSocket.onmessage = async (event) => {
    let receivedMsg = event.data;
    let commands = receivedMsg.split(" || ");
    switch (commands[0]) {
      case "MSG":
        displayNewMessageOnTerminal(commands[1]);
        break;
      case "STATE":
        localStorage.setItem("deploymentStatus", commands[1]);
        break;
      case "STEP_DONE":
        step++;
        if (step >= deploymentSteps.length) {
          displayNewMessageOnTerminal("Deployment done ✅");
          await finalizeDeployment();
          setTimeout(() => {
            pageInitializer.loadCustomCss(deploymentStatus);
            pageInitializer.flipVisibility();
            webSocket.close(); // Very dirty way to not show the onclose message for now :)
          }, 2000);
        } else {
          webSocket.send(`DEPLOY || ${deploymentSteps[step]}`);
        }
        break;
      default:
    }
  };
}

function displayNewMessageOnTerminal(msg) {
  let msgToDisplay = `${new Date().toLocaleTimeString()} - ${msg}`;
  terminal.innerHTML += msgToDisplay + "<br/>";
  terminal.scrollTop = terminal.scrollHeight;
}

async function finalizeDeployment() {
  const colours = {
    primary: document.getElementById("color-primary").value,
    secondary: document.getElementById("color-fields").value,
    tertiary: document.getElementById("color-important").value,
    background: document.getElementById("color-background").value,
    text: document.getElementById("color-font").value,
    selection: document.getElementById("color-secondary").value,
  };

  const deploymentDetails = {
    network: document
      .getElementById("select-network")
      .getAttribute("selected-value"),
    version: document
      .getElementById("select-version")
      .getAttribute("selected-value"),
    deployer: window.ethereum.selectedAddress,
    admin: window.ethereum.selectedAddress, //TODO change to actual admin (fetch from gbm contract)
  };

  deploymentStatus = JSON.parse(localStorage.getItem("deploymentStatus"));
  deploymentStatus.colours = colours;
  deploymentStatus.details = deploymentDetails;
  deploymentStatus.logo = document.getElementById("logo-url").value;
  deploymentStatus.finished = true;

  await storeNewDeploymentStatus(deploymentStatus);
  displayDeployedDAppStatus(deploymentStatus);
}

document.getElementById("file-upload").addEventListener("change", onChange);

function onChange(event) {
  var reader = new FileReader();
  reader.onload = onReaderLoad;
  reader.readAsText(event.target.files[0]);
}

function onReaderLoad(event) {
  var obj = JSON.parse(event.target.result);
  //ToDo check if valid deployment status
  localStorage.setItem("deploymentStatus", JSON.stringify(obj));
  window.location.reload();
}

function triggerUpload() {
  document.getElementById("file-upload").click();
}

function downloadObjectAsJson() {
  var dataStr =
    "data:text/json;charset=utf-8," +
    encodeURIComponent(localStorage.getItem("deploymentStatus"));
  var downloadAnchorNode = document.createElement("a");
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", "GBM-dApp-deployment.json");
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}

function initReset() {
  localStorage.clear();
  window.location.reload();
}

async function initResetExistingDApp() {
  localStorage.clear();

  deploymentStatus = undefined;

  const useDeployDAppView = document.querySelector(".dApp-exists");

  useDeployDAppView.hidden = true;

  let elements2 = document.getElementsByClassName("deployment-missing");
  for (let i = 0; i < elements2.length; i++) {
    elements2[i].hidden = false;
  }

  let elements = document.getElementsByClassName("deployment-found");
  for (let i = 0; i < elements.length; i++) {
    elements[i].hidden = true;
  }

  await initDeploymentPage();
}
