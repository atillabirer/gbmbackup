// SPDX-License-Identifier: UNLICENSED
// © Copyright 2023. Patent pending. All rights reserved. Perpetual Altruism Ltd.
pragma solidity 0.8.19; 

import { IGBMPrimaryAuctionRegistrationFacet } from "../interfaces/facets/IGBMPrimaryAuctionRegistrationFacet.sol";
import { GBMStorage } from "../libraries/GBM_Core.sol";
import { IGBMEventsFacet } from "../interfaces/facets/IGBMEventsFacet.sol";
import { IERC721 } from "../interfaces/IERC721.sol";

contract GBMPrimaryAuctionRegistrationFacet is IGBMPrimaryAuctionRegistrationFacet, IGBMEventsFacet {

    GBMStorage internal s;

    modifier onlyAdmin() {
        require(msg.sender == s.GBMAdminAccount, "Function only callable by the GBM admin");
        _;
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

        internalRegister721Auction(tokenID, tokenContractAddress, gbmPreset, startTimestamp, currencyID, beneficiary, 0, 0);

    }

    /// @notice Register a 721 auction and checking for token ownership
    /// @dev The default way to register your auctions one by one
    /// @param tokenID The token ID of the ERC721 NFT for sale
    /// @param tokenContractAddress The address of the smart contract of the NFT for sale
    /// @param gbmPreset The id of the GBM preset used for this auction. 0 to use the default one.
    /// @param startTimestamp The timestamp of when the auction should start.
    /// @param currencyID The ID of the currency this auction accept. 0 to use the default one.
    /// @param beneficiary The address of whom should the proceed from the sales goes to.
    /// @param endTimestamp When shall the last bid should be accepted
    /// @param startingBid How much at the minimum should the first bid be
    /// @param endTimestamp When shall the last bid should be accepted
    /// @param startingBid How much at the minimum should the first bid be
    function safeRegister721Auction_Custom( uint256 tokenID, 
                                        address tokenContractAddress, 
                                        uint256 gbmPreset, 
                                        uint256 startTimestamp, 
                                        uint256 currencyID, 
                                        address beneficiary,
                                        uint256 endTimestamp,
                                        uint256 startingBid
                                        ) external onlyAdmin() {

        require(IERC721(tokenContractAddress).ownerOf(tokenID) == address(this), "Please deposit the token in escrow first");

        internalRegister721Auction(tokenID, tokenContractAddress, gbmPreset, startTimestamp, currencyID, beneficiary, endTimestamp, startingBid);

    }

    /// @notice Register a 721 auction and checking for token ownership
    /// @dev The default way to register your auctions one by one
    /// @param tokenIDs And arrau of the token ID of the ERC721 NFT for sale
    /// @param tokenContractAddress The address of the smart contract of the NFT for sale
    /// @param gbmPreset The id of the GBM preset used for this auction. 0 to use the default one.
    /// @param startTimestamp The timestamp of when the auction should start.
    /// @param currencyID The ID of the currency this auction accept. 0 to use the default one.
    /// @param beneficiary The address of whom should the proceed from the sales goes to.
    function safeRegister721AuctionBatch(uint256[] calldata tokenIDs, 
                                        address tokenContractAddress, 
                                        uint256 gbmPreset, 
                                        uint256 startTimestamp, 
                                        uint256 currencyID, 
                                        address beneficiary) external onlyAdmin() {

        for(uint256 i = 0; i < tokenIDs.length; i++){
            require(IERC721(tokenContractAddress).ownerOf(tokenIDs[i]) == address(this), "Please deposit the token in escrow first");

            internalRegister721Auction(tokenIDs[i], tokenContractAddress, gbmPreset, startTimestamp, currencyID, beneficiary, 0, 0);
        }
    }


    /// @notice Register a 721 auction and checking for token ownership
    /// @dev The default way to register your auctions one by one
    /// @param tokenIDs And arrau of the token ID of the ERC721 NFT for sale
    /// @param tokenContractAddress The address of the smart contract of the NFT for sale
    /// @param gbmPreset The id of the GBM preset used for this auction. 0 to use the default one.
    /// @param startTimestamp The timestamp of when the auction should start.
    /// @param currencyID The ID of the currency this auction accept. 0 to use the default one.
    /// @param beneficiary The address of whom should the proceed from the sales goes to.
    /// @param endTimestamp When shall the last bid should be accepted
    /// @param startingBid How much at the minimum should the first bid be
    function safeRegister721AuctionBatch_Custom(uint256[] calldata tokenIDs, 
                                        address tokenContractAddress, 
                                        uint256 gbmPreset, 
                                        uint256 startTimestamp, 
                                        uint256 currencyID, 
                                        address beneficiary,
                                        uint256 endTimestamp,
                                        uint256 startingBid
                                        ) external onlyAdmin() {

        for(uint256 i = 0; i < tokenIDs.length; i++){
            require(IERC721(tokenContractAddress).ownerOf(tokenIDs[i]) == address(this), "Please deposit the token in escrow first");

            internalRegister721Auction(tokenIDs[i], tokenContractAddress, gbmPreset, startTimestamp, currencyID, beneficiary, endTimestamp, startingBid);
        }
    }


    /// @notice Register a 1155 auction and check for 1155 token ownership
    /// @dev Make sure that the beneficiary is the wallet address that sent the 1155 tokens in escrow.
    /// @param tokenID The token ID of the ERC721 NFT for sale
    /// @param tokenContractAddress The address of the smart contract of the NFT for sale
    /// @param amount Amount of token to be auctionned off
    /// @param gbmPreset The id of the GBM preset used for this auction. 0 to use the default one.
    /// @param startTimestamp The timestamp of when the auction should start.
    /// @param currencyID The ID of the currency this auction accept. 0 to use the default one.
    /// @param beneficiary The address of whom should the proceed from the sales goes to.
    function safeRegister1155auction(  uint256 tokenID, 
                                        address tokenContractAddress, 
                                        uint256 amount,
                                        uint256 gbmPreset, 
                                        uint256 startTimestamp, 
                                        uint256 currencyID, 
                                        address beneficiary) external onlyAdmin() {


        require((s.erc1155tokensAddressAndIDToEscrowerUnderSaleAmount[tokenContractAddress][tokenID][beneficiary] + amount) <= 
            s.erc1155tokensAddressAndIDToEscrowerAmount[tokenContractAddress][tokenID][beneficiary]
            , "You cannot put that many 1155 tokens on sale without depositing more first");
        internalRegister1155AuctionUnsafe(tokenID, tokenContractAddress, amount, gbmPreset, startTimestamp, currencyID, beneficiary, 0, 0);
    }

    /// @notice Register a 1155 auction and check for 1155 token ownership
    /// @dev Make sure that the beneficiary is the wallet address that sent the 1155 tokens in escrow.
    /// @param tokenID The token ID of the ERC721 NFT for sale
    /// @param tokenContractAddress The address of the smart contract of the NFT for sale
    /// @param amount Amount of token to be auctionned off
    /// @param gbmPreset The id of the GBM preset used for this auction. 0 to use the default one.
    /// @param startTimestamp The timestamp of when the auction should start.
    /// @param currencyID The ID of the currency this auction accept. 0 to use the default one.
    /// @param beneficiary The address of whom should the proceed from the sales goes to.
    /// @param endTimestamp When shall the last bid should be accepted
    /// @param startingBid How much at the minimum should the first bid be
    function safeRegister1155auction_Custom(  uint256 tokenID, 
                                        address tokenContractAddress, 
                                        uint256 amount,
                                        uint256 gbmPreset, 
                                        uint256 startTimestamp, 
                                        uint256 currencyID, 
                                        address beneficiary,
                                        uint256 endTimestamp,
                                        uint256 startingBid
                                    ) external onlyAdmin() {


        require((s.erc1155tokensAddressAndIDToEscrowerUnderSaleAmount[tokenContractAddress][tokenID][beneficiary] + amount) <= 
            s.erc1155tokensAddressAndIDToEscrowerAmount[tokenContractAddress][tokenID][beneficiary]
            , "You cannot put that many 1155 tokens on sale without depositing more first");
        internalRegister1155AuctionUnsafe(tokenID, tokenContractAddress, amount, gbmPreset, startTimestamp, currencyID, beneficiary, endTimestamp, startingBid);
    }


    /// @notice Register a 1155 auction and check for 1155 token ownership
    /// @dev Make sure that the beneficiary is the wallet address that sent the 1155 tokens in escrow.
    /// @param tokenIDs The token ID of the ERC721 NFT for sale
    /// @param amounts Amount of token to be auctionned off
    /// @param tokenContractAddress The address of the smart contract of the NFT for sale
    /// @param gbmPreset The id of the GBM preset used for this auction. 0 to use the default one.
    /// @param startTimestamp The timestamp of when the auction should start.
    /// @param currencyID The ID of the currency this auction accept. 0 to use the default one.
    /// @param beneficiary The address of whom should the proceed from the sales goes to.
    function safeRegister1155auctionBatch(  uint256[] calldata tokenIDs, 
                                        uint256[] calldata amounts,
                                        address tokenContractAddress, 
                                        uint256 gbmPreset, 
                                        uint256 startTimestamp, 
                                        uint256 currencyID, 
                                        address beneficiary) external onlyAdmin() {

        for(uint256 i = 0; i < tokenIDs.length; i++){
                require((s.erc1155tokensAddressAndIDToEscrowerUnderSaleAmount[tokenContractAddress][tokenIDs[i]][beneficiary] + amounts[i]) <= 
                    s.erc1155tokensAddressAndIDToEscrowerAmount[tokenContractAddress][tokenIDs[i]][beneficiary]
                    , "You cannot put that many 1155 tokens on sale without depositing more first");
                internalRegister1155AuctionUnsafe(tokenIDs[i], tokenContractAddress, amounts[i], gbmPreset, startTimestamp, currencyID, beneficiary, 0 , 0);
        }

    }


    /// @notice Register a 1155 auction and check for 1155 token ownership
    /// @dev Make sure that the beneficiary is the wallet address that sent the 1155 tokens in escrow.
    /// @param tokenIDs The token ID of the ERC721 NFT for sale
    /// @param amounts Amount of token to be auctionned off
    /// @param tokenContractAddress The address of the smart contract of the NFT for sale
    /// @param gbmPreset The id of the GBM preset used for this auction. 0 to use the default one.
    /// @param startTimestamp The timestamp of when the auction should start.
    /// @param currencyID The ID of the currency this auction accept. 0 to use the default one.
    /// @param beneficiary The address of whom should the proceed from the sales goes to.
    /// @param endTimestamp When shall the last bid should be accepted
    /// @param startingBid How much at the minimum should the first bid be
    function safeRegister1155auctionBatch_Custom(  uint256[] calldata tokenIDs, 
                                        uint256[] calldata amounts,
                                        address tokenContractAddress, 
                                        uint256 gbmPreset, 
                                        uint256 startTimestamp, 
                                        uint256 currencyID, 
                                        address beneficiary,
                                        uint256 endTimestamp,
                                        uint256 startingBid
                                    ) external onlyAdmin() {

        for(uint256 i = 0; i < tokenIDs.length; i++){
                require((s.erc1155tokensAddressAndIDToEscrowerUnderSaleAmount[tokenContractAddress][tokenIDs[i]][beneficiary] + amounts[i]) <= 
                    s.erc1155tokensAddressAndIDToEscrowerAmount[tokenContractAddress][tokenIDs[i]][beneficiary]
                    , "You cannot put that many 1155 tokens on sale without depositing more first");
                internalRegister1155AuctionUnsafe(tokenIDs[i], tokenContractAddress, amounts[i], gbmPreset, startTimestamp, currencyID, beneficiary, endTimestamp , startingBid);
        }

    }


    function internalRegister721Auction( uint256 tokenID, 
                                        address tokenContractAddress, 
                                        uint256 gbmPreset, 
                                        uint256 startTimestamp, 
                                        uint256 currencyID, 
                                        address beneficiary,
                                        uint256 endTimeStamp,
                                        uint256 startingBid
    ) internal{

        require(!s.erc721tokensAddressAndIDToUnderSale[tokenContractAddress][tokenID], "This token is already under sale");
        s.erc721tokensAddressAndIDToUnderSale[tokenContractAddress][tokenID] = true;

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
        if(gbmPreset == 0){
            _gbmPreset = s.defaultPreset;
        } else {
            _gbmPreset = gbmPreset;
        }

        s.saleToGBMPreset[_saleID] = _gbmPreset;                                                     // A mapping storing the associated GBM preset with a sale
        s.saleTocurrencyID[_saleID] = currencyID;                                                   // A mapping storing the associated main currency with a sale
        s.saleToStartTimestamp[_saleID] = startTimestamp;                                           // A mapping storing the associated StartTimestamp with a sale

        if(endTimeStamp == 0){
            s.saleToEndTimestamp[_saleID] = startTimestamp + s.GBMPresets[_gbmPreset].auctionDuration;   // A mapping storing the associated EndTimestamp with a sale
        } else {
            s.saleToEndTimestamp[_saleID] = endTimeStamp;
        }

        uint256 _startPrice = startingBid;
        if(_startPrice == 0){ 
           _startPrice = s.GBMPresets[_gbmPreset].firstMinBid;
        } else {
            s.saleToPrice[_saleID] = startingBid;
        }
       
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
            beneficiary,
            _startPrice
        );                      

                                                            
    }

    function internalRegister1155AuctionUnsafe( uint256 tokenID, 
                                        address tokenContractAddress, 
                                        uint256 amount,
                                        uint256 gbmPreset, 
                                        uint256 startTimestamp, 
                                        uint256 currencyID, 
                                        address beneficiary,
                                        uint256 endTimeStamp,
                                        uint256 startingBid
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

        s.erc1155tokensAddressAndIDToEscrowerUnderSaleAmount[tokenContractAddress][tokenID][beneficiary] += amount;
                
        uint256 _gbmPreset;
        if(gbmPreset == 0){
            _gbmPreset = s.defaultPreset;
        } else {
            _gbmPreset = gbmPreset;
        }

        s.saleToGBMPreset[_saleID] = _gbmPreset;                                                     // A mapping storing the associated GBM preset with a sale
        s.saleTocurrencyID[_saleID] = currencyID;                                                   // A mapping storing the associated main currency with a sale
        s.saleToStartTimestamp[_saleID] = startTimestamp;  
                                                 // A mapping storing the associated StartTimestamp with a sale
        if(endTimeStamp == 0){
            s.saleToEndTimestamp[_saleID] = startTimestamp + s.GBMPresets[_gbmPreset].auctionDuration;   // A mapping storing the associated EndTimestamp with a sale
        } else {
            s.saleToEndTimestamp[_saleID] = endTimeStamp;
        }

        uint256 _startPrice = startingBid;
        if(_startPrice == 0){ 
           _startPrice = s.GBMPresets[_gbmPreset].firstMinBid;
        } else {
            s.saleToPrice[_saleID] = startingBid;
        }
  
       
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
            beneficiary,
            _startPrice
        );                      
                                                            
    }

}