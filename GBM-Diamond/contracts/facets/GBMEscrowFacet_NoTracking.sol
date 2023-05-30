// SPDX-License-Identifier: UNLICENSED
// © Copyright 2023. Patent pending. All rights reserved. Perpetual Altruism Ltd.
pragma solidity 0.8.19; 

import { IERC721TokenReceiver } from "../interfaces/IERC721TokenReceiver.sol";
import { IERC1155TokenReceiver } from "../interfaces/IERC1155TokenReceiver.sol";
import { GBMStorage } from "../libraries/GBM_Core.sol";
import { IGBMEventsFacet } from "../interfaces/facets/IGBMEventsFacet.sol";

/// @title GBMEscrowFacet Contract
/// @author Guillaume Gonnaud
contract GBMEscrowFacet_NoTracking is IGBMEventsFacet, IERC721TokenReceiver, IERC1155TokenReceiver {

    function onERC721Received(address /* _operator */, address /* _from */, uint256 /* _tokenID */, bytes calldata /* _data */) external pure returns(bytes4) {
        return bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"));
    }

    function onERC1155Received(address /* _operator */, address /* _from */, uint256 /* _id */, uint256 /* _value */, bytes calldata /* _data */) external pure returns(bytes4) {
        return bytes4(keccak256("onERC1155Received(address,address,uint256,uint256,bytes)"));
    }

   
    function onERC1155BatchReceived(address /* _operator */, address /* _from */, uint256[] calldata /* _ids */, uint256[] calldata /* _values */, bytes calldata /* _data */) external pure returns(bytes4) {
        return bytes4(keccak256("onERC1155BatchReceived(address,address,uint256[],uint256[],bytes)"));
    }    

}