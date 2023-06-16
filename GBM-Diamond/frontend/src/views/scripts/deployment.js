let defaultPresets;
let terminal = document.getElementById("terminal");

if (deploymentStatus?.finished) displayDeployedDAppStatus();
else initDeploymentPage();

generateSelectDropdown(
  "select-network",
  ["Local Hardhat", "Ethereum Mainnet"],
  ["Local Hardhat", "Ethereum Mainnet"],
  () => {}
);
generateSelectDropdown(
  "select-version",
  ["Demo Showcase", "NFT Drop (Primary Market Only)"],
  ["Demo Showcase", "NFT Drop (Primary Market Only)"],
  () => {}
);

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
  document.getElementById("preset-name").value =
    defaultPresets.GBMPresetArray[0].name;
  document.getElementById("preset-auction-duration").value =
    defaultPresets.GBMPresetArray[0].auctionDuration;
  document.getElementById("preset-cancellation").value =
    defaultPresets.GBMPresetArray[0].cancellationPeriodDuration;
  document.getElementById("preset-hammer").value =
    defaultPresets.GBMPresetArray[0].hammerTimeDuration;
  document.getElementById("preset-incentive-mul").value =
    defaultPresets.GBMPresetArray[0].incentiveGrowthMultiplier;
  document.getElementById("preset-incentive-max").value =
    defaultPresets.GBMPresetArray[0].incentiveMax;
  document.getElementById("preset-incentive-min").value =
    defaultPresets.GBMPresetArray[0].incentiveMin;
  document.getElementById("preset-step-min").value =
    defaultPresets.GBMPresetArray[0].stepMin;
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

  const webSocket = new WebSocket("ws://localhost:443/");

  let deploymentSteps = deploymentConf["demo"].deploymentSteps;

  deploymentSteps[0] = deploymentSteps[0].replace(
    "metamask",
    window.ethereum.selectedAddress
  );

  let step = deploymentStatus ? deploymentStatus.commandHistory.length : 0;

  webSocket.onopen = (event) => {
    let lastDeploymentState = localStorage.getItem("deploymentStatus");
    if (lastDeploymentState) webSocket.send(`RESUME || ${lastDeploymentState}`);
    webSocket.send(`DEPLOY || ${deploymentSteps[step]}`);
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
          setTimeout(pageInitializer.flipVisibility, 2000);
          webSocket.close();
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
  localStorage.setItem("deploymentDetails", JSON.stringify(deploymentDetails));
  displayDeployedDAppStatus();
}

function displayDeployedDAppStatus() {
  let details = JSON.parse(localStorage.getItem("deploymentDetails"));

  // Display the values from the previous deployment
  document.getElementById("deployed-network").innerHTML = details.network;
  document.getElementById("deployed-version").innerHTML = details.version;
  document.getElementById("deployed-deployer").innerHTML = details.deployer;
  document.getElementById("deployed-admin").innerHTML = details.admin;
}

document.getElementById('file-upload').addEventListener('change', onChange);

function onChange(event) {
  var reader = new FileReader();
  reader.onload = onReaderLoad;
  reader.readAsText(event.target.files[0]);
}

function onReaderLoad(event){
  var obj = JSON.parse(event.target.result);
  //ToDo check if valid deployment status
  localStorage.setItem('deploymentStatus', JSON.stringify(obj));
  window.location.reload();
}

function triggerUpload() {
  document.getElementById("file-upload").click();
}

function downloadObjectAsJson() {
  var dataStr =
    "data:text/json;charset=utf-8," +
    encodeURIComponent(localStorage.getItem('deploymentStatus'));
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
