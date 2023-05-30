// SPDX-License-Identifier: UNLICENSED
// © Copyright 2023. Patent pending. All rights reserved. Perpetual Altruism Ltd.
pragma solidity 0.8.19; 

import { IGBMGettersFacet } from "../interfaces/facets/IGBMGettersFacet.sol";
import "../libraries/GBM_Core.sol";

/// @title GBMGettersFacet Contract
/// @author Guillaume Gonnaud
contract GBMGettersFacet is IGBMGettersFacet {

    GBMStorage internal s;

    /// @notice get the address to which all marketplace royalties are paid to.
    /// @return marketPlaceRoyalty
    function getMarketPlaceRoyalty() external view returns(address){
        return s.marketPlaceRoyalty;
    }

    /// @notice get how much the marketplace take as a percentkage in case of a settled GBM auction
    /// @return mPlaceGBMFeePercentKage
    function getmPlaceGBMFeePercentKage() external view returns(uint256){
        return s.mPlaceGBMFeePercentKage;
    }

    /// @notice get how much the marketplace take as a percentkage in case of a settled GBM auction
    /// @return mPlaceEnglishFeePercentKage
    function getmPlaceEnglishFeePercentKage() external view returns(uint256){
        return s.mPlaceEnglishFeePercentKage;
    }

    /// @notice get the address to which the GBM License fee is being paid
    /// @return GBMAccount
    function getGBMAccount() external view returns(address){
        return s.GBMAccount;
    }

    /// @notice get the boolean controlling if the license fee is paid at settlement time in tokens or separately off-chain
    /// @return isLicensePaidOnChain
    function getIsLicensePaidOnChain() external view returns(bool){
        return s.isLicensePaidOnChain;
    }

    /// @notice get how much %k is the GBM license fee of a settled auction
    /// @return GBMFeePercentKage
    function getGBMFeePercentKage() external view returns(uint256){
        return s.GBMFeePercentKage;
    }

    /// @notice All calculation granularity are done to the 10th of basis point (DECIMALSK parts per unit)
    /// @return percentKage
    function getpercentKage() external pure returns(uint256){
        return 100000;
    }

    /// @notice Get a preset usable by auctions on the marketplace
    /// @param index The index of the preset you wish to inspect
    /// @return GBMPreset the gbm preset
    function getGBMPreset(uint256 index) external view returns(GBM_preset memory){
        return s.GBMPresets[index];
    }

    /// @notice Get the total number of presets registered in the GBM diamond
    /// @return amount the gbm presets amount
    function getGBMPresetsAmount() external view returns(uint256){
        return s.GBMPresetsAmount;
    }

    /// @notice Get a preset's name: 
    /// @param index The index of the preset you wish to inspect
    /// @return name the name of the GBM preset
    function getGBMPreset_Name(uint256 index) external view returns(string memory){
        return s.GBMPresetName[index];
    }

    /// @notice Get a preset's auctionDuration: 
    /// @param index The index of the preset you wish to inspect
    /// @return auctionDuration How long will the auction last at the minimum
    function getGBMPreset_AuctionDuration(uint256 index) external view returns(uint256){
        return s.GBMPresets[index].auctionDuration;
    }

    /// @notice Get a preset's hammerTimeDuration
    /// @param index The index of the preset you wish to inspect
    /// @return hammerTimeDuration How much time a new bid can come in after the last bid at the end of an auction
    function getGBMPreset_HammerTimeDuration(uint256 index) external view returns(uint256){
        return s.GBMPresets[index].hammerTimeDuration;
    }

    /// @notice Get a preset's cancellationPeriodDuration
    /// @param index The index of the preset you wish to inspect
    /// @return cancellationPeriodDuration How much time does the seller has to cancel the auction at the end of it
    function getGBMPreset_CancellationPeriodDuration(uint256 index) external view returns(uint256){
        return s.GBMPresets[index].cancellationPeriodDuration;
    }

    /// @notice Get a preset's stepMin
    /// @param index The index of the preset you wish to inspect
    /// @return stepMin The minimal %k increase between two successive bids   
    function getGBMPreset_StepMin(uint256 index) external view returns(uint256){
        return s.GBMPresets[index].stepMin;
    }

    /// @notice Get a preset's incentiveMin
    /// @param index The index of the preset you wish to inspect
    /// @return incentiveMin The minimal %k incentive reward from a bid
    function getGBMPreset_IncentiveMin(uint256 index) external view returns(uint256){
        return s.GBMPresets[index].incentiveMin;
    }

    /// @notice Get a preset's incentiveMax
    /// @param index The index of the preset you wish to inspect
    /// @return incentiveMax The maximal %k incentive reward from a bid
    function getGBMPreset_IncentiveMax(uint256 index) external view returns(uint256){
        return s.GBMPresets[index].incentiveMax;
    }

    
    /// @notice Get a preset's incentiveGrowthMultiplier
    /// @param index The index of the preset you wish to inspect
    /// @return incentiveGrowthMultiplier  // The growth factor in a GBM auction
    function getGBMPreset_IncentiveGrowthMultiplier(uint256 index) external view returns(uint256){
        return s.GBMPresets[index].incentiveGrowthMultiplier;
    }
 
    /// @notice get which preset is the default one used by auctions if none is specified
    /// @return defaultPreset
    function getGBMPresetDefault() external view returns(uint256){
        return s.defaultPreset;
    }

     
    /// @notice get the total number of sales ran by the contract so far
    /// @return totalNumberOfSales
    function getTotalNumberOfSales() external view returns(uint256){
        return s.totalNumberOfSales;
    }

    /// @notice get the kind of sale (GBM, English or direct) a sale is
    /// @param saleID The ID of the sale you wish to know the details of
    /// @return saleKind  0x0 = GBM sale, 0x1 = English Auction, 0x2 = Direct Sale
    function getSale_SaleKind(uint256 saleID) external view returns(bytes4){
        return s.saleToSaleKind[saleID];
    }

    /// @notice get the address of the NFT tokens that are being sold in a sale
    /// @param saleID The ID of the sale you wish to know the details of
    /// @return tokenAddress  0x0 = GBM sale, 0x1 = English Auction, 0x2 = Direct Sale
    function getSale_TokenAddress(uint256 saleID) external view returns(address){
        return s.saleToTokenAddress[saleID];
    }

    /// @notice get the tokenID of the NFT tokens that are being sold in a sale
    /// @param saleID The ID of the sale you wish to know the details of
    /// @return tokenID the tokenID of the NFT tokens that are being sold in a sale
    function getSale_TokenID(uint256 saleID) external view returns(uint256){
        return s.saleToTokenId[saleID];
    }

    /// @notice get the amount of the NFT tokens that are being sold in a sale
    /// @param saleID The ID of the sale you wish to know the details of
    /// @return tokenAmount the amount of the NFT tokens that are being sold in a sale
    function getSale_TokenAmount(uint256 saleID) external view returns(uint256){
        return s.saleToTokenAmount[saleID];
    }

    /// @notice get the kind (ERC721 or 1155) of the NFT tokens that are being sold in a sale
    /// @param saleID The ID of the sale you wish to know the details of
    /// @return kind 0x73ad2146 if the token is ERC721, 0x973bb640 if the token is ERC1155
    function getSale_TokenKind(uint256 saleID) external view returns(bytes4){
        return s.saleToTokenKind[saleID];
    }

    /// @notice get the index of the GBM preset used by the sale
    /// @param saleID The ID of the sale you wish to know the details of
    /// @return GBMPresetIndex 0 mean that the sale is using the default GBM preset
    function getSale_GBMPresetIndex(uint256 saleID) external view returns(uint256){
        return s.saleToGBMPreset[saleID];
    }

    /// @notice get the index of the GBM preset used by the sale
    /// @param saleID The ID of the sale you wish to know the details of
    /// @return GBMPresetIndex 0 mean that the sale is using the default GBM preset
    function getSale_GBMPreset(uint256 saleID) external view returns(GBM_preset memory){

        //Getting the sale GBM preset index
        uint256 _index = s.saleToGBMPreset[saleID];

        //If the sale is using the default preset, fetch it
        if(_index == 0){
            _index = s.defaultPreset;
        }
        return  s.GBMPresets[_index];
    }

    /// @notice Get an auction preset's auctionDuration
    /// @param saleID The ID of the sale you wish to know the details of
    /// @return auctionDuration How long will the auction last at the minimum
    function getSale_GBMPreset_AuctionDuration(uint256 saleID) external view returns(uint256){

        //Getting the sale GBM preset index
        uint256 _index = s.saleToGBMPreset[saleID];

        //If the sale is using the default preset, fetch it
        if(_index == 0){
            _index = s.defaultPreset;
        }
        return s.GBMPresets[_index].auctionDuration;
    }

    /// @notice Get an auction preset's hammerTimeDuration
    /// @param saleID The ID of the sale you wish to know the details of
    /// @return hammerTimeDuration How much time a new bid can come in after the last bid at the end of an auction
    function getSale_GBMPreset_HammerTimeDuration(uint256 saleID) external view returns(uint256){

        //Getting the sale GBM preset index
        uint256 _index = s.saleToGBMPreset[saleID];

        //If the sale is using the default preset, fetch it
        if(_index == 0){
            _index = s.defaultPreset;
        }
        return s.GBMPresets[_index].hammerTimeDuration;
    }

    /// @notice Get an auction preset's cancellationPeriodDuration
    /// @param saleID The ID of the sale you wish to know the details of
    /// @return cancellationPeriodDuration How much time does the seller has to cancel the auction at the end of it
    function getSale_GBMPreset_CancellationPeriodDuration(uint256 saleID) external view returns(uint256){

        //Getting the sale GBM preset index
        uint256 _index = s.saleToGBMPreset[saleID];

        //If the sale is using the default preset, fetch it
        if(_index == 0){
            _index = s.defaultPreset;
        }
        return s.GBMPresets[_index].cancellationPeriodDuration;
    }

    /// @notice Get an auction preset's stepMin
    /// @param saleID The ID of the sale you wish to know the details of
    /// @return stepMin The minimal %k increase between two successive bids   
    function getSale_GBMPreset_StepMin(uint256 saleID) external view returns(uint256){

        //Getting the sale GBM preset index
        uint256 _index = s.saleToGBMPreset[saleID];

        //If the sale is using the default preset, fetch it
        if(_index == 0){
            _index = s.defaultPreset;
        }
        return s.GBMPresets[_index].stepMin;
    }

    /// @notice Get an auction preset's incentiveMin
    /// @param saleID The ID of the sale you wish to know the details of
    /// @return incentiveMin The minimal %k incentive reward from a bid
    function getSale_GBMPreset_IncentiveMin(uint256 saleID) external view returns(uint256){

        //Getting the sale GBM preset index
        uint256 _index = s.saleToGBMPreset[saleID];

        //If the sale is using the default preset, fetch it
        if(_index == 0){
            _index = s.defaultPreset;
        }
        return s.GBMPresets[_index].incentiveMin;
    }

    /// @notice Get an auction preset's incentiveMax
    /// @param saleID The ID of the sale you wish to know the details of
    /// @return incentiveMax The maximal %k incentive reward from a bid
    function getSale_GBMPreset_IncentiveMax(uint256 saleID) external view returns(uint256){

        //Getting the sale GBM preset index
        uint256 _index = s.saleToGBMPreset[saleID];

        //If the sale is using the default preset, fetch it
        if(_index == 0){
            _index = s.defaultPreset;
        }
        return s.GBMPresets[_index].incentiveMax;
    }

    /// @notice Get an auction preset's incentiveGrowthMultiplier
    /// @param saleID The ID of the sale you wish to know the details of
    /// @return incentiveGrowthMultiplier The growth factor in a GBM auction
    function getSale_GBMPreset_IncentiveGrowthMultiplier(uint256 saleID) external view returns(uint256){

        //Getting the sale GBM preset index
        uint256 _index = s.saleToGBMPreset[saleID];

        //If the sale is using the default preset, fetch it
        if(_index == 0){
            _index = s.defaultPreset;
        }
        return s.GBMPresets[_index].incentiveGrowthMultiplier;
    }

    /// @notice Get the sale's currencyID
    /// @param saleID The ID of the sale you wish to know the details of
    /// @return currencyID The currencyID bsed by the auction. 0 for default.
    function getSale_CurrencyID(uint256 saleID) external view returns(uint256){
        return s.saleTocurrencyID[saleID];
    }

    /// @notice Get the sale's currencyID
    /// @param saleID The ID of the sale you wish to know the details of
    /// @return currencyName The currencyName used by the auction
    function getSale_Currency_Name(uint256 saleID) external view returns(string memory){

        //Getting the sale currency index
        uint256 _index = s.saleTocurrencyID[saleID];

        //If the sale is using the default preset, fetch it
        if(_index == 0){
            _index = s.defaultCurrency;
        }

        return s.currencyNames[_index];
    }

    /// @notice Get the sale's currency token address
    /// @param saleID The ID of the sale you wish to know the details of
    /// @return currencyAddress The currencyAddress used by the auction. 0x0 mean base currency (ETH/MATIC/GLMR)
    function getSale_Currency_Address(uint256 saleID) external view returns(address){

        //Getting the sale currency index
        uint256 _index = s.saleTocurrencyID[saleID];

        //If the sale is using the default preset, fetch it
        if(_index == 0){
            _index = s.defaultCurrency;
        }

        return s.currencyAddress[_index];
    }

    /// @notice Get the sale's startTimestamp
    /// @param saleID The ID of the sale you wish to know the details of
    /// @return startTimestamp When is a sale starting to accept bids/offers
    function getSale_StartTimestamp(uint256 saleID) external view returns(uint256){
        return s.saleToStartTimestamp[saleID];
    }

    /// @notice Get the sale's endTimestamp
    /// @param saleID The ID of the sale you wish to know the details of
    /// @return endTimestamp When is a refusing any more bids
    function getSale_EndTimestamp(uint256 saleID) external view returns(uint256){
        return s.saleToEndTimestamp[saleID];
    }

    /// @notice Get the sale's beneficiary (usually the seller)
    /// @param saleID The ID of the sale you wish to know the details of
    /// @return beneficiary The address of the beneficiary of a sale
    function getSale_Beneficiary(uint256 saleID) external view returns(address){
        return s.saleToBeneficiary[saleID];
    }

    
    /// @notice Get the sale's GBM debt
    /// @param saleID The ID of the sale you wish to know the details of
    /// @return debt The amount of currency distributed in incentives
    function getSale_Debt(uint256 saleID) external view returns(uint256){
        return s.saleToDebt[saleID];
    }

    /// @notice Get the sale's specified bid value
    /// @param saleID The ID of the sale you wish to know the details of
    /// @param bidIndex The position of the bid you wish to know the details of. Starts at 1.
    /// @return value The value of the bid at the specified index, expressed in the auction base currency
    function getSale_Bid_Value(uint256 saleID, uint256 bidIndex) external view returns(uint256){
        return s.saleToBidValues[saleID][bidIndex];
    }

    /// @notice Get the sale's specified bid bidder
    /// @param saleID The ID of the sale you wish to know the details of
    /// @param bidIndex The position of the bid you wish to know the details of. Starts at 1.
    /// @return bidder The address of the bidder
    function getSale_Bid_Bidder(uint256 saleID, uint256 bidIndex) external view returns(address){
        return s.saleToBidders[saleID][bidIndex];
    }

    /// @notice Get the sale's specified bid due incentive
    /// @param saleID The ID of the sale you wish to know the details of
    /// @param bidIndex The position of the bid you wish to know the details of. Starts at 1.
    /// @return incentive The value of the incentive if outbid of the bid at the specified index, expressed in the auction base currency
    function getSale_Bid_Incentive(uint256 saleID, uint256 bidIndex) external view returns(uint256){
        return s.saleToBidIncentives[saleID][bidIndex];
    }

    /// @notice Get the sale's bid currency index
    /// @param saleID The ID of the sale you wish to know the details of
    /// @param bidIndex The position of the bid you wish to know the details of. Starts at 1.
    /// @return currencyIndex The currency index of the currency the bid was made in.
    function getSale_Bid_CurrencyIndex(uint256 saleID, uint256 bidIndex) external view returns(uint256){
        return s.saleToBidCurrencies[saleID][bidIndex];
    }

    
    /// @notice Get the sale's bid currency address
    /// @param saleID The ID of the sale you wish to know the details of
    /// @param bidIndex The position of the bid you wish to know the details of. Starts at 1.
    /// @return currencyAddress The currency address of the currency the bid was made in. 0 is base currency (ETH/MATIC/GLMR)
    function getSale_Bid_Currency_Address(uint256 saleID, uint256 bidIndex) external view returns(address){

        //Getting the sale currency index
        uint256 _index = s.saleToBidCurrencies[saleID][bidIndex];

        //If the sale is using the default preset, fetch it
        if(_index == 0){
            _index = s.defaultCurrency;
        }

        return s.currencyAddress[_index];
    }

    /// @notice Get the sale's bid currency name
    /// @param saleID The ID of the sale you wish to know the details of
    /// @param bidIndex The position of the bid you wish to know the details of. Starts at 1.
    /// @return currencyName The currency index of the currency the bid was made in.
    function getSale_Bid_Currency_Name(uint256 saleID, uint256 bidIndex) external view returns(string memory){

        //Getting the sale currency index
        uint256 _index = s.saleToBidCurrencies[saleID][bidIndex];

        //If the sale is using the default preset, fetch it
        if(_index == 0){
            _index = s.defaultCurrency;
        }

        return s.currencyNames[_index];
    }

    /// @notice Get the sale's highest bid value
    /// @param saleID The ID of the sale you wish to know the details of
    /// @return value The value of the bid at the specified index, expressed in the auction base currency
    function getSale_HighestBid_Value(uint256 saleID) external view returns(uint256){
        uint256 _bidindex = s.saleToNumberOfBids[saleID];
        return s.saleToBidValues[saleID][_bidindex];
    }

    /// @notice Get the sale's highest bid bidder
    /// @param saleID The ID of the sale you wish to know the details of
    /// @return bidder The address of the bidder
    function getSale_HighestBid_Bidder(uint256 saleID) external view returns(address){
        uint256 _bidindex = s.saleToNumberOfBids[saleID];
        return s.saleToBidders[saleID][_bidindex];
    }

    /// @notice Get the sale's highest bid due incentive
    /// @param saleID The ID of the sale you wish to know the details of
    /// @return incentive The value of the incentive if outbid of the bid at the specified index, expressed in the auction base currency
    function getSale_HighestBid_Incentive(uint256 saleID) external view returns(uint256){
        uint256 _bidindex = s.saleToNumberOfBids[saleID];
        return s.saleToBidIncentives[saleID][_bidindex];
    }

    /// @notice Get the sale's bid highest index
    /// @param saleID The ID of the sale you wish to know the details of
    /// @return currencyIndex The currency index of the currency the bid was made in.
    function getSale_HighestBid_CurrencyIndex(uint256 saleID) external view returns(uint256){
        uint256 _bidindex = s.saleToNumberOfBids[saleID];
        return s.saleToBidCurrencies[saleID][_bidindex];
    }

    
    /// @notice Get the sale's highest bid currency address
    /// @param saleID The ID of the sale you wish to know the details of
    /// @return currencyAddress The currency address of the currency the bid was made in. 0 is base currency (ETH/MATIC/GLMR)
    function getSale_HighestBid_Currency_Address(uint256 saleID) external view returns(address){
        uint256 _bidindex = s.saleToNumberOfBids[saleID];

        //Getting the sale currency index
        uint256 _index = s.saleToBidCurrencies[saleID][_bidindex];

        //If the sale is using the default preset, fetch it
        if(_index == 0){
            _index = s.defaultCurrency;
        }

        return s.currencyAddress[_index];
    }

    /// @notice Get the sale's highest bid currency name
    /// @param saleID The ID of the sale you wish to know the details of
    /// @return currencyName The currency index of the currency the bid was made in.
    function getSale_HighestBid_Currency_Name(uint256 saleID) external view returns(string memory){
        uint256 _bidindex = s.saleToNumberOfBids[saleID];

        //Getting the sale currency index
        uint256 _index = s.saleToBidCurrencies[saleID][_bidindex];

        //If the sale is using the default preset, fetch it
        if(_index == 0){
            _index = s.defaultCurrency;
        }

        return s.currencyNames[_index];
    }

    /// @notice Get the sale's total number of subsequent bids
    /// @param saleID The ID of the sale you wish to know the details of
    /// @return numberOdBids The number of bids made in this auction
    function getSale_NumberOfBids (uint256 saleID) external view returns(uint256){
        return s.saleToNumberOfBids[saleID];
    }


    /// @notice Get the withdrawable balance a smart contract user has
    /// @param smartContract The address of the smart contract that own a balance on the GBM smart contract.
    /// @return balance How much base currency can be withdrawn using withdraw()
    function getSmartContractsUsersNativeCurrencyBalance (address smartContract) external view returns(uint256){
        return s.smartContractsUsersNativeCurrencyBalance[smartContract];
    }

    /// @notice Get the claimed status of a sale
    /// @param saleID The ID of the sale you wish to know the details of
    /// @return claimed Wether or not a sale have already been settled
    function getSmartContractsUsersNativeCurrencyBalance (uint256 saleID) external view returns(bool){
        return s.saleToClaimed[saleID];
    }
    

}