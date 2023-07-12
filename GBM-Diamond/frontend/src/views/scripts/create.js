const urlParams = new URLSearchParams(window.location.search);
const tokenId = urlParams.get("tokenId");
const tokenStandard = urlParams.get("tokenKind");
const contractIndex = urlParams.get("contractIndex");
let latestAuction;
let gbmPresetNames;
let gbmPresets;
let availableQuantity = 1;

generateSelectDropdown(
  "select-currency",
  Object.values(deploymentStatus.registeredCurrencies).map((currency) => {
    return currency.currencyName;
  }),
  Object.values(deploymentStatus.registeredCurrencies).map(
    (currency) => currency.currencyDisplayName
  ),
  () => {}
);

onScriptLoad();

async function onScriptLoad() {
  document.getElementById("start-date-selector").style.display = "none";

  const title = document.getElementById("token-title");
  title.innerHTML = `GBM Whale #${tokenId}`;

  const image = document.getElementsByClassName("token-media")[0];
  image.src = `/whale/${tokenId}/image`;
  latestAuction = await gbmContracts.methods.getTotalNumberOfSales().call();

  if (tokenStandard === "ERC1155") await get1155TokenAvailableQuantity();

  await populatePresets();
  generateBreakdown();
}

async function populatePresets() {
  const { names, presets } = await getPresets();
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
    generateBreakdown
  );
  generateSelectDropdown(
    "select-incentive",
    incentivePresets,
    incentivePresetNames,
    generateBreakdown,
    2
  );
}

async function getPresets() {
  const presetAmount = await gbmContracts.methods.getGBMPresetsAmount().call();

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
}

