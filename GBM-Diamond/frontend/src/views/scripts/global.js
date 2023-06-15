let gbmAbi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "saleID",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "bidIndex",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "bidder",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "bidamount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "incentivesPaid",
        type: "uint256",
      },
    ],
    name: "AuctionBid_Displaced",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "saleID",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "bidIndex",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "bidder",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "bidamount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "incentivesDue",
        type: "uint256",
      },
    ],
    name: "AuctionBid_Placed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "saleID",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "endTimeStamp",
        type: "uint256",
      },
    ],
    name: "AuctionRegistration_EndTimeUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "saleID",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "tokenContractAddress",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenID",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "tokenAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bytes4",
        name: "tokenKind",
        type: "bytes4",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "gbmPresetIndex",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "currencyID",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "startTimestamp",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "endTimeStamp",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "beneficiary",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "startingBid",
        type: "uint256",
      },
    ],
    name: "AuctionRegistration_NewAuction",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "saleID",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "tokenContractAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "tokenID",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "tokenAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bytes4",
        name: "tokenKind",
        type: "bytes4",
      },
      {
        indexed: false,
        internalType: "address",
        name: "beneficiary",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "winningBidAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "winningBidCurrencyIndex",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "winner",
        type: "address",
      },
    ],
    name: "Auction_Claimed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "currencyIndex",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "currencyAddress",
        type: "address",
      },
    ],
    name: "Currency_AddressUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "currencyIndex",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "currencyAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "currencyName",
        type: "string",
      },
    ],
    name: "Currency_DefaultUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "currencyIndex",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "currencyName",
        type: "string",
      },
    ],
    name: "Currency_NameUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "facetAddress",
            type: "address",
          },
          {
            internalType: "enum IDiamondCut.FacetCutAction",
            name: "action",
            type: "uint8",
          },
          {
            internalType: "bytes4[]",
            name: "functionSelectors",
            type: "bytes4[]",
          },
        ],
        indexed: false,
        internalType: "struct IDiamondCut.FacetCut[]",
        name: "_diamondCut",
        type: "tuple[]",
      },
      {
        indexed: false,
        internalType: "address",
        name: "_init",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "_calldata",
        type: "bytes",
      },
    ],
    name: "DiamondCut",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "presetID",
        type: "uint256",
      },
    ],
    name: "GBMPreset_DefaultUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "presetID",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "auctionDuration",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "hammerTimeDuration",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "cancellationPeriodDuration",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "stepMin",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "incentiveMin",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "incentiveMax",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "incentiveGrowthMultiplier",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "firstMinBid",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "presetName",
        type: "string",
      },
    ],
    name: "GBMPreset_Updated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "saleID",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "tokenContractAddress",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenID",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "tokenAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bytes4",
        name: "tokenKind",
        type: "bytes4",
      },
      {
        indexed: false,
        internalType: "address",
        name: "tokenOrigin",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "price",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "currencyID",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "beneficiary",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "startTimestamp",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "endTimestamp",
        type: "uint256",
      },
    ],
    name: "SaleRegistration_NewSale",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "auctionID",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "newBidAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "previousHighestBidAmount",
        type: "uint256",
      },
    ],
    name: "bid",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "saleID",
        type: "uint256",
      },
    ],
    name: "buyASaleOffer",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "saleID",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "buyASaleOfferPartial",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "auctionID",
        type: "uint256",
      },
    ],
    name: "cancelAuction",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "auctionID",
        type: "uint256",
      },
    ],
    name: "claim",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "facetAddress",
            type: "address",
          },
          {
            internalType: "enum IDiamondCut.FacetCutAction",
            name: "action",
            type: "uint8",
          },
          {
            internalType: "bytes4[]",
            name: "functionSelectors",
            type: "bytes4[]",
          },
        ],
        internalType: "struct IDiamondCut.FacetCut[]",
        name: "_diamondCut",
        type: "tuple[]",
      },
      {
        internalType: "address",
        name: "_init",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "_calldata",
        type: "bytes",
      },
    ],
    name: "diamondCut",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "_functionSelector",
        type: "bytes4",
      },
    ],
    name: "facetAddress",
    outputs: [
      {
        internalType: "address",
        name: "facetAddress_",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "facetAddresses",
    outputs: [
      {
        internalType: "address[]",
        name: "facetAddresses_",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_facet",
        type: "address",
      },
    ],
    name: "facetFunctionSelectors",
    outputs: [
      {
        internalType: "bytes4[]",
        name: "facetFunctionSelectors_",
        type: "bytes4[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "facets",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "facetAddress",
            type: "address",
          },
          {
            internalType: "bytes4[]",
            name: "functionSelectors",
            type: "bytes4[]",
          },
        ],
        internalType: "struct IDiamondLoupe.Facet[]",
        name: "facets_",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "currencyIndex",
        type: "uint256",
      },
    ],
    name: "getCurrencyAddress",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "currencyIndex",
        type: "uint256",
      },
    ],
    name: "getCurrencyName",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getDefaultCurrency",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "tokenAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenID",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "depositor",
        type: "address",
      },
    ],
    name: "getERC1155Token_UnderSaleByDepositor",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "tokenAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenID",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "depositor",
        type: "address",
      },
    ],
    name: "getERC1155Token_depositor",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "tokenAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenID",
        type: "uint256",
      },
    ],
    name: "getERC721Token_depositor",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "tokenAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenID",
        type: "uint256",
      },
    ],
    name: "getERC721Token_underSale",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getGBMAdmin",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getGBMFeePercentKage",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getGBMFeesAccount",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "getGBMPreset",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "auctionDuration",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "hammerTimeDuration",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "cancellationPeriodDuration",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "stepMin",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "incentiveMin",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "incentiveMax",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "incentiveGrowthMultiplier",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "firstMinBid",
            type: "uint256",
          },
        ],
        internalType: "struct GBM_preset",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getGBMPresetDefault",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "getGBMPreset_AuctionDuration",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "getGBMPreset_CancellationPeriodDuration",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "getGBMPreset_HammerTimeDuration",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "getGBMPreset_IncentiveGrowthMultiplier",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "getGBMPreset_IncentiveMax",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "getGBMPreset_IncentiveMin",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "getGBMPreset_Name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "getGBMPreset_StepMin",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getGBMPresetsAmount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getIsLicensePaidOnChain",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getMarketPlaceRoyalty",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "NFTContract",
        type: "address",
      },
    ],
    name: "getNFTContractIsWhitelisted",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "saleID",
        type: "uint256",
      },
    ],
    name: "getSale_Beneficiary",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "saleID",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "bidIndex",
        type: "uint256",
      },
    ],
    name: "getSale_Bid_Bidder",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "saleID",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "bidIndex",
        type: "uint256",
      },
    ],
    name: "getSale_Bid_CurrencyIndex",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "saleID",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "bidIndex",
        type: "uint256",
      },
    ],
    name: "getSale_Bid_Currency_Address",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "saleID",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "bidIndex",
        type: "uint256",
      },
    ],
    name: "getSale_Bid_Currency_Name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "saleID",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "bidIndex",
        type: "uint256",
      },
    ],
    name: "getSale_Bid_Incentive",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "saleID",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "bidIndex",
        type: "uint256",
      },
    ],
    name: "getSale_Bid_Value",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "saleID",
        type: "uint256",
      },
    ],
    name: "getSale_Claimed",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "saleID",
        type: "uint256",
      },
    ],
    name: "getSale_CurrencyID",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "saleID",
        type: "uint256",
      },
    ],
    name: "getSale_Currency_Address",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "saleID",
        type: "uint256",
      },
    ],
    name: "getSale_Currency_Name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "saleID",
        type: "uint256",
      },
    ],
    name: "getSale_Debt",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "saleID",
        type: "uint256",
      },
    ],
    name: "getSale_EndTimestamp",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "saleID",
        type: "uint256",
      },
    ],
    name: "getSale_GBMPreset",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "auctionDuration",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "hammerTimeDuration",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "cancellationPeriodDuration",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "stepMin",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "incentiveMin",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "incentiveMax",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "incentiveGrowthMultiplier",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "firstMinBid",
            type: "uint256",
          },
        ],
        internalType: "struct GBM_preset",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "saleID",
        type: "uint256",
      },
    ],
    name: "getSale_GBMPresetIndex",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "saleID",
        type: "uint256",
      },
    ],
    name: "getSale_GBMPreset_AuctionDuration",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "saleID",
        type: "uint256",
      },
    ],
    name: "getSale_GBMPreset_CancellationPeriodDuration",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "saleID",
        type: "uint256",
      },
    ],
    name: "getSale_GBMPreset_HammerTimeDuration",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "saleID",
        type: "uint256",
      },
    ],
    name: "getSale_GBMPreset_IncentiveGrowthMultiplier",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "saleID",
        type: "uint256",
      },
    ],
    name: "getSale_GBMPreset_IncentiveMax",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "saleID",
        type: "uint256",
      },
    ],
    name: "getSale_GBMPreset_IncentiveMin",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "saleID",
        type: "uint256",
      },
    ],
    name: "getSale_GBMPreset_StepMin",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "saleID",
        type: "uint256",
      },
    ],
    name: "getSale_HighestBid_Bidder",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "saleID",
        type: "uint256",
      },
    ],
    name: "getSale_HighestBid_CurrencyIndex",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "saleID",
        type: "uint256",
      },
    ],
    name: "getSale_HighestBid_Currency_Address",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "saleID",
        type: "uint256",
      },
    ],
    name: "getSale_HighestBid_Currency_Name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "saleID",
        type: "uint256",
      },
    ],
    name: "getSale_HighestBid_Incentive",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "saleID",
        type: "uint256",
      },
    ],
    name: "getSale_HighestBid_Value",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "saleID",
        type: "uint256",
      },
    ],
    name: "getSale_NumberOfBids",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "saleID",
        type: "uint256",
      },
    ],
    name: "getSale_SaleKind",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "saleID",
        type: "uint256",
      },
    ],
    name: "getSale_StartTimestamp",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "saleID",
        type: "uint256",
      },
    ],
    name: "getSale_TokenAddress",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "saleID",
        type: "uint256",
      },
    ],
    name: "getSale_TokenAmount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "saleID",
        type: "uint256",
      },
    ],
    name: "getSale_TokenID",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "saleID",
        type: "uint256",
      },
    ],
    name: "getSale_TokenKind",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "smartContract",
        type: "address",
      },
    ],
    name: "getSmartContractsUsersNativeCurrencyBalance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getTotalNumberOfSales",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getmPlaceEnglishFeePercentKage",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getmPlaceGBMFeePercentKage",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getpercentKage",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_operator",
        type: "address",
      },
      {
        internalType: "address",
        name: "_from",
        type: "address",
      },
      {
        internalType: "uint256[]",
        name: "_ids",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "_values",
        type: "uint256[]",
      },
      {
        internalType: "bytes",
        name: "_data",
        type: "bytes",
      },
    ],
    name: "onERC1155BatchReceived",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_operator",
        type: "address",
      },
      {
        internalType: "address",
        name: "_from",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_id",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_value",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "_data",
        type: "bytes",
      },
    ],
    name: "onERC1155Received",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_operator",
        type: "address",
      },
      {
        internalType: "address",
        name: "_from",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "_data",
        type: "bytes",
      },
    ],
    name: "onERC721Received",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "owner_",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenID",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "tokenContractAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "price",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "currencyID",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "startTimestamp",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "endTimestamp",
        type: "uint256",
      },
    ],
    name: "safeRegister1155DirectSale",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256[]",
        name: "tokenIDs",
        type: "uint256[]",
      },
      {
        internalType: "address",
        name: "tokenContractAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "price",
        type: "uint256",
      },
      {
        internalType: "uint256[]",
        name: "amounts",
        type: "uint256[]",
      },
      {
        internalType: "uint256",
        name: "currencyID",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "startTimestamp",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "endTimestamp",
        type: "uint256",
      },
    ],
    name: "safeRegister1155DirectSale_Batch",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenID",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "tokenContractAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "gbmPreset",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "startTimestamp",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "currencyID",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "beneficiary",
        type: "address",
      },
    ],
    name: "safeRegister1155auction",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256[]",
        name: "tokenIDs",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "amounts",
        type: "uint256[]",
      },
      {
        internalType: "address",
        name: "tokenContractAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "gbmPreset",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "startTimestamp",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "currencyID",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "beneficiary",
        type: "address",
      },
    ],
    name: "safeRegister1155auctionBatch",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256[]",
        name: "tokenIDs",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "amounts",
        type: "uint256[]",
      },
      {
        internalType: "address",
        name: "tokenContractAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "gbmPreset",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "startTimestamp",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "currencyID",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "beneficiary",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "endTimestamp",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "startingBid",
        type: "uint256",
      },
    ],
    name: "safeRegister1155auctionBatch_Custom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256[]",
        name: "tokenIDs",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "amounts",
        type: "uint256[]",
      },
      {
        internalType: "address",
        name: "tokenContractAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "gbmPreset",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "startTimestamp",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "currencyID",
        type: "uint256",
      },
    ],
    name: "safeRegister1155auctionBatch_User",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256[]",
        name: "tokenIDs",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "amounts",
        type: "uint256[]",
      },
      {
        internalType: "address",
        name: "tokenContractAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "gbmPreset",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "startTimestamp",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "currencyID",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "endTimestamp",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "startingBid",
        type: "uint256",
      },
    ],
    name: "safeRegister1155auctionBatch_User_Custom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenID",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "tokenContractAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "gbmPreset",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "startTimestamp",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "currencyID",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "beneficiary",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "endTimestamp",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "startingBid",
        type: "uint256",
      },
    ],
    name: "safeRegister1155auction_Custom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenID",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "tokenContractAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "gbmPreset",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "startTimestamp",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "currencyID",
        type: "uint256",
      },
    ],
    name: "safeRegister1155auction_User",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenID",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "tokenContractAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "gbmPreset",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "startTimestamp",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "currencyID",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "endTimestamp",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "startingBid",
        type: "uint256",
      },
    ],
    name: "safeRegister1155auction_User_Custom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenID",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "tokenContractAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "gbmPreset",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "startTimestamp",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "currencyID",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "beneficiary",
        type: "address",
      },
    ],
    name: "safeRegister721Auction",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256[]",
        name: "tokenIDs",
        type: "uint256[]",
      },
      {
        internalType: "address",
        name: "tokenContractAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "gbmPreset",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "startTimestamp",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "currencyID",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "beneficiary",
        type: "address",
      },
    ],
    name: "safeRegister721AuctionBatch",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256[]",
        name: "tokenIDs",
        type: "uint256[]",
      },
      {
        internalType: "address",
        name: "tokenContractAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "gbmPreset",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "startTimestamp",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "currencyID",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "beneficiary",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "endTimestamp",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "startingBid",
        type: "uint256",
      },
    ],
    name: "safeRegister721AuctionBatch_Custom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256[]",
        name: "tokenIDs",
        type: "uint256[]",
      },
      {
        internalType: "address",
        name: "tokenContractAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "gbmPreset",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "startTimestamp",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "currencyID",
        type: "uint256",
      },
    ],
    name: "safeRegister721AuctionBatch_User",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256[]",
        name: "tokenIDs",
        type: "uint256[]",
      },
      {
        internalType: "address",
        name: "tokenContractAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "gbmPreset",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "startTimestamp",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "currencyID",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "endTimestamp",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "startingBid",
        type: "uint256",
      },
    ],
    name: "safeRegister721AuctionBatch_User_Custom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenID",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "tokenContractAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "gbmPreset",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "startTimestamp",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "currencyID",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "beneficiary",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "endTimestamp",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "startingBid",
        type: "uint256",
      },
    ],
    name: "safeRegister721Auction_Custom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenID",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "tokenContractAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "gbmPreset",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "startTimestamp",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "currencyID",
        type: "uint256",
      },
    ],
    name: "safeRegister721Auction_User",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenID",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "tokenContractAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "gbmPreset",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "startTimestamp",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "currencyID",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "endTimestamp",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "startingBid",
        type: "uint256",
      },
    ],
    name: "safeRegister721Auction_User_Custom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenID",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "tokenContractAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "price",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "currencyID",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "startTimestamp",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "endTimestamp",
        type: "uint256",
      },
    ],
    name: "safeRegister721DirectSale",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256[]",
        name: "tokenIDs",
        type: "uint256[]",
      },
      {
        internalType: "address",
        name: "tokenContractAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "price",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "currencyID",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "startTimestamp",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "endTimestamp",
        type: "uint256",
      },
    ],
    name: "safeRegister721DirectSale_Batch",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "currencyIndex",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "currencyAddress",
        type: "address",
      },
    ],
    name: "setCurrencyAddress",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "currencyIndex",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "currencyName",
        type: "string",
      },
    ],
    name: "setCurrencyName",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "currencyIndex",
        type: "uint256",
      },
    ],
    name: "setDefaultCurrency",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "presetIndex",
        type: "uint256",
      },
    ],
    name: "setDefaultGBMPreset",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "GBMAdmin",
        type: "address",
      },
    ],
    name: "setGBMAdmin",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "presetIndex",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "auctionDuration",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "hammerTimeDuration",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "cancellationPeriodDuration",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "stepMin",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "incentiveMin",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "incentiveMax",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "incentiveGrowthMultiplier",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "firstMinBid",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "presetName",
        type: "string",
      },
    ],
    name: "setGBMPreset",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "licensePaidTo",
        type: "address",
      },
      {
        internalType: "bool",
        name: "licensePaidOnChain",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "GBMFeePercentKage",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "marketplaceFeeCollectorWallet",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "mPlaceDirectFeePercentKage",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "mPlaceEnglishFeePercentKage",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "mPlaceGBMFeePercentKage",
        type: "uint256",
      },
    ],
    name: "setMarketPlaceFeesStructure",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "NFTContract",
        type: "address",
      },
      {
        internalType: "bool",
        name: "isWhitelistedForSale",
        type: "bool",
      },
    ],
    name: "setNFTContractIsWhitelisted",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceID",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

