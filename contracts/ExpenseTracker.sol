// SPDX-License-Identifier: MIT
pragma solidity ^0.5.0;

contract ExpenseTracker {
    struct Expense {
        uint256 amount;
        bool approved;
    }


    mapping(uint256 => Expense) public expenses;
    uint256 public expenseCount;

    event ExpenseCreated(uint256 indexed expenseId, uint256 amount);
    event ExpenseApproved(uint256 indexed expenseId, bool approved);

    function createExpense(uint256 _amount ) external returns (uint256){
        uint256 expenseId = expenseCount++;
        expenses[expenseId] = Expense(_amount, false);
        emit ExpenseCreated(expenseId, _amount);
        return expenseId;
    }

    function approveExpense(uint256 _expenseId) external {
        require(_expenseId < expenseCount, "Expense does not exist");
        expenses[_expenseId].approved = true;
        emit ExpenseApproved(_expenseId, true);
    }

    function getExpenseAmount(uint256 _expenseId) external view returns (uint256) {
        require(_expenseId < expenseCount, "Expense does not exist");
        return expenses[_expenseId].amount;
    }

    function isExpenseApproved(uint256 _expenseId) external view returns (bool) {
        require(_expenseId < expenseCount, "Expense does not exist");
        return expenses[_expenseId].approved;
    }
}
