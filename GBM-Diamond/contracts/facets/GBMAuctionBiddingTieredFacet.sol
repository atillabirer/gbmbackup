// SPDX-License-Identifier: UNLICENSED
// © Copyright 2023. Patent pending. All rights reserved. Perpetual Altruism Ltd.
pragma solidity 0.8.19; 

import { GBMAuctionBiddingFacet } from "./GBMAuctionBiddingFacet.sol";
import { IERC721 } from "../interfaces/IERC721.sol";
import { IERC1155 } from "../interfaces/IERC1155.sol";
import { IERC20 } from "../interfaces/IERC20.sol";
import { IPremiumUserSpotting } from "../libraries/TokenSale/IPremiumUserSpotting.sol";
import "../libraries/GBM_Core.sol";



/// @title GBMDirectSalePrimary Contract
/// @author Guillaume Gonnaud
/// @notice This facet is purpose built for a client that wented higher incentive reward for some of it's users
contract GBMAuctionBiddingTieredFacet is GBMAuctionBiddingFacet{

    /// @notice Calculating and setting how much payout a bidder will receive if outbid
    /// @dev Only callable internally
    function calculateIncentives(
        uint256 auctionID,
        uint256 newBidValue,
        uint256 oldBidValue
    ) internal override view returns (uint256) {
        uint256 _presetIndex = s.saleToGBMPreset[auctionID];

        if (_presetIndex == 0) {
            _presetIndex = s.defaultPreset;
        }

        uint256 _bidIncMax = s.GBMPresets[_presetIndex].incentiveMax;

        //Init the baseline bid we need to perform against
        uint256 _baseBid = (oldBidValue *
            (DECIMALSK + s.GBMPresets[_presetIndex].stepMin)) / DECIMALSK;

        require(
            _baseBid <= newBidValue,
            "newBidValue doesn't meet the minimal step above the previous bid"
        );

        //If no bids are present, set a basebid value of 1 to prevent divide by 0 errors
        if (_baseBid == 0) {
            _baseBid = 1;
        }
        //Ratio of newBid compared to expected minBid
        uint256 _decimaledRatio = ((DECIMALSK *
            s.GBMPresets[_presetIndex].incentiveGrowthMultiplier *
            (newBidValue - _baseBid)) / _baseBid) +
            s.GBMPresets[_presetIndex].incentiveMin *
            DECIMALSK;

        if(checkIsPremium(msg.sender)){ //Implement msg.sender == premium user here, fine to hardcode smart contract address
            _decimaledRatio += 500 * DECIMALSK; //0.5% bonus  /!\ Make sure you deploy the right presets that we gave you, as the default presets are severly impacted by this
        }

        //Clamping
        if (_decimaledRatio > (DECIMALSK * _bidIncMax)) {
            _decimaledRatio = DECIMALSK * _bidIncMax;
        }

        return (newBidValue * _decimaledRatio) / (DECIMALSK * DECIMALSK);
    }

    function checkIsPremium(address _user) internal view returns (bool){
      
        (uint256 _amount, uint256 _b, uint256 _c, uint256  _d) = IPremiumUserSpotting(s.STELLA_dualFarmContract).userInfo(3, _user);

        _amount += IPremiumUserSpotting(s.STELLA_xStellaContract).balanceOF(_user);

        return (_amount >= s.STELLA_tierLimit);

    }


    function setTokenSaleTierConfig(address STELLA_xStellaContract, address STELLA_dualFarmContract, uint256 STELLA_tierLimit) external {
        require(msg.sender == s.GBMAdminAccount, "Function only callable by the GBM admin");

        s.STELLA_xStellaContract = STELLA_xStellaContract;
        s.STELLA_dualFarmContract = STELLA_dualFarmContract;
        s.STELLA_tierLimit = STELLA_tierLimit;
    }

    function getTokenSaleTierConfig()  external view returns (address, address, uint256){
        return ( s.STELLA_xStellaContract, s.STELLA_dualFarmContract, s.STELLA_tierLimit);
    }

}