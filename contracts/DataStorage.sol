// SPDX-License-Identifier: MIT
pragma solidity ^0.5.0;

contract DataStorage {
    // address public owner = msg.sender;
    string public storedData;
    string public constant version = "1.0.0";

    // modifier onlyOwner() {
    //     require(msg.sender == owner, "Not the owner");
    //     _;
    // }

    function saveData(string memory data) public {
        storedData = data;
    }

    // function storeData(string memory data) public onlyOwner {
    //     storedData = data;
    // }

    function readData() public view returns (string memory) {
        return storedData;
    }
}
