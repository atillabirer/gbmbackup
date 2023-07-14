let freeCurrencyIndexOnChain = 1;

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
    await freezeAndSendToMetamask(() =>
      gbmContracts.methods
        .setGBMAdmin(document.getElementById("new-admin-address").value)
        .send({ from: window.ethereum.selectedAddress })
    );
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
  async updateLogoByLink() {
    deploymentStatus.logo = document.getElementById("logo-url").value;
    document.getElementById("logo-upload-success").hidden = false;
    await storeNewDeploymentStatus(deploymentStatus);
  },
  imageUpload: function () {
    document.getElementById("image-upload").click();
  },
  async imgFound(event) {
    if (event.target.files[0]?.size > 10000000) {
      alert("File size must be under 10MB!");
      return;
    }

    const reader = new FileReader();

    reader.readAsDataURL(event.target.files[0]);

    reader.onload = async function (e) {
      deploymentStatus.logo = e.target.result;

      document.getElementById("logo-upload-success").hidden = false;
      await storeNewDeploymentStatus(deploymentStatus);
    };
  },
  resetToDefault: async function () {
    document.getElementById("logo-url").value = "./images/logo.svg";
    deploymentStatus.logo = document.getElementById("logo-url").value;
    document.getElementById("logo-upload-success").hidden = false;
    await storeNewDeploymentStatus(deploymentStatus);
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
  async init() {
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
  async pairFieldToPreview(element) {
    element.onchange = async function () {
      if (colorActions.initDone) {
        colorActions.currentColors[colorActions.colourMapping[element.id]] =
          element.value;
        deploymentStatus.colours = colorActions.currentColors;
        await storeNewDeploymentStatus(deploymentStatus);
        pageInitializer.loadCustomCss(deploymentStatus);
      }
      document.getElementById(`${element.id}-preview`).style.backgroundColor =
        element.value;
    };
  },
  async resetToDefault() {
    deploymentStatus.colours = window.COLOR_PALLETE;
    this.currentColors = deploymentStatus.colours;
    await storeNewDeploymentStatus(deploymentStatus);
    pageInitializer.loadCustomCss(deploymentStatus);
    const colourElements = Array.from(
      document.getElementsByClassName("color-picker")
    );
    this.initDone = false;
    this.initializeColours(colourElements);
    this.initDone = true;
  },
};

const currencyActions = {
  //   currentCurrencies: [],
  async init() {
    await this.renderCurrencies();
  },

  async renderCurrencies() {
    let runLoop = true;

    while (runLoop) {
      const currencyOnChain = await this.fetchCurrency(
        freeCurrencyIndexOnChain
      );

      if (!currencyOnChain) {
        runLoop = false;
        break;
      }

      this.generateCurrencyElement(currencyOnChain);

      deploymentStatus.ERC20[freeCurrencyIndexOnChain - 1] =
        currencyOnChain.currencyAddress;

      deploymentStatus.registeredCurrencies[freeCurrencyIndexOnChain] =
        currencyOnChain;

      freeCurrencyIndexOnChain++;
    }

    await storeNewDeploymentStatus(deploymentStatus);
  },

  async fetchCurrency(_index) {
    const [currencyAddress, currencyName] = await Promise.all([
      this.getCurrencyAddress(_index),
      this.getCurrencyName(_index),
    ]);

    if (
      !currencyName &&
      currencyAddress === "0x0000000000000000000000000000000000000000"
    ) {
      return null;
    }

    return {
      currencyIndex: _index,
      currencyAddress: currencyAddress,
      currencyName: currencyName,
      currencyDisplayName: currencyName,
    };
  },

  generateCurrencyElement(currency) {
    const currencyContainer = document.getElementById("currency-display");

    let currencyToAdd = document.createElement("div");
    currencyToAdd.classList.add(
      "configuration-default-preset-group",
      "currency-row"
    );

    currencyToAdd.innerHTML = `
      <div class="currency-column currency-header">${
        currency.currencyName
      }</div>
      <div class="currency-column">${
        currency.currencyIndex === 0
          ? "Native"
          : shortenAddress(currency.currencyAddress)
      }</div>
        <div class="currency-column currency-remove" onclick="currencyActions.removeCurrency(${
          currency.currencyIndex
        })">Remove</div>`;

    currencyContainer.appendChild(currencyToAdd);
  },

  async removeCurrency(_index) {
    await freezeAndSendToMetamask(() =>
      this.updateCurrencyOnChain(
        _index,
        "0x0000000000000000000000000000000000000000",
        ""
      )
    );

    window.location.reload();
  },

  async addCurrency() {
    let symbol = document.getElementById("currency-symbol-input").value;
    let address = document.getElementById("currency-address-input").value;

    // TODO Add check for valid contract address

    await freezeAndSendToMetamask(() =>
      this.updateCurrencyOnChain(freeCurrencyIndexOnChain, address, symbol)
    );

    window.location.reload();
  },

  async getCurrencyAddress(index) {
    return await gbmContracts.methods.getCurrencyAddress(index).call();
  },

  async getCurrencyName(index) {
    return await gbmContracts.methods.getCurrencyName(index).call();
  },

  async updateCurrencyOnChain(index, address, symbol) {
    await gbmContracts.methods
      .setCurrencyAddressAndName(index, address, symbol)
      .send({ from: window.ethereum.selectedAddress });
  },

  //   treatCurrentCurrencies() {
  //     return this.currentCurrencies.reduce((acc, currentCurrency) => {
  //       acc[currentCurrency.currencyIndex] = currentCurrency;

  //       return acc;
  //     }, {});
  //   },
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

    await freezeAndSendToMetamask(() =>
      gbmContracts.methods
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
        })
    );

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
