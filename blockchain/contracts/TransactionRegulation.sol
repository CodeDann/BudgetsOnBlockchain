// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Contract to demonstrate how to have programtic regulation
contract TransactionRegulation {
    event trxFlag(uint256 id, uint256 trxId, uint256 amount, string description, string recipientName, address processedBy, string reason);
    uint256 public counter;


    // If any trx is over 500, emit an event to flag it
    function checkTrxValue(uint256 _trxId, uint256 _amount, string memory _description, address _processedBy, string memory _recipientName, uint256 _id) public {
        counter++;
        // check if any single trx is for over £500
        if (_amount > 500) {
            emit trxFlag(_id, _trxId, _amount, _description, _recipientName, _processedBy, "Expense value is over 500");
        }
    }
}