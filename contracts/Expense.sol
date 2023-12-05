// SPDX-License-Identifier: MIT
pragma solidity ^0.5.0;

contract Expense {
    address private approver = 0x05867a49E08E81564bc3Fd29Bb34531Dba2C9c31;
    bool private approved = false;
    int256 private amount = 1000;

    modifier onlyApprover() {
        require(msg.sender == approver, "Not the approver");
        _;
    }

    function approveExpense() public onlyApprover {
        approved = true;
    }

    function getValue() public view returns (int256 value) {
        return amount;
    }

    function getApproved() public view returns (bool isApproved) {
        return approved;
    }
}
