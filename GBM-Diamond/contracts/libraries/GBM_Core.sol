// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;


bytes4 constant ERC721 = bytes4(keccak256("ERC721"));
bytes4 constant ERC1155 = bytes4(keccak256("ERC1155"));
uint256 constant DECIMALSK = 100000;

//struct used to represent a GBM preset for incentive calculations
struct GBM_preset{
    uint256 auctionDuration;                // How long will the auction last at the minimum
    uint256 hammerTimeDuration;             // How much time a new bid can come in after the last bid at the end of an auction
    uint256 cancellationPeriodDuration;     // How much time does the seller has to cancel the auction at the end of it
    uint256 stepMin;                        // The minimal %k increase between two successive bids   
    uint256 incentiveMin;                   // The minimal %k incentive reward from a bid
    uint256 incentiveMax;                   // The maximal %k incentive reward from a bid
    uint256 incentiveGrowthMultiplier;      // The growth factor in a GBM auction
}

//Design philosophy : 
//Never register something at index 0 in a mapping. 0 is the default value that is reserved for "un-initialized" gas saving shortcuts.

// The struct used as storage by the main diamond contract
struct GBMStorage {

    bool reentrancySemaphore;                   // Boolean used to gurantee no-reantrancy

    address GBMAdminAccount;                    // The address of the GBM contract administrator. Make it a real wallet you know the pkey of.
                                                // Nota Bene: This a separate address from the diamond owner. Ofc, you can use same address twice.

    address marketPlaceRoyalty;                 // The address to which all marketplace royalties are paid for.
    uint256 mPlaceGBMFeePercentKage;            // How much the marketplace take as a percentkage in case of a settled GBM auction
    uint256 mPlaceEnglishFeePercentKage;        // How much the marketplace take as a percentkage in case of a settled English auction
    uint256 mPlaceDirectFeePercentKage;         // How much the marketplace take as a percentkage in case of a direct sale

    address GBMAccount;                         // The address to which the GBM License fee is being paid
    bool isLicensePaidOnChain;                  // A boolean controlling if the license fee is paid at settlement time in tokens or separately off-chain
    uint256 GBMFeePercentKage;                  // How much % is the GBM license fee of a settled auction

    uint256 totalSalesCreated;                  // How many sales have been created so far. Also used as auctionID;

    mapping (uint256 => string) currencyNames;     // Name of the authorized currencies
    mapping (uint256 => address) currencyAddress;  // Address of the ERC-20 tokens currencies. An address of 0 imply a Native currency.
    uint256 defaultCurrency;                       // When a currency is not registered, which index of currency shall be assumed


    mapping (uint256 => GBM_preset) GBMPresets;    // The list of presets usable by auctions on the marketplace
    mapping (uint256 => string) GBMPresetName;    // The name of a GBM preset
    uint256 GBMPresetsAmount;                       // The total number of presets
    uint256 defaultPreset;                         // The default preset used by auctions

    uint256 totalNumberOfSales;                      //Total number of sales ran by the contract so far

    mapping (uint256 => bytes4) saleToSaleKind;        // A mapping storing which kind of sale is hapenning. 0x0 = GBM sale.

    mapping (uint256 => address) saleToTokenAddress;    // A mapping storing the associated tokenAddress with a sale
    mapping (uint256 => uint256) saleToTokenId;         // A mapping storing the associated tokenID with a sale
    mapping (uint256 => uint256) saleToTokenAmount;     // A mapping storing the associated tokenAmount offered by a sale
    mapping (uint256 => bytes4) saleToTokenKind;        // A mapping storing the associated tokenKind with a sale
                                                        //  _tokenKind = 0x73ad2146 if the token is ERC721, 0x973bb640 if the token is ERC1155

    mapping (uint256 => uint256) saleToGBMPreset;           // A mapping storing the associated GBM preset with a sale
    mapping (uint256 => uint256) saleTocurrencyID;          // A mapping storing the associated main currency with a sale
    mapping (uint256 => uint256) saleToStartTimestamp;      // A mapping storing the associated StartTimestamp with a sale
    mapping (uint256 => uint256) saleToEndTimestamp;        // A mapping storing the associated EndTimestamp with a sale
    mapping (uint256 => address) saleToBeneficiary;         // A mapping storing the associated Beneficiary (ie : the seller) with a sale
    mapping (uint256 => uint256) saleToDebt;                // A mapping storing how much debt has the gbm auctiona ccumulated

    mapping (uint256 => mapping(uint256 => uint256)) saleToBidValues;   // A mapping storing the bids in the order they hapenned. Index start at 1.
    mapping (uint256 => mapping(uint256 => address)) saleToBidders;     // A mapping storing the bidders in the order they bid. Index start at 1.
    mapping (uint256 => mapping(uint256 => uint256)) saleToBidCurrencies;  // A mapping storing the currency in which the bids happenned. 0 = default currency of the auction.
    mapping (uint256 => mapping(uint256 => uint256)) saleToBidIncentives; // A mapping to store how much money each bidder will receive as incentive
    mapping (uint256 => uint256) saleToNumberOfBids;                    // A mapping storing the number of bids per auction. 0 = no bids.


    //For security reason, only non-smart contracts can receive instant incentives and proceeds in native currency. Smart contracts have to withdraw().
    mapping (address => uint256) smartContractsUsersNativeCurrencyBalance; 

    mapping (address => mapping(uint256 => address)) erc721tokensAddressAndIDToEscrower; //A mapping keeping track of who deposited an ERC721 token in escrow
    mapping (address => mapping(uint256 => mapping(address => uint256))) erc1155tokensAddressAndIDToEscrowerAmount; //A mapping keeping track of how much by whom ERC1155 tokens have been deposited in escrow    
    mapping (address => mapping(uint256 => mapping(address => uint256))) erc1155tokensAddressAndIDToEscrowerUnderSaleAmount; //A mapping keeping track of how much by whom ERC1155 tokens are under sale 
    mapping (uint256 => uint256) saleToSeller; // A mapping storing who has deposited the token in escrow and created the sale       

     mapping (uint256 => bool) saleToClaimed; // A mapping storing wether or not a sale have been settled                                          
}

