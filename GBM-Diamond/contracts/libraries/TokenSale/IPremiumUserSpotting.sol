// SPDX-License-Identifier: UNLICENSED
// © Copyright 2023. Patent pending. All rights reserved. Perpetual Altruism Ltd.
pragma solidity ^0.8.19;


/// @dev Interface for the NFT Royalty Standard
interface IPremiumUserSpotting {

    //To be isntanced on the xStellaContract
    function balanceOF(address) external view returns(uint256);

    //To be instanced on the dual stacking contract
    function userInfo(uint256, address) external view returns(uint256, uint256, uint256, uint256);

    /*

    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "userInfo",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "rewardDebt",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "rewardLockedUp",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "nextHarvestUntil",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    */
}
