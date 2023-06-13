// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/******************************************************************************\
* Author: Nick Mudge <nick@perfectabstractions.com> (https://twitter.com/mudgen)
* EIP-2535 Diamonds: https://eips.ethereum.org/EIPS/eip-2535
*
* Implementation of a diamond.
/******************************************************************************/

import { LibDiamond } from "../libraries/LibDiamond.sol";
import { IDiamondLoupe } from "../interfaces/IDiamondLoupe.sol";
import { IDiamondCut } from "../interfaces/IDiamondCut.sol";
import { IERC173 } from "../interfaces/IERC173.sol";
import { IERC165 } from "../interfaces/IERC165.sol";
import "../libraries/GBM_Core.sol";

contract DiamondInitFacet {
    GBMStorage internal s;

    function init(uint256 /*_conf */) external {
        LibDiamond.enforceIsContractOwner();

        //GBM admin (the account allowed to create presets, sales, etc)
        s.GBMAdminAccount = msg.sender;

        //Default preset is the first one
        s.defaultPreset = 1;

        // GBM licensing setup
        s.GBMAccount = 0xA7427d0D45e8dd969049872F9cDE383716A39B23;
        s.isLicensePaidOnChain = true;
        s.GBMFeePercentKage = 2000; //2%%

        //Marketplace fees setup
        s.marketPlaceRoyalty = msg.sender; //replace here with your own marketplace wallet address if it's not the deployer
        s.mPlaceDirectFeePercentKage = 5000;  // marketplace take 5% of direct sales
        s.mPlaceEnglishFeePercentKage = 5000;  // marketplace take 5% of english auctions
        s.mPlaceGBMFeePercentKage = 3000; // 3% of GBM sales
   
        // adding ERC165 data, implementation in DiamondLoupeFacet
        LibDiamond.DiamondStorage storage ds = LibDiamond.diamondStorage();
        ds.supportedInterfaces[type(IERC165).interfaceId] = true; // Introspection
        ds.supportedInterfaces[type(IDiamondCut).interfaceId] = true;
        ds.supportedInterfaces[type(IDiamondLoupe).interfaceId] = true;
        ds.supportedInterfaces[type(IERC173).interfaceId] = true; // Ownable

    }

}
