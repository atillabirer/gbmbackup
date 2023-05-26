let auctionAbi = [
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
        }
      ],
      "name": "GBMPreset_Updated",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenID",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "tokenContractAddress",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "gbmPreset",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "startTimestamp",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "currencyID",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "beneficiary",
          "type": "address"
        }
      ],
      "name": "safeRegister721Auction",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenID",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "tokenContractAddress",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "gbmPreset",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "startTimestamp",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "currencyID",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "beneficiary",
          "type": "address"
        }
      ],
      "name": "unsafeRegister1155auction",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenID",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "tokenContractAddress",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "gbmPreset",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "startTimestamp",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "currencyID",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "beneficiary",
          "type": "address"
        }
      ],
      "name": "unsafeRegister721Auction",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
];

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
  }
];

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
        }
      ],
      "name": "setGBMPreset",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
];

let biddingAbi = [
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
      }
    ],
    "name": "GBMPreset_Updated",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "auctionID",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "newBidAmount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "previousHighestBidAmount",
        "type": "uint256"
      }
    ],
    "name": "bid",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "auctionID",
        "type": "uint256"
      }
    ],
    "name": "claim",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

let diamondAddress;

let auctionsContract;
let gettersContract;
let adminContract;
let biddingContract;
let web3;

async function loadContracts() {
    diamondAddress = await localStorage.getItem("DiamondAddress");
    console.log(diamondAddress);
    web3 = new Web3(window.ethereum);
    auctionsContract = new web3.eth.Contract(auctionAbi, diamondAddress);
    gettersContract = new web3.eth.Contract(gettersAbi, diamondAddress);
    adminContract = new web3.eth.Contract(adminAbi, diamondAddress);
    biddingContract = new web3.eth.Contract(biddingAbi, diamondAddress);
}

function subscribeToNewAuctions(callback) {
  auctionsContract.events.AuctionRegistration_NewAuction({}, function(error, event) {
    // console.log(event);
  }).on('data', function(event) {
    callback(event.returnValues)
  }).on('changed', function(event) {
    // console.log(event);
  }).on('error', console.error);
}

function subscribeToNewBids(callback, callback2) {
  biddingContract.events.AuctionBid_Placed({}, function(error, event) {
    // console.log(event);
  }).on('data', function(event) {
    callback(web3.utils.fromWei(event.returnValues.bidamount))
  }).on('changed', function(event) {
    // console.log(event);
  }).on('error', console.error);

  biddingContract.events.AuctionRegistration_EndTimeUpdated({}, function(error, event) {
    // console.log(event);
  }).on('data', function(event) {
    callback2(event.returnValues.endTimeStamp);
  }).on('changed', function(event) {
    // console.log(event);
  }).on('error', console.error);
}

async function confirmAdminStatus() {
  const isAdmin = await adminContract.methods.getGBMAdmin().call();
  console.log(`GBM Admin: ${isAdmin}`)
  console.log(`Metamask in use: ${window.ethereum.selectedAddress}`);
  console.log(isAdmin.toLowerCase() == window.ethereum.selectedAddress.toLowerCase());
} 

async function getNumberOfAuctions() {
  const availableAuctions = await gettersContract.methods.getTotalNumberOfSales().call();
  return availableAuctions;
}

async function getNumberOfBids(saleId) {
  const availableBids = await gettersContract.methods.getSale_NumberOfBids(saleId).call();
  return availableBids;
}

async function loadAuctions(noOfAuctions) {
  const auctionsArray = Promise.all([...Array(parseInt(noOfAuctions)+1).keys()].map(async (item, index) => await getAuctionInfoMinimal(index)));
  return (await auctionsArray).slice(1);
}

async function loadBids(saleId, noOfBids) {
  const bidsArray = Promise.all([...Array(parseInt(noOfBids)+1).keys()].map(async (item, index) => await getBidInfo(saleId, index)));
  return (await bidsArray).slice(1);
}

// getMarketPlaceRoyalty()
// getmPlaceGBMFeePercentKage()
// getmPlaceEnglishFeePercentKage()
// getGBMAccount()
// getIsLicensePaidOnChain()
// getGBMFeePercentKage()
// getpercentKage()
// getGBMPreset(uint256)

