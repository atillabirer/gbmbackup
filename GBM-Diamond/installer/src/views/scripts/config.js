let gettersAbi = [
  {
    "inputs": [],
    "name": "getGBMAccount",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getGBMFeePercentKage",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
      }
    ],
    "name": "getGBMPreset",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "auctionDuration",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "hammerTimeDuration",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "cancellationPeriodDuration",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "stepMin",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "incentiveMin",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "incentiveMax",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "incentiveGrowthMultiplier",
            "type": "uint256"
          }
        ],
        "internalType": "struct GBM_preset",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getGBMPresetDefault",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
      }
    ],
    "name": "getGBMPreset_AuctionDuration",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
      }
    ],
    "name": "getGBMPreset_CancellationPeriodDuration",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
      }
    ],
    "name": "getGBMPreset_HammerTimeDuration",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
      }
    ],
    "name": "getGBMPreset_IncentiveGrowthMultiplier",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
      }
    ],
    "name": "getGBMPreset_IncentiveMax",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
      }
    ],
    "name": "getGBMPreset_IncentiveMin",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
      }
    ],
    "name": "getGBMPreset_Name",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
      }
    ],
    "name": "getGBMPreset_StepMin",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getGBMPresetsAmount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getIsLicensePaidOnChain",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getMarketPlaceRoyalty",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "saleID",
        "type": "uint256"
      }
    ],
    "name": "getSale_Beneficiary",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "saleID",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "bidIndex",
        "type": "uint256"
      }
    ],
    "name": "getSale_Bid_Bidder",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "saleID",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "bidIndex",
        "type": "uint256"
      }
    ],
    "name": "getSale_Bid_CurrencyIndex",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "saleID",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "bidIndex",
        "type": "uint256"
      }
    ],
    "name": "getSale_Bid_Currency_Address",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "saleID",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "bidIndex",
        "type": "uint256"
      }
    ],
    "name": "getSale_Bid_Currency_Name",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "saleID",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "bidIndex",
        "type": "uint256"
      }
    ],
    "name": "getSale_Bid_Incentive",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "saleID",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "bidIndex",
        "type": "uint256"
      }
    ],
    "name": "getSale_Bid_Value",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "saleID",
        "type": "uint256"
      }
    ],
    "name": "getSale_CurrencyID",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "saleID",
        "type": "uint256"
      }
    ],
    "name": "getSale_Currency_Address",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "saleID",
        "type": "uint256"
      }
    ],
    "name": "getSale_Currency_Name",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "saleID",
        "type": "uint256"
      }
    ],
    "name": "getSale_Debt",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "saleID",
        "type": "uint256"
      }
    ],
    "name": "getSale_EndTimestamp",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "saleID",
        "type": "uint256"
      }
    ],
    "name": "getSale_GBMPreset",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "auctionDuration",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "hammerTimeDuration",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "cancellationPeriodDuration",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "stepMin",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "incentiveMin",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "incentiveMax",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "incentiveGrowthMultiplier",
            "type": "uint256"
          }
        ],
        "internalType": "struct GBM_preset",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "saleID",
        "type": "uint256"
      }
    ],
    "name": "getSale_GBMPresetIndex",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "saleID",
        "type": "uint256"
      }
    ],
    "name": "getSale_GBMPreset_AuctionDuration",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "saleID",
        "type": "uint256"
      }
    ],
    "name": "getSale_GBMPreset_CancellationPeriodDuration",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "saleID",
        "type": "uint256"
      }
    ],
    "name": "getSale_GBMPreset_HammerTimeDuration",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "saleID",
        "type": "uint256"
      }
    ],
    "name": "getSale_GBMPreset_IncentiveGrowthMultiplier",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "saleID",
        "type": "uint256"
      }
    ],
    "name": "getSale_GBMPreset_IncentiveMax",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "saleID",
        "type": "uint256"
      }
    ],
    "name": "getSale_GBMPreset_IncentiveMin",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "saleID",
        "type": "uint256"
      }
    ],
    "name": "getSale_GBMPreset_StepMin",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "saleID",
        "type": "uint256"
      }
    ],
    "name": "getSale_HighestBid_Bidder",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "saleID",
        "type": "uint256"
      }
    ],
    "name": "getSale_HighestBid_CurrencyIndex",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "saleID",
        "type": "uint256"
      }
    ],
    "name": "getSale_HighestBid_Currency_Address",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "saleID",
        "type": "uint256"
      }
    ],
    "name": "getSale_HighestBid_Currency_Name",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "saleID",
        "type": "uint256"
      }
    ],
    "name": "getSale_HighestBid_Incentive",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "saleID",
        "type": "uint256"
      }
    ],
    "name": "getSale_HighestBid_Value",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "saleID",
        "type": "uint256"
      }
    ],
    "name": "getSale_NumberOfBids",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "saleID",
        "type": "uint256"
      }
    ],
    "name": "getSale_SaleKind",
    "outputs": [
      {
        "internalType": "bytes4",
        "name": "",
        "type": "bytes4"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "saleID",
        "type": "uint256"
      }
    ],
    "name": "getSale_StartTimestamp",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "saleID",
        "type": "uint256"
      }
    ],
    "name": "getSale_TokenAddress",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "saleID",
        "type": "uint256"
      }
    ],
    "name": "getSale_TokenAmount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "saleID",
        "type": "uint256"
      }
    ],
    "name": "getSale_TokenID",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "saleID",
        "type": "uint256"
      }
    ],
    "name": "getSale_TokenKind",
    "outputs": [
      {
        "internalType": "bytes4",
        "name": "",
        "type": "bytes4"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "smartContract",
        "type": "address"
      }
    ],
    "name": "getSmartContractsUsersNativeCurrencyBalance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "saleID",
        "type": "uint256"
      }
    ],
    "name": "getSmartContractsUsersNativeCurrencyBalance",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTotalNumberOfSales",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getmPlaceEnglishFeePercentKage",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getmPlaceGBMFeePercentKage",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getpercentKage",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  }];