let erc721Abi = [
  {
    inputs: [
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
      {
        internalType: "string",
        name: "_symbol",
        type: "string",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "_approved",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "_operator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "_approved",
        type: "bool",
      },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "_to",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_approved",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256",
      },
    ],
    name: "getApproved",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "_operator",
        type: "address",
      },
    ],
    name: "isApprovedForAll",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_URI",
        type: "string",
      },
    ],
    name: "mint",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_creator",
        type: "address",
      },
      {
        internalType: "string",
        name: "_URI",
        type: "string",
      },
    ],
    name: "mintCreator",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256",
      },
    ],
    name: "ownerOf",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "finalAmount",
        type: "uint256",
      },
    ],
    name: "royaltyInfo",
    outputs: [
      {
        internalType: "address",
        name: "receiver",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "royaltyAmount",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_from",
        type: "address",
      },
      {
        internalType: "address",
        name: "_to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_from",
        type: "address",
      },
      {
        internalType: "address",
        name: "_to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_operator",
        type: "address",
      },
      {
        internalType: "bool",
        name: "_approved",
        type: "bool",
      },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "receiver",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "percentkage",
        type: "uint256",
      },
    ],
    name: "setRoyaltyInfo",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "_tokenURI",
        type: "string",
      },
    ],
    name: "setTokenURI",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceID",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256",
      },
    ],
    name: "tokenURI",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_from",
        type: "address",
      },
      {
        internalType: "address",
        name: "_to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
];

