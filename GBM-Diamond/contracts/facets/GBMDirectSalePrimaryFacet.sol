// SPDX-License-Identifier: UNLICENSED
// © Copyright 2023. Patent pending. All rights reserved. Perpetual Altruism Ltd.
pragma solidity 0.8.19; 

import { IGBMDirectSalePrimaryFacet } from "../interfaces/facets/IGBMDirectSalePrimaryFacet.sol";
import "../libraries/GBM_Core.sol";
import { IGBMEventsFacet } from "../interfaces/facets/IGBMEventsFacet.sol";
import { IERC721 } from "../interfaces/IERC721.sol";
import { IERC1155 } from "../interfaces/IERC1155.sol";
import { IERC20 } from "../interfaces/IERC20.sol";


/// @title GBMDirectSalePrimaryFacet Contract
/// @author Guillaume Gonnaud
contract GBMDirectSalePrimaryFacet is IGBMEventsFacet, IGBMDirectSalePrimaryFacet {

    GBMStorage internal s;

    modifier onlyAdmin() {
    require(msg.sender == s.GBMAdminAccount, "Function only callable by the GBM admin");
        _;
    }

    modifier reentrancyProtector() {
        require(!s.reentrancySemaphore, "No Double Dip, kthxbye");
        s.reentrancySemaphore = true;
        _;
        s.reentrancySemaphore = false;
    }


    /// @notice Register a 721 direct sale and checking for token ownership
    /// @dev The regisration will detect if you have the token in escrow or if you own it in your wallet
    /// @param tokenID The token ID of the ERC721 NFT for sale
    /// @param tokenContractAddress The address of the smart contract of the NFT for sale
    /// @param price The amount of currency requested for this sale
    /// @param currencyID The ID of the currency this auction accept. 0 to use the default one.
    /// @param startTimestamp The timestamp of when the sale should start
    /// @param endTimestamp The timestamp of when the sale should expire
    function safeRegister721DirectSale( uint256 tokenID, 
                                        address tokenContractAddress, 
                                        uint256 price, 
                                        uint256 currencyID, 
                                        uint256 startTimestamp,
                                        uint256 endTimestamp
                                    ) external onlyAdmin() {

        if(!(IERC721(tokenContractAddress).ownerOf(tokenID) == msg.sender)){ //If the token is NOT in the sender wallet
            require(IERC721(tokenContractAddress).ownerOf(tokenID) == address(this), "A token must be in your wallet or in escrow if you are putting it up for direct sale"); //then it must be in escrow
        } else { //If the token is in the sender wallet
            require(IERC721(tokenContractAddress).getApproved(tokenID) == address(this) ||  
                    IERC721(tokenContractAddress).isApprovedForAll(msg.sender,  address(this)), 
                    "The GBM diamond contract must approved to transfer the token"); //The GBM smart contract must be an operator

        }

        require(!s.erc721tokensAddressAndIDToUnderSale[tokenContractAddress][tokenID], "This token is already under sale");
        s.erc721tokensAddressAndIDToUnderSale[tokenContractAddress][tokenID] = true;

        registerDirectSaleInternal(     tokenID, 
                                        tokenContractAddress, 
                                        price, 
                                        currencyID, 
                                        msg.sender,
                                        startTimestamp,
                                        endTimestamp,
                                        1,
                                        0x73ad2146,
                                        address(0) //Useless for 721
                                    );
    }

    /// @notice Register a bunch of 721 direct sale and checking for token ownership
    /// @dev The regisration will detect if you have the token in escrow or if you own it in your wallet
    /// @param tokenIDs The token ID of the ERC721 NFT for sale
    /// @param tokenContractAddress The address of the smart contract of the NFT for sale
    /// @param price The amount of currency requested for this sale
    /// @param currencyID The ID of the currency this auction accept. 0 to use the default one.
    /// @param startTimestamp The timestamp of when the sale should start
    /// @param endTimestamp The timestamp of when the sale should expire
    function safeRegister721DirectSale_Batch( uint256[] calldata tokenIDs, 
                                        address tokenContractAddress, 
                                        uint256 price, 
                                        uint256 currencyID, 
                                        uint256 startTimestamp,
                                        uint256 endTimestamp
                                    ) external onlyAdmin() {

        
        uint256 _lgth =  tokenIDs.length;
        for(uint256 i = 0; i < _lgth; ){
            if(!(IERC721(tokenContractAddress).ownerOf(tokenIDs[i]) == msg.sender)){ //If the token is NOT in the sender wallet
                        require(IERC721(tokenContractAddress).ownerOf(tokenIDs[i]) == address(this), "A token must be in your wallet or in escrow if you are putting it up for direct sale"); //then it must be in escrow
                    } else { //If the token is in the sender wallet
                        require(IERC721(tokenContractAddress).getApproved(tokenIDs[i]) == address(this) ||  
                                IERC721(tokenContractAddress).isApprovedForAll(msg.sender,  address(this)), 
                                "The GBM diamond contract must approved to transfer the token"); //The GBM smart contract must be an operator

                    }

                    require(!s.erc721tokensAddressAndIDToUnderSale[tokenContractAddress][tokenIDs[i]], "This token is already under sale");
                    s.erc721tokensAddressAndIDToUnderSale[tokenContractAddress][tokenIDs[i]] = true;

                    registerDirectSaleInternal(     tokenIDs[i], 
                                                    tokenContractAddress, 
                                                    price, 
                                                    currencyID, 
                                                    msg.sender,
                                                    startTimestamp,
                                                    endTimestamp,
                                                    1,
                                                    0x73ad2146,
                                                    address(0) //Useless for 721
                                                );
            unchecked{ i++;}                 
        }
       
    }


    /// @notice Register a 1155 direct sale and checking for token ownership
    /// @dev The regisration will detect if you have the tokens in escrow or if you own them in your wallet
    /// @param tokenID The token ID of the ERC721 NFT for sale
    /// @param tokenContractAddress The address of the smart contract of the NFT for sale
    /// @param price The amount of currency requested for this sale
    /// @param amount The total number of tokens in this sale
    /// @param currencyID The ID of the currency this auction accept. 0 to use the default one.
    /// @param startTimestamp The timestamp of when the sale should start
    /// @param endTimestamp The timestamp of when the sale should expire
    function safeRegister1155DirectSale( uint256 tokenID, 
                                        address tokenContractAddress, 
                                        uint256 price, 
                                        uint256 amount,
                                        uint256 currencyID, 
                                        uint256 startTimestamp,
                                        uint256 endTimestamp
                                    ) external onlyAdmin() {

        address _origin;
        if((s.erc1155tokensAddressAndIDToEscrowerUnderSaleAmount[tokenContractAddress][tokenID][msg.sender] + amount) <= 
          s.erc1155tokensAddressAndIDToEscrowerAmount[tokenContractAddress][tokenID][msg.sender]){ // In the case where there is not enough tokens is escrow
            require(IERC1155(tokenContractAddress).balanceOf(msg.sender, tokenID)  >= 
                    s.erc1155tokensAddressAndIDToOwnerUnderSaleAmount[tokenContractAddress][tokenID][msg.sender] + amount, //Enough token must be owned
                    "You do not own enough tokens to create this sale");
            require(IERC1155(tokenContractAddress).isApprovedForAll(msg.sender, address(this)) , "The GBM diamond has not been granted approval to manipulate your ERC1155 tokens");

            s.erc1155tokensAddressAndIDToOwnerUnderSaleAmount[tokenContractAddress][tokenID][msg.sender] += amount;
            _origin = msg.sender; //The sale will transfer the tokens from the current owner at sale time
        } else {
            _origin= address(this); //The sale will transfer the tokens from the GBM diamond at sale time
            s.erc1155tokensAddressAndIDToEscrowerUnderSaleAmount[tokenContractAddress][tokenID][msg.sender] += amount; //udpating the total number of token undersale
        }
       

        registerDirectSaleInternal(     tokenID, 
                                        tokenContractAddress, 
                                        price, 
                                        currencyID, 
                                        msg.sender,
                                        startTimestamp,
                                        endTimestamp,
                                        amount,
                                        0x973bb640,
                                        _origin
                                    );
    }


    
    /// @notice Register a 1155 direct sale and checking for token ownership
    /// @dev The regisration will detect if you have the tokens in escrow or if you own them in your wallet
    /// @param tokenIDs The token IDs of the ERC721 NFT for sale
    /// @param tokenContractAddress The address of the smart contract of the NFT for sale
    /// @param price The amount of currency requested for this sale
    /// @param amounts The total number of tokens in this sale
    /// @param currencyID The ID of the currency this auction accept. 0 to use the default one.
    /// @param startTimestamp The timestamp of when the sale should start
    /// @param endTimestamp The timestamp of when the sale should expire
    function safeRegister1155DirectSale_Batch( uint256[] calldata tokenIDs, 
                                        address tokenContractAddress, 
                                        uint256 price, 
                                        uint256[] calldata amounts,
                                        uint256 currencyID, 
                                        uint256 startTimestamp,
                                        uint256 endTimestamp
                                    ) external onlyAdmin() {


        uint256 _lgth =  tokenIDs.length;                               
        for(uint256 i = 0; i < _lgth;){

            //For secondary direct sale, need a reentrancy semaphore
            address _origin;
            if((s.erc1155tokensAddressAndIDToEscrowerUnderSaleAmount[tokenContractAddress][tokenIDs[i]][msg.sender] + amounts[i]) <= 
            s.erc1155tokensAddressAndIDToEscrowerAmount[tokenContractAddress][tokenIDs[i]][msg.sender]){ // In the case where there is not enough tokens is escrow
                require(IERC1155(tokenContractAddress).balanceOf(msg.sender, tokenIDs[i])  >= 
                        s.erc1155tokensAddressAndIDToOwnerUnderSaleAmount[tokenContractAddress][tokenIDs[i]][msg.sender] + amounts[i], //Enough token must be owned
                        "You do not own enough tokens to create this sale");
                require(IERC1155(tokenContractAddress).isApprovedForAll(msg.sender, address(this)) , "The GBM diamond has not been granted approval to manipulate your ERC1155 tokens");

                s.erc1155tokensAddressAndIDToOwnerUnderSaleAmount[tokenContractAddress][tokenIDs[i]][msg.sender] += amounts[i];
                _origin = msg.sender; //The sale will transfer the tokens from the current owner at sale time
            } else {
                _origin= address(this); //The sale will transfer the tokens from the GBM diamond at sale time
                s.erc1155tokensAddressAndIDToEscrowerUnderSaleAmount[tokenContractAddress][tokenIDs[i]][msg.sender] += amounts[i]; //udpating the total number of token undersale
            }
        

            registerDirectSaleInternal(     tokenIDs[i], 
                                            tokenContractAddress, 
                                            price, 
                                            currencyID, 
                                            msg.sender,
                                            startTimestamp,
                                            endTimestamp,
                                            amounts[i],
                                            0x973bb640,
                                            _origin
                                        );
            unchecked{ i++;}
        }
    }


    /// @notice Buy all tokens from a direct sale
    /// @param saleID The ID of the sale you wish to buy in it's entirety
    function buyASaleOffer(uint256 saleID) payable external {
      
        buyASaleOfferPartial(saleID, s.saleToTokenAmount[saleID]);

    }

    /// @notice Buy tokens from a direct sale
    /// @param saleID The ID of the sale you wish to buy 
    /// @param amount The amount of token from this sale you wish to buy.
    function buyASaleOfferPartial(uint256 saleID, uint256 amount) reentrancyProtector() payable public{

        {
            require(!s.saleToClaimed[saleID], "This sale has already been fully bought");
            require(block.timestamp < s.saleToEndTimestamp[saleID], "This sale has expired");
            require(block.timestamp > s.saleToStartTimestamp[saleID], "This sale has not yet started");
            require(s.saleToSaleKind[saleID] == 0x00000001, "You cannot accept auctions directy");
            require(amount <= s.saleToTokenAmount[saleID], "This sale doesn't have that much token for sale");
        } //Code block to avoid stack too deep

        //Let's check how much currency we actually need
        uint256 _paidable = (s.saleToPrice[saleID] * amount) / s.saleToTokenAmount[saleID];
        address _beneficiary = s.saleToBeneficiary[saleID];

        //Currency payments
        {
            address _currAddress = s.currencyAddress[s.saleTocurrencyID[saleID]];
            uint256 _mpdue = (_paidable * s.mPlaceGBMFeePercentKage) / DECIMALSK; //Marpetplace share 


            if(_currAddress == address(0x0)){  //Case base currency
                require(msg.value == _paidable, "Please send the correct amount of currency to buy the tokens");

                //Sending money for marketplace share
                (bool succ, ) = s.marketPlaceRoyalty.call{value: _mpdue}("");
                require(
                    succ,
                    "Transfer failed to your marketplace fee account. Wut ?"
                );

                //Sending money for seller
                sendbaseCurrency(_beneficiary, _paidable - _mpdue);

                //Sending money to beneficiary
            } else {
                // Case of an ERC20 token

                //Sending money for marketplace share
                IERC20(_currAddress).transferFrom(
                    msg.sender,
                    s.marketPlaceRoyalty,
                    _mpdue
                );

                //Sending money for seller
                IERC20(_currAddress).transferFrom(
                    msg.sender,
                    _beneficiary,
                    _paidable - _mpdue
                );
            }
        }

        //NFT Token sending
        address _tkc = s.saleToTokenAddress[saleID];
        uint256 _tokenID = s.saleToTokenId[saleID];

        //Case ERC721
        if (s.saleToTokenKind[saleID] == 0x73ad2146) {
 
            s.saleToClaimed[saleID] = true;

            //Get the owner of the asset
            address _from;
            //A properly implemented ERC721 contract should throw if the owner of a token is 0x0. Hence the raw call.
            (bool result, bytes memory data) = _tkc.call(abi.encodeWithSignature("ownerOf(uint256)",s.saleToTokenId[saleID]));

            if (result) {
                _from = abi.decode(data, (address));
            } // No else. A freshly pushed address is initialized to 0x0


            if (_from != msg.sender &&   //Prevent doing a stay in the same place move.
                //Prevent token thievery
                (_from == address(0) || _from == _beneficiary || s.erc721tokensAddressAndIDToEscrower[_tkc][_tokenID] == _beneficiary)
            ) {
              
                IERC721(_tkc).safeTransferFrom(_from, msg.sender, _tokenID);
            } else if (
                _from != _beneficiary
            ) {
                revert("The seller doesn't own the token anymore");
            }

            //If we were keeping track of escrow, unescrow the token
            if (s.erc721tokensAddressAndIDToEscrower[_tkc][_tokenID] != address(0)) {
                s.erc721tokensAddressAndIDToEscrower[_tkc][_tokenID] = address(0);
            }

            s.erc721tokensAddressAndIDToUnderSale[_tkc][_tokenID] = false;

        } else if (s.saleToTokenKind[saleID] == 0x973bb640) {
            //ERC 1155

            //We do a proper throwing safeTransfer
            IERC1155(_tkc).safeTransferFrom(s.saleToSender[saleID], msg.sender, _tokenID, amount, "");

            s.saleToTokenAmount[saleID] -= amount;
            if(s.saleToTokenAmount[saleID] == 0){
                s.saleToClaimed[saleID] = true;
            } else {
                s.saleToPrice[saleID] -= _paidable;
            }

            if (s.saleToSender[saleID] == address(this)) {
                //If keeping tracks of 1155 deposits, undeposit it
                s.erc1155tokensAddressAndIDToEscrowerAmount[_tkc][_tokenID][_beneficiary] -= amount;
                //Remove those tokens from being currently under sale
                s.erc1155tokensAddressAndIDToEscrowerUnderSaleAmount[_tkc][_tokenID][_beneficiary] -=amount;
            } else {
                s.erc1155tokensAddressAndIDToOwnerUnderSaleAmount[_tkc][_tokenID][_beneficiary] -= amount;
            }

        }

        //TODO : Royalty checks

        if(s.saleToClaimed[saleID]){

            emit SaleExecuted(
                saleID,                 // The id of the sale
                _tkc,                   // The address of the contract of the NFT being sold
                _tokenID,               // The ID of the token being sold    
                amount,                 // How many tokens sold at once in this sale
                _paidable,              // The total price for the bundle of token
                0,                      // If the sale is a partial execution, some token will still be left for sale
                0                       // The total price of the remainers tokens
            );

        } else {

            emit SaleExecuted(
                saleID,                             // The id of the sale
                _tkc,                               // The address of the contract of the NFT being sold
                _tokenID,                           // The ID of the token being sold    
                amount,                             // How many tokens sold at once in this sale
                _paidable,                          // The total price for the bundle of token
                s.saleToTokenAmount[saleID],        // If the sale is a partial execution, some token will still be left for sale
                s.saleToPrice[saleID]               // The total price of the remainers tokens
            );

        }


    }


    /// @notice Register a 721 or 1155 direct sale
    /// @param tokenID The token ID of the NFT for sale
    /// @param tokenContractAddress The address of the smart contract of the NFT for sale
    /// @param price The amount of currency requested for this sale
    /// @param currencyID The ID of the currency this auction accept. 0 to use the default one.
    /// @param beneficiary The address of whom should the proceed from the sales goes to.
    /// @param endTimestamp The timestamp of when the sale should expire
    function registerDirectSaleInternal( uint256 tokenID, 
                                        address tokenContractAddress, 
                                        uint256 price, 
                                        uint256 currencyID, 
                                        address beneficiary,
                                        uint256 startTimestamp,
                                        uint256 endTimestamp,
                                        uint256 amount,
                                        bytes4 tokenKind,
                                        address tokenOrigin
                                    ) internal {

        //Incrementing the total number of auction ran
        uint256 _saleID = s.totalNumberOfSales + 1;
        s.totalNumberOfSales = _saleID;



        if(tokenKind == 0x73ad2146){ // case 721
            s.saleToTokenAmount[_saleID] = 1;
            s.saleToTokenKind[_saleID] = 0x73ad2146; //ERC721

            //event emission
            emit SaleRegistration_NewSale(
                _saleID,                        //uint256 indexed saleID,
                tokenContractAddress,           //address indexed tokenContractAddress, 
                tokenID,                        //uint256 indexed tokenID, 
                1,                              //uint256 tokenAmount,
                0x73ad2146, //bytes4 tokenKind,    
                tokenOrigin,
                price, //uint256 price, 
                currencyID, //uint256 currencyID, 
                beneficiary, //address beneficiary,
                startTimestamp, //uint256 startTimestamp,
                endTimestamp //uint256 endTimestamp
            );
        } else { 
            s.saleToTokenAmount[_saleID] = amount;
            s.saleToTokenKind[_saleID] = 0x973bb640; //ERC1155
            s.saleToSender[_saleID] = tokenOrigin;

            //event emission
            emit SaleRegistration_NewSale(
                _saleID,                        //uint256 indexed saleID,
                tokenContractAddress,           //address indexed tokenContractAddress, 
                tokenID,                        //uint256 indexed tokenID, 
                amount,                              //uint256 tokenAmount,
                0x973bb640, //bytes4 tokenKind,   
                tokenOrigin, 
                price, //uint256 price, 
                currencyID, //uint256 currencyID, 
                beneficiary, //address beneficiary,
                startTimestamp, //uint256 startTimestamp,
                endTimestamp //uint256 endTimestamp
            );

        }

        //registering the parameters of the sale
        s.saleToSaleKind[_saleID] = 0x00000001;  
        s.saleToTokenAddress[_saleID]  = tokenContractAddress;

        s.saleToTokenId[_saleID] = tokenID;        
        s.saleTocurrencyID[_saleID] = currencyID;
        s.saleToStartTimestamp[_saleID] = startTimestamp;
        s.saleToEndTimestamp[_saleID] = endTimestamp;
        s.saleToBeneficiary[_saleID] = beneficiary;
        s.saleToPrice[_saleID] = price;

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