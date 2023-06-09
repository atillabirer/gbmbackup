// SPDX-License-Identifier: UNLICENSED
// © Copyright 2023. Patent pending. All rights reserved. Perpetual Altruism Ltd.
pragma solidity 0.8.19; 

import { GBMPrimaryAuctionRegistrationFacet } from "./GBMPrimaryAuctionRegistrationFacet.sol";

/// @title GBMPrimaryAuctionRegistrationFacetUnsafe Contract
/// @author Guillaume Gonnaud
/// @notice If this facet is deployed, anyone that give NFT manipulation approval to the GBM diamond could have those token
/// drained by the GBMAdmin. Use with care, and only in the scope of lazy minting auctions or similar advanced drops.
/// Of course, you need to use purpose built 721/1155 contracts for such features.
/// If you do know how to make such contracts, it's highly recommended that you do not deploy this facet.
contract GBMPrimaryAuctionRegistrationFacetUnsafe is GBMPrimaryAuctionRegistrationFacet {


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
        internalRegister721Auction(tokenID, tokenContractAddress, gbmPreset, startTimestamp, currencyID, beneficiary, 0, 0);
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
    /// @param endTimestamp When shall the last bid should be accepted
    /// @param startingBid How much at the minimum should the first bid be
    function unsafeRegister721Auction_Custom(  uint256 tokenID, 
                                        address tokenContractAddress, 
                                        uint256 gbmPreset, 
                                        uint256 startTimestamp, 
                                        uint256 currencyID, 
                                        address beneficiary,
                                        uint256 endTimestamp,
                                        uint256 startingBid
                                        ) external onlyAdmin() {
        internalRegister721Auction(tokenID, tokenContractAddress, gbmPreset, startTimestamp, currencyID, beneficiary, endTimestamp, startingBid);
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
        internalRegister1155AuctionUnsafe(tokenID, tokenContractAddress, amount, gbmPreset, startTimestamp, currencyID, beneficiary, 0, 0);
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
    /// @param endTimestamp When shall the last bid should be accepted
    /// @param startingBid How much at the minimum should the first bid be
    function unsafeRegister1155auction_Custom(  uint256 tokenID, 
                                        address tokenContractAddress, 
                                        uint256 amount,
                                        uint256 gbmPreset, 
                                        uint256 startTimestamp, 
                                        uint256 currencyID, 
                                        address beneficiary,
                                        uint256 endTimestamp,
                                        uint256 startingBid
                                    ) external onlyAdmin() {

        internalRegister1155AuctionUnsafe(tokenID, tokenContractAddress, amount, gbmPreset, startTimestamp, currencyID, beneficiary, endTimestamp, startingBid);
    }


    /// @notice Register a 1155 auction and check for 1155 token ownership
    /// @dev This allow for cheaper deposit of the 1155 tokens, as you can bypass escrow tracking and settlement. Also allow
    /// JIT minting at auction settlement, just like for the unsafe 721 auction registration
    /// @param tokenIDs The token ID of the ERC721 NFT for sale
    /// @param amounts Amount of token to be auctionned off
    /// @param tokenContractAddress The address of the smart contract of the NFT for sale
    /// @param gbmPreset The id of the GBM preset used for this auction. 0 to use the default one.
    /// @param startTimestamp The timestamp of when the auction should start.
    /// @param currencyID The ID of the currency this auction accept. 0 to use the default one.
    /// @param beneficiary The address of whom should the proceed from the sales goes to.
    function unsafeRegister1155auctionBatch(  uint256[] calldata tokenIDs, 
                                        uint256[] calldata amounts,
                                        address tokenContractAddress, 
                                        uint256 gbmPreset, 
                                        uint256 startTimestamp, 
                                        uint256 currencyID, 
                                        address beneficiary) external onlyAdmin() {

        for(uint256 i = 0; i < tokenIDs.length; i++){
                internalRegister1155AuctionUnsafe(tokenIDs[i], tokenContractAddress, amounts[i], gbmPreset, startTimestamp, currencyID, beneficiary, 0 , 0);
        }

    }


    /// @notice Register a 1155 auction and check for 1155 token ownership
    /// @dev This allow for cheaper deposit of the 1155 tokens, as you can bypass escrow tracking and settlement. Also allow
    /// JIT minting at auction settlement, just like for the unsafe 721 auction registration
    /// @param tokenIDs The token ID of the ERC721 NFT for sale
    /// @param amounts Amount of token to be auctionned off
    /// @param tokenContractAddress The address of the smart contract of the NFT for sale
    /// @param gbmPreset The id of the GBM preset used for this auction. 0 to use the default one.
    /// @param startTimestamp The timestamp of when the auction should start.
    /// @param currencyID The ID of the currency this auction accept. 0 to use the default one.
    /// @param beneficiary The address of whom should the proceed from the sales goes to.
    /// @param endTimestamp When shall the last bid should be accepted
    /// @param startingBid How much at the minimum should the first bid be
    function unsafeRegister1155auctionBatch_Custom(  uint256[] calldata tokenIDs, 
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
                internalRegister1155AuctionUnsafe(tokenIDs[i], tokenContractAddress, amounts[i], gbmPreset, startTimestamp, currencyID, beneficiary, endTimestamp , startingBid);
        }

    }



}