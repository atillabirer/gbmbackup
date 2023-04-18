// SPDX-License-Identifier: UNLICENSED
// © Copyright 2023. Patent pending. All rights reserved. Perpetual Altruism Ltd.
pragma solidity 0.8.19; 

/// @title IGBMCurrencyFacet interface
/// @author Guillaume Gonnaud
interface IGBMCurrencyFacet {
    
    /// @notice Set the name of currency associated with the currency index
    /// @dev Will throw if currencyIndex == 0. Will throw if not called by the GBM admin.
    /// @param currencyIndex The index of the currency you wish to change the name of
    /// @param currencyName The new name of the currency
    function setCurrencyName(uint256 currencyIndex, string calldata currencyName) external;

    /// @notice Get the name of currency associated with the currency index
    /// @dev Will throw if currencyIndex == 0.
    /// @param currencyIndex The index of the currency you wish to know the name of
    /// @return currencyName The name of the currency
    function getCurrencyName(uint256 currencyIndex) external view returns (string memory);

    /// @notice Set the address of the ERC-20 currency associated with the currency index
    /// @dev Will throw if currencyIndex == 0. Will throw if not called by the GBM admin.
    /// To set to native chain currency, set currencyAddress to 0x0.
    /// @param currencyIndex The index of the currency you wish to change the address of
    /// @param currencyAddress The address of the currency. If set to 0x0, it mean that the 
    /// currency is the native chain currency. eg : ETH on Etherum, MATIC on Polygon, etc...
    function setCurrencyAddress(uint256 currencyIndex, address currencyAddress) external;

    /// @notice Get the address of currency associated with the currency index
    /// @dev Will throw if currencyIndex == 0. If currency is the native one, will return 0x0
    /// @param currencyIndex The index of the currency you wish to know the address of
    /// @return currencyAddress The address of the currency
    function getCurrencyAddress(uint256 currencyIndex) external view returns (address);

    /// @notice Set the currency to be used by default if no currency params are specified
    /// @dev /!\ Will also impact live auctions. Beware of unforseen consequences.
    /// @param currencyIndex The index of the currency you wish to be the new default one.
    function setDefaultCurrency(uint256 currencyIndex) external;


}