async function getAuctionInfo(saleID) {
    return {
        saleKind: await gettersContract.methods.getSale_SaleKind(saleID).call(),
        tokenAddress: await gettersContract.methods.getSale_TokenAddress(saleID).call(),
        tokenID: await gettersContract.methods.getSale_TokenID(saleID).call(),
        tokenAmount: await gettersContract.methods.getSale_TokenAmount(saleID).call(),
        tokenKind: await gettersContract.methods.getSale_TokenKind(saleID).call(),
        gbmPreset: await gettersContract.methods.getSale_GBMPreset(saleID).call(), // can break this down further
        currencyID: await gettersContract.methods.getSale_CurrencyID(saleID).call(),
        currencyName: await gettersContract.methods.getSale_Currency_Name(saleID).call(),
        currencyAddress: await gettersContract.methods.getSale_Currency_Address(saleID).call(),
        startTimestamp: await gettersContract.methods.getSale_StartTimestamp(saleID).call(),
        endTimestamp: await gettersContract.methods.getSale_EndTimestamp(saleID).call(),
        beneficiary: await gettersContract.methods.getSale_Beneficiary(saleID).call(),
        debt: await gettersContract.methods.getSale_Debt(saleID).call(),
        highestBidValue: web3.utils.fromWei(await gettersContract.methods.getSale_HighestBid_Value(saleID).call()),
        highestBidBidder: await gettersContract.methods.getSale_HighestBid_Bidder(saleID).call(),
        highestBidIncentive: await gettersContract.methods.getSale_HighestBid_Incentive(saleID).call(),
        highestBidCurrencyIndex: await gettersContract.methods.getSale_HighestBid_CurrencyIndex(saleID).call(),
        highestBidCurrencyAddress: await gettersContract.methods.getSale_HighestBid_Currency_Address(saleID).call(),
        highestBidCurrencyName: await gettersContract.methods.getSale_HighestBid_Currency_Name(saleID).call(),
        duration: await gettersContract.methods.getSale_GBMPreset_AuctionDuration(saleID).call()
    }
}

async function getAuctionInfoMinimal(saleID) {
  return {
    saleKind: await gettersContract.methods.getSale_SaleKind(saleID).call(),
    tokenID: await gettersContract.methods.getSale_TokenID(saleID).call(),
    tokenAmount: await gettersContract.methods.getSale_TokenAmount(saleID).call(),
    tokenKind: await gettersContract.methods.getSale_TokenKind(saleID).call(),
    currencyName: await gettersContract.methods.getSale_Currency_Name(saleID).call(),
    currencyAddress: await gettersContract.methods.getSale_Currency_Address(saleID).call(),
    startTimestamp: await gettersContract.methods.getSale_StartTimestamp(saleID).call(),
    endTimestamp: await gettersContract.methods.getSale_EndTimestamp(saleID).call(),
    highestBidValue: web3.utils.fromWei(await gettersContract.methods.getSale_HighestBid_Value(saleID).call()),
  }
}

async function getBidInfo(saleID, bidIndex) {
    return {
        bidValue: web3.utils.fromWei(await gettersContract.methods.getSale_Bid_Value(saleID, bidIndex).call()),
        bidBidder: await gettersContract.methods.getSale_Bid_Bidder(saleID, bidIndex).call(),
        bidIncentive: web3.utils.fromWei(await gettersContract.methods.getSale_Bid_Incentive(saleID, bidIndex).call()),
        bidCurrencyIndex: await gettersContract.methods.getSale_Bid_CurrencyIndex(saleID, bidIndex).call(),
        bidCurrencyAddress: await gettersContract.methods.getSale_Bid_Currency_Address(saleID, bidIndex).call(),
        bidCurrencyName: await gettersContract.methods.getSale_Bid_Currency_Name(saleID, bidIndex).call()
    }
}

async function startNewAuction(tokenID, tokenContractAddress, gbmPreset, startTimestamp, currencyID, beneficiary) {
    /*
    /// @param tokenID The token ID of the ERC721 NFT for sale
    /// @param tokenContractAddress The address of the smart contract of the NFT for sale
    /// @param gbmPreset The id of the GBM preset used for this auction. 0 to use the default one.
    /// @param startTimestamp The timestamp of when the auction should start.
    /// @param currencyID The ID of the currency this auction accept. 0 to use the default one.
    /// @param beneficiary The address of whom should the proceed from the sales goes to.
    */
    await auctionsContract.methods.unsafeRegister721Auction(tokenID, tokenContractAddress, gbmPreset, Math.ceil(Date.now() / 1000) + 300, currencyID, beneficiary).send({ from: window.ethereum.selectedAddress })
}

async function submitBid(auctionId, newBidAmount, previousHighestBidAmount) {
    const newAmount = web3.utils.toWei(newBidAmount);
    const oldAmount = web3.utils.toWei(previousHighestBidAmount);
    await biddingContract.methods.bid(auctionId, newAmount, oldAmount).send({from: window.ethereum.selectedAddress, to: diamondAddress, value: newAmount, gasLimit: 300000 })
}