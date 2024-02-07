// SPDX-License-Identifier: MIT
// note: need to change boolean approved into unint256 status ( approved = 1, rejected = 2, pending = 0)


pragma solidity 0.8.0;

contract ExpenseTracker {

    struct Expense {
        uint256 amount;
        string description;
        string payee;
        bool approved;
    }


    mapping(uint256 => Expense) public expenses;
    uint256 public expenseCount;

    address private approverAddress = 0x4c57009d9bD53A00F58b8C5568081c9065E43E0A;

    event ExpenseCreated(uint256 indexed expenseId, uint256 amount);
    event ExpenseApproved(uint256 indexed expenseId, bool approved, uint256 amount, string description, string payee);

    function createExpense(uint256 _amount, string calldata _description, string calldata _payee) external returns (uint256){
        uint256 expenseId = expenseCount++;
        expenses[expenseId] = Expense(_amount, _description, _payee, false);
        emit ExpenseCreated(expenseId, _amount);
        return expenseId;
    }

    modifier onlyApprover() {
        require(msg.sender == approverAddress);
        _;
    }

    function approveExpense(uint256 _expenseId) external onlyApprover returns (bool){
        require(_expenseId < expenseCount, "Expense does not exist");
        expenses[_expenseId].approved = true;
        emit ExpenseApproved(_expenseId, true, expenses[_expenseId].amount, expenses[_expenseId].description, expenses[_expenseId].payee);
        return true;
    }

    function getExpenseAmount(uint256 _expenseId) external view returns (uint256) {
        require(_expenseId < expenseCount, "Expense does not exist");
        return expenses[_expenseId].amount;
    }

    function getExpenseStatus(uint256 _expenseId) external view returns (bool) {
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
    
}