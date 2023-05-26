// SPDX-License-Identifier: UNLICENSED
// © Copyright 2023. Patent pending. All rights reserved. Perpetual Altruism Ltd.
pragma solidity 0.8.19; 

import { GBM_preset } from "../../libraries/GBM_Core.sol";

/// @title IGBMAdminFacet interface
/// @author Guillaume Gonnaud
interface IGBMEventsFacet {


    /// ********************************************
    /// *************** Admin Events ***************
    /// ********************************************

    /// @dev This event emits whenever a preset is registered/modified
    event GBMPreset_Updated(
        uint256 indexed presetID, 
        uint256 auctionDuration, 
        uint256 hammerTimeDuration, 
        uint256 cancellationPeriodDuration, 
        uint256 stepMin,
        uint256 incentiveMin,
        uint256 incentiveMax,
        uint256 incentiveGrowthMultiplier
    );

    /// @dev This event emits whenever a default preset is set
    event GBMPreset_DefaultUpdated(
        uint256 indexed presetID 
    );

    /// ***********************************************
    /// *************** Currency Events ***************
    /// ***********************************************

    /// @dev This event emits whenever a currency name is registered/modified
    event Currency_NameUpdated(
        uint256 indexed currencyIndex, 
        string currencyName
    );

    
    /// @dev This event emits whenever a currency address is registered/modified
    /// If currencyAddress == address(0), then this is the native Chain currency (eg: Eth, Matic, GLMR)
    /// If currencyAddress != address(0), then this is an ERC20 token (eg: USDC, WETH)
    event Currency_AddressUpdated(
        uint256 indexed currencyIndex, 
        address currencyAddress
    );

    /// @dev This event emits whenever the default currency is being set to a new one
    event Currency_DefaultUpdated(
        uint256 indexed currencyIndex,
        address currencyAddress,
        string currencyName
    );


    /// ***********************************************************
    /// *************** Auction Registration Events ***************
    /// ***********************************************************

    /// @dev This event emits whenever a new auction has been registered individually
    event AuctionRegistration_NewAuction(
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

    event AuctionRegistration_EndTimeUpdated(
        uint256 indexed saleID,
        uint256 endTimeStamp
    );


    /// ***************************************************
    /// ******************* Bids Events *******************
    /// ***************************************************

    /// @dev This event emits whenever a bid is being placed
    event AuctionBid_Placed(
        uint256 indexed saleID,                 // The id of auction
        uint256 indexed bidIndex,               // The Index of the bid being placed
        address bidder,                         // The address of the bidder placing a bid
        uint256 bidamount,                      // The value of the bid being placed
        uint256 incentivesDue                   // How much incentive will be earned if this bid is displaced
    );

    /// @dev This event emits whenever a bid is being displaced (cancelled because someone outbid it)
    event AuctionBid_Displaced(
        uint256 indexed saleID,                 // The id of auction
        uint256 indexed bidIndex,               // The Index of the bid being displaced
        address bidder,                         // The address of the bidder being displaced
        uint256 bidamount,                      // The value of the bid being displaced
        uint256 incentivesPaid                  // How much incentive was earned with this bid
    );





}