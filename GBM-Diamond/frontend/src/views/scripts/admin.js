let presetsLength = 0;

async function onScriptLoad() {
  const diamondLabel = document.getElementById("diamond-address");
  const adminLabel = document.getElementById("admin-address");

  diamondLabel.innerHTML = `Smart Contract: ${deploymentStatus.deployedFacets["Diamond"]}`;
  adminLabel.innerHTML = `GBM Admin: ${await getGBMAdmin()}`;

  await fetchPresets();
}

async function callUpdatePreset(newName, index) {
  const updateBtn = document.getElementsByClassName("update-btn")[index];
  updateBtn.innerHTML = "Updating...";
  updateBtn.disabled = true;

  const inputs = document.getElementsByClassName(`preset${[index]}`);

  await gbmContracts.methods
    .setGBMPreset(
      index + 1,
      inputs[0].value, // Auction Duration
      inputs[2].value, // Hammer Time Duration
      inputs[1].value, // Cancellation Period Duration
      inputs[6].value, // Step Min
      inputs[5].value, // Incentive Min
      inputs[4].value, // Incentive Max
      inputs[3].value, // Incentive Growth Multiplier
      0, // Minimum bid
      newName
    )
    .send({
      from: window.ethereum.selectedAddress,
      to: diamondAddress,
      gasLimit: 300000,
    });

  updateBtn.innerHTML = "Update Preset";
  updateBtn.disabled = false;
}

async function addPreset() {
  var newPreset = document.getElementsByClassName("configuration-input");

  await gbmContracts.methods
    .setGBMPreset(
      presetsLength + 1,
      newPreset[1].value, // Auction Duration
      newPreset[3].value, // Hammer Time Duration
      newPreset[2].value, // Cancellation Period Duration
      newPreset[7].value, // Step Min
      newPreset[6].value, // Incentive Min
      newPreset[5].value, // Incentive Max
      newPreset[4].value, // Incentive Growth Multiplier
      0, // Minimum bid
      newPreset[0].value
    )
    .send({
      from: window.ethereum.selectedAddress,
      to: diamondAddress,
      gasLimit: 300000,
    });

  window.location.reload();
}

function storeNewDeploymentStatus() {
  localStorage.setItem("deploymentStatus", JSON.stringify(deploymentStatus));
}

const adminAddressActions = {
  init: async function () {
    document.getElementById("admin-address").value = await this.getGBMAdmin();
    document.getElementById("current-admin-address").value =
      await this.getGBMAdmin();
  },
  getGBMAdmin: async function () {
    return await gbmContracts.methods.getGBMAdmin().call();
  },
  toggleChangeAdminView: function () {
    document.getElementById("main-view").hidden =
      !document.getElementById("main-view").hidden;
    document.getElementById("admin-change").hidden =
      !document.getElementById("admin-change").hidden;
  },
  setGBMAdmin: async function () {
    // ToDo: Add valid hex check (although the contract side also does one too)
    await gbmContracts.methods
      .setGBMAdmin(document.getElementById("new-admin-address").value)
      .send({ from: window.ethereum.selectedAddress });
  },
};

const logoActions = {
  init: async function () {
    document.getElementById("logo-update-first").checked = true;
    document.getElementById("logo-update-second").false = false;
    document.getElementById("logo-url").hidden = false;
    document.getElementById("logo-upload").hidden = true;
    document.getElementById("logo-url").value = deploymentStatus.logo;
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
    deploymentStatus.logo = document.getElementById("logo-url").value;
    document.getElementById("logo-upload-success").hidden = false;
    storeNewDeploymentStatus();
  },
  imageUpload: function () {
    document.getElementById("image-upload").click();
  },
  imgFound: function (event) {
    var reader = new FileReader();
    reader.onload = function (event) {
      deploymentStatus.logo = event.target.result;
      document.getElementById("logo-upload-success").hidden = false;
      storeNewDeploymentStatus();
    };
    reader.readAsDataURL(event.target.files[0]);
  },
};

