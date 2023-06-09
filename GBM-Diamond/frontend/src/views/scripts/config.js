onScriptLoad()

let presetsLength = 0;

async function onScriptLoad() {
  const diamondLabel = document.getElementById('diamond-address');
  const adminLabel = document.getElementById('admin-address');

  diamondLabel.innerHTML = `Smart Contract: ${localStorage.getItem('diamondAddress')}`;
  adminLabel.innerHTML = `GBM Admin: ${await getGBMAdmin()}`;
              
  await fetchPresets();
}

async function fetchPresets() {
  const { names, presets } = await getPresets();
  const presetContainer = document.getElementById("preset-container");

  presetsLength = presets.length;

  for (i = 0; i < presets.length; i++) {
    const presetEl = document.createElement('div');
    presetEl.classList.add('preset');

    const presetInnerHTML = `
        <div class="preset-id">${i+1} - ${names[i].replace("_", " ")}</div>
        <div class="separator"></div>
        <div class="preset-field">
            <div class="description">Auction Duration</div>
            <input class="preset-input preset${i}" value="${presets[i].auctionDuration}"></input>
        </div>
        <div class="preset-field">
            <div class="description">Cancellation Period Duration</div>
            <input class="preset-input preset${i}" value="${presets[i].cancellationPeriodDuration}"></input>
        </div>
        <div class="preset-field">
            <div class="description">Hammer Time Duration</div>
            <input class="preset-input preset${i}" value="${presets[i].hammerTimeDuration}"></input>
        </div>
        <div class="preset-field">
            <div class="description">Incentive Growth Multiplier</div>
            <input class="preset-input preset${i}" value="${presets[i].incentiveGrowthMultiplier}"></input>
        </div>
        <div class="preset-field">
            <div class="description">Incentive Max</div>
            <input class="preset-input preset${i}" value="${presets[i].incentiveMax}"></input>
        </div>
        <div class="preset-field">
            <div class="description">Incentive Min</div>
            <input class="preset-input preset${i}" value="${presets[i].incentiveMin}"></input>
        </div>
        <div class="preset-field">
            <div class="description">Step Min</div>
            <input class="preset-input preset${i}" value="${presets[i].stepMin}"></input>
        </div>
        <button class="update-btn" onclick="callUpdatePreset('${names[i]}', ${i})">Update Preset</button>`;

        presetEl.innerHTML = presetInnerHTML;
        presetContainer.appendChild(presetEl);
    }
}

async function callUpdatePreset(newName, index) {
    const updateBtn = document.getElementsByClassName('update-btn')[index];
    updateBtn.innerHTML = "Updating...";
    updateBtn.disabled = true;

    const inputs = document.getElementsByClassName(`preset${[index]}`);
    
    await gbmContracts.methods.setGBMPreset(
        index+1, 
        inputs[0].value, // Auction Duration
        inputs[2].value, // Hammer Time Duration
        inputs[1].value, // Cancellation Period Duration
        inputs[6].value, // Step Min
        inputs[5].value, // Incentive Min 
        inputs[4].value, // Incentive Max 
        inputs[3].value, // Incentive Growth Multiplier
        0,               // Minimum bid
        newName,      
      ).send({
        from: window.ethereum.selectedAddress, 
        to: diamondAddress, 
        gasLimit: 300000 
      });
        
    updateBtn.innerHTML = "Update Preset"
    updateBtn.disabled = false;
}

async function getGBMAdmin() {
   return await gbmContracts.methods.getGBMAdmin().call();
}

async function getPresets() {
  const presetAmount = await gbmContracts.methods.getGBMPresetsAmount().call();

  const presetsArray = Promise.all([...Array(parseInt(presetAmount)+1).keys()].map(async (item, index) => await gbmContracts.methods.getGBMPreset(index).call()));
  const presetsNames = Promise.all([...Array(parseInt(presetAmount)+1).keys()].map(async (item, index) => await gbmContracts.methods.getGBMPreset_Name(index).call()));

  return {
    presets: (await presetsArray).slice(1), 
    names: (await presetsNames).slice(1)
  }
}

async function addPreset() {
  var newPreset = document.getElementsByClassName("configuration-input");

  await gbmContracts.methods.setGBMPreset(
    presetsLength+1, 
    newPreset[1].value, // Auction Duration
    newPreset[3].value, // Hammer Time Duration
    newPreset[2].value, // Cancellation Period Duration
    newPreset[7].value, // Step Min
    newPreset[6].value, // Incentive Min 
    newPreset[5].value, // Incentive Max 
    newPreset[4].value, // Incentive Growth Multiplier
    0,               // Minimum bid
    newPreset[0].value,      
  ).send({
    from: window.ethereum.selectedAddress, 
    to: diamondAddress, 
    gasLimit: 300000 
  });

  window.location.reload();
}