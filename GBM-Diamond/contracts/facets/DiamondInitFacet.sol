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

    function init(uint256 _conf) external {
        LibDiamond.enforceIsContractOwner();

        s.GBMAdminAccount = msg.sender;

        // adding ERC165 data, implementation in DiamondLoupeFacet
        LibDiamond.DiamondStorage storage ds = LibDiamond.diamondStorage();
        ds.supportedInterfaces[type(IERC165).interfaceId] = true; // Introspection
        ds.supportedInterfaces[type(IDiamondCut).interfaceId] = true;
        ds.supportedInterfaces[type(IDiamondLoupe).interfaceId] = true;
        ds.supportedInterfaces[type(IERC173).interfaceId] = true; // Ownable

        /*
        if(_conf == 177013){
            s.defaultCurrency = 1;
            s.currencyNames[1] = "FakETH";
            s.currencyAddress[1] = address(0);
            s.defaultPreset = 1; 
            s.GBMPresets[1] = GBM_preset(600, 300, 300, 5000, 1000, 10000, 11120);
        }

        */

    }

}