let erc1155Abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "_operator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "_approved",
        type: "bool",
      },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_operator",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "_from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "_to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "_ids",
        type: "uint256[]",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "_values",
        type: "uint256[]",
      },
    ],
    name: "TransferBatch",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_operator",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "_from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "_to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_id",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_value",
        type: "uint256",
      },
    ],
    name: "TransferSingle",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "_value",
        type: "string",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "_id",
        type: "uint256",
      },
    ],
    name: "URI",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_owner",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_id",
        type: "uint256",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "_owners",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "_ids",
        type: "uint256[]",
      },
    ],
    name: "balanceOfBatch",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "_operator",
        type: "address",
      },
    ],
    name: "isApprovedForAll",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_from",
        type: "address",
      },
      {
        internalType: "address",
        name: "_to",
        type: "address",
      },
      {
        internalType: "uint256[]",
        name: "_ids",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "_values",
        type: "uint256[]",
      },
      {
        internalType: "bytes",
        name: "_data",
        type: "bytes",
      },
    ],
    name: "safeBatchTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_from",
        type: "address",
      },
      {
        internalType: "address",
        name: "_to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_id",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_value",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "_data",
        type: "bytes",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_operator",
        type: "address",
      },
      {
        internalType: "bool",
        name: "_approved",
        type: "bool",
      },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

