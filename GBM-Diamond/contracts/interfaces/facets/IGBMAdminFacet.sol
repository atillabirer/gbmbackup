// SPDX-License-Identifier: UNLICENSED
// © Copyright 2023. Patent pending. All rights reserved. Perpetual Altruism Ltd.
pragma solidity 0.8.19; 

import { GBM_preset } from "../../libraries/GBM_Core.sol";

/// @title IGBMAdminFacet interface
/// @author Guillaume Gonnaud
interface IGBMAdminFacet {
    

    /// @notice Set the address of the GBMAdmin
    /// @dev Will throw if not called by the GBM admin OR the Diamond owner.
    /// @param GBMAdmin The address of the new GBM admin
    function setGBMAdmin(address GBMAdmin) external;

    /// @notice Get the address of the GBMAdmin
    /// @return GBMAdmin The address of the GBM admin
    function getGBMAdmin() external view returns(address);

    /// @notice Set the parameters of a GBM preset
    /// @dev Will throw if not called by the GBM admin
    /// @param presetIndex The index of the preset you wish to set
    /// @param auctionDuration How long will the auction last at the minimum
    /// @param hammerTimeDuration How much time a new bid can come in after the last bid at the end of an auction
    /// @param cancellationPeriodDuration How much time does the seller has to cancel the auction at the end of it
    /// @param stepMin The minimal %k increase between two successive bids   
    /// @param incentiveMin The minimal %k incentive reward from a bid
    /// @param incentiveMax The maximal %k incentive reward from a bid
    /// @param incentiveGrowthMultiplier The growth factor in a GBM auction
    /// @param firstMinBid The minimal amount of the first bid
    /// @param presetName The name of the preset
    function setGBMPreset(
            uint256 presetIndex,                    // Need to be either already existing or at the open position in the preset arrqy
            uint256 auctionDuration,                // How long will the auction last at the minimum
            uint256 hammerTimeDuration,             // How much time a new bid can come in after the last bid at the end of an auction
            uint256 cancellationPeriodDuration,     // How much time does the seller has to cancel the auction at the end of it
            uint256 stepMin,                        // The minimal %k increase between two successive bids   
            uint256 incentiveMin,                   // The minimal %k incentive reward from a bid
            uint256 incentiveMax,                   // The maximal %k incentive reward from a bid
            uint256 incentiveGrowthMultiplier,      // The growth factor in a GBM auction
            uint256 firstMinBid,                     // The minimal amount of the first bid
            string calldata presetName              // The preset Name
        ) external;



    /// @notice Set the GBM preset used when no preset are specified by auctions
    /// @dev Will throw if not called by the GBM admin
    /// @param presetIndex The index of the preset you wish to set as default
    function setDefaultGBMPreset( uint256 presetIndex) external;


    /// @notice Set the fee structure on your marketplace
    /// @dev Will throw if not called by the GBM admin
    /// @param licensePaidTo The address the GBM license fee is being paid to
    /// @param licensePaidOnChain Is the license paid on chain or trough legacy fiat invoice
    /// @param GBMFeePercentKage How much is the license fee for Gbm auction
    /// @param marketplaceFeeCollectorWallet What is the wallet where you want your profits being sent to
    /// @param mPlaceDirectFeePercentKage How much is your cut for direct sales
    /// @param mPlaceEnglishFeePercentKage How much is your cut for English auctions
    /// @param mPlaceGBMFeePercentKage How much is your cut for GBM auctions
    function setMarketPlaceFeesStructure (
            address licensePaidTo, //0xA7427d0D45e8dd969049872F9cDE383716A39B23
            bool licensePaidOnChain, //true
            uint256 GBMFeePercentKage, // 2000 = 2%
            address marketplaceFeeCollectorWallet,
            uint256 mPlaceDirectFeePercentKage,
            uint256 mPlaceEnglishFeePercentKage,
            uint256 mPlaceGBMFeePercentKage
        )external;

}