function generateBreakdown() {
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

  if (document.getElementById("start-date-selector").style.display !== "none") {
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

  document.getElementById("cancellation-text1-2").innerHTML = `
        ${convertToPercentage(preset.incentiveMin)}%-${convertToPercentage(
    preset.incentiveMax
  )}% of winning bid
    `;

  document.getElementById("cancellation-text2").innerHTML = `
        If you are not happy with the final sale price, you will have <strong>${convertToMinutes(
          preset.cancellationPeriodDuration
        )} minutes</strong> after the end of the auction to cancel, by paying the cancellation fee.
    `;
}

async function createAuctionAndRedirect() {
  const nextAuction = parseInt(latestAuction) + 1;
  const currencyIndexToUse = Object.values(
    deploymentStatus.registeredCurrencies
  ).filter(
    (currency) =>
      currency.currencyName ===
      document.getElementById("select-currency").getAttribute("selected-value")
  )[0].currencyIndex;

  let startTime = Math.ceil(Date.now() / 1000) + 30;

  let selectDuration = document.getElementById("select-duration");
  let selectIncentive = document.getElementById("select-incentive");
  let minBid = document.getElementById("min-bid");

  let presetName = `${selectIncentive.getAttribute(
    "selected-value"
  )}_${selectDuration.getAttribute("selected-value")}`;
  let presetNumber = gbmPresetNames.indexOf(presetName) + 1;

  if (document.getElementById("start-date-selector").style.display !== "none") {
    let time = document
      .getElementsByClassName("gbm-time-picker")[0]
      .value.split(":");
    let date = document
      .getElementsByClassName("gbm-date-picker")[0]
      .value.split("-");
    startTime = Math.floor(
      new Date(
        parseInt(date[0]),
        parseInt(date[1]) - 1,
        parseInt(date[2]),
        parseInt(time[0]),
        parseInt(time[1])
      ).getTime() / 1000
    );
  }

  let finalMinBid =
    minBid.value !== "1" || minBid.value !== "" ? minBid.value : "1";
  if (tokenStandard !== "ERC1155") {
    await startNewAuction721Custom(
      tokenId,
      erc721contractAddresses[0],
      presetNumber,
      startTime,
      currencyIndexToUse,
      window.ethereum.selectedAddress,
      finalMinBid
    );
  } else {
    await startNewAuction1155Custom(
      tokenId,
      erc1155contractAddresses[contractIndex],
      parseInt(document.getElementById("quantity-input").value),
      presetNumber,
      startTime,
      currencyIndexToUse,
      window.ethereum.selectedAddress,
      finalMinBid
    );
  }
  location.href = `${window.location.protocol}//${window.location.host}/auction?saleId=${nextAuction}`;
}

async function startNewAuction(
  tokenID,
  tokenContractAddress,
  gbmPreset,
  startTimestamp,
  currencyID,
  beneficiary
) {
  /*
    /// @param tokenID The token ID of the ERC721 NFT for sale
    /// @param tokenContractAddress The address of the smart contract of the NFT for sale
    /// @param gbmPreset The id of the GBM preset used for this auction. 0 to use the default one.
    /// @param startTimestamp The timestamp of when the auction should start.
    /// @param currencyID The ID of the currency this auction accept. 0 to use the default one.
    /// @param beneficiary The address of whom should the proceed from the sales goes to.
    */
  //console.log(gbmContracts.methods.safeRegister721Auction(${tokenID}, ${tokenContractAddress}, ${gbmPreset}, ${startTimestamp}, ${currencyID}, ${beneficiary})`)
  await freezeAndSendToMetamask(() =>
    gbmContracts.methods
      .safeRegister721Auction(
        tokenID,
        tokenContractAddress,
        gbmPreset,
        startTimestamp,
        currencyID,
        beneficiary
      )
      .send({ from: window.ethereum.selectedAddress })
  );
}

async function startNewAuction721Custom(
  tokenID,
  tokenContractAddress,
  gbmPreset,
  startTimestamp,
  currencyID,
  beneficiary,
  minimumBid
) {
  await freezeAndSendToMetamask(() =>
    gbmContracts.methods
      .safeRegister721Auction_Custom(
        tokenID,
        tokenContractAddress,
        gbmPreset,
        startTimestamp,
        currencyID,
        beneficiary,
        0,
        web3.utils.toWei(minimumBid)
      )
      .send({ from: window.ethereum.selectedAddress })
  );
}

async function startNewAuction1155Custom(
  tokenID,
  tokenContractAddress,
  amount,
  gbmPreset,
  startTimestamp,
  currencyID,
  beneficiary,
  minimumBid
) {
  await freezeAndSendToMetamask(() =>
    gbmContracts.methods
      .safeRegister1155auction_Custom(
        tokenID,
        tokenContractAddress,
        amount,
        gbmPreset,
        startTimestamp,
        currencyID,
        beneficiary,
        0,
        web3.utils.toWei(minimumBid)
      )
      .send({ from: window.ethereum.selectedAddress })
  );
}

function toggleStartDateSelection(_visible) {
  document.getElementById("start-date-selector").style.display = _visible
    ? "flex"
    : "none";
  generateBreakdown();
}

function changeQuantity(_toAdd) {
  let quantityBox = document.getElementById("quantity-input");
  let newValue = parseInt(quantityBox.value) + _toAdd;
  if (newValue > 0 && newValue <= availableQuantity) {
    quantityBox.value = newValue;
  }
}

async function get1155TokenAvailableQuantity() {
  const auctions = await getOngoingAuctions();
  const beneficiaries = await getAuctionBeneficiaries(auctions);
  let tokensOnSale = (
    await Promise.all(
      beneficiaries.map(async (item, index) => {
        return {
          tokenId: parseInt(
            await gbmContracts.methods.getSale_TokenID(item.saleId).call()
          ),
          tokenKind: await gbmContracts.methods
            .getSale_TokenKind(item.saleId)
            .call(),
          tokenAmount: parseInt(
            await gbmContracts.methods.getSale_TokenAmount(item.saleId).call()
          ),
          owner: item.beneficiary.toLowerCase(),
        };
      })
    )
  )
    .filter(
      (item) =>
        item.tokenKind === "0x973bb640" &&
        item.tokenId === parseInt(tokenId) &&
        item.owner === window.ethereum.selectedAddress.toLowerCase()
    )
    .reduce((total, item) => total + item.tokenAmount, 0);

  let escrowedQuantity = parseInt(
    await gbmContracts.methods
      .getERC1155Token_depositor(
        erc1155contractAddresses[contractIndex],
        tokenId,
        window.ethereum.selectedAddress
      )
      .call()
  );

  availableQuantity = escrowedQuantity - tokensOnSale;
  document.getElementById(
    "quantity-owned"
  ).innerHTML = `Available: ${availableQuantity}`;
  document.getElementById("quantity-container").style.display = "block";
}

async function getOngoingAuctions() {
  const salesAmount = await gbmContracts.methods.getTotalNumberOfSales().call();
  const keysArray = [...Array(parseInt(salesAmount) + 1).keys()].slice(1);
  let ongoingAuctions = await Promise.all(
    keysArray.map(async (item) => {
      const check = await gbmContracts.methods.getSale_Claimed(item).call();
      return !check ? item : 0;
    })
  );

  ongoingAuctions = ongoingAuctions.filter((item) => item > 0);
  return ongoingAuctions;
}

const getAuctionBeneficiaries = async (saleIDs) =>
  await Promise.all(
    saleIDs.map(async (item) => {
      return {
        beneficiary: await gbmContracts.methods
          .getSale_Beneficiary(item)
          .call(),
        saleId: item,
      };
    })
  );