let web3;
let gbmContracts;
let erc721contract;
let erc721contractAddress = localStorage.getItem("erc721contract");
let erc1155contract;
let erc1155contractAddress = localStorage.getItem("erc1155contract");
let diamondAddress = localStorage.getItem("diamondAddress") ?? "";
let metamaskEnabled;
let metamaskTrigger;
let globalConf;

// Functions to run on page load

const pageInitializer = {
  init: async function () {
    await this.loadSiteConfigurationJSON();
    this.addNavBar();
    this.setUpMetamask();
    await this.isConnected();
    this.checkDeploymentState();
  },
  loadSiteConfigurationJSON: async function () {
    let fetcher = await fetch("../globalPageConf.json");
    globalConf = await fetcher.json();
  },
  loadCustomCss: function () {
    const r = document.querySelector(":root");
    r.style.setProperty("--background", "purple");
  },
  addNavBar: function () {
    let navBar = document.createElement("div");
    navBar.classList.add("nav-bar");
    navBar.innerHTML = `
      <div class="flex-row opposite-ends pad-vertical-2">
        <div>
            <img class="h-3" src="./images/gbm-logo.svg" />
        </div>
        <div class="nav-metamask">
            <div class="metamask-missing">
                <button id="metamask-enable" class="gbm-btn">Connect MetaMask</button>
            </div>
            <div class="metamask-found" hidden>
                <div class="items-center flex-row">
                  <p id="active-metamask-account"></p>
                  <button id="metamask-disable" class="gbm-btn transparent ml-75">Disconnect</button>
                  <button id="metamask-refresh" class="gbm-btn ml-75">⟳</button>
                </div>
            </div>
        </div>
      </div>
      <div class="nav-bottom-row">
        <div class="deployment-found" hidden>
          <div class="flex-row">
              <a class="nav-link link-${
                window.location.pathname === "/auctions"
                  ? `stay"`
                  : `leave" href="/auctions"`
              }>Browse Auctions</a>
              <a class="nav-link link-${
                window.location.pathname === "/tokens"
                  ? `stay"`
                  : `leave" href="/tokens"`
              }>My NFTs</a>
              <a class="nav-link link-${
                window.location.pathname === "/config"
                  ? `stay"`
                  : `leave" href="/config"`
              }>Admin Panel</a>
              <a class="nav-link link-${
                window.location.pathname === "/" ? `stay"` : `leave" href="/"`
              }>Deployment</a>
              <a class="nav-link link-${
                window.location.pathname === "/tokenSale"
                  ? `stay"`
                  : `leave" href="/tokenSale"`
              }>Token Sale</a>
          </div>
        </div>
      </div>
    `;

    this.addTitleAndFavicon();

    this.addCSS("global");
    this.addCSS(
      window.location.pathname.substring(1) === ""
        ? "deployment"
        : window.location.pathname.substring(1)
    );

    document.body.insertBefore(navBar, document.body.children[0]);

    metamaskTrigger = document.getElementById("metamask-enable");
    metamaskTrigger.onclick = enableMetamask;
  },
  addTitleAndFavicon: function () {
    var favicon = document.createElement("link");
    favicon.type = "image/png";
    favicon.rel = "icon";
    favicon.href = "./images/favicon.png";
    document.head.appendChild(favicon);

    var pageTitle = document.createElement("title");
    pageTitle.innerHTML = "GBM dApp";
    document.head.appendChild(pageTitle);
  },
  addCSS: function (_filename) {
    var pageCSS = document.createElement("link");
    pageCSS.type = "text/css";
    pageCSS.rel = "stylesheet";
    pageCSS.href = `styles/${_filename}.css`;

    document.head.appendChild(pageCSS);
  },
  setUpMetamask: function () {
    if (ethereum && ethereum.on) {
      const handleConnect = () => {
        console.log("Handling 'connect' event");
      };

      const handleChainChanged = (chainId) => {
        console.log("Handling 'chainChanged' event with payload", chainId);
      };

      const handleAccountsChanged = (accounts) => {
        console.log("Handling 'accountsChanged' event with payload", accounts);
        window.location.reload();
      };

      ethereum.on("connect", handleConnect);
      ethereum.on("disconnect", () => {
        window.location.reload();
      });
      ethereum.on("chainChanged", handleChainChanged);
      ethereum.on("accountsChanged", handleAccountsChanged);

      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener("connect", handleConnect);
          ethereum.removeListener("chainChanged", handleChainChanged);
          ethereum.removeListener("accountsChanged", handleAccountsChanged);
        }
      };
    }
  },
  isConnected: async function () {
    const accounts = await ethereum.request({ method: "eth_accounts" });
    if (accounts.length) {
      await this.loadContracts();
      ethereum
        .request({ method: "eth_requestAccounts" })
        .then(() => this.enableWeb3DependentElements())
        .catch((err) => {
          console.error(err);
        });

      // Hacky way to detect that metamask has desynced from the demo node.
      const chainIdInUse = await web3.eth.getChainId();

      if (
        chainIdInUse === 31337 &&
        localStorage.getItem("metamaskNonce") === null
      ) {
        const nonceCheck = web3.eth
          .getTransactionCount(window.ethereum.selectedAddress)
          .then()
          .catch((error) => {
            localStorage.clear();
            localStorage.setItem(
              "metamaskNonce",
              error.message.match(/\d+/g)[1]
            );
            window.location.reload();
          });
      }
    } else {
      metamaskTrigger.checked = false;
      console.log("Metamask is not connected");
    }
  },
  loadContracts: async function () {
    web3 = new Web3(window.ethereum);
    diamondAddress = await localStorage.getItem("diamondAddress");
    gbmContracts = new web3.eth.Contract(gbmAbi, diamondAddress);
    erc721contract = new web3.eth.Contract(erc721Abi, erc721contractAddress);
    erc1155contract = new web3.eth.Contract(erc1155Abi, erc1155contractAddress);
  },
  checkDeploymentState: function () {
    let deploymentStep = localStorage.getItem("currentDeploymentStep");

    if (deploymentStep > 13) {
      this.flipVisibility();
    }
  },
  flipVisibility: function () {
    let elements = document.getElementsByClassName("deployment-found");
    for (let i = 0; i < elements.length; i++) {
      elements[i].hidden = false;
    }

    let elements2 = document.getElementsByClassName("deployment-missing");
    for (let i = 0; i < elements2.length; i++) {
      elements2[i].hidden = true;
    }
  },
  enableWeb3DependentElements: async function () {
    // Toggle between no-metamask/metamask states
    Array.from(document.getElementsByClassName("metamask-missing")).forEach(
      (_element) => (_element.hidden = true)
    );
    Array.from(document.getElementsByClassName("metamask-found")).forEach(
      (_element) => (_element.hidden = false)
    );

    document.getElementById(
      "active-metamask-account"
    ).innerHTML = `Connected: ${shortenAddress(
      window.ethereum.selectedAddress
    )}`;
    const forceBtn = document.getElementById("metamask-refresh");
    forceBtn.onclick = chainZigZag;

    var nftFetcher = document.createElement("script");
    nftFetcher.type = "text/javascript";
    nftFetcher.src = `scripts/nftjsonfetcher.js`;

    document.body.appendChild(nftFetcher);

    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = `scripts/${
      window.location.pathname.substring(1) === ""
        ? "deployment"
        : window.location.pathname.substring(1)
    }.js`;

    document.body.appendChild(script);
  },
};

const shortenAddress = (_address) =>
  `${_address.substring(0, 6)}...${_address.substring(_address.length - 6)}`;

/*
  Basic function to request MetaMask access, then add & switch the network to the
  local hardhat node for convenience.
*/
function enableMetamask() {
  ethereum
    .request({ method: "eth_requestAccounts" })
    .then(() => enableWeb3DependentElements())
    .catch((err) => {
      console.error(err);
    });

  requestChainAddition("0x7a69");
}

/* 
  Simple helper function to request a network change on metamask. Requires knowing the change id. 
  The error clause is only here to add the hardhat network since it's not available by default, and should 
  only be kept for demo purposes.
*/
async function requestChainAddition(_chain) {
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: _chain }],
    });
  } catch (err) {
    // This error code indicates that the chain has not been added to MetaMask
    if (err.code === 4902) {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainName: "Local Hardhat",
            chainId: `0x7a69`,
            nativeCurrency: {
              name: "fETH",
              decimals: 18,
              symbol: "fETH",
            },
            rpcUrls: ["http://localhost:8545"],
          },
        ],
      });
    } else if (err.code === 4001) {
      throw new Error("Chain change rejected!");
    }
  }
}

/*
  Very dirty workaround for metamask to force a refresh for the hardhat node.
  That cache is very persistent but metamask plays by the rules if it switches networks back and forth.
*/
async function chainZigZag() {
  await requestChainAddition("0x1");
  await requestChainAddition("0x7a69");
  window.location.reload();
}

/*

*/
function generateSelectDropdown(_spanId, _options, _display, _onclick) {
  var gbmCSS = window.document.styleSheets[0];
  const selectContainer = document.getElementById(_spanId);
  selectContainer.innerHTML = "";
  gbmCSS.insertRule(
    `#${_spanId}.expanded { height: ${3 * _options.length}rem; }`,
    gbmCSS.cssRules.length
  );
  selectContainer.setAttribute("selected-value", _options[0]);
  selectContainer.setAttribute("selected-index", 0);
  for (i = 0; i < _options.length; i++) {
    selectContainer.innerHTML += `<input type="radio" name="${_spanId}" index="${i}" value="${
      _options[i]
    }" id="${_options[i]}" ${i === 0 ? "checked" : ""}/><label for="${
      _options[i]
    }">${_display[i]}</label>`;
  }

  document.getElementById(_spanId).onclick = function (e) {
    e.preventDefault();
    e.stopPropagation();
    let targeted = document.getElementById(e.target.getAttribute("for"));
    targeted.checked = true;
    if (
      targeted.value !== targeted.parentElement.getAttribute("selected-value")
    ) {
      targeted.parentElement.setAttribute("selected-value", targeted.value);
      targeted.parentElement.setAttribute(
        "selected-index",
        targeted.getAttribute("index")
      );
      _onclick();
    }
    selectContainer.classList.toggle("expanded");
  };

  document.onclick = function (e) {
    Array.from(document.getElementsByClassName("gbm-select")).forEach(
      (_selectElement) => {
        _selectElement.classList.remove("expanded");
      }
    );
  };
}

