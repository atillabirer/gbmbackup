// SPDX-License-Identifier: UNLICENSED
// © Copyright 2023. Patent pending. All rights reserved. Perpetual Altruism Ltd.
pragma solidity 0.8.19; 

import { IERC721TokenReceiver } from "../interfaces/IERC721TokenReceiver.sol";
import { IERC1155TokenReceiver } from "../interfaces/IERC1155TokenReceiver.sol";
import { GBMStorage } from "../libraries/GBM_Core.sol";
import { IGBMEventsFacet } from "../interfaces/facets/IGBMEventsFacet.sol";

/// @title GBMEscrowFacet Contract
/// @author Guillaume Gonnaud
contract GBMEscrowFacet_Tracking is IGBMEventsFacet, IERC721TokenReceiver, IERC1155TokenReceiver {

    GBMStorage internal s;

    function onERC721Received(address /* _operator */, address  _from, uint256 _tokenID, bytes calldata /* _data */) external returns(bytes4) {
        s.erc721tokensAddressAndIDToEscrower[msg.sender][_tokenID] = _from;
        return bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"));
    }

    function onERC1155Received(address /* _operator */, address _from, uint256 _id, uint256 _value, bytes calldata /* _data */) external returns(bytes4) {
        s.erc1155tokensAddressAndIDToEscrowerAmount[msg.sender][_id][_from] += _value;
        return bytes4(keccak256("onERC1155Received(address,address,uint256,uint256,bytes)"));
    }

   
    function onERC1155BatchReceived(address /* _operator */, address _from, uint256[] calldata  _ids, uint256[] calldata _values, bytes calldata /* _data */) external returns(bytes4) {

        for (uint i; i < _ids.length; i++) {
            s.erc1155tokensAddressAndIDToEscrowerAmount[msg.sender][_ids[i]][_from] += _values[i];
        }

        return bytes4(keccak256("onERC1155BatchReceived(address,address,uint256[],uint256[],bytes)"));
    }    

}
