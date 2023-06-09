// SPDX-License-Identifier: UNLICENSED
// © Copyright 2023. Patent pending. All rights reserved. Perpetual Altruism Ltd.
pragma solidity 0.8.19;

import {GBM_preset} from "../../libraries/GBM_Core.sol";

/// @title IGBMAdminFacet interface
/// @author Guillaume Gonnaud
interface IGBMAuctionBiddingFacet {
    /// @notice Place a bid on a live GBM Auction
    /// @dev The currency being used is the default currency of the auction
    /// @param auctionID The auctionID the bid is placed upon
    /// @param newBidAmount The amount of the new bid
    /// @param previousHighestBidAmount The amount of the previous highest bid
    function bid(
        uint256 auctionID,
        uint256 newBidAmount,
        uint256 previousHighestBidAmount
    ) external payable;

    /// @notice Attribute the token and payment to a finished GBM auction
    /// @param auctionID The saleID of the auction you wish to settle
    function claim(uint256 auctionID) external;

    /// @notice During the grace period, a Seller can decide to pay for the incentives to everyone and get back the
    /// nft that was put up for sale
    /// Will throw if called before the auction end, after the grace period end or not called by the _beneficiary (seller)
    /// @param auctionID The saleID of the auction you wish to cancel
    function cancelAuction(uint256 auctionID) external payable;

    /// @notice Function to be used by smart contracts to collect their currency
    function withdraw() external;
}
