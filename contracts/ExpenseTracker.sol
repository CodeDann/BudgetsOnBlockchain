// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// import "@openzeppelin/contracts/utils/Strings.sol";

contract ExpenseTracker {
    struct Expense {
        uint256 amount;
        string description;
        string payee;
        bool approved;
    }


    mapping(uint256 => Expense) public expenses;
    uint256 public expenseCount;

    event ExpenseCreated(uint256 indexed expenseId, uint256 amount);
    event ExpenseApproved(uint256 indexed expenseId, bool approved);

    function createExpense(uint256 _amount, string calldata _description, string calldata _payee) external returns (uint256){
        uint256 expenseId = expenseCount++;
        expenses[expenseId] = Expense(_amount, _description, _payee, false);
        emit ExpenseCreated(expenseId, _amount);
        return expenseId;
    }

    function approveExpense(uint256 _expenseId) external returns (bool){
        require(_expenseId < expenseCount, "Expense does not exist");
        expenses[_expenseId].approved = true;
        emit ExpenseApproved(_expenseId, true);
        return true;
    }

    function getExpenseAmount(uint256 _expenseId) external view returns (uint256) {
        require(_expenseId < expenseCount, "Expense does not exist");
        return expenses[_expenseId].amount;
    }

    function isExpenseApproved(uint256 _expenseId) external view returns (bool) {
        require(_expenseId < expenseCount, "Expense does not exist");
        return expenses[_expenseId].approved;
    }

    function getExpenseDescription(uint256 _expenseId) external view returns (string memory) {
        require(_expenseId < expenseCount, "Expense does not exist");
        return expenses[_expenseId].description;
    }

    function getExpensePayee(uint256 _expenseId) external view returns (string memory) {
        require(_expenseId < expenseCount, "Expense does not exist");
        return expenses[_expenseId].payee;
    }

    // function printExpense(uint256 _expenseId) external view returns (string memory) {
    //     require(_expenseId < expenseCount, "Expense does not exist");
    //     return string(abi.encodePacked("Expense ID: ", Strings.toString(_expenseId), ", Amount: ", Strings.toString(expenses[_expenseId].amount), ", Description: ", expenses[_expenseId].description, ", Payee: ", expenses[_expenseId].payee, ", Approved: ", expenses[_expenseId].approved ? "true" : "false"));
    // }
}
