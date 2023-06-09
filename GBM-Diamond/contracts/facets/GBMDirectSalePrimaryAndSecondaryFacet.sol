// SPDX-License-Identifier: UNLICENSED
// © Copyright 2023. Patent pending. All rights reserved. Perpetual Altruism Ltd.
pragma solidity 0.8.19; 

import { GBMDirectSalePrimaryFacet } from "./GBMDirectSalePrimaryFacet.sol";
import { IERC721 } from "../interfaces/IERC721.sol";
import { IERC1155 } from "../interfaces/IERC1155.sol";
import { IERC20 } from "../interfaces/IERC20.sol";
import "../libraries/GBM_Core.sol";
import { IGBMDirectSaleSecondaryFacet } from "../interfaces/facets/IGBMDirectSaleSecondaryFacet.sol";


/// @title GBMDirectSalePrimary Contract
/// @author Guillaume Gonnaud
contract GBMDirectSalePrimaryAndSecondaryFacet is GBMDirectSalePrimaryFacet, IGBMDirectSaleSecondaryFacet{


    /// @notice Register a 721 direct sale and checking for token ownership
    /// @dev The regisration will detect if you have the token in escrow or if you own it in your wallet
    /// @param tokenID The token ID of the ERC721 NFT for sale
    /// @param tokenContractAddress The address of the smart contract of the NFT for sale
    /// @param price The amount of currency requested for this sale
    /// @param currencyID The ID of the currency this auction accept. 0 to use the default one.
    /// @param startTimestamp The timestamp of when the sale should start
    /// @param endTimestamp The timestamp of when the sale should expire
    function safeRegister721DirectSale_User( uint256 tokenID, 
                                        address tokenContractAddress, 
                                        uint256 price, 
                                        uint256 currencyID, 
                                        uint256 startTimestamp,
                                        uint256 endTimestamp
                                    ) external reentrancyProtector() {

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
    function safeRegister721DirectSale_User_Batch( uint256[] calldata tokenIDs, 
                                        address tokenContractAddress, 
                                        uint256 price, 
                                        uint256 currencyID, 
                                        uint256 startTimestamp,
                                        uint256 endTimestamp
                                    ) external reentrancyProtector() {

        

        for(uint256 i = 0; i < tokenIDs.length; i++){
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
    function safeRegister1155DirectSale_User( uint256 tokenID, 
                                        address tokenContractAddress, 
                                        uint256 price, 
                                        uint256 amount,
                                        uint256 currencyID, 
                                        uint256 startTimestamp,
                                        uint256 endTimestamp
                                    ) external reentrancyProtector() {

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
    function safeRegister1155DirectSale_User_Batch( uint256[] calldata tokenIDs, 
                                        address tokenContractAddress, 
                                        uint256 price, 
                                        uint256[] calldata amounts,
                                        uint256 currencyID, 
                                        uint256 startTimestamp,
                                        uint256 endTimestamp
                                    ) external reentrancyProtector() {

                                        
        for(uint256 i = 0; i < tokenIDs.length; i++){

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
        }
    }


}