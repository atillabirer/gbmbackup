export const conf:any = JSON.stringify(
    {
    "RunTestAuction": true, //Set to true if you want to create an empty test auction with self deployed smart contracts.
    "AutomatedTests": false, //Set to true if you want to run automated tests of the codebase. /!\ Will skip your node to the future
    "UseSameAddressForDeployerAndGbmAdmin": true,  //set to true if the gbm administrator is also the smart contract deployer/diamond administrator
    "GBMAdminOverrideAddress": "0x0000000000000000000000000000000000000000", // Address of the GBM admin if the above value is false
    "GBMPresetArray": [{
            "presetIndex": 1,
            "auctionDuration": 600,
            "hammerTimeDuration": 300,
            "cancellationPeriodDuration": 300,
            "stepMin": 5000,
            "incentiveMin": 1000,
            "incentiveMax": 10000,
            "incentiveGrowthMultiplier": 11120,
            "name": "GBM_Classic"
        }, {
            "presetIndex": 2,
            "auctionDuration": 600,
            "hammerTimeDuration": 300,
            "cancellationPeriodDuration": 0,
            "stepMin": 5000,
            "incentiveMin": 0,
            "incentiveMax": 0,
            "incentiveGrowthMultiplier": 0,
            "name": "English_Breakfast"
        }
    ],
    "CurrenciesArray": [{
        "CurrencyIndex": 1,
        "CurrencyName": "BaseCurrency",
        "CurrencyAddress": "0x0000000000000000000000000000000000000000"
    }]
});

