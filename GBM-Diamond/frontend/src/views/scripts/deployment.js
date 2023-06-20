let defaultPresets;
let terminal = document.getElementById("terminal");
let newImage;

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
          setTimeout(() => {
            pageInitializer.loadCustomCss();
            document.getElementById('nav-bar-logo').src = newImage ?? './images/gbm-logo.svg';
            pageInitializer.flipVisibility();
          }, 2000);
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

  const colours = {
    primary: document.getElementById('color-primary').value,
    secondary: document.getElementById('color-secondary').value,
    tertiary: document.getElementById('color-tertiary').value,
    background: document.getElementById('color-background').value,
    text: document.getElementById('color-text').value,
    selection: document.getElementById('color-selection').value
  }

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

  deploymentStatus = JSON.parse(localStorage.getItem('deploymentStatus'));
  deploymentStatus.colours = colours;
  deploymentStatus.details = deploymentDetails;
  deploymentStatus.logo = newImage ? newImage : './images/gbm-logo.png';

  localStorage.setItem("deploymentStatus", JSON.stringify(deploymentStatus));
  displayDeployedDAppStatus();
}

function displayDeployedDAppStatus() {
  // Display the values from the previous deployment
  document.getElementById("deployed-network").innerHTML = deploymentStatus.details.network;
  document.getElementById("deployed-version").innerHTML = deploymentStatus.details.version;
  document.getElementById("deployed-deployer").innerHTML = deploymentStatus.details.deployer;
  document.getElementById("deployed-admin").innerHTML = deploymentStatus.details.admin;
}

document.getElementById('file-upload').addEventListener('change', onChange);
document.getElementById('image-upload').addEventListener('change', imgFound);

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

function imgFound(event) {
  var reader = new FileReader();
  reader.onload = onImageLoad;
  reader.readAsDataURL(event.target.files[0]);
}

function onImageLoad(event){
  newImage = event.target.result;
  document.getElementById('logoPreview').src = newImage;
  document.getElementById('display-logo').style.display = 'flex';
}

function triggerUpload() {
  document.getElementById("file-upload").click();
}

function imageUpload() {
  document.getElementById("image-upload").click();
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

function getBase64Image(img) {
  var canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;

  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);

  var dataURL = canvas.toDataURL("image/png");

  return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}


function initReset() {
  localStorage.clear();
  window.location.reload();
}
