// SPDX-License-Identifier: UNLICENSED
// © Copyright 2022. All rights reserved. Perpetual Altruism Ltd.
pragma solidity ^0.8.19; 

import "../interfaces/IERC20.sol";
import "../interfaces/IERC165.sol";

/// @author Guillaume Gonnaud 2020
/// @title ERC20 Generic placeholder smart contract for testing and ABI
contract ERC20Generic is IERC20, IERC165  {

    string public name; // Returns the name of the token - e.g. "Generic ERC20".
    string public symbol; // Returns the symbol of the token. E.g. GEN20.
    uint8 public decimals; // Returns the number of decimals the token uses - e.g. 8, means to divide the token amount by 100000000 to get its user representation.
    uint256 public override totalSupply; //Returns the total token supply.
    mapping(address => uint256) public override balanceOf; //Returns the account balance of another account with address _owner.
    mapping(address => mapping(address => uint256)) internal individualAllowance; // Mapping of allowance per owner/spender
    mapping(bytes4 => bool) supportedInterfaces;


    /// @notice Constructor
    /// @dev Please change the values in here if you want more specific values, or make the constructor takes arguments
    constructor()
    {
        name = "Generic ERC20";
        symbol = "GEN20";
        decimals = 18; //Same as ETH

        supportedInterfaces[type(IERC165).interfaceId] = true;
        supportedInterfaces[0x01ffc9a7] = true; //ERC165
        supportedInterfaces[0x36372b07] = true; //ERC20

        require(bytes4(0x36372b07) != type(IERC20).interfaceId, "Interface ID do not match");
    }


    /// @notice Transfer a _value amount of ERC token from msg.sender to _to
    /// Throw if msg.sender doesn't have enough tokens
    /// @param _to The address of the recipient
    /// @param _value The amount of token to send
    /// @return success true if success, throw if failed
    function transfer(address _to, uint256 _value) public override returns (bool success){
        require(balanceOf[msg.sender] >= _value, "transfer: msg.sender balance is too low");
        balanceOf[msg.sender] = balanceOf[msg.sender] - _value;
        balanceOf[_to] = balanceOf[_to] + _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }


    /// @notice Transfer a _value amount of ERC token from _drom to _to. 
    /// Only work if msg.sender == from or if msg.sender allowance < value
    /// Throw if _from doesn't have enough tokens
    /// @param _from The address of the account being removed tokens
    /// @param _to The address of the account being given tokens
    /// @param _value The amount of token to send
    /// @return success true if success, throw if failed
    function transferFrom(address _from, address _to, uint256 _value) public override returns (bool success){
        require(balanceOf[_from] >= _value, "transferFrom: _from balance is too low");
        require(individualAllowance[_from][msg.sender] >= _value || msg.sender == _from, "transferFrom: msg.sender allowance with _from is too low");
        if( msg.sender != _from){
            individualAllowance[_from][msg.sender] = individualAllowance[_from][msg.sender] - _value;
        }
        balanceOf[_from] = balanceOf[_from] - _value;
        balanceOf[_to] = balanceOf[_to] + _value;
        emit Transfer(_from, _to, _value);
        return true;
    }


    /// @notice Approve an amount of token _spender can spend on behalf of msg.sender
    /// @param _spender The address of the account being approved for tokens
    /// @param _value The amount of token to be spent in total
    /// @return success true if success
    function approve(address _spender, uint256 _value) public override returns (bool success){
        individualAllowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }


    /// @notice get the approved amount of token _spender can spend on behalf of _owner
    /// @param _owner The address of the account being approved for tokens
    /// @param _spender The amount of token to be spent in total
    /// @return remaining the allowance of _spender on behalf of _owner
    function allowance(address _owner, address _spender) public view  override returns (uint256 remaining){
        return individualAllowance[_owner][_spender];
    }


    /// @notice Mint _value tokens for msg.sender
    /// Function not present in ERC20 spec : allow for the minting of a token for test purposes
    /// @param _value Amount of tokens to mint
    function mint( uint256 _value) public {
        balanceOf[msg.sender] = balanceOf[msg.sender] + _value;
        totalSupply += _value;
    }

    /// @notice Query if a contract implements an interface
    /// @param interfaceID The interface identifier, as specified in ERC-165
    /// @dev Interface identification is specified in ERC-165. This function
    ///  uses less than 30,000 gas.
    /// @return `true` if the contract implements `interfaceID` and
    ///  `interfaceID` is not 0xffffffff, `false` otherwise
    function supportsInterface(bytes4 interfaceID) external override view returns (bool){
        return (supportedInterfaces[interfaceID]);
    }

    
}