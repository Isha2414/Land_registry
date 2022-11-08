// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./LandRegister.sol";

///@author Kaido997
///@title ERC721 standard implementation of Land Register


contract LandRegisterERC721 is LandRegister {

    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);


    mapping(uint => address) approvedLand;

    function balanceOf(address owner) external view returns (uint256 balance){
        return ownerLandsCounter[owner];
    }

    function ownerOf(uint256 tokenId) external view returns (address owner) {
        require(tokenId <= lands.length - 1);
        return landToOwner[tokenId];
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) external payable {
        address owner = landToOwner[tokenId];
        require(from != address(0), "from cannot be the zero address"); 
        require(to != address(0), "to cannot be the zero address.");
        require(tokenId <= lands.length - 1, "tokenId token must exist");
        require(from == owner || from == approvedLand[tokenId], "Not owner or approved");
        require(msg.sender == owner || msg.sender == approvedLand[tokenId], "Sender address is not the owner or the approved one");
        require(from != to, "Same address");
    
        ownerLandsCounter[from] -= 1;
        ownerLandsCounter[to] += 1;
        landToOwner[tokenId] = to;


        emit Transfer(from, to, tokenId);
    }

    function approve(address to, uint256 tokenId) external payable {
        require(msg.sender == landToOwner[tokenId], "Not owner");
        require(tokenId <= lands.length - 1, "tokenId token must exist");
        approvedLand[tokenId] = to;

        emit Approval(msg.sender, to, tokenId);
    }

}