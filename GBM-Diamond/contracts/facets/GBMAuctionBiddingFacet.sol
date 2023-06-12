// SPDX-License-Identifier: UNLICENSED
// © Copyright 2023. Patent pending. All rights reserved. Perpetual Altruism Ltd.
pragma solidity 0.8.19;

import {IGBMAuctionBiddingFacet} from "../interfaces/facets/IGBMAuctionBiddingFacet.sol";
import "../libraries/GBM_Core.sol";
import {IERC20} from "../interfaces/IERC20.sol";
import {IERC721} from "../interfaces/IERC721.sol";
import {IERC1155} from "../interfaces/IERC1155.sol";
import {IGBMEventsFacet} from "../interfaces/facets/IGBMEventsFacet.sol";

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
    function bid(
        uint256 auctionID,
        uint256 newBidAmount,
        uint256 previousHighestBidAmount
    ) external payable reentrancyProtector {

        require(s.saleToSaleKind[auctionID] == 0x00000000, "You can only bid() on auctions");

        uint256 _previousBidIndex = s.saleToNumberOfBids[auctionID];

        require(s.saleToStartTimestamp[auctionID] != 0, "Auction doesn't exist");

        //Checking that the previousHighestBidAmount matches
        require(previousHighestBidAmount ==s.saleToBidValues[auctionID][_previousBidIndex],
            "The previous highest bid do not match");

        //Checking that the auction has started
        require( s.saleToStartTimestamp[auctionID] < block.timestamp,
            "The auction has not started yet"  );

        //Checking that the auction has not ended
        require( s.saleToEndTimestamp[auctionID] > block.timestamp,
            "The auction has already ended");

        require(newBidAmount > 1, "newBidAmount cannot be 0");

        uint256 _presetIndex = s.saleToGBMPreset[auctionID];
        if (_presetIndex == 0) {
            _presetIndex = s.defaultPreset;
        }

        //Checking if there was a min BID requirement
        require(s.GBMPresets[_presetIndex].firstMinBid <= newBidAmount,
            "You need to bid higher or equal than the minimum preset bid for this preset");
        
        require(s.saleToPrice[auctionID] <= newBidAmount,
            "You need to bid higher or equal than the minimum bid for this auction");

        //Check the kind of currency used by the auction:
        uint256 _currencyID = s.saleTocurrencyID[auctionID];

        //If the auction doesn't have a registered currency, then use the default currency for the contract
        if (_currencyID == 0) {
            _currencyID = s.defaultCurrency;
        }

        //Fetch the address of the currency used by the auction
        address _currAddress = s.currencyAddress[_currencyID];

        //Case of a native currency : Eth, Matic, etc...
        if (_currAddress == address(0x0)) {
            require(
                msg.value == newBidAmount,
                "The amount of currency sent with the bid do not match the bid"
            );
        } else {
            // Case of an ERC20 token
            //Transfer the money of the bidder to the GBM smart contract
            IERC20(_currAddress).transferFrom( msg.sender, address(this), newBidAmount);
        }

        //Get the current bidIndex and bidamount/incentives
        uint256 _bidIndex = s.saleToNumberOfBids[auctionID];
        uint256 _prevBidAmount = s.saleToBidValues[auctionID][_bidIndex];
        uint256 _dueIncentives = s.saleToBidIncentives[auctionID][_bidIndex];

        if (_bidIndex != 0) {
            //If there is already a previous bid

            emit AuctionBid_Displaced(
                auctionID,
                _bidIndex,
                s.saleToBidders[auctionID][_bidIndex],
                _prevBidAmount,
                _dueIncentives
            );

            //Refunding the bids + the incentives
            if (_currAddress == address(0x0)) {
                //Sending the money in case of base currency
                sendbaseCurrency(
                    s.saleToBidders[auctionID][_bidIndex],
                    _prevBidAmount + _dueIncentives
                );
            } else {
                //Sending the money in case of of ERC20 tokens
                IERC20(_currAddress).transferFrom(
                    address(this),
                    s.saleToBidders[auctionID][_bidIndex],
                    _prevBidAmount + _dueIncentives
                );
            }

            //Recording the increased debt
            s.saleToDebt[auctionID] += _dueIncentives;
        }

        //Increasing the number of bids on the auction
        _bidIndex++;
        s.saleToNumberOfBids[auctionID] = _bidIndex;
        s.saleToBidValues[auctionID][_bidIndex] = newBidAmount;
        _dueIncentives = calculateIncentives(
            auctionID,
            newBidAmount,
            _prevBidAmount
        );
        s.saleToBidIncentives[auctionID][_bidIndex] = _dueIncentives;
        s.saleToBidders[auctionID][_bidIndex] = msg.sender;

        emit AuctionBid_Placed(
            auctionID,
            _bidIndex,
            msg.sender,
            newBidAmount,
            _dueIncentives
        );

        //Extending the auction if bid placed at the end
        if (
            block.timestamp + s.GBMPresets[_presetIndex].hammerTimeDuration >
            s.saleToEndTimestamp[auctionID]
        ) {
            s.saleToEndTimestamp[auctionID] =
                block.timestamp +
                s.GBMPresets[_presetIndex].hammerTimeDuration;

            emit AuctionRegistration_EndTimeUpdated(
                auctionID,
                s.saleToEndTimestamp[auctionID]
            );
        }
    }


    /// @notice Attribute the token and payment to a finished GBM auction
    /// @param auctionID The saleID of the auction you wish to settle
    function claim(uint256 auctionID) external {

        require(s.saleToSaleKind[auctionID] == 0x00000000, "You can only claim auctions");

        require(
            !s.saleToClaimed[auctionID],
            "This auction has already been settled"
        );
        s.saleToClaimed[auctionID] = true;
        uint256 _tokenID = s.saleToTokenId[auctionID];
        uint256 _highestBidIndex = s.saleToNumberOfBids[auctionID];
        address _highestBidder = s.saleToBidders[auctionID][_highestBidIndex];
        address _beneficiary = s.saleToBeneficiary[auctionID];
        address _tkc = s.saleToTokenAddress[auctionID];

        //Check the kind of currency used by the auction:
        uint256 _currencyID = s.saleTocurrencyID[auctionID];

        //If the auction doesn't have a registered currency, then use the default currency for the contract
        if (_currencyID == 0) {
            _currencyID = s.defaultCurrency;
        }

        {
            uint256 _presetIndex = s.saleToGBMPreset[auctionID];
            if (_presetIndex == 0) {
                _presetIndex = s.defaultPreset;
            }

            if(msg.sender != _beneficiary || _highestBidIndex !=0){ //As long as there is no bids, the seller can claim the auction at any time.

                //If there are bids, we need to wait for the end of the auction + grace period
                require(
                    block.timestamp >=
                        s.saleToEndTimestamp[auctionID] +
                            s.GBMPresets[_presetIndex].cancellationPeriodDuration
                        || (msg.sender == _beneficiary && block.timestamp >= s.saleToEndTimestamp[auctionID]),
                    "This auction cannot be claimed yet"
                );
            }
        }

        /*
        event Auction_Claimed(
            uint256 indexed saleID,                 // The id of auction
            address tokenContractAddress,   // The address of the contract of the NFT being auctionned
            uint256 tokenID,                // The ID of the token being auctionned
            uint256 tokenAmount,                    // How many tokens sold at once in this auction
            bytes4 tokenKind,                       // tokenKind = 0x73ad2146 if the token is ERC721, 0x973bb640 if the token is ERC1155
            address beneficiary,                    // Who is the seller that is receiving the profits of the sale
            uint256 winningBidAmount,               // How big was the winning bid
            uint256 winningBidCurrencyIndex,        // In what currency was the winning bid
            address winner                          // What is the adress of the winning bidder
        );
        */

        emit Auction_Claimed(
            auctionID,
            _tkc,
            _tokenID,
            s.saleToTokenAmount[auctionID],
            s.saleToTokenKind[auctionID],
            _beneficiary,
            s.saleToBidValues[auctionID][_highestBidIndex],
            _currencyID,
            _highestBidder
        );

        //Checking for at least a bid
        if (_highestBidIndex != 0) {

            uint256 _debt = s.saleToDebt[auctionID];
            uint256 _pot = s.saleToBidValues[auctionID][_highestBidIndex];
            uint256 _due;

            //Fetch the address of the currency used by the auction
            address _currAddress = s.currencyAddress[_currencyID];

            //Sending money to GBM
            if (
                s.isLicensePaidOnChain &&
                s.saleToBidIncentives[auctionID][1] != 0
            ) {
                //Only send money if this was a gbm auction
                _due = (_pot * s.GBMFeePercentKage) / DECIMALSK;
                _debt += _due;

                if (_currAddress == address(0x0)) {
                    sendbaseCurrency(s.GBMAccount, _due);
                } else {
                    // Case of an ERC20 token
                    //Transfer the money of the bidder to the GBM smart contract
                    IERC20(_currAddress).transferFrom(
                        address(this),
                        s.GBMAccount,
                        _due
                    );
                }
            }

            if(s.saleToBidIncentives[auctionID][1] == 0){ //English auction case
                _due = (_pot * s.mPlaceEnglishFeePercentKage) / DECIMALSK;
            } else { 
                //Sending money to marketplace share
                _due = (_pot * s.mPlaceGBMFeePercentKage) / DECIMALSK;
            }
            _debt += _due;
 
            //Case of a native currency : Eth, Matic, etc...
            if (_currAddress == address(0x0)) {

                (bool succ, ) = s.marketPlaceRoyalty.call{value: _due}("");
                require(
                    succ,
                    "Transfer failed to your marketplace fee account. Wut ?"
                );

            } else {
                // Case of an ERC20 token
                //Transfer the money of the bidder to the GBM smart contract
                IERC20(_currAddress).transferFrom(address(this), s.marketPlaceRoyalty, _due);
            }

            //Sending money to beneficiary aka seller
            _due = _pot - _debt;
            if (_currAddress == address(0x0)) {
                sendbaseCurrency(_beneficiary, _due);
            } else {
                // Case of an ERC20 token
                //Transfer the money of the bidder to the GBM smart contract
                IERC20(_currAddress).transferFrom(address(this), _beneficiary,_due);
            }
        }

        //Transfering the auctionned asset

        //Case ERC721
        if (s.saleToTokenKind[auctionID] == 0x73ad2146) {
            //Get the owner of the asset
            address _from;
            //A properly implemented ERC721 contract should throw if the owner of a token is 0x0. Hence the raw call.
            (bool result, bytes memory data) = _tkc.call(abi.encodeWithSignature("ownerOf(uint256)",s.saleToTokenId[auctionID]));

            if (result) {
                _from = abi.decode(data, (address));
            } // No else. A freshly pushed address is initialized to 0x0

            if (_highestBidIndex == 0) //Case of no bids : send NFT to seller
            {
                _highestBidder = _beneficiary;
            }

            if (_from != _highestBidder) {
                //Prevent doing a stay in the same place move.
                //We do a proper throwing safeTransfer here. Edge case of rogue highestBidder unable to receive the NFT to be handled by a separate function, not Claim.
                IERC721(_tkc).safeTransferFrom(_from, _highestBidder, _tokenID);
            }

            //If we were keeping track of escrow, unescrow it
            if (s.erc721tokensAddressAndIDToEscrower[_tkc][_tokenID] != address(0)) {
                s.erc721tokensAddressAndIDToEscrower[_tkc][_tokenID] = address(0);
                s.erc721tokensAddressAndIDToUnderSale[_tkc][_tokenID] = false;
            }
        } else if (s.saleToTokenKind[auctionID] == 0x973bb640) {
            //ERC 1155
            //In the case of 1155, we always assume the tokens are coming from the diamond contract.

            if (_highestBidIndex == 0) //Case of no bids : send NFT to seller
            {
                _highestBidder = _beneficiary;
            }

            //We do a proper throwing safeTransfer here. Edge case of rogue highestBidder unable to receive the NFT to be handled by a separate function, not Claim.
            IERC1155(_tkc).safeTransferFrom(address(this), _highestBidder, _tokenID, s.saleToTokenAmount[auctionID], "");

            if (s.erc1155tokensAddressAndIDToEscrowerAmount[_tkc][_tokenID][_beneficiary] != 0) {
                //If keeping tracks of 1155 deposits, undeposit it
                s.erc1155tokensAddressAndIDToEscrowerAmount[_tkc][_tokenID][_beneficiary] -= s.saleToTokenAmount[auctionID];
            }

            //Remove those tokens from being currently under sale
            s.erc1155tokensAddressAndIDToEscrowerUnderSaleAmount[_tkc][_tokenID][_beneficiary] -= s.saleToTokenAmount[auctionID];
        }
        //TODO : Royalty checks
    }


    /// @notice During the grace period, a Seller can decide to pay for the incentives to everyone and get back the
    /// nft that was put up for sale
    /// Will throw if called before the auction end, after the grace period end or not called by the _beneficiary (seller)
    /// @param auctionID The saleID of the auction you wish to cancel
    function cancelAuction(
        uint256 auctionID
    ) external payable reentrancyProtector {
        require(
            !s.saleToClaimed[auctionID],
            "This auction has already been settled"
        );
        s.saleToClaimed[auctionID] = true;

        require(s.saleToSaleKind[auctionID] == 0x00000000, "You can only cancelAuction() auctions");

        address _beneficiary = s.saleToBeneficiary[auctionID];

        require(msg.sender == _beneficiary,"Only the seller can cancel the auction");

        address _tkc = s.saleToTokenAddress[auctionID];
        uint256 _tokenID = s.saleToTokenId[auctionID];
        uint256 _highestBidIndex = s.saleToNumberOfBids[auctionID];
        address _highestBidder = s.saleToBidders[auctionID][_highestBidIndex];

        uint256 _presetIndex = s.saleToGBMPreset[auctionID];
        if (_presetIndex == 0) {
            _presetIndex = s.defaultPreset;
        }

        //Checking that the auction AND the grace period is over
        require(block.timestamp >= s.saleToEndTimestamp[auctionID],
            "This auction cannot be cancelled yet"
        );

        require(block.timestamp <=  s.saleToEndTimestamp[auctionID] + s.GBMPresets[_presetIndex].cancellationPeriodDuration,
                "This auction cannot be cancelled anymore"
        );

        //Checking for at least a bid
        if (_highestBidIndex != 0) {
            //Fetch the address of the currency used by the auction
            uint256 _currencyID = s.saleTocurrencyID[auctionID];

            //If the auction doesn't have a registered currency, then use the default currency for the contract
            if (_currencyID == 0) {
                _currencyID = s.defaultCurrency;
            }

            address _currAddress = s.currencyAddress[_currencyID];
            uint256 _prevBidAmount = s.saleToBidValues[auctionID][_highestBidIndex];
            uint256 _dueIncentives = s.saleToBidIncentives[auctionID][_highestBidIndex];
            uint256 _debt = s.saleToDebt[auctionID];

            _debt += _dueIncentives; //The seller need to settle the existing incentives paid out so far + the highest bidder one

            //Case of a native currency : Eth, Matic, etc...
            if (_currAddress == address(0x0)) {
                require(
                    msg.value == _debt,
                    "The amount of currency sent with the cancellation do not match the debt"
                );
            } else {
                // Case of an ERC20 token
                //Transfer the money of the bidder to the GBM smart contract
                IERC20(_currAddress).transferFrom(
                    msg.sender,
                    address(this),
                    _debt
                );
            }

            //Emitting the fact that the previous bid is cancelled
            emit AuctionBid_Displaced(
                auctionID,
                _highestBidIndex,
                _highestBidder,
                _prevBidAmount,
                _dueIncentives
            );

            //Refunding the bids + the incentives
            if (_currAddress == address(0x0)) {
                //Sending the money in case of base currency
                sendbaseCurrency(
                    _highestBidder,
                    _prevBidAmount + _dueIncentives
                );
            } else {
                //Sending the money in case of of ERC20 tokens
                IERC20(_currAddress).transferFrom(
                    address(this),
                    _highestBidder,
                    _prevBidAmount + _dueIncentives
                );
            }

            //Recording the increased debt
            s.saleToDebt[auctionID] += _debt;
        }

        //Case ERC721
        if (s.saleToTokenKind[auctionID] == 0x73ad2146) {
            //Get the owner of the asset
            address _from;
            //A properly implemented ERC721 contract should throw if the owner of a token is 0x0. Hence the raw call.
            (bool result, bytes memory data) = _tkc.call(
                abi.encodeWithSignature(
                    "ownerOf(uint256)",
                    s.saleToTokenId[auctionID]
                )
            );
            if (result) {
                _from = abi.decode(data, (address));
            } // No else. A freshly pushed address is initialized to 0x0

            if (_highestBidIndex == 0) //Case of no bids : send NFT to seller
            {
                _beneficiary = _beneficiary;
            }

            if (_from != _beneficiary) {
                //Prevent doing a stay in the same place move.
                //We do a proper throwing safeTransfer here. Edge case of rogue highestBidder unable to receive the NFT to be handled by a separate function, not Claim.
                IERC721(_tkc).safeTransferFrom(_from, _highestBidder, _tokenID);
            }

            //If we were keeping track of escrow, unescrow it
            if (
                s.erc721tokensAddressAndIDToEscrower[_tkc][_tokenID] !=
                address(0)
            ) {
                s.erc721tokensAddressAndIDToEscrower[_tkc][_tokenID] = address(
                    0
                );
                s.erc721tokensAddressAndIDToUnderSale[_tkc][_tokenID] = false;
            }
        } else if (s.saleToTokenKind[auctionID] == 0x973bb640) {
            //ERC 1155
            //In the case of 1155, we always assume the tokens are coming from the diamond contract.

            //We do a proper throwing safeTransfer here. Edge case of rogue highestBidder unable to receive the NFT to be handled by a separate function, not Claim.
            IERC1155(_tkc).safeTransferFrom(address(this), _beneficiary, _tokenID, s.saleToTokenAmount[auctionID], "");

            if (s.erc1155tokensAddressAndIDToEscrowerAmount[_tkc][_tokenID][_beneficiary] != 0) {
                //If keeping tracks of 1155 deposits, undeposit it
                s.erc1155tokensAddressAndIDToEscrowerAmount[_tkc][_tokenID][_beneficiary] -= s.saleToTokenAmount[auctionID];
            }

            //Remove those tokens from being currently under sale
            s.erc1155tokensAddressAndIDToEscrowerUnderSaleAmount[_tkc][_tokenID][_beneficiary] -= s.saleToTokenAmount[auctionID];
        }
    }


    /// @notice Calculating and setting how much payout a bidder will receive if outbid
    /// @dev Only callable internally
    function calculateIncentives(
        uint256 auctionID,
        uint256 newBidValue,
        uint256 oldBidValue
    ) virtual internal view returns (uint256) {
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

        //Clamping
        if (_decimaledRatio > (DECIMALSK * _bidIncMax)) {
            _decimaledRatio = DECIMALSK * _bidIncMax;
        }

        return (newBidValue * _decimaledRatio) / (DECIMALSK * DECIMALSK);
    }

    /// @notice Function to be used by smart contracts to collect their currency
    function withdraw() external reentrancyProtector {
        (bool succ, ) = msg.sender.call{
            value: s.smartContractsUsersNativeCurrencyBalance[msg.sender]
        }("");
        require(succ, "Transfer failed");
        s.smartContractsUsersNativeCurrencyBalance[msg.sender] = 0;
    }

    function sendbaseCurrency(address to, uint256 amount) internal {
        if (amount == 0) {
            return;
        }
        //For security reasons, smart contract do not get to receive instantly the currency. They have to withdraw it in a separate transaction.
        if (isContract(to)) {
            // A smart contract could pass as a normal wallet at constructor time, but I fail to see any use for this exploit in our case : the worst damage you could do is prevent yourself from bidding.
            // Once other transactions get processed eg: new bids, auction settling, etc... the smart contract will be recognised as such.
            s.smartContractsUsersNativeCurrencyBalance[to] += amount;
        } else {
            (bool succ, ) = to.call{value: amount}("");
            require(
                succ,
                "Transfer failed on a normal wallet. Je beg your pardon ?"
            );
        }
    }

    function isContract(address addr) internal view returns (bool) {
        uint size;
        assembly {
            size := extcodesize(addr)
        }
        return size > 0;
    }
}
