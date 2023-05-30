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
  }
];

let web3;
let diamondAddress;
let gbmContracts;

async function loadContracts() {
    diamondAddress = await localStorage.getItem("diamondAddress");
    web3 = new Web3(window.ethereum);
    const latest = await web3.eth.getBlockNumber()

    gbmContracts = new web3.eth.Contract(gbmAbi, diamondAddress);
}

function subscribeToNewAuctions(callback) {
  gbmContracts.events.AuctionRegistration_NewAuction({}, function(error, event) {
    // console.log(event);
  }).on('data', function(event) {
    callback(event.returnValues)
  }).on('changed', function(event) {
    // console.log(event);
  }).on('error', console.error);
}

function subscribeToNewBids(callback, callback2) {
  gbmContracts.events.AuctionBid_Placed({}, function(error, event) {
    // console.log(event);
  }).on('data', function(event) {
    callback(web3.utils.fromWei(event.returnValues.bidamount))
  }).on('changed', function(event) {
    // console.log(event);
  }).on('error', console.error);

  gbmContracts.events.AuctionRegistration_EndTimeUpdated({}, function(error, event) {
    // console.log(event);
  }).on('data', function(event) {
    callback2(event.returnValues.endTimeStamp);
  }).on('changed', function(event) {
    // console.log(event);
  }).on('error', console.error);
}

async function confirmAdminStatus() {
  const isAdmin = await gbmContracts.methods.getGBMAdmin().call();
  console.log(`GBM Admin: ${isAdmin}`)
  console.log(`Metamask in use: ${window.ethereum.selectedAddress}`);
  console.log(isAdmin.toLowerCase() == window.ethereum.selectedAddress.toLowerCase());
} 

async function getNumberOfAuctions() {
  const availableAuctions = await gbmContracts.methods.getTotalNumberOfSales().call();
  return availableAuctions;
}

async function getNumberOfBids(saleId) {
  const availableBids = await gbmContracts.methods.getSale_NumberOfBids(saleId).call();
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
        saleKind: await gbmContracts.methods.getSale_SaleKind(saleID).call(),
        tokenAddress: await gbmContracts.methods.getSale_TokenAddress(saleID).call(),
        tokenID: await gbmContracts.methods.getSale_TokenID(saleID).call(),
        tokenAmount: await gbmContracts.methods.getSale_TokenAmount(saleID).call(),
        tokenKind: await gbmContracts.methods.getSale_TokenKind(saleID).call(),
        gbmPreset: await gbmContracts.methods.getSale_GBMPreset(saleID).call(), // can break this down further
        currencyID: await gbmContracts.methods.getSale_CurrencyID(saleID).call(),
        currencyName: await gbmContracts.methods.getSale_Currency_Name(saleID).call(),
        currencyAddress: await gbmContracts.methods.getSale_Currency_Address(saleID).call(),
        startTimestamp: await gbmContracts.methods.getSale_StartTimestamp(saleID).call(),
        endTimestamp: await gbmContracts.methods.getSale_EndTimestamp(saleID).call(),
        beneficiary: await gbmContracts.methods.getSale_Beneficiary(saleID).call(),
        debt: await gbmContracts.methods.getSale_Debt(saleID).call(),
        highestBidValue: web3.utils.fromWei(await gbmContracts.methods.getSale_HighestBid_Value(saleID).call()),
        highestBidBidder: await gbmContracts.methods.getSale_HighestBid_Bidder(saleID).call(),
        highestBidIncentive: await gbmContracts.methods.getSale_HighestBid_Incentive(saleID).call(),
        highestBidCurrencyIndex: await gbmContracts.methods.getSale_HighestBid_CurrencyIndex(saleID).call(),
        highestBidCurrencyAddress: await gbmContracts.methods.getSale_HighestBid_Currency_Address(saleID).call(),
        highestBidCurrencyName: await gbmContracts.methods.getSale_HighestBid_Currency_Name(saleID).call(),
        duration: await gbmContracts.methods.getSale_GBMPreset_AuctionDuration(saleID).call()
    }
}

async function getAuctionInfoMinimal(saleID) {
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
  }
}

async function getBidInfo(saleID, bidIndex) {
    return {
        bidValue: web3.utils.fromWei(await gbmContracts.methods.getSale_Bid_Value(saleID, bidIndex).call()),
        bidBidder: await gbmContracts.methods.getSale_Bid_Bidder(saleID, bidIndex).call(),
        bidIncentive: web3.utils.fromWei(await gbmContracts.methods.getSale_Bid_Incentive(saleID, bidIndex).call()),
        bidCurrencyIndex: await gbmContracts.methods.getSale_Bid_CurrencyIndex(saleID, bidIndex).call(),
        bidCurrencyAddress: await gbmContracts.methods.getSale_Bid_Currency_Address(saleID, bidIndex).call(),
        bidCurrencyName: await gbmContracts.methods.getSale_Bid_Currency_Name(saleID, bidIndex).call()
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
    await gbmContracts.methods.unsafeRegister721Auction(tokenID, tokenContractAddress, gbmPreset, Math.ceil(Date.now() / 1000) + 30, currencyID, beneficiary).send({ from: window.ethereum.selectedAddress })
}

async function submitBid(auctionId, newBidAmount, previousHighestBidAmount) {
    const newAmount = web3.utils.toWei(newBidAmount);
    const oldAmount = web3.utils.toWei(previousHighestBidAmount);
    await gbmContracts.methods.bid(auctionId, newAmount, oldAmount).send({from: window.ethereum.selectedAddress, to: diamondAddress, value: newAmount, gasLimit: 300000 })
}

async function getPresets() {
  const presetAmount = await gbmContracts.methods.getGBMPresetsAmount(0).call();

  const presetsArray = Promise.all([...Array(parseInt(presetAmount)+1).keys()].map(async (item, index) => await gbmContracts.methods.getGBMPreset(index).call()));
  const presetsNames = Promise.all([...Array(parseInt(presetAmount)+1).keys()].map(async (item, index) => await gbmContracts.methods.getGBMPreset_Name(index).call()));

  return {
    presets: (await presetsArray).slice(1), 
    names: (await presetsNames).slice(1)
  }
}

async function getGBMAdmin() {
  const admin = await gbmContracts.methods.getGBMAccount().call();
  return admin;
}

async function updatePreset(auctionDuration, hammerTimeDuration, cancellationPeriodDuration, stepMin, incentiveMin, incentiveMax, incentiveGrowthMultiplier) {
  const presetIndex = await gbmContracts.methods.getGBMPresetDefault().call();
  await gbmContracts.methods.setGBMPreset(presetIndex, auctionDuration, hammerTimeDuration, cancellationPeriodDuration, stepMin, incentiveMin, incentiveMax, incentiveGrowthMultiplier).send({from: window.ethereum.selectedAddress, to: diamondAddress, gasLimit: 300000 });
}

async function claimToken(saleId) {
  await gbmContracts.methods.claim(saleId).send({from: window.ethereum.selectedAddress})
}