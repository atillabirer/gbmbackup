export const conf:any = JSON.stringify(
    {
    "RunTestAuction": true, //Set to true if you want to create an empty test auction with self deployed smart contracts.
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
            "incentiveGrowthMultiplier": 11120
        }
    ],
    "CurrenciesArray": [{
        "CurrencyIndex": 1,
        "CurrencyName": "BaseCurrency",
        "CurrencyAddress": "0x0000000000000000000000000000000000000000"
    }]
});

