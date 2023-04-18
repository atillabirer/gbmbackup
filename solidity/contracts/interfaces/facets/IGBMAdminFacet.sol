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
    /// @param bidMultiplier The growth factor in a GBM auction
    function setGBMPreset(
        uint256 presetIndex, 
        uint256 auctionDuration,                // How long will the auction last at the minimum
        uint256 hammerTimeDuration,             // How much time a new bid can come in after the last bid at the end of an auction
        uint256 cancellationPeriodDuration,     // How much time does the seller has to cancel the auction at the end of it
        uint256 stepMin,                        // The minimal %k increase between two successive bids   
        uint256 incentiveMin,                   // The minimal %k incentive reward from a bid
        uint256 incentiveMax,                   // The maximal %k incentive reward from a bid
        uint256 bidMultiplier                   // The growth factor in a GBM auction
    ) external;


    /// @notice Get the parameters of a GBM preset
    /// @param presetIndex The index of the preset you wish to get
    /// @return preset The preset at the specified index
    function getGBMPreset(uint256 presetIndex) external view returns(GBM_preset memory);

}