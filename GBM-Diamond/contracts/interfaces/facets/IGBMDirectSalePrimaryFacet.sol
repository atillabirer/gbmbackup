// SPDX-License-Identifier: UNLICENSED
// © Copyright 2023. Patent pending. All rights reserved. Perpetual Altruism Ltd.
pragma solidity 0.8.19; 

import { GBM_preset } from "../../libraries/GBM_Core.sol";

/// @title IGBMDirectSalePrimaryFacet interface
/// @author Guillaume Gonnaud 2023
interface IGBMDirectSalePrimaryFacet {
    

    /// @notice Buy all tokens from a direct sale
    /// @param saleID The ID of the sale you wish to buy in it's entirety
    function buyASaleOffer(uint256 saleID) payable external;


    /// @notice Buy tokens from a direct sale
    /// @param saleID The ID of the sale you wish to buy 
    /// @param amount The amount of token from this sale you wish to buy.
    function buyASaleOfferPartial(uint256 saleID, uint256 amount) payable external;


    /// @notice Register a 721 direct sale and checking for token ownership
    /// @dev The regisration will detect if you have the token in escrow or if you own it in your wallet
    /// @param tokenID The token ID of the ERC721 NFT for sale
    /// @param tokenContractAddress The address of the smart contract of the NFT for sale
    /// @param price The amount of currency requested for this sale
    /// @param currencyID The ID of the currency this auction accept. 0 to use the default one.
    /// @param startTimestamp The timestamp of when the sale should start
    /// @param endTimestamp The timestamp of when the sale should expire
    function safeRegister721DirectSale( uint256 tokenID, 
                                        address tokenContractAddress, 
                                        uint256 price, 
                                        uint256 currencyID, 
                                        uint256 startTimestamp,
                                        uint256 endTimestamp) external;

    /// @notice Register a bunch of 721 direct sale and checking for token ownership
    /// @dev The regisration will detect if you have the token in escrow or if you own it in your wallet
    /// @param tokenIDs The token ID of the ERC721 NFT for sale
    /// @param tokenContractAddress The address of the smart contract of the NFT for sale
    /// @param price The amount of currency requested for this sale
    /// @param currencyID The ID of the currency this auction accept. 0 to use the default one.
    /// @param startTimestamp The timestamp of when the sale should start
    /// @param endTimestamp The timestamp of when the sale should expire
    function safeRegister721DirectSale_Batch( uint256[] calldata tokenIDs, 
                                        address tokenContractAddress, 
                                        uint256 price, 
                                        uint256 currencyID, 
                                        uint256 startTimestamp,
                                        uint256 endTimestamp) external;


    /// @notice Register a 1155 direct sale and checking for token ownership
    /// @dev The regisration will detect if you have the tokens in escrow or if you own them in your wallet
    /// @param tokenID The token ID of the ERC721 NFT for sale
    /// @param tokenContractAddress The address of the smart contract of the NFT for sale
    /// @param price The amount of currency requested for this sale
    /// @param amount The total number of tokens in this sale
    /// @param currencyID The ID of the currency this auction accept. 0 to use the default one.
    /// @param startTimestamp The timestamp of when the sale should start
    /// @param endTimestamp The timestamp of when the sale should expire
    function safeRegister1155DirectSale( uint256 tokenID, 
                                        address tokenContractAddress, 
                                        uint256 price, 
                                        uint256 amount,
                                        uint256 currencyID, 
                                        uint256 startTimestamp,
                                        uint256 endTimestamp) external;


    
    /// @notice Register a 1155 direct sale and checking for token ownership
    /// @dev The regisration will detect if you have the tokens in escrow or if you own them in your wallet
    /// @param tokenIDs The token IDs of the ERC721 NFT for sale
    /// @param tokenContractAddress The address of the smart contract of the NFT for sale
    /// @param price The amount of currency requested for this sale
    /// @param amounts The total number of tokens in this sale
    /// @param currencyID The ID of the currency this auction accept. 0 to use the default one.
    /// @param startTimestamp The timestamp of when the sale should start
    /// @param endTimestamp The timestamp of when the sale should expire
    function safeRegister1155DirectSale_Batch( uint256[] calldata tokenIDs, 
                                        address tokenContractAddress, 
                                        uint256 price, 
                                        uint256[] calldata amounts,
                                        uint256 currencyID, 
                                        uint256 startTimestamp,
                                        uint256 endTimestamp) external;


}