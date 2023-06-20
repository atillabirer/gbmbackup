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
  resetToDefault: function () {
    document.getElementById("logo-url").value = "./images/gbm-logo.png";
    deploymentStatus.logo = document.getElementById("logo-url").value;
    document.getElementById("logo-upload-success").hidden = false;
    storeNewDeploymentStatus();
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
  defaults: {
    background: "#085F63",
    text: "#FFFFFF",
    primary: "#49BEB7",
    selection: "#FACF5A",
    secondary: "#05848A",
    tertiary: "#FF5959",
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
  resetToDefault: function () {
    deploymentStatus.colours = this.defaults;
    this.currentColors = deploymentStatus.colours;
    storeNewDeploymentStatus();
    pageInitializer.loadCustomCss();
    const colourElements = Array.from(
      document.getElementsByClassName("color-picker")
    );
    this.initDone = false;
    this.initializeColours(colourElements);
    this.initDone = true;
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

    names.push("Create new preset");

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
    this.currentIncentivePresetNames.push("Custom incentive profile");
    generateSelectDropdown(
      "select-preset",
      [...Array(names.length).keys()],
      names,
      () => this.displaySelectedPreset(),
      0
    );

    this.displaySelectedPreset();
  },
  displaySelectedPreset: function () {
    let selectedPresetIndex = document
      .getElementById("select-preset")
      .getAttribute("selected-value");

    if (selectedPresetIndex < this.currentPresetNames.length - 1) {
      document.getElementById("preset-name").value =
        this.currentPresetNames[selectedPresetIndex];
      document.getElementById("preset-auction-duration").value =
        this.currentPresets[selectedPresetIndex].auctionDuration;
      document.getElementById("preset-cancellation").value =
        this.currentPresets[selectedPresetIndex].cancellationPeriodDuration;
      document.getElementById("preset-hammertime").value =
        this.currentPresets[selectedPresetIndex].hammerTimeDuration;
      document.getElementById("preset-multiplier").value =
        this.currentPresets[selectedPresetIndex].incentiveGrowthMultiplier;
      document.getElementById("preset-incentive-max").value =
        this.currentPresets[selectedPresetIndex].incentiveMax;
      document.getElementById("preset-incentive-min").value =
        this.currentPresets[selectedPresetIndex].incentiveMin;
      document.getElementById("preset-step").value =
        this.currentPresets[selectedPresetIndex].stepMin;
      document.getElementById("preset-update-btn").innerHTML = "Edit preset";

      let correctIndexPosition;

      try {
        correctIndexPosition = this.currentIncentivePresetNames.indexOf(
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
      } catch {
        correctIndexPosition = 5;
      }

      generateSelectDropdown(
        "select-incentive-preset",
        this.currentIncentivePresetNames,
        this.currentIncentivePresetNames,
        () => this.displayCustomIncentive(),
        correctIndexPosition
      );
    } else {
      document.getElementById("preset-name").value = "";
      document.getElementById("preset-auction-duration").value = "";
      document.getElementById("preset-cancellation").value = "";
      document.getElementById("preset-hammertime").value = "";
      document.getElementById("preset-multiplier").value = "";
      document.getElementById("preset-incentive-max").value = "";
      document.getElementById("preset-incentive-min").value = "";
      document.getElementById("preset-step").value = "";
      document.getElementById("preset-update-btn").innerHTML = "Create preset";
      generateSelectDropdown(
        "select-incentive-preset",
        this.currentIncentivePresetNames,
        this.currentIncentivePresetNames,
        () => this.displayCustomIncentive()
      );
    }
    this.displayCustomIncentive();
  },
  displayCustomIncentive: function () {
    if (
      document
        .getElementById("select-incentive-preset")
        .getAttribute("selected-value") === "Custom incentive profile"
    )
      document.getElementById("custom-incentive-display").hidden = false;
    else document.getElementById("custom-incentive-display").hidden = true;
  },
  updatePreset: async function () {
    const updateBtn = document.getElementById("preset-update-btn");
    updateBtn.innerHTML = "Updating...";
    updateBtn.disabled = true;

    let incentivePresetToUse = Object.values(
      deploymentStatus.registeredPresets
    ).find(
      (preset) =>
        preset.displayName ===
        document
          .getElementById("select-incentive-preset")
          .getAttribute("selected-value")
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
        document.getElementById("preset-step").value, // Step Min
        document.getElementById("preset-incentive-min").value, // Incentive Min
        document.getElementById("preset-incentive-max").value, // Incentive Max
        document.getElementById("preset-multiplier").value, // Incentive Growth Multiplier
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
