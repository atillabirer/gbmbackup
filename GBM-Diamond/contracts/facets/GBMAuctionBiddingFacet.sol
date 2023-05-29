// SPDX-License-Identifier: UNLICENSED
// © Copyright 2023. Patent pending. All rights reserved. Perpetual Altruism Ltd.
pragma solidity 0.8.19; 

import { IGBMAuctionBiddingFacet } from "../interfaces/facets/IGBMAuctionBiddingFacet.sol";
import "../libraries/GBM_Core.sol";
import { IERC20 } from "../interfaces/IERC20.sol";
import { IERC721 } from "../interfaces/IERC721.sol";
import { IGBMEventsFacet } from "../interfaces/facets/IGBMEventsFacet.sol";

/// @title GBMAuctionBiddingFacet Contract
/// @author Guillaume Gonnaud
contract GBMAuctionBiddingFacet is IGBMAuctionBiddingFacet, IGBMEventsFacet {

    GBMStorage internal s;

    modifier reentrancyProtector() {
        require(!s.reentrancySemaphore, "No Double Dip, kthxbye");
        s.reentrancySemaphore = true;
            _;
        s.reentrancySemaphore = false;
    }


    /// @notice Place a bid on a live GBM Auction
    /// @dev The currency being used is the default currency of the auction
    /// @param auctionID The auctionID the bid is placed upon
    /// @param newBidAmount The amount of the new bid
    /// @param previousHighestBidAmount The amount of the previous highest bid
    function bid(uint256 auctionID, uint256 newBidAmount, uint256 previousHighestBidAmount) external payable reentrancyProtector(){

        uint256 _previousBidIndex = s.saleToNumberOfBids[auctionID];

        require(s.saleToStartTimestamp[auctionID] != 0, "Auction doesn't exist");

        //Checking that the previousHighestBidAmount matches
        require(previousHighestBidAmount == s.saleToBidValues[auctionID][_previousBidIndex], "The previous highest bid do not match");

        //Checking that the auction has started
        require(s.saleToStartTimestamp[auctionID] < block.timestamp, "The auction has not started yet");

        //Checking that the auction has not ended
        require(s.saleToEndTimestamp[auctionID] > block.timestamp, "The auction has already ended");

        require(newBidAmount > 1, "newBidAmount cannot be 0");

        //Check the kind of currency used by the auction:
        uint256 _currencyID = s.saleTocurrencyID[auctionID];   

        //If the auction doesn't have a registered currency, then use the default currency for the contract
        if(_currencyID == 0){
            _currencyID = s.defaultCurrency;
        }

        //Fetch the address of the currency used by the auction
        address _currAddress = s.currencyAddress[_currencyID];

        //Case of a native currency : Eth, Matic, etc...
        if(_currAddress == address(0x0)){
            require(msg.value == newBidAmount, "The amount of currency sent with the bid do not match the bid");
        } else {
            // Case of an ERC20 token
            //Transfer the money of the bidder to the GBM smart contract
            IERC20(_currAddress).transferFrom(msg.sender, address(this), newBidAmount);
        }

        //Get the current bidIndex and bidamount/incentives
        uint256 _bidIndex = s.saleToNumberOfBids[auctionID];
        uint256 _prevBidAmount = s.saleToBidValues[auctionID][_bidIndex];
        uint256 _dueIncentives = s.saleToBidIncentives[auctionID][_bidIndex];

        if(_bidIndex != 0){ //If there is already a previous bid
           
            emit AuctionBid_Displaced(auctionID, _bidIndex, s.saleToBidders[auctionID][_bidIndex], _prevBidAmount, _dueIncentives);

            //Refunding the bids + the incentives
            if(_currAddress == address(0x0)){
                //Sending the money in case of base currency
                sendbaseCurrency(s.saleToBidders[auctionID][_bidIndex], _prevBidAmount + _dueIncentives);

            } else {
                //Sending the money in case of of ERC20 tokens
                IERC20(_currAddress).transferFrom(address(this), s.saleToBidders[auctionID][_bidIndex], _prevBidAmount + _dueIncentives);
            }

            //Recording the increased debt
            s.saleToDebt[auctionID] += _dueIncentives;
        }

        //Increasing the number of bids on the auction
        _bidIndex++;
        s.saleToNumberOfBids[auctionID] = _bidIndex;
        s.saleToBidValues[auctionID][_bidIndex] = newBidAmount;
        _dueIncentives = calculateIncentives(auctionID, newBidAmount, _prevBidAmount);
        s.saleToBidIncentives[auctionID][_bidIndex] = _dueIncentives;
        s.saleToBidders[auctionID][_bidIndex] = msg.sender;


        emit AuctionBid_Placed(auctionID, _bidIndex, msg.sender, newBidAmount, _dueIncentives);


        uint256 _presetIndex = s.saleToGBMPreset[auctionID];

        if(_presetIndex == 0){
            _presetIndex = s.defaultPreset;
        }

        //Extending the auction if bid placed at the end
        if(block.timestamp + s.GBMPresets[_presetIndex].hammerTimeDuration > s.saleToEndTimestamp[auctionID]){
            s.saleToEndTimestamp[auctionID] = block.timestamp + s.GBMPresets[_presetIndex].hammerTimeDuration;

            emit AuctionRegistration_EndTimeUpdated(auctionID, s.saleToEndTimestamp[auctionID]);
        }
 
    }


    /// @notice Attribute the token and payment to a finished GBM auction
    /// @param auctionID The saleID of the auction you wish to settle
    function claim(uint256 auctionID) external {
        require(!s.saleToClaimed[auctionID], "This auction has already been settled");
        s.saleToClaimed[auctionID] = true;
        uint256 _presetIndex = s.saleToGBMPreset[auctionID];
        uint256 _tokenID = s.saleToTokenId[auctionID];
        uint256 _highestBidIndex = s.saleToNumberOfBids[auctionID];
        address _highestBidder = s.saleToBidders[auctionID][_highestBidIndex];
        uint256 _debt = s.saleToDebt[auctionID];

        //Checking that the auction AND the grace period is over
        require(block.timestamp >= s.saleToEndTimestamp[auctionID] + s.GBMPresets[_presetIndex].cancellationPeriodDuration, "This auction cannot be claimed yet");

        //Checking for at least a bid
        if(_highestBidIndex != 0){
            uint256 _pot = s.saleToBidValues[auctionID][_highestBidIndex];
            uint256 _due;

            //Check the kind of currency used by the auction:
            uint256 _currencyID = s.saleTocurrencyID[auctionID];   

            //If the auction doesn't have a registered currency, then use the default currency for the contract
            if(_currencyID == 0){
                _currencyID = s.defaultCurrency;
            }

            //Fetch the address of the currency used by the auction
            address _currAddress = s.currencyAddress[_currencyID];

            //Sending money to GBM
            if(s.isLicensePaidOnChain && s.saleToBidIncentives[auctionID][1] != 0){ //Only send money if this was a gbm auction
                _due = (_pot * s.GBMFeePercentKage) / DECIMALSK;
                _debt += _due;

                if(_currAddress == address(0x0)){
                    sendbaseCurrency(s.GBMAccount, _due);
                } else { // Case of an ERC20 token
                    //Transfer the money of the bidder to the GBM smart contract
                    IERC20(_currAddress).transferFrom(address(this), s.GBMAccount, _due);
                }
            }

            //Sending money to marketplace share
            _due = (_pot * s.mPlaceGBMFeePercentKage) / DECIMALSK;
            _debt += _due;

            //Case of a native currency : Eth, Matic, etc...
            if(_currAddress == address(0x0)){
                sendbaseCurrency(s.marketPlaceRoyalty, _due);
            } else {    // Case of an ERC20 token
                //Transfer the money of the bidder to the GBM smart contract
                IERC20(_currAddress).transferFrom( address(this), s.marketPlaceRoyalty, _due);
            }

            //Sending money to beneficiary aka seller
            _due = _pot - _debt;
             if(_currAddress == address(0x0)){
                   sendbaseCurrency(s.saleToBeneficiary[auctionID], _due);
            } else { // Case of an ERC20 token
                //Transfer the money of the bidder to the GBM smart contract
                IERC20(_currAddress).transferFrom(address(this), s.GBMAccount, _due);
            }
        }

        //Transfering the auctionned asset

        //Case ERC721
        if(s.saleToTokenKind[auctionID] == 0x73ad2146){
            //Get the owner of the asset
            address _from;
            //A properly implemented ERC721 contract should throw if the owner of a token is 0x0. Hence the raw call.
            (bool result, bytes memory data ) = s.saleToTokenAddress[auctionID].call(abi.encodeWithSignature("ownerOf(uint256)", s.saleToTokenId[auctionID]));
            if(result){
                _from = abi.decode(data, (address));
            } // No else. A freshly pushed address is initialized to 0x0

            if(_highestBidIndex == 0) //Case of no bids : send NFT to seller
            {
                _highestBidder = s.saleToBeneficiary[auctionID];
            }

            if(_from != _highestBidder){ //Prevent doing a stay in the same place move.
                //We do a proper throwing safeTransfer here. Edge case of rogue highestBidder unable to receive the NFT to be handled by a separate function, not Claim.
                IERC721(s.saleToTokenAddress[auctionID]).safeTransferFrom(_from, _highestBidder, _tokenID);
            }

            //If we were keeping track of escrow, unescrow it
            if(s.erc721tokensAddressAndIDToEscrower[s.saleToTokenAddress[auctionID]][_tokenID] != address(0)){
                s.erc721tokensAddressAndIDToEscrower[s.saleToTokenAddress[auctionID]][_tokenID] = address(0);
            }
  
        } else if(s.saleToTokenKind[auctionID] == 0x973bb640){ //ERC 1155  //TODO
            //Get the owner of the asset
            address _from;
            //A properly implemented ERC721 contract should throw if the owner of a token is 0x0. Hence the raw call.
            (bool result, bytes memory data ) = s.saleToTokenAddress[auctionID].call(abi.encodeWithSignature("ownerOf(uint256)", s.saleToTokenId[auctionID]));
            if(result){
                //_from = address(uint160(bytes20(data)));
               // _from = bytesToAddress(data);
            } // No else. A freshly pushed address is initialized to 0x0

            if(_highestBidIndex == 0) //Case of no bids : send NFT to seller
            {
                _highestBidder = s.saleToBeneficiary[auctionID];
            }

            if(_from != _highestBidder){ //Prevent doing a stay in the same place move.
                //We do a proper throwing safeTransfer here. Edge case of rogue highestBidder unable to receive the NFT to be handled by a separate function, not Claim.
                IERC721(s.saleToTokenAddress[auctionID]).safeTransferFrom(_from, _highestBidder, _tokenID);
            }

            //If we were keeping track of escrow, unescrow it
            if(s.erc721tokensAddressAndIDToEscrower[s.saleToTokenAddress[auctionID]][_tokenID] != address(0)){
                s.erc721tokensAddressAndIDToEscrower[s.saleToTokenAddress[auctionID]][_tokenID] = address(0);
            }
  
        }

        //TODO: Events
        //TODO : Royalty checks

    }

    function bytesToAddress(bytes memory bys) private pure returns (address addr) {
        assembly {
            addr := mload(add(bys,20))
        } 
    }

    
    /// @notice Calculating and setting how much payout a bidder will receive if outbid
    /// @dev Only callable internally
    function calculateIncentives(uint256 auctionID, uint256 newBidValue, uint256 oldBidValue) internal view returns (uint256) {
        uint256 _presetIndex = s.saleToGBMPreset[auctionID];

        if(_presetIndex == 0){
            _presetIndex = s.defaultPreset;
        }

        uint256 _bidIncMax = s.GBMPresets[_presetIndex].incentiveMax;

        //Init the baseline bid we need to perform against
        uint256 _baseBid = oldBidValue * (DECIMALSK + s.GBMPresets[_presetIndex].stepMin) / DECIMALSK;

        require(_baseBid <= newBidValue, "newBidValue doesn't meet the minimal step above the previous bid");

        //If no bids are present, set a basebid value of 1 to prevent divide by 0 errors
        if(_baseBid == 0) {
            _baseBid = 1;
        }
        //Ratio of newBid compared to expected minBid
        uint256 _decimaledRatio = ((DECIMALSK * s.GBMPresets[_presetIndex].incentiveGrowthMultiplier * (newBidValue - _baseBid) ) / _baseBid) + s.GBMPresets[_presetIndex].incentiveMin * DECIMALSK;

        //Clamping
        if(_decimaledRatio > (DECIMALSK * _bidIncMax)) {
            _decimaledRatio = DECIMALSK * _bidIncMax;
        }

        return  (newBidValue * _decimaledRatio)/(DECIMALSK*DECIMALSK);
    }


    /// @notice Function to be used by smart contracts to collect their currency
    function withdraw() external reentrancyProtector(){
        (bool succ, ) = msg.sender.call{value: s.smartContractsUsersNativeCurrencyBalance[msg.sender] }("");
        require(succ, "Transfer failed");
        s.smartContractsUsersNativeCurrencyBalance[msg.sender] = 0;
    }

    function sendbaseCurrency(address to, uint256 amount) internal{

        if(amount == 0){return;}
        //For security reasons, smart contract do not get to receive instantly the currency. They have to withdraw it in a separate transaction.
        if(isContract(to)){
            // A smart contract could pass as a normal wallet at constructor time, but I fail to see any use for this exploit in our case : the worst damage you could do is prevent yourself from bidding.
            // Once other transactions get processed eg: new bids, auction settling, etc... the smart contract will be recognised as such.
            s.smartContractsUsersNativeCurrencyBalance[to] += amount;
        } else {
            (bool succ, ) = to.call{value: amount }("");
            require(succ, "Transfer failed on a normal wallet. Je beg your pardon ?");
        }
    }

    function isContract(address addr) internal view returns (bool) {
        uint size;
        assembly { size := extcodesize(addr) }
        return size > 0;
    }
}