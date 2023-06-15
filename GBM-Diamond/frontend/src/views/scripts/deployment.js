let step = localStorage.getItem("currentDeploymentStep") ?? 0;
let diamondCutAddress = localStorage.getItem("diamondCutAddress") ?? "";
let cuts = localStorage.getItem("cuts") ?? [];
let facets = localStorage.getItem("facets") ?? [];
let defaultPresets;

if (step >= 14) displayDeployedDAppStatus();
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

function displayDeployedDAppStatus() {
  let details = JSON.parse(localStorage.getItem("deploymentDetails"));

  // Display the values from the previous deployment
  document.getElementById("deployed-network").innerHTML = details.network;
  document.getElementById("deployed-version").innerHTML = details.version;
  document.getElementById("deployed-deployer").innerHTML = details.deployer;
  document.getElementById("deployed-admin").innerHTML = details.admin;
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

function connectToDeployer() {
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

  document.getElementById("terminal").innerHTML =
    "Starting deployment... <br/>";

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

  const webSocket = new WebSocket("ws://localhost:443/");

  webSocket.onopen = (event) => {
    webSocket.send(
      `PRE-DEPLOYMENT || ${window.ethereum.selectedAddress} || ${JSON.stringify(
        defaultPresets
      )}`
    );
  };

  webSocket.onmessage = (event) => {
    let deployOrder = [
      "DCF",
      "DD",
      "FT",
      "FT",
      "FT",
      "FT",
      "FT",
      "FT",
      "FT",
      "FT",
      "FT",
      "CUT",
      "PRST",
      "CRC",
      "TST",
    ];

    let receivedMsg = event.data;
    let commands = receivedMsg.split(" || ");
    if (commands[0] !== "SERVER") return;

    switch (commands[1]) {
      case "MSG":
        let msgToDisplay = `${new Date().toLocaleTimeString()} - ${
          commands[2]
        }`;
        document.getElementById("terminal").innerHTML += msgToDisplay + "<br/>";
        break;
      case "TST":
        document.getElementById("terminal").innerHTML += "All done!<br/>";
        step++;
        saveDeployerStatus(commands);
        webSocket.send(
          `POST-DEPLOYMENT || ${window.ethereum.selectedAddress} || ${
            localStorage.getItem("metamaskNonce") ?? "0"
          }`
        );
        localStorage.removeItem("metamaskNonce");
        pageInitializer.flipVisibility();
        webSocket.close();
        break;
      default:
        step++;
        localStorage.setItem("currentDeploymentStep", step);
        saveDeployerStatus(commands);
      case "ACK":
        webSocket.send(
          `CLIENT || ${deployOrder[step]} || ${step} || ${diamondCutAddress} || ${diamondAddress} || ${cuts} || ${facets}`
        );
    }
  };
}

function saveDeployerStatus(commands) {
  switch (commands[1]) {
    case "DCF":
      localStorage.setItem("diamondCutAddress", commands[2]);
      diamondCutAddress = commands[2];
      break;
    case "DD":
      localStorage.setItem("diamondAddress", commands[2]);
      diamondAddress = commands[2];
      break;
    case "FT":
      localStorage.setItem("cuts", commands[2]);
      cuts = commands[2];
      localStorage.setItem("facets", commands[3]);
      facets = commands[3];
      break;
    case "TST":
      const deploymentDetails = {
        network: document
          .getElementById("select-network")
          .getAttribute("selected-value"),
        version: document
          .getElementById("select-version")
          .getAttribute("selected-value"),
        deployer: window.ethereum.selectedAddress,
        admin: window.ethereum.selectedAddress,
      };
      localStorage.setItem(
        "deploymentDetails",
        JSON.stringify(deploymentDetails)
      );
      displayDeployedDAppStatus();
      localStorage.setItem("erc721contract", commands[2]);
      localStorage.setItem("erc1155contract", commands[3]);
    default:
      break;
  }
}

function initReset() {
  localStorage.clear();
  window.location.reload();
}
