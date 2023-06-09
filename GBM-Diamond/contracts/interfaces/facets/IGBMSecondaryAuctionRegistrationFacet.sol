// SPDX-License-Identifier: UNLICENSED
// © Copyright 2023. Patent pending. All rights reserved. Perpetual Altruism Ltd.
pragma solidity 0.8.19; 

import { GBM_preset } from "../../libraries/GBM_Core.sol";

/// @title IGBMSecondaryAuctionRegistrationFacet interface
/// @author Guillaume Gonnaud
interface IGBMSecondaryAuctionRegistrationFacet {

    /// @notice Register a 721 auction and checking for token ownership
    /// @dev The default way to register your auctions one by one
    /// @param tokenID The token ID of the ERC721 NFT for sale
    /// @param tokenContractAddress The address of the smart contract of the NFT for sale
    /// @param gbmPreset The id of the GBM preset used for this auction. 0 to use the default one.
    /// @param startTimestamp The timestamp of when the auction should start.
    /// @param currencyID The ID of the currency this auction accept. 0 to use the default one.
    function safeRegister721Auction_User(    uint256 tokenID, 
                                        address tokenContractAddress, 
                                        uint256 gbmPreset, 
                                        uint256 startTimestamp, 
                                        uint256 currencyID) external;

   
    /// @notice Register a 721 auction and checking for token ownership
    /// @dev The default way to register your auctions one by one
    /// @param tokenID The token ID of the ERC721 NFT for sale
    /// @param tokenContractAddress The address of the smart contract of the NFT for sale
    /// @param gbmPreset The id of the GBM preset used for this auction. 0 to use the default one.
    /// @param startTimestamp The timestamp of when the auction should start.
    /// @param currencyID The ID of the currency this auction accept. 0 to use the default one.
    /// @param endTimestamp When shall the last bid should be accepted
    /// @param startingBid How much at the minimum should the first bid be
    function safeRegister721Auction_User_Custom(    uint256 tokenID, 
                                        address tokenContractAddress, 
                                        uint256 gbmPreset, 
                                        uint256 startTimestamp, 
                                        uint256 currencyID,
                                        uint256 endTimestamp,
                                        uint256 startingBid) external;

    /// @notice Register a 721 auction and checking for token ownership
    /// @dev The default way to register your auctions one by one
    /// @param tokenIDs And arrau of the token ID of the ERC721 NFT for sale
    /// @param tokenContractAddress The address of the smart contract of the NFT for sale
    /// @param gbmPreset The id of the GBM preset used for this auction. 0 to use the default one.
    /// @param startTimestamp The timestamp of when the auction should start.
    /// @param currencyID The ID of the currency this auction accept. 0 to use the default one.
    function safeRegister721AuctionBatch_User(uint256[] calldata tokenIDs, 
                                        address tokenContractAddress, 
                                        uint256 gbmPreset, 
                                        uint256 startTimestamp, 
                                        uint256 currencyID) external;

    /// @notice Register a 721 auction and checking for token ownership
    /// @dev The default way to register your auctions one by one
    /// @param tokenIDs And arrau of the token ID of the ERC721 NFT for sale
    /// @param tokenContractAddress The address of the smart contract of the NFT for sale
    /// @param gbmPreset The id of the GBM preset used for this auction. 0 to use the default one.
    /// @param startTimestamp The timestamp of when the auction should start.
    /// @param currencyID The ID of the currency this auction accept. 0 to use the default one.
    /// @param endTimestamp When shall the last bid should be accepted
    /// @param startingBid How much at the minimum should the first bid be
    function safeRegister721AuctionBatch_User_Custom(uint256[] calldata tokenIDs, 
                                        address tokenContractAddress, 
                                        uint256 gbmPreset, 
                                        uint256 startTimestamp, 
                                        uint256 currencyID,
                                        uint256 endTimestamp,
                                        uint256 startingBid
                                    ) external;



