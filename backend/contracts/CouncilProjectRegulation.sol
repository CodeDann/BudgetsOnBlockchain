// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Contract to demonstrate how to have programtic regulation
contract CouncilProjectRegulation {
    event ExpenseFlag(uint256 CouncilID, uint256 ProjectID, uint256 expenseId, uint256 amount, string description, address payee_identifier, string reason);
    uint256 public counter;
    // example of simple approved expense regulation
    function checkExpenseValue(uint256 _expenseId, uint256 _amount, string memory _description, address _payeeID, address _approverID, uint256 _councilID, uint256 _projectID, uint256 _projectbudget) public {
        counter++;
        // check if any single expense is for over £500
        if (_amount > 500) {
            emit ExpenseFlag(_councilID, _projectID, _expenseId, _amount, _description, _payeeID, "Expense value is over 500");
        }

        // check if the payee is the same as the approver
        if ( _approverID == _payeeID) {
            emit ExpenseFlag(_councilID, _projectID, _expenseId, _amount, _description, _payeeID, "Payee is the same as Approver");
        }

        // check if the expense is over 5% of the project budget
        if ( _amount > (_projectbudget / 20)) {
            emit ExpenseFlag(_councilID, _projectID, _expenseId, _amount, _description, _payeeID, "Expense flagged as 5% of project budget");
        }
    }
}