// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

///@title Real estate register 
///@author Kaido997
///@notice This Contract simulate a decentralised register of real estate property

///@notice Self destruct implementation for deleting the contract from the blockchain
contract Mortal is Ownable {
    
    function kill() public payable onlyOwner {
        address payable addr = payable(address(this));
        selfdestruct(addr);
    }
}


contract LandRegister is Mortal {

    event Registered(uint indexed _id, address indexed _owner);

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    struct Land {
        uint256 landId;
        uint256 mQ;
        bytes32 coords;
    }


    Land[] public lands;

    mapping(uint => address) public landToOwner;
    mapping(address => uint) ownerLandsCounter;
    mapping(bytes32 => bool) exists;

    ///@dev require new land added has unique coordinates
    modifier isUnique(bytes32 _coords) {
        require(exists[_coords] == false, "Land already registered");
        _;
    }


    function _newLand(uint _mQ, bytes32 _coords)
        public 
        isUnique(_coords)
        onlyOwner
        returns(uint256) 
        {
            require(_mQ > 0, "Squere meters must be grater then 0");   
            address _landowner = msg.sender;
            uint newLandId = _tokenIds.current();
            lands.push(Land(newLandId, _mQ, _coords));
            uint landIndex = lands.length - 1;
            _tokenIds.increment();
            landToOwner[landIndex] = _landowner;
            ownerLandsCounter[_landowner] += 1;
            exists[_coords] = true;
            emit Registered(landIndex, _landowner);
            return landIndex;
    }

    function _getLandsByOwner(address _owner) public view returns(uint[] memory) {
        uint[] memory result = new uint[](ownerLandsCounter[_owner]);
        uint counter = 0;
        for (uint i = 0; i < lands.length; i++) {
            if(landToOwner[i] == _owner) {
                result[counter] = i;
                counter++;
            }
        }
        return result;
    }
}