    /// @notice Register a 1155 auction and check for 1155 token ownership
    /// @dev Make sure that the msg.sender is the wallet address that sent the 1155 tokens in escrow.
    /// @param tokenID The token ID of the ERC721 NFT for sale
    /// @param tokenContractAddress The address of the smart contract of the NFT for sale
    /// @param amount Amount of token to be auctionned off
    /// @param gbmPreset The id of the GBM preset used for this auction. 0 to use the default one.
    /// @param startTimestamp The timestamp of when the auction should start.
    /// @param currencyID The ID of the currency this auction accept. 0 to use the default one.
    function safeRegister1155auction_User(  uint256 tokenID, 
                                        address tokenContractAddress, 
                                        uint256 amount,
                                        uint256 gbmPreset, 
                                        uint256 startTimestamp, 
                                        uint256 currencyID) external;

    /// @notice Register a 1155 auction and check for 1155 token ownership
    /// @dev Make sure that the msg.sender is the wallet address that sent the 1155 tokens in escrow.
    /// @param tokenID The token ID of the ERC721 NFT for sale
    /// @param tokenContractAddress The address of the smart contract of the NFT for sale
    /// @param amount Amount of token to be auctionned off
    /// @param gbmPreset The id of the GBM preset used for this auction. 0 to use the default one.
    /// @param startTimestamp The timestamp of when the auction should start.
    /// @param currencyID The ID of the currency this auction accept. 0 to use the default one.
    /// @param endTimestamp When shall the last bid should be accepted
    /// @param startingBid How much at the minimum should the first bid be
    function safeRegister1155auction_User_Custom(  uint256 tokenID, 
                                        address tokenContractAddress, 
                                        uint256 amount,
                                        uint256 gbmPreset, 
                                        uint256 startTimestamp, 
                                        uint256 currencyID,
                                        uint256 endTimestamp,
                                        uint256 startingBid) external;

    /// @notice Register a 1155 auction and check for 1155 token ownership
    /// @dev Make sure that the msg.sender is the wallet address that sent the 1155 tokens in escrow.
    /// @param tokenIDs The token ID of the ERC721 NFT for sale
    /// @param amounts Amount of token to be auctionned off
    /// @param tokenContractAddress The address of the smart contract of the NFT for sale
    /// @param gbmPreset The id of the GBM preset used for this auction. 0 to use the default one.
    /// @param startTimestamp The timestamp of when the auction should start.
    /// @param currencyID The ID of the currency this auction accept. 0 to use the default one.
    function safeRegister1155auctionBatch_User(  uint256[] calldata tokenIDs, 
                                        uint256[] calldata amounts,
                                        address tokenContractAddress, 
                                        uint256 gbmPreset, 
                                        uint256 startTimestamp, 
                                        uint256 currencyID) external;

    /// @notice Register a 1155 auction and check for 1155 token ownership
    /// @dev Make sure that the msg.sender is the wallet address that sent the 1155 tokens in escrow.
    /// @param tokenIDs The token ID of the ERC721 NFT for sale
    /// @param amounts Amount of token to be auctionned off
    /// @param tokenContractAddress The address of the smart contract of the NFT for sale
    /// @param gbmPreset The id of the GBM preset used for this auction. 0 to use the default one.
    /// @param startTimestamp The timestamp of when the auction should start.
    /// @param currencyID The ID of the currency this auction accept. 0 to use the default one.
    /// @param endTimestamp When shall the last bid should be accepted
    /// @param startingBid How much at the minimum should the first bid be
    function safeRegister1155auctionBatch_User_Custom(  uint256[] calldata tokenIDs, 
                                        uint256[] calldata amounts,
                                        address tokenContractAddress, 
                                        uint256 gbmPreset, 
                                        uint256 startTimestamp, 
                                        uint256 currencyID,
                                        uint256 endTimestamp,
                                        uint256 startingBid) external;


    /// @notice Set wether or not nft from a specific smart contract can be sold on the secondary market
    /// @dev Only callable by GBM Admin
    /// @param NFTContract the addrss of the NFT contract you wish to whitelist/unwhitelist for sale
    /// @param isWhitelistedForSale The token ID of the ERC721 NFT for sale
    function setNFTContractIsWhitelisted(address NFTContract, bool isWhitelistedForSale)external;

    /// @notice Get wether or not nft from a specific smart contract can be sold on the secondary market
    /// @param NFTContract the addrss of the NFT contract you wish to whitelist/unwhitelist for sale
    /// @return isWhitelistedForSale The token ID of the ERC721 NFT for sale
    function getNFTContractIsWhitelisted(address NFTContract) external view returns (bool);
    
    
}