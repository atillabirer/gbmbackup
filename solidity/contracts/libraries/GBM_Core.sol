// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;


bytes4 constant ERC721 = bytes4(keccak256("ERC721"));
bytes4 constant ERC1155 = bytes4(keccak256("ERC1155"));

bytes4 constant FIAT = bytes4(keccak256("FIAT"));
bytes4 constant MONOERC20 = bytes4(keccak256("MONOERC20"));
bytes4 constant CRYPTO = bytes4(keccak256("CRYPTO"));

bytes8 constant ESCROW = bytes8(keccak256("ESCROW"));
bytes8 constant APPROVED = bytes8(keccak256("APPROVED"));


//struct used to represent a GBM preset for incentive calculations
struct GBM_preset{
    uint256 auctionDuration;                // How long will the auction last at the minimum
    uint256 hammerTimeDuration;             // How much time a new bid can come in after the last bid at the end of an auction
    uint256 cancellationPeriodDuration;     // How much time does the seller has to cancel the auction at the end of it
    uint256 stepMin;                        // The minimal %k increase between two successive bids   
    uint256 incentiveMin;                   // The minimal %k incentive reward from a bid
    uint256 incentiveMax;                   // The maximal %k incentive reward from a bid
    uint256 bidMultiplier;                  // The growth factor in a GBM auction
}

//Design philosophy : 
//Never register something at index 0 in a mapping. 0 is the default value that is reserved for "un-initialized" gas saving shortcuts.

// The struct used as storage by the main diamond contract
struct GBMStorage {

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


    uint256 percentKage;                        // All calculation granularity are done to the 10th of basis point (100000 parts per unit)
    uint256 decimals;                           // How much wei is an ERC-20 token/chain currency unit.


    mapping (uint256 => string) currencyNames;     // Name of the authorized currencies
    mapping (uint256 => address) currencyAddress;  // Address of the ERC-20 tokens currencies. An address of 0 imply a Native currency.
    uint256 defaultCurrency;                       // When a currency is not registered, which index of currency shall be assumed


    mapping (uint256 => GBM_preset) GBMPresets;    // The list of presets usable by auctions on the marketplace
}



//Struct used to store the representation of an NFT being auctionned
struct token_representation {
    address contractAddress; // The contract address
    uint256 tokenId; // The ID of the token on the contract
    bytes4 tokenKind; // The ERC name of the token implementation bytes4(keccak256("ERC721")) or bytes4(keccak256("ERC1155"))
    uint256 tokenAmount; // The amount of units that are sold in the auction
}


//Struct as parameter when placing a bid on an auction
struct bid {
    uint256 saleID;
    uint256 previousHighestBid;
    uint256 bidValue;
}