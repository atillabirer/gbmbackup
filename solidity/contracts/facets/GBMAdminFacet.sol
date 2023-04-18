// SPDX-License-Identifier: UNLICENSED
// © Copyright 2023. Patent pending. All rights reserved. Perpetual Altruism Ltd.
pragma solidity 0.8.19; 

import { LibDiamond } from "../libraries/LibDiamond.sol";
import { IGBMAdminFacet } from "../interfaces/facets/IGBMAdminFacet.sol";
import { GBMStorage, GBM_preset } from "../libraries/GBM_Core.sol";


/// @title GBMAdminFacet Contract
/// @author Guillaume Gonnaud
contract GBMAdminFacet is IGBMAdminFacet {

    GBMStorage internal s;

    modifier onlyAdmin() {
    require(msg.sender == s.GBMAdminAccount, "Function only callable by the GBM admin");
        _;
    }

    /// @notice Set the address of the GBMAdmin
    /// @dev Will throw if not called by the GBM admin OR the Diamond owner.
    /// @param GBMAdmin The address of the new GBM admin
    function setGBMAdmin(address GBMAdmin) external{

        //Right checks
        LibDiamond.DiamondStorage storage ds = LibDiamond.diamondStorage();
        require(msg.sender == s.GBMAdminAccount || msg.sender == ds.contractOwner, "msg.sender not allowed to set a new GBM admin");

        //Setting the new admin
        s.GBMAdminAccount = GBMAdmin;
    }

    /// @notice Get the address of the GBMAdmin
    /// @return GBMAdmin The address of the GBM admin
    function getGBMAdmin() external view returns(address){
        return s.GBMAdminAccount;
    }

    /// @notice Set the parameters of a GBM preset
    /// @dev Will throw if not called by the GBM admin OR the Diamond owner.
    /// @param presetIndex The index of the preset you wish to set
    /// @param auctionDuration How long will the auction last at the minimum
    /// @param hammerTimeDuration How much time a new bid can come in after the last bid at the end of an auction
    /// @param cancellationPeriodDuration How much time does the seller has to cancel the auction at the end of it
    /// @param stepMin The minimal %k increase between two successive bids   
    /// @param incentiveMin The minimal %k incentive reward from a bid
    /// @param incentiveMax The maximal %k incentive reward from a bid
    /// @param bidMultiplier The growth factor in a GBM auction
    function setGBMPreset (
        uint256 presetIndex, 
        uint256 auctionDuration,                // How long will the auction last at the minimum
        uint256 hammerTimeDuration,             // How much time a new bid can come in after the last bid at the end of an auction
        uint256 cancellationPeriodDuration,     // How much time does the seller has to cancel the auction at the end of it
        uint256 stepMin,                        // The minimal %k increase between two successive bids   
        uint256 incentiveMin,                   // The minimal %k incentive reward from a bid
        uint256 incentiveMax,                   // The maximal %k incentive reward from a bid
        uint256 bidMultiplier                   // The growth factor in a GBM auction
    ) external onlyAdmin {

        // Setting the preset
        s.GBMPresets[presetIndex] = GBM_preset({
            auctionDuration:auctionDuration,                
            hammerTimeDuration:hammerTimeDuration,             
            cancellationPeriodDuration:cancellationPeriodDuration,    
            stepMin:stepMin,                        
            incentiveMin:incentiveMin,                   
            incentiveMax:incentiveMax,                 
            bidMultiplier:bidMultiplier  
        });
    }

    /// @notice Get the parameters of a GBM preset
    /// @param presetIndex The index of the preset you wish to get
    /// @return preset The preset at the specified index
    function getGBMPreset(uint256 presetIndex) external view returns(GBM_preset memory){
        return s.GBMPresets[presetIndex];
    }


}