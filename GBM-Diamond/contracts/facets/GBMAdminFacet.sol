// SPDX-License-Identifier: UNLICENSED
// © Copyright 2023. Patent pending. All rights reserved. Perpetual Altruism Ltd.
pragma solidity 0.8.19; 

import { LibDiamond } from "../libraries/LibDiamond.sol";
import { IGBMAdminFacet } from "../interfaces/facets/IGBMAdminFacet.sol";
import { IGBMEventsFacet } from "../interfaces/facets/IGBMEventsFacet.sol";
import "../libraries/GBM_Core.sol";


/// @title GBMAdminFacet Contract
/// @author Guillaume Gonnaud
contract GBMAdminFacet is IGBMEventsFacet, IGBMAdminFacet {

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
    function setGBMPreset (
        uint256 presetIndex, 
        uint256 auctionDuration,                // How long will the auction last at the minimum
        uint256 hammerTimeDuration,             // How much time a new bid can come in after the last bid at the end of an auction
        uint256 cancellationPeriodDuration,     // How much time does the seller has to cancel the auction at the end of it
        uint256 stepMin,                        // The minimal %k increase between two successive bids   
        uint256 incentiveMin,                   // The minimal %k incentive reward from a bid
        uint256 incentiveMax,                   // The maximal %k incentive reward from a bid
        uint256 incentiveGrowthMultiplier,      // The growth factor in a GBM auction
        uint256 firstMinBid,                    // The minimal amount of the first bid
        string calldata presetName              // The name of the preset
    ) external onlyAdmin {

        require((s.GBMPresetsAmount+1) >= presetIndex, "Preset doesn't exist or is too far ahead in the index to be added");

        require(stepMin >= incentiveMax, "To guarantee liquidity, please make so that stepMin >= incentiveMax");

        // Setting the preset
        s.GBMPresets[presetIndex] = GBM_preset({
            auctionDuration:auctionDuration,                
            hammerTimeDuration:hammerTimeDuration,             
            cancellationPeriodDuration:cancellationPeriodDuration,    
            stepMin:stepMin,                        
            incentiveMin:incentiveMin,                   
            incentiveMax:incentiveMax,                 
            incentiveGrowthMultiplier:incentiveGrowthMultiplier,
            firstMinBid: firstMinBid  
        });

        s.GBMPresetName[presetIndex] = presetName;

        if(presetIndex > s.GBMPresetsAmount){ //id expanding the pseudo array
            s.GBMPresetsAmount++;
        }

        // Emit the preset updated event
        emit GBMPreset_Updated(
            presetIndex,
            auctionDuration,
            hammerTimeDuration,
            cancellationPeriodDuration,
            stepMin,
            incentiveMin,
            incentiveMax,
            incentiveGrowthMultiplier,
            firstMinBid,
            presetName
        );

    }

    /// @notice Set the GBM preset used when no preset are specified by auctions
    /// @dev Will throw if not called by the GBM admin
    /// @param presetIndex The index of the preset you wish to set as default
    function setDefaultGBMPreset( uint256 presetIndex) external onlyAdmin {
          s.defaultPreset = presetIndex; 
    }



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
    )external onlyAdmin {
        // GBM licensing setup
        s.GBMAccount = licensePaidTo;
        s.isLicensePaidOnChain = licensePaidOnChain;
        s.GBMFeePercentKage = GBMFeePercentKage; //2%%

        //Marketplace fees setup
        s.marketPlaceRoyalty =marketplaceFeeCollectorWallet;
        s.mPlaceDirectFeePercentKage = mPlaceDirectFeePercentKage;  
        s.mPlaceEnglishFeePercentKage = mPlaceEnglishFeePercentKage;  
        s.mPlaceGBMFeePercentKage = mPlaceGBMFeePercentKage;
    }

}