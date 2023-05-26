// SPDX-License-Identifier: UNLICENSED
// © Copyright 2023. Patent pending. All rights reserved. Perpetual Altruism Ltd.
pragma solidity 0.8.19; 

import { IGBMPrimaryAuctionRegistrationFacet } from "../interfaces/facets/IGBMPrimaryAuctionRegistrationFacet.sol";
import { GBMStorage } from "../libraries/GBM_Core.sol";
import { IGBMEventsFacet } from "../interfaces/facets/IGBMEventsFacet.sol";
import { IERC721 } from "../interfaces/IERC721.sol";

contract GBMPrimaryAuctionRegistrationFacet is IGBMPrimaryAuctionRegistrationFacet,IGBMEventsFacet {

    GBMStorage internal s;

    modifier onlyAdmin() {
        require(msg.sender == s.GBMAdminAccount, "Function only callable by the GBM admin");
        _;
    }

    /// @notice Register a 721 auction without checking for token ownership
    /// @dev Useful for example if you have a custom 721 contract that will mint the token at the end of the auction,
    /// when the safeTransfer function is called, or simply if the GBM contract is approved to manipulate the auctionned
    /// token and the seller can be trusted to not move the token once the auction has started. Throw if not called by the GBM admin.
    /// /!\ Auction settlement always try to get the owner of the token before transferring it. If doing minting settlement, please
    /// implement your 721 in a way that unminted token ownerOf() do not throw and instead return address(0).
    /// @param tokenID The token ID of the ERC721 NFT for sale
    /// @param tokenContractAddress The address of the smart contract of the NFT for sale
    /// @param gbmPreset The id of the GBM preset used for this auction. 0 to use the default one.
    /// @param startTimestamp The timestamp of when the auction should start.
    /// @param currencyID The ID of the currency this auction accept. 0 to use the default one.
    /// @param beneficiary The address of whom should the proceed from the sales goes to.
    function unsafeRegister721Auction(  uint256 tokenID, 
                                        address tokenContractAddress, 
                                        uint256 gbmPreset, 
                                        uint256 startTimestamp, 
                                        uint256 currencyID, 
                                        address beneficiary) external onlyAdmin() {

        internalRegister721Auction(tokenID, tokenContractAddress, gbmPreset, startTimestamp, currencyID, beneficiary);
    }

    /// @notice Register a 721 auction and checking for token ownership
    /// @dev The default way to register your auctions one by one
    /// @param tokenID The token ID of the ERC721 NFT for sale
    /// @param tokenContractAddress The address of the smart contract of the NFT for sale
    /// @param gbmPreset The id of the GBM preset used for this auction. 0 to use the default one.
    /// @param startTimestamp The timestamp of when the auction should start.
    /// @param currencyID The ID of the currency this auction accept. 0 to use the default one.
    /// @param beneficiary The address of whom should the proceed from the sales goes to.
    function safeRegister721Auction(    uint256 tokenID, 
                                        address tokenContractAddress, 
                                        uint256 gbmPreset, 
                                        uint256 startTimestamp, 
                                        uint256 currencyID, 
                                        address beneficiary) external onlyAdmin() {

        require(IERC721(tokenContractAddress).ownerOf(tokenID) == address(this), "Please deposit the token in escrow first");

        internalRegister721Auction(tokenID, tokenContractAddress, gbmPreset, startTimestamp, currencyID, beneficiary);

    }

    /// @notice Register a 1155 auction without checking for token ownership
    /// @dev This allow for cheaper deposit of the 1155 tokens, as you can bypass escrow tracking and settlement. Also allow
    /// JIT minting at auction settlement, just like for the unsafe 721 auction registration
    /// @param tokenID The token ID of the ERC721 NFT for sale
    /// @param tokenContractAddress The address of the smart contract of the NFT for sale
    /// @param amount Amount of token to be auctionned off
    /// @param gbmPreset The id of the GBM preset used for this auction. 0 to use the default one.
    /// @param startTimestamp The timestamp of when the auction should start.
    /// @param currencyID The ID of the currency this auction accept. 0 to use the default one.
    /// @param beneficiary The address of whom should the proceed from the sales goes to.
    function unsafeRegister1155auction(  uint256 tokenID, 
                                        address tokenContractAddress, 
                                        uint256 amount,
                                        uint256 gbmPreset, 
                                        uint256 startTimestamp, 
                                        uint256 currencyID, 
                                        address beneficiary) external onlyAdmin() {
        internalRegister1155Auction(tokenID, tokenContractAddress, amount, gbmPreset, startTimestamp, currencyID, beneficiary);
    }

    function internalRegister721Auction( uint256 tokenID, 
                                        address tokenContractAddress, 
                                        uint256 gbmPreset, 
                                        uint256 startTimestamp, 
                                        uint256 currencyID, 
                                        address beneficiary
    ) internal{

        require(currencyID != 0 || s.defaultCurrency != 0, "No currency have been set for the auction being registered");
        require(startTimestamp != 0, "The auction have no starting timestamp specified");

        //Incrementing the total number of auction ran
        uint256 _saleID = s.totalNumberOfSales + 1;
        s.totalNumberOfSales = _saleID;

        s.saleToTokenAddress[_saleID] = tokenContractAddress;    // A mapping storing the associated tokenAddress with a sale
        s.saleToTokenId[_saleID] = tokenID;         // A mapping storing the associated tokenID with a sale
        s.saleToTokenAmount[_saleID] = 1;           // A mapping storing the associated tokenAmount offered by a sale
        s.saleToTokenKind[_saleID] = 0x73ad2146;    // A mapping storing the associated tokenKind with a sale _tokenKind = 0x73ad2146 if the token is ERC721, 0x973bb640 if the token is ERC1155


        
        uint256 _gbmPreset;
        if(_gbmPreset == 0){
            _gbmPreset = s.defaultPreset;
        }

        s.saleToGBMPreset[_saleID] = _gbmPreset;                                                     // A mapping storing the associated GBM preset with a sale
        s.saleTocurrencyID[_saleID] = currencyID;                                                   // A mapping storing the associated main currency with a sale
        s.saleToStartTimestamp[_saleID] = startTimestamp;                                           // A mapping storing the associated StartTimestamp with a sale

        s.saleToEndTimestamp[_saleID] = startTimestamp + s.GBMPresets[_gbmPreset].auctionDuration;   // A mapping storing the associated EndTimestamp with a sale
        s.saleToBeneficiary[_saleID] = beneficiary;                                                 // A mapping storing the associated Beneficiary (ie : the seller) with a sale

        /*
            /// @dev This event emits whenever a new auction has been registered individually
            event AuctionRegistrationNewAuction(
                uint256 indexed saleID,                 // The id of the new sale
                address indexed tokenContractAddress,   // The address of the contract of the NFT being auctionned
                uint256 indexed tokenID,                // The ID of the token being auctionned
                uint256 tokenAmount,                    // How many tokens sold at once in this auction
                bytes4 tokenKind,                       // tokenKind = 0x73ad2146 if the token is ERC721, 0x973bb640 if the token is ERC1155
                uint256 gbmPresetIndex,                 // The index of the GBM preset being used. 0 = default preset.
                uint256 currencyID,                     // The index of the currency being used. 0 = default preset
                uint256 startTimestamp,                 // When is the auction starting
                uint256 endTimeStamp,                   // When is the auction ending
                address beneficiary                     // Who is the seller that is gonna receive the profits of the sale
            );
        */
        emit AuctionRegistration_NewAuction(
            _saleID,
            tokenContractAddress,
            tokenID,
            1,
            0x73ad2146,
            gbmPreset,
            currencyID,
            startTimestamp,
            s.saleToEndTimestamp[_saleID],
            beneficiary
        );                      

                                                            
    }

    function internalRegister1155Auction( uint256 tokenID, 
                                        address tokenContractAddress, 
                                        uint256 amount,
                                        uint256 gbmPreset, 
                                        uint256 startTimestamp, 
                                        uint256 currencyID, 
                                        address beneficiary
    ) internal{

        require(currencyID != 0 || s.defaultCurrency != 0, "No currency have been set for the auction being registered");
        require(startTimestamp != 0, "The auction have no starting timestamp specified");

        //Incrementing the total number of auction ran
        uint256 _saleID = s.totalNumberOfSales + 1;
        s.totalNumberOfSales = _saleID;

        s.saleToTokenAddress[_saleID] = tokenContractAddress;    // A mapping storing the associated tokenAddress with a sale
        s.saleToTokenId[_saleID] = tokenID;         // A mapping storing the associated tokenID with a sale
        s.saleToTokenAmount[_saleID] = amount;           // A mapping storing the associated tokenAmount offered by a sale
        s.saleToTokenKind[_saleID] = 0x973bb640;    // A mapping storing the associated tokenKind with a sale _tokenKind = 0x73ad2146 if the token is ERC721, 0x973bb640 if the token is ERC1155


                
        uint256 _gbmPreset;
        if(_gbmPreset == 0){
            _gbmPreset = s.defaultPreset;
        }

        s.saleToGBMPreset[_saleID] = gbmPreset;                                                     // A mapping storing the associated GBM preset with a sale
        s.saleTocurrencyID[_saleID] = currencyID;                                                   // A mapping storing the associated main currency with a sale
        s.saleToStartTimestamp[_saleID] = startTimestamp;                                           // A mapping storing the associated StartTimestamp with a sale
        s.saleToEndTimestamp[_saleID] = startTimestamp + s.GBMPresets[gbmPreset].auctionDuration;   // A mapping storing the associated EndTimestamp with a sale
        s.saleToBeneficiary[_saleID] = beneficiary;                                                 // A mapping storing the associated Beneficiary (ie : the seller) with a sale

        /*
            /// @dev This event emits whenever a new auction has been registered individually
            event AuctionRegistrationNewAuction(
                uint256 indexed saleID,                 // The id of the new sale
                address indexed tokenContractAddress,   // The address of the contract of the NFT being auctionned
                uint256 indexed tokenID,                // The ID of the token being auctionned
                uint256 tokenAmount,                    // How many tokens sold at once in this auction
                bytes4 tokenKind,                       // tokenKind = 0x73ad2146 if the token is ERC721, 0x973bb640 if the token is ERC1155
                uint256 gbmPresetIndex,                 // The index of the GBM preset being used. 0 = default preset.
                uint256 currencyID,                     // The index of the currency being used. 0 = default preset
                uint256 startTimestamp,                 // When is the auction starting
                uint256 endTimeStamp,                   // When is the auction ending
                address beneficiary                     // Who is the seller that is gonna receive the profits of the sale
            );
        */
        emit AuctionRegistration_NewAuction(
            _saleID,
            tokenContractAddress,
            tokenID,
            amount,
            0x973bb640,
            gbmPreset,
            currencyID,
            startTimestamp,
            s.saleToEndTimestamp[_saleID],
            beneficiary
        );                      
                                                            
    }

}