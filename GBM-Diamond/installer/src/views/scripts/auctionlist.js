let gbmAbi = [
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
        "name": "saleID",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "tokenContractAddress",
        "type": "address"
      },
      {
        "indexed": false,
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
        "internalType": "address",
        "name": "beneficiary",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "winningBidAmount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "winningBidCurrencyIndex",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "winner",
        "type": "address"
      }
    ],
    "name": "Auction_Claimed",
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
        "components": [
          {
            "internalType": "address",
            "name": "facetAddress",
            "type": "address"
          },
          {
            "internalType": "enum IDiamondCut.FacetCutAction",
            "name": "action",
            "type": "uint8"
          },
          {
            "internalType": "bytes4[]",
            "name": "functionSelectors",
            "type": "bytes4[]"
          }
        ],
        "indexed": false,
        "internalType": "struct IDiamondCut.FacetCut[]",
        "name": "_diamondCut",
        "type": "tuple[]"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "_init",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "bytes",
        "name": "_calldata",
        "type": "bytes"
      }
    ],
    "name": "DiamondCut",
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
        "internalType": "uint256",
        "name": "firstMinBid",
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
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
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
    "inputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "facetAddress",
            "type": "address"
          },
          {
            "internalType": "enum IDiamondCut.FacetCutAction",
            "name": "action",
            "type": "uint8"
          },
          {
            "internalType": "bytes4[]",
            "name": "functionSelectors",
            "type": "bytes4[]"
          }
        ],
        "internalType": "struct IDiamondCut.FacetCut[]",
        "name": "_diamondCut",
        "type": "tuple[]"
      },
      {
        "internalType": "address",
        "name": "_init",
        "type": "address"
      },
      {
        "internalType": "bytes",
        "name": "_calldata",
        "type": "bytes"
      }
    ],
    "name": "diamondCut",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes4",
        "name": "_functionSelector",
        "type": "bytes4"
      }
    ],
    "name": "facetAddress",
    "outputs": [
      {
        "internalType": "address",
        "name": "facetAddress_",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "facetAddresses",
    "outputs": [
      {
        "internalType": "address[]",
        "name": "facetAddresses_",
        "type": "address[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_facet",
        "type": "address"
      }
    ],
    "name": "facetFunctionSelectors",
    "outputs": [
      {
        "internalType": "bytes4[]",
        "name": "facetFunctionSelectors_",
        "type": "bytes4[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "facets",
    "outputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "facetAddress",
            "type": "address"
          },
          {
            "internalType": "bytes4[]",
            "name": "functionSelectors",
            "type": "bytes4[]"
          }
        ],
        "internalType": "struct IDiamondLoupe.Facet[]",
        "name": "facets_",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "currencyIndex",
        "type": "uint256"
      }
    ],
    "name": "getCurrencyAddress",
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
        "name": "currencyIndex",
        "type": "uint256"
      }
    ],
    "name": "getCurrencyName",
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
    "inputs": [],
    "name": "getDefaultCurrency",
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
        "internalType": "address",
        "name": "tokenAddress",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenID",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "depositor",
        "type": "address"
      }
    ],
    "name": "getERC1155Token_UnderSaleByDepositor",
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
        "internalType": "address",
        "name": "tokenAddress",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenID",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "depositor",
        "type": "address"
      }
    ],
    "name": "getERC1155Token_depositor",
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
        "internalType": "address",
        "name": "tokenAddress",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenID",
        "type": "uint256"
      }
    ],
    "name": "getERC721Token_depositor",
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
        "name": "tokenAddress",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenID",
        "type": "uint256"
      }
    ],
    "name": "getERC721Token_underSale",
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
          },
          {
            "internalType": "uint256",
            "name": "firstMinBid",
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
    "name": "getSale_Claimed",
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
          },
          {
            "internalType": "uint256",
            "name": "firstMinBid",
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
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_operator",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_from",
        "type": "address"
      },
      {
        "internalType": "uint256[]",
        "name": "_ids",
        "type": "uint256[]"
      },
      {
        "internalType": "uint256[]",
        "name": "_values",
        "type": "uint256[]"
      },
      {
        "internalType": "bytes",
        "name": "_data",
        "type": "bytes"
      }
    ],
    "name": "onERC1155BatchReceived",
    "outputs": [
      {
        "internalType": "bytes4",
        "name": "",
        "type": "bytes4"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_operator",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_from",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_id",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_value",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "_data",
        "type": "bytes"
      }
    ],
    "name": "onERC1155Received",
    "outputs": [
      {
        "internalType": "bytes4",
        "name": "",
        "type": "bytes4"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_operator",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_from",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_tokenId",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "_data",
        "type": "bytes"
      }
    ],
    "name": "onERC721Received",
    "outputs": [
      {
        "internalType": "bytes4",
        "name": "",
        "type": "bytes4"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "owner_",
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
    "name": "safeRegister1155auction",
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
    "name": "safeRegister721Auction",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "currencyIndex",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "currencyAddress",
        "type": "address"
      }
    ],
    "name": "setCurrencyAddress",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "currencyIndex",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "currencyName",
        "type": "string"
      }
    ],
    "name": "setCurrencyName",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "currencyIndex",
        "type": "uint256"
      }
    ],
    "name": "setDefaultCurrency",
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
        "internalType": "uint256",
        "name": "firstMinBid",
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
  },
  {
    "inputs": [
      {
        "internalType": "bytes4",
        "name": "interfaceID",
        "type": "bytes4"
      }
    ],
    "name": "supportsInterface",
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
    "inputs": [
      {
        "internalType": "address",
        "name": "_newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
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
  },
  {
    "inputs": [],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

let web3;
let diamondAddress;
let gbmContracts;

window.onload = async function() {
    await loadAuctionListContracts();
    await addNewAuctionButtons();
    const auctionNo = await getNumberOfAuctions();
    const auctions = await loadAuctions(auctionNo);
    const loader = document.getElementsByClassName('lds-ellipsis');
    loader[0].style.visibility = 'collapse';
    for (i = 0; i < auctions.length; i++) {
        generateAuctionElement(auctions[i], i);
    }
    reverseChildren(document.getElementsByClassName("auction-container")[0]);
    subscribeToNewAuctions(retrieveNewAuction);
};

async function addNewAuctionButtons() {
    const { names } = await getPresets();
    const buttonsContainer = document.getElementById('new-auction-btn-containers');

    for (i = 0; i < names.length; i++) {
        const buttonEl = document.createElement('div');
        buttonEl.innerHTML = `<button class="new-auction-btn" onclick="createNewAuction(${i+1})">Start new auction - ${names[i].replace("_", " ")}</button>`;
        buttonsContainer.appendChild(buttonEl);
    }
}

async function loadAuctionListContracts() {
    diamondAddress = await localStorage.getItem("diamondAddress");
    web3 = new Web3(window.ethereum);
    gbmContracts = new web3.eth.Contract(gbmAbi, diamondAddress);
}

function reverseChildren(parent) {
    for (var i = 1; i < parent.childNodes.length; i++){
        parent.insertBefore(parent.childNodes[i], parent.firstChild);
    }
}

function redirectToAuction(number) {
    location.href = `${window.location.protocol}//${window.location.host}/auction?saleId=${number}`;
}

function shortenAddress(address) {
    return `${address.substring(0,6)}...${address.substring(address.length-6)}` 
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

const getNumberOfAuctions = async () => await gbmContracts.methods.getTotalNumberOfSales().call();

async function loadAuctions(noOfAuctions) {
  const auctionsArray = Promise.all([...Array(parseInt(noOfAuctions)+1).keys()].map(async (item, index) => await getAuctionInfoMinimal(index)));
  return (await auctionsArray).slice(1);
}

async function getAuctionInfoMinimal(saleID) {
    const gbmPresetIndex = await gbmContracts.methods.getSale_GBMPresetIndex(saleID).call();
    console.log(saleID)
    console.log(gbmPresetIndex)

    return {
      saleKind: await gbmContracts.methods.getSale_SaleKind(saleID).call(),
      tokenID: await gbmContracts.methods.getSale_TokenID(saleID).call(),
      tokenAmount: await gbmContracts.methods.getSale_TokenAmount(saleID).call(),
      tokenKind: await gbmContracts.methods.getSale_TokenKind(saleID).call(),
      currencyName: await gbmContracts.methods.getSale_Currency_Name(saleID).call(),
      currencyAddress: await gbmContracts.methods.getSale_Currency_Address(saleID).call(),
      startTimestamp: await gbmContracts.methods.getSale_StartTimestamp(saleID).call(),
      endTimestamp: await gbmContracts.methods.getSale_EndTimestamp(saleID).call(),
      highestBidValue: web3.utils.fromWei(await gbmContracts.methods.getSale_HighestBid_Value(saleID).call()),
      highestBidBidder: await gbmContracts.methods.getSale_HighestBid_Bidder(saleID).call(),
      gbmPreset: await gbmContracts.methods.getSale_GBMPreset(saleID).call(), // can break this down further
      gbmPresetName: await gbmContracts.methods.getGBMPreset_Name(gbmPresetIndex).call(),
    }
}

function generateAuctionElement(auction, index) {
    const auctionsContainer = document.getElementsByClassName('auction-container')
    const auctionEl = document.createElement('div');
    auctionEl.classList.add("auction");
    let timeMessage;

    if (auction.startTimestamp*1000 - Date.now() > 0) {
        const auctionDate = new Date(parseInt(auction.startTimestamp * 1000)); 
        timeMessage = `Starts at-${auctionDate.getHours()}:${("0"+auctionDate.getMinutes()).substr(-2)}:${("0"+auctionDate.getSeconds()).substr(-2)}`;
    } else if (auction.endTimestamp*1000 - Date.now() >= 0){
        const auctionDate = new Date(parseInt(auction.endTimestamp * 1000)); 
        timeMessage = `Ends at-${auctionDate.getHours()}:${("0"+auctionDate.getMinutes()).substr(-2)}:${("0"+auctionDate.getSeconds()).substr(-2)}`;
    } else {
        timeMessage = 'Ended';
    }

    console.log(auction);

    const auctionInnerHTML = `
        <div class="auction-token" style="background-image: url('../images/whale${i}.png');"></div>
        <div class="separator-vertical"></div>
        <div class="auction-description">
            <div id="item-sold" class="auction-field">Sample Collection #${auction.tokenID}</div>
            <div id="amount-sold" class="auction-field">x${auction.tokenAmount}</div>
            <button class="view-btn-neo" onclick="redirectToAuction(${i+1})">View</button>
        </div>
        <div class="separator-vertical"></div>
        <div class="auction-bid">
            <h4>Highest Bid</h4>
            <div id="highest-bid" class="auction-field">${auction.highestBidValue} ${auction.currencyName}</div>
            <h4>Bidder</h4>
            <div id="bidder" class="auction-field">${shortenAddress(auction.highestBidBidder)}</div>
        </div>
        <div class="separator-vertical"></div>
        <div class="auction-status">
            <h4>${timeMessage.split("-")[0]}</h4>
            <div class="timer">${timeMessage.split("-")[0] === 'Ended' ? '' : timeMessage.split("-")[1]}</div>
        </div>                    
        <div class="separator-vertical"></div>
        <div class="auction-preset">
            <div class="presets-header">${auction.gbmPresetName.replace("_"," ")}</div>
            <div class="separator"></div>
            <div class="presets-container">
                <div id="hammer-time" class="auction-field">Hammer Time: ${auction.gbmPreset.hammerTimeDuration}</div>
                <div id="cancellation-time" class="auction-field">Cancellation Time: ${auction.gbmPreset.cancellationPeriodDuration}</div>
                <div id="step-min" class="auction-field">Step Min: ${auction.gbmPreset.stepMin}</div>
            </div>
        </div>`;

    auctionEl.innerHTML = auctionInnerHTML;
    auctionsContainer[0].appendChild(auctionEl);
}

async function createNewAuction(gbmPresetIndex) {
    await startNewAuction(Math.floor(Math.random() * 999), "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", gbmPresetIndex, 'test', 0, "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
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
    await gbmContracts.methods.unsafeRegister721Auction(tokenID, tokenContractAddress, gbmPreset, Math.ceil(Date.now() / 1000) + 30, currencyID, beneficiary).send({ from: window.ethereum.selectedAddress })
}

async function retrieveNewAuction(newAuction) {
    const {names, presets} = await getPresets(newAuction.gbmPresetIndex);
    const adjustedNewAuction = {
        startTimestamp: newAuction.startTimestamp,
        endTimestamp: newAuction.endTimeStamp,
        tokenID: newAuction.tokenID,
        tokenAmount: newAuction.tokenAmount,
        highestBidValue: 0,
        highestBidBidder: "Nobody   yet!",
        saleKind: newAuction.saleKind ?? 'GBM',
        currencyName: newAuction.currencyName ?? 'FakETH',
        gbmPreset: presets[newAuction.gbmPresetIndex-1] ?? {},
        gbmPresetName: names[newAuction.gbmPresetIndex-1] ?? 'GBM_Classic',
    }
    reverseChildren(document.getElementsByClassName("auction-container")[0]);
    generateAuctionElement(adjustedNewAuction, newAuction.saleID);
    reverseChildren(document.getElementsByClassName("auction-container")[0]);
}

function subscribeToNewAuctions(callback) {
    gbmContracts.events.AuctionRegistration_NewAuction({}, function(error, event) {
      // console.log(event);
    }).on('data', function(event) {
        console.log(event.returnValues);
      callback(event.returnValues)
    }).on('changed', function(event) {
      // console.log(event);
    }).on('error', console.error);
}