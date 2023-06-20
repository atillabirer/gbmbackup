// SPDX-License-Identifier: UNLICENSED
// © Copyright 2023. Patent pending. All rights reserved. Perpetual Altruism Ltd.
pragma solidity 0.8.19; 

import { GBM_Interface } from "../../interfaces/GBM_Interface.sol";



/// @title IGBM_Interface_TokenSale
/// @dev Use this to generate ABIs or to interact with the diamond in general. It contains all the functions, even those you chose to disable.
/// @author Guillaume Gonnaud
interface IGBM_Interface_TokenSale is  GBM_Interface {

    function setTokenSaleTierConfig(address STELLA_xStellaContract, address STELLA_dualFarmContract, uint256 STELLA_tierLimit) external;

    function getTokenSaleTierConfig()  external view returns (address STELLA_xStellaContract, address STELLA_dualFarmContract, uint256 STELLA_tierLimit);
    
}