function reverseChildren(_parent) {
  for (var i = 1; i < _parent.childNodes.length; i++) {
    _parent.insertBefore(_parent.childNodes[i], _parent.firstChild);
  }
}

function timecalc(x, v) {
  return Math.floor(x / v);
}

function copyToClipboard() {
  navigator.clipboard.writeText(window.location);
}

function countdownDisplay(_timestamp) {
  var days = timecalc(_timestamp, 24 * 60 * 60),
    hours = timecalc(_timestamp, 60 * 60) % 24,
    minutes = timecalc(_timestamp, 60) % 60,
    seconds = timecalc(_timestamp, 1) % 60;
  return `${days > 0 ? `${days}d ` : ""}${hours > 0 ? `${hours}h ` : ""}${
    minutes > 0 ? `${minutes}m ` : ""
  }${seconds > 0 ? `${seconds}s` : ""}`;
}

const auctionFunctions = {
  getAuctionInfo: async function (_saleID) {
    let _highBidValueRaw = await gbmContracts.methods
      .getSale_HighestBid_Value(_saleID)
      .call();
    return {
      saleKind: await gbmContracts.methods.getSale_SaleKind(_saleID).call(),
      tokenAddress: await gbmContracts.methods
        .getSale_TokenAddress(_saleID)
        .call(),
      tokenID: await gbmContracts.methods.getSale_TokenID(_saleID).call(),
      tokenAmount: await gbmContracts.methods
        .getSale_TokenAmount(_saleID)
        .call(),
      tokenKind: await gbmContracts.methods.getSale_TokenKind(_saleID).call(),
      gbmPreset: await gbmContracts.methods.getSale_GBMPreset(_saleID).call(), // can break this down further
      gbmPresetIndex: await gbmContracts.methods
        .getSale_GBMPresetIndex(_saleID)
        .call(), // can break this down further
      currencyID: await gbmContracts.methods.getSale_CurrencyID(_saleID).call(),
      currencyName: await gbmContracts.methods
        .getSale_Currency_Name(_saleID)
        .call(),
      currencyAddress: await gbmContracts.methods
        .getSale_Currency_Address(_saleID)
        .call(),
      startTimestamp: await gbmContracts.methods
        .getSale_StartTimestamp(_saleID)
        .call(),
      endTimestamp: await gbmContracts.methods
        .getSale_EndTimestamp(_saleID)
        .call(),
      beneficiary: await gbmContracts.methods
        .getSale_Beneficiary(_saleID)
        .call(),
      debt: await gbmContracts.methods.getSale_Debt(_saleID).call(),
      highestBidValue: web3.utils.fromWei(_highBidValueRaw),
      highestBidValueRaw: _highBidValueRaw,
      highestBidBidder: await gbmContracts.methods
        .getSale_HighestBid_Bidder(_saleID)
        .call(),
      highestBidIncentive: await gbmContracts.methods
        .getSale_HighestBid_Incentive(_saleID)
        .call(),
      highestBidCurrencyIndex: await gbmContracts.methods
        .getSale_HighestBid_CurrencyIndex(_saleID)
        .call(),
      highestBidCurrencyAddress: await gbmContracts.methods
        .getSale_HighestBid_Currency_Address(_saleID)
        .call(),
      highestBidCurrencyName: await gbmContracts.methods
        .getSale_HighestBid_Currency_Name(_saleID)
        .call(),
      duration: await gbmContracts.methods
        .getSale_GBMPreset_AuctionDuration(_saleID)
        .call(),
    };
  },
  getNumberOfBids: async function (_saleId) {
    const availableBids = await gbmContracts.methods
      .getSale_NumberOfBids(_saleId)
      .call();
    return availableBids;
  },
  loadBids: async function (_saleId, _noOfBids) {
    const bidsArray = Promise.all(
      [...Array(parseInt(_noOfBids) + 1).keys()].map(
        async (item, index) => await this.getBidInfo(_saleId, index)
      )
    );
    return (await bidsArray).slice(1);
  },
  getBidInfo: async function (_saleID, _bidIndex) {
    return {
      bidValue: web3.utils.fromWei(
        await gbmContracts.methods.getSale_Bid_Value(_saleID, _bidIndex).call()
      ),
      bidBidder: await gbmContracts.methods
        .getSale_Bid_Bidder(_saleID, _bidIndex)
        .call(),
      bidIncentive: web3.utils.fromWei(
        await gbmContracts.methods
          .getSale_Bid_Incentive(_saleID, _bidIndex)
          .call()
      ),
      bidCurrencyIndex: await gbmContracts.methods
        .getSale_Bid_CurrencyIndex(_saleID, _bidIndex)
        .call(),
      bidCurrencyAddress: await gbmContracts.methods
        .getSale_Bid_Currency_Address(_saleID, _bidIndex)
        .call(),
      bidCurrencyName: await gbmContracts.methods
        .getSale_Bid_Currency_Name(_saleID, _bidIndex)
        .call(),
    };
  },
  submitBid: async function (
    _auctionId,
    _newBidAmount,
    _previousHighestBidAmount
  ) {
    const newAmount = web3.utils.toWei(_newBidAmount);
    const oldAmount = web3.utils.toWei(_previousHighestBidAmount);
    await gbmContracts.methods.bid(_auctionId, newAmount, oldAmount).send({
      from: window.ethereum.selectedAddress,
      to: diamondAddress,
      value: newAmount,
      gasLimit: 300000,
    });
  },
  claimToken: async function (_saleId) {
    await gbmContracts.methods
      .claim(_saleId)
      .send({ from: window.ethereum.selectedAddress });
  },
};

pageInitializer.init();
