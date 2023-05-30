// SPDX-License-Identifier: UNLICENSED
// © Copyright 2023. Patent pending. All rights reserved. Perpetual Altruism Ltd.
pragma solidity 0.8.19; 

import { GBM_preset } from "../../libraries/GBM_Core.sol";

/// @title IGBMAuctionRegistration interface
/// @author Guillaume Gonnaud
interface IGBMPrimaryAuctionRegistrationFacet {
    

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
                                        address beneficiary) external;


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
                                        address beneficiary) external;


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
                                        address beneficiary) external;


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
                                        address beneficiary) external;

}