let adminAbi = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "saleID",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "bidIndex",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "bidder",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "bidamount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "incentivesPaid",
        "type": "uint256"
      }
    ],
    "name": "AuctionBid_Displaced",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "saleID",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "bidIndex",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "bidder",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "bidamount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "incentivesDue",
        "type": "uint256"
      }
    ],
    "name": "AuctionBid_Placed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "saleID",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "endTimeStamp",
        "type": "uint256"
      }
    ],
    "name": "AuctionRegistration_EndTimeUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "saleID",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "tokenContractAddress",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "tokenID",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "tokenAmount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "bytes4",
        "name": "tokenKind",
        "type": "bytes4"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "gbmPresetIndex",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "currencyID",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "startTimestamp",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "endTimeStamp",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "beneficiary",
        "type": "address"
      }
    ],
    "name": "AuctionRegistration_NewAuction",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "currencyIndex",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "currencyAddress",
        "type": "address"
      }
    ],
    "name": "Currency_AddressUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "currencyIndex",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "currencyAddress",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "currencyName",
        "type": "string"
      }
    ],
    "name": "Currency_DefaultUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "currencyIndex",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "currencyName",
        "type": "string"
      }
    ],
    "name": "Currency_NameUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "presetID",
        "type": "uint256"
      }
    ],
    "name": "GBMPreset_DefaultUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "presetID",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "auctionDuration",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "hammerTimeDuration",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "cancellationPeriodDuration",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "stepMin",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "incentiveMin",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "incentiveMax",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "incentiveGrowthMultiplier",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "presetName",
        "type": "string"
      }
    ],
    "name": "GBMPreset_Updated",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "getGBMAdmin",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "presetIndex",
        "type": "uint256"
      }
    ],
    "name": "setDefaultGBMPreset",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "GBMAdmin",
        "type": "address"
      }
    ],
    "name": "setGBMAdmin",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "presetIndex",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "auctionDuration",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "hammerTimeDuration",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "cancellationPeriodDuration",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "stepMin",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "incentiveMin",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "incentiveMax",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "incentiveGrowthMultiplier",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "presetName",
        "type": "string"
      }
    ],
    "name": "setGBMPreset",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

let web3;
let diamondAddress;
let gettersContract;
let adminContract;

window.onload = async function() {
  await loadConfigContracts();

  const diamondLabel = document.getElementById('diamond-address');
  const adminLabel = document.getElementById('admin-address');

  diamondLabel.innerHTML = `Smart Contract: ${localStorage.getItem('diamondAddress')}`;
  adminLabel.innerHTML = `GBM Admin: ${await getGBMAdmin()}`;
              
  await fetchPresets();
}

async function loadConfigContracts() {
    diamondAddress = await localStorage.getItem("diamondAddress");
    web3 = new Web3(window.ethereum);
    gettersContract = new web3.eth.Contract(gettersAbi, diamondAddress);
    adminContract = new web3.eth.Contract(adminAbi, diamondAddress);
}

async function fetchPresets() {
  const { names, presets } = await getPresets();
  const presetContainer = document.getElementById("preset-container");

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
            <input class="preset-input preset${i}" value="${presets[i].stepMin}"></input>
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
    
    console.log(index+1);

    await adminContract.methods.setGBMPreset(
        index+1, 
        inputs[0].value, // Auction Duration
        inputs[2].value, // Hammer Time Duration
        inputs[1].value, // Cancellation Period Duration
        inputs[6].value, // Step Min
        inputs[5].value, // Incentive Min 
        inputs[4].value, // Incentive Max 
        inputs[3].value, // Incentive Growth Multiplier
        newName
      ).send({
        from: window.ethereum.selectedAddress, 
        to: diamondAddress, 
        gasLimit: 300000 
      });
        
    updateBtn.innerHTML = "Update Preset"
    updateBtn.disabled = false;
}

const getGBMAdmin = async () => await gettersContract.methods.getGBMAccount().call();

async function getPresets() {
  const presetAmount = await gettersContract.methods.getGBMPresetsAmount().call();

  const presetsArray = Promise.all([...Array(parseInt(presetAmount)+1).keys()].map(async (item, index) => await gettersContract.methods.getGBMPreset(index).call()));
  const presetsNames = Promise.all([...Array(parseInt(presetAmount)+1).keys()].map(async (item, index) => await gettersContract.methods.getGBMPreset_Name(index).call()));

  return {
    presets: (await presetsArray).slice(1), 
    names: (await presetsNames).slice(1)
  }
}