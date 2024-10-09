// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Contract to demonstrate how to have programtic regulation
contract GovTransactionRegulation {
    event trxFlag(uint256 GovId, uint256 trxId, uint256 amount, string description, address departmentAddress, string recipient, string reason);
    uint256 public counter;
    // example of simple approved expense regulation
    function checkTrxValue(uint256 _trxId, uint256 _amount, string memory _description, address _departmentAddress, string memory _recipient, uint256 _GovId) public {
        counter++;
        // check if any single trx is for over £500
        if (_amount > 500) {
            emit trxFlag(_GovId, _trxId, _amount, _description, _departmentAddress, _recipient, "Expense value is over 500");
        }
    }
}