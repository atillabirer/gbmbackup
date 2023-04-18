// SPDX-License-Identifier: UNLICENSED
// © Copyright 2023. Patent pending. All rights reserved. Perpetual Altruism Ltd.
pragma solidity 0.8.19; 

import { GBM_preset } from "../../libraries/GBM_Core.sol";

/// @title IGBMAuctionRegistration interface
/// @author Guillaume Gonnaud
interface IGBMAuctionRegistration {
    
    /// @notice Register a 721 auction without checking for token ownership
    /// @dev Useful for example if you have a custom 721 contract that will mint the token at the end of the auction 
    /// when the safeTransfer function is called. Throw if not called by the GBM admin.
    /// @param tokenID The token ID of the ERC721 NFT for sale
    /// @param tokenContractAddress The address of the smart contract of the NFT for sale
    /// @param gbmPreset The id of the GBM preset used for this auction. 0 to use the default one.
    /// @param startTimestamp The timestamp of when the auction should start.
    /// @param currencyID The ID of the currency this auction accept. 0 to use the default one.
    /// @param beneficiary The address of whom should the proceed from the sales goes to.
    function unsafeRegister721Auction(uint256 tokenID, address tokenContractAddress, uint256 gbmPreset, uint256 startTimestamp, uint256 currencyID, address beneficiary) external;

}