const colorActions = {
  currentColors: {},
  colourMapping: {
    "color-background": "background",
    "color-font": "text",
    "color-primary": "primary",
    "color-secondary": "selection",
    "color-fields": "secondary",
    "color-important": "tertiary",
  },
  initDone: false,
  init: async function () {
    this.currentColors = deploymentStatus.colours;
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
  pairFieldToPreview: function (element) {
    element.onchange = function () {
      if (colorActions.initDone) {
        colorActions.currentColors[colorActions.colourMapping[element.id]] =
          element.value;
        deploymentStatus.colours = colorActions.currentColors;
        storeNewDeploymentStatus();
        pageInitializer.loadCustomCss();
      }
      document.getElementById(`${element.id}-preview`).style.backgroundColor =
        element.value;
    };
  },
};

const currencyActions = {
  init: async function () {},
};

const sliderActions = {
  init: async function () {},
};

const presetActions = {
  currentPresets: [],
  currentPresetNames: [],
  currentIncentivePresets: [],
  currentIncentivePresetNames: [],
  init: async function () {
    await this.fetchPresets();
  },
  getPresetDetailsFromDiamond: async function () {
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
  fetchPresets: async function () {
    const { names, presets } = await this.getPresetDetailsFromDiamond();
    this.currentPresetNames = names;
    this.currentPresets = presets;

    let presetsFromDeployment = Object.values(
      deploymentStatus.registeredPresets
    ).splice(2);

    let incentivePresets = presetsFromDeployment.map(
      (_element) => _element.name.split("_")[0]
    );
    let incentivePresetNames = presetsFromDeployment.map(
      (_element) => _element.displayName
    );

    this.currentIncentivePresets = [...new Set(incentivePresets)];
    this.currentIncentivePresetNames = [...new Set(incentivePresetNames)];

    generateSelectDropdown(
      "select-preset",
      [...Array(names.length).keys()],
      names,
      () => this.displaySelectedPreset(),
      1
    );

    this.displaySelectedPreset();
  },
  displaySelectedPreset: function () {
    const selectedPresetIndex = document
      .getElementById("select-preset")
      .getAttribute("selected-value");
    document.getElementById("preset-name").value =
      this.currentPresetNames[selectedPresetIndex];
    document.getElementById("preset-auction-duration").value =
      this.currentPresets[selectedPresetIndex].auctionDuration;
    document.getElementById("preset-cancellation").value =
      this.currentPresets[selectedPresetIndex].cancellationPeriodDuration;
    document.getElementById("preset-hammertime").value =
      this.currentPresets[selectedPresetIndex].hammerTimeDuration;

    let correctIndexPosition = this.currentIncentivePresetNames.indexOf(
      Object.values(deploymentStatus.registeredPresets).find((preset) => {
        return (
          preset.incentiveMin ===
            `${this.currentPresets[
              selectedPresetIndex
            ].incentiveMin.toString()}` &&
          preset.incentiveMax ===
            `${this.currentPresets[
              selectedPresetIndex
            ].incentiveMax.toString()}` &&
          preset.incentiveGrowthMultiplier ===
            `${this.currentPresets[
              selectedPresetIndex
            ].incentiveGrowthMultiplier.toString()}`
        );
      }).displayName
    );

    generateSelectDropdown(
      "select-incentive-preset",
      this.currentIncentivePresetNames,
      this.currentIncentivePresetNames,
      () => {},
      correctIndexPosition
    );
  },
  updatePreset: async function () {
    const updateBtn = document.getElementById("preset-update-btn");
    updateBtn.innerHTML = "Updating...";
    updateBtn.disabled = true;

    let incentivePresetToUse = Object.values(deploymentStatus.registeredPresets).find(
      (preset) =>
        preset.displayName ===
        document.getElementById("select-incentive-preset").getAttribute("selected-value")
    );


    await gbmContracts.methods
      .setGBMPreset(
        parseInt(
          document
            .getElementById("select-preset")
            .getAttribute("selected-value")
        ) + 1,
        document.getElementById("preset-auction-duration").value, // Auction Duration
        document.getElementById("preset-hammertime").value, // Hammer Time Duration
        document.getElementById("preset-cancellation").value, // Cancellation Period Duration
        incentivePresetToUse.stepMin, // Step Min
        incentivePresetToUse.incentiveMin, // Incentive Min
        incentivePresetToUse.incentiveMax, // Incentive Max
        incentivePresetToUse.incentiveGrowthMultiplier, // Incentive Growth Multiplier
        0, // Minimum bid
        document.getElementById("preset-name").value
      )
      .send({
        from: window.ethereum.selectedAddress,
        to: diamondAddress,
        gasLimit: 300000,
      });

      window.location.reload();
  },
};

async function pageInit() {
  await adminAddressActions.init();
  await logoActions.init();
  await colorActions.init();
  await currencyActions.init();
  await sliderActions.init();
  await presetActions.init();
}

pageInit();
