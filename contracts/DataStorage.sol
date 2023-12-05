// SPDX-License-Identifier: MIT
pragma solidity ^0.5.0;

contract DataStorage {
    address public owner = msg.sender;
    string public storedData;

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    function storeData(string memory data) public onlyOwner {
        storedData = data;
    }
}
