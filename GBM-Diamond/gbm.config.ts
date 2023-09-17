let confi =  {
    "RunTestAuction": true, //Set to true if you want to create an empty set of test auctions with self deployed smart contracts.
    "UseSameAddressForDeployerAndGbmAdmin": true,  //set to true if the gbm administrator is also the smart contract deployer/diamond administrator
    "GBMAdminOverrideAddress": "0x0000000000000000000000000000000000000000", // Address of the GBM admin if the above value is false
    "GBMPresetArray": [{
            "name": "GBM_Fast&Furious",                      // We recommend using a name that make sense for you and your users
            "presetIndex": 1,
            "auctionDuration": 600,                         // Recommended duration for most auctions : 86400 (24hours)
            "hammerTimeDuration": 300,                      // Recommended duration : 900 (15mn)
            "cancellationPeriodDuration": 300,              // Recommended duration : 900 (15mn)
            "stepMin": 10000,                               // Recommended stepmin : 10000 (10% increase)
            "incentiveMin": 1000,                           // Recommended incentiveMin : 1000 (1%)
            "incentiveMax": 10000,                          // Recommended incentiveMax : 10000 (10%)
            "incentiveGrowthMultiplier": 11120,             // Recommended incentiveGrowthMultiplier : 11120 (With previous params, double your bid net the max 10%)
            "firstMinBid": "0",                             // We do not recommend requiring a first minimal bid. Javascript do not handle bigNumbers, so please use a string in wei
        }, {
            "name": "English_Breakfast",
            "presetIndex": 2,
            "auctionDuration": 600,
            "hammerTimeDuration": 300,
            "cancellationPeriodDuration": 0,
            "stepMin": 5000,
            "incentiveMin": 0,
            "incentiveMax": 0,
            "incentiveGrowthMultiplier": 0,
            "firstMinBid": "0"
        }
    ],
    "CurrenciesArray": [{
        "currencyIndex": 1,
        "currencyName": "fETH",
        "currencyDisplayName": "Fake Ether (fETH)",                                           // To be used by your frontend, not used otherwise
        "currencyAddress": "0x0000000000000000000000000000000000000000", //Address 0x0 for the base currency, ERC20 token address if not
    },
    {
        "currencyIndex": 2,
        "currencyName": "STELLA",
        "currencyDisplayName": "StellaSwap (STELLA)",                                           // To be used by your frontend, not used otherwise
        "currencyAddress": "0x0E358838ce72d5e61E0018a2ffaC4bEC5F4c88d2", //Address 0x0 for the base currency, ERC20 token address if not
    }],
}



let pregen:any;
try{
    pregen = require("./presetGenerator");
} catch{
    pregen = require("./scripts/libraries/presetGenerator");
}

confi.GBMPresetArray = [...confi.GBMPresetArray, ...pregen.generateAllPresetsFromOffset(confi.GBMPresetArray.length)];

export const conf:any = JSON.stringify(confi);

