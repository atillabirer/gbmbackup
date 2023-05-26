// SPDX-License-Identifier: UNLICENSED
// © Copyright 2022. All rights reserved. Perpetual Altruism Ltd.
pragma solidity ^0.8.19;

import "../interfaces/IERC721.sol";
import "../interfaces/IERC721TokenReceiver.sol";
import "../interfaces/IERC165.sol";

/// @author Guillaume Gonnaud 2021
/// @title ERC721 Generic placeholder smart contract for testing and ABI
contract ERC721Generic is IERC721, IERC165 {

    string public name; // Returns the name of the token - e.g. "Generic ERC721".
    string public symbol; // Returns the symbol of the token. E.g. GEN721.
    mapping(address => uint256) public override balanceOf; //The number of token an address own
    uint256 public totalSupply; //The total amount of minted tokens
    mapping(uint256 => string) tokenURIs;

    address public owner;

    mapping(uint256 => address) internal ownerOfVar;
    mapping(uint256 => address) internal approvedTransferAddress; //Address allowed to Transfer a token
    mapping(address => mapping(address => bool)) internal approvedOperator; //Approved operators mapping: owner => operator => allowed?

    mapping(bytes4 => bool) supportedInterfaces;

    /// @notice Constructor
    /// @dev Please change the values in here if you want more specific values, or make the constructor takes arguments
    constructor(string memory _name, string memory _symbol)
    {
        owner = msg.sender;
        name = _name;
        symbol = _symbol;

        supportedInterfaces[0x2a55205a] = true; //Royalty standard ERC2981
        supportedInterfaces[0x80ac58cd] = true; //ERC721
        supportedInterfaces[0x5b5e139f] = true; //ERC721Metadata  support (NFT images/json)
        supportedInterfaces[0x01ffc9a7] = true; //ERC165
        
        
    }   

    /// @notice Find the owner of an NFT
    /// @dev NFTs assigned to zero address are considered invalid, and queries about them do throw.
    /// @param _tokenId The identifier for an NFT
    /// @return The address of the owner of the NFT
    function ownerOf(uint256 _tokenId) external override view returns (address){
        //require(ownerOfVar[_tokenId] != address(0x0), "ownerOf: ERC721 NFTs assigned to the zero address are considered invalid");
        return ownerOfVar[_tokenId];
    }


    /// @notice Transfers the ownership of an NFT from one address to another address
    /// @dev Throws unless `msg.sender` is the current owner, an authorized
    ///  operator, or the approved address for this NFT. Throws if `_from` is
    ///  not the current owner. Throws if `_to` is the zero address. Throws if
    ///  `_tokenId` is not a valid NFT. When transfer is complete, this function
    ///  checks if `_to` is a smart contract (code size > 0). If so, it calls
    ///  `onERC721Received` on `_to` and throws if the return value is not
    ///  `bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"))`.
    /// @param _from The current owner of the NFT
    /// @param _to The new owner
    /// @param _tokenId The NFT to transfer
    /// @param data Additional data with no specified format, sent in call to `_to`
    function safeTransferFrom(address _from, address _to, uint256 _tokenId, bytes calldata data) external override payable{
        safeTransferFromInternal(_from, _to, _tokenId, data);
    }


    /// @notice Transfers the ownership of an NFT from one address to another address
    /// @dev This works identically to the other function with an extra data parameter,
    ///  except this function just sets data to "".
    /// @param _from The current owner of the NFT
    /// @param _to The new owner
    /// @param _tokenId The NFT to transfer
    function safeTransferFrom(address _from, address _to, uint256 _tokenId) external override payable{
        safeTransferFromInternal(_from, _to, _tokenId, "");
    }


    /// @notice Transfer ownership of an NFT -- THE CALLER IS RESPONSIBLE
    ///  TO CONFIRM THAT `_to` IS CAPABLE OF RECEIVING NFTS OR ELSE
    ///  THEY MAY BE PERMANENTLY LOST
    /// @dev Throws unless `msg.sender` is the current owner, an authorized
    ///  operator, or the approved address for this NFT. Throws if `_from` is
    ///  not the current owner. Throws if `_to` is the zero address. Throws if
    ///  `_tokenId` is not a valid NFT.
    /// @param _from The current owner of the NFT
    /// @param _to The new owner
    /// @param _tokenId The NFT to transfer
    function transferFrom(address _from, address _to, uint256 _tokenId) external override payable{
        transferFromInternal(_from, _to, _tokenId);
    }

    /// @notice Change or reaffirm the approved address for an NFT
    /// @dev The zero address indicates there is no approved address.
    ///  Throws unless `msg.sender` is the current NFT owner, or an authorized
    ///  operator of the current owner.
    /// @param _approved The new approved NFT controller
    /// @param _tokenId The NFT to approve
    function approve(address _approved, uint256 _tokenId) external override payable{
        require(msg.sender == ownerOfVar[_tokenId] || 
            approvedOperator[ownerOfVar[_tokenId]][msg.sender],
            "approve: msg.sender is not allowed to approve the token"
        );

        approvedTransferAddress[_tokenId] = _approved;
        emit Approval(ownerOfVar[_tokenId], _approved, _tokenId);
    }


    /// @notice Enable or disable approval for a third party ("operator") to manage
    ///  all of `msg.sender`'s assets
    /// @dev Emits the ApprovalForAll event. The contract MUST allow
    ///  multiple operators per owner.
    /// @param _operator Address to add to the set of authorized operators
    /// @param _approved True if the operator is approved, false to revoke approval
    function setApprovalForAll(address _operator, bool _approved) external override {
        approvedOperator[msg.sender][_operator] = _approved;
        emit ApprovalForAll(msg.sender, _operator, _approved);
    }

    
    /// @notice Get the approved address for a single NFT
    /// @dev Throws if `_tokenId` is not a valid NFT.
    /// @param _tokenId The NFT to find the approved address for
    /// @return The approved address for this NFT, or the zero address if there is none
    function getApproved(uint256 _tokenId) external override view returns (address){
        return approvedTransferAddress[_tokenId];
    }


    /// @notice Query if an address is an authorized operator for another address
    /// @param _owner The address that owns the NFTs
    /// @param _operator The address that acts on behalf of the owner
    /// @return True if `_operator` is an approved operator for `_owner`, false otherwise
    function isApprovedForAll(address _owner, address _operator) external override view returns (bool){
        return  approvedOperator[_owner][_operator];
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


    /// @notice Mint a token for msg.sender
    function mint(string calldata _URI) external returns (uint256) {
        require(owner == msg.sender, "Only the owner can mint");
        return internalMint(_URI);
    }

      /// @notice Mint a token for msg.sender
    function mintCreator(address _creator, string calldata _URI) external returns (uint256) {
        require(owner == msg.sender, "Only the owner can mint");
        return internalMintCreator(_creator, _URI);
    }

      function internalMintCreator(address _creator, string calldata _URI) internal returns (uint256){

        totalSupply++;
        balanceOf[msg.sender] = balanceOf[msg.sender] + 1;

        //Changing ownership
        ownerOfVar[totalSupply] = msg.sender;
        tokenURIs[totalSupply] = _URI;

        //Emitting transfer event
        emit Transfer(address(0x0), _creator, totalSupply);
        emit Transfer(_creator, msg.sender, totalSupply);

        return totalSupply;
    }


    function internalMint(string calldata _URI) internal returns (uint256){

        totalSupply++;
        balanceOf[msg.sender] = balanceOf[msg.sender] + 1;

        //Changing ownership
        ownerOfVar[totalSupply] = msg.sender;
        tokenURIs[totalSupply] = _URI;

        //Emitting transfer event
        emit Transfer(address(0x0), msg.sender, totalSupply);

        return totalSupply;
    }



    /// @dev Called by both variants of Safetransfer. Is a transfer followed by a smartContract check and then
    /// an onERC721Received call
    function safeTransferFromInternal(address _from, address _to, uint256 _tokenId, bytes memory data) internal {
        transferFromInternal(_from, _to, _tokenId);
        
        if(isContract(_to)){
            //bytes4(keccak256("onERC721Received(address,address,uint256,bytes)")) == 0x150b7a02
            require(IERC721TokenReceiver(_to).onERC721Received(msg.sender, _from, _tokenId, data) == bytes4(0x150b7a02));
        }
    }


    /// @dev Actual token transfer code called by all the other functions
    function transferFromInternal(address _from, address _to, uint256 _tokenId) internal {
        require(_to != address(0x0), "transferFromInternal: Tokens cannot be send to 0x0. Use 0xdead instead ?");
        require(ownerOfVar[_tokenId] == _from, "transferFromInternal: _from is not the owner of the token");
        require(msg.sender == ownerOfVar[_tokenId] || 
            approvedOperator[ownerOfVar[_tokenId]][msg.sender] ||
            msg.sender == approvedTransferAddress[_tokenId],
            "transferFromInternal: msg.sender is not allowed to manipulate the token"
        );

        // Adjusting token balances
        if(_from != address(0x0)){
            balanceOf[_from] = balanceOf[_from] - 1;
        }
        balanceOf[_to] = balanceOf[_to] + 1;

        //Resetting approved addresse permission
        approvedTransferAddress[_tokenId] = address(0x0);

        //Changing ownership
        ownerOfVar[_tokenId] = _to;

        //Emitting transfer event
        emit Transfer(_from, _to, _tokenId);
        
    }


    /// @notice Check if an address is a contract
    /// @param _address The adress you want to test
    /// @return true if the address has bytecode, false if not
    function isContract(address _address) internal view returns(bool){
        // According to EIP-1052, 0x0 is the value returned for not-yet created accounts
        // and 0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470 is returned
        // for accounts without code, i.e. `keccak256('')`
        bytes32 codehash;
        bytes32 accountHash = 0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470;
        assembly { codehash := extcodehash(_address) }
        return (codehash != accountHash && codehash != 0x0);
    }


    mapping(uint256 => address) royaltyReceiver;
    mapping(uint256 => uint256) royaltyPercentage;

    function setRoyaltyInfo(uint256, address receiver, uint256 percentkage) external {
        require(msg.sender == owner);
        royaltyReceiver[0] = receiver;
        royaltyPercentage[0] = percentkage;
    }

    function royaltyInfo(uint256, uint256 finalAmount) public view returns(address receiver, uint256 royaltyAmount) {
        uint256 royalty = finalAmount * royaltyPercentage[0] / 100000;
        return(royaltyReceiver[0], royalty);
    }

      /// @notice A distinct Uniform Resource Identifier (URI) for a given asset.
    /// @dev Throws if `_tokenId` is not a valid NFT. URIs are defined in RFC
    ///  3986. The URI may point to a JSON file that conforms to the "ERC721
    ///  Metadata JSON Schema".
    function tokenURI(uint256 _tokenId) external view returns (string memory){
        return (tokenURIs[_tokenId]);
    }

    function _setTokenURI(uint256 _tokenId, string memory _tokenURI) internal {
        tokenURIs[_tokenId] = _tokenURI;
    }

    function setTokenURI(uint256 _tokenId, string memory _tokenURI) external {
        require(msg.sender == owner);
        _setTokenURI(_tokenId, _tokenURI);
    }

}