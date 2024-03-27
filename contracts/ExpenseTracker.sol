// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ExpenseTracker {

    // address of the approver is set to the deployer of the contract
    address private approverAddress = msg.sender;
    // modifier to check if the caller is the approver
    modifier onlyApprover() {
        require(msg.sender == approverAddress, "Only the approver can call this function!");
        _;
    }
    // modiefier to check if the expense exits
    modifier expenseExists(uint256 _expenseId) {
        require(_expenseId <= expenseCount, "Expense does not exist in the system!");
        _;
    }
    // modifier to check if the caller is a known payee
    modifier onlyKnownPayee() {
        require(knownPayees[msg.sender], "Only known payees can create expenses! Please contact the council to be added to the list.");
        _;
    }

    enum Status { Pending, Approved, Rejected }
    // Define an Expense
    // Amount: the amount of the expense
    // Description: the description of the work completed
    // IBAN: the IBAN of the payee to send the funds to
    // payee_identifier: the address of the payee to identify them
    // status: the status of the expense (Pending, Approved, Rejected)
    struct Expense {
        uint256 id;
        uint256 amount;
        string description;
        string IBAN;
        address payee_identifier;
        Status status;
    }
    // Mapping of expenses
    mapping(uint256 => Expense) public expenses;
    // count of expenses
    uint256 public expenseCount;
    // known payees list
    mapping(address => bool) public knownPayees;


    // -------- Events --------
    // event to log the creation of an expense
    event ExpenseCreated(uint256 amount, string description, string IBAN, address payee_identifier);
    event ExpenseApproved(uint256 amount, string description, string IBAN, address payee_identifier);
    event ExpenseRejected(uint256 amount, string description, string IBAN, address payee_identifier);

    // Create an expense with given parameters
    function createExpense(uint256 _amount, string calldata _description, string calldata _IBAN) external onlyKnownPayee(){
        expenses[expenseCount] = Expense(expenseCount, _amount, _description, _IBAN, msg.sender, Status.Pending);
        // emit expense created event 
        emit ExpenseCreated(_amount, _description, _IBAN, msg.sender);
        expenseCount++;
    }


    // -------- Approve/Reject --------
    // approve expense with given id: only the approver can call this function
    function approveExpense(uint256 _expenseId) external onlyApprover expenseExists(_expenseId) {
        expenses[_expenseId].status = Status.Approved;
        emit ExpenseApproved(expenses[_expenseId].amount, expenses[_expenseId].description, expenses[_expenseId].IBAN, expenses[_expenseId].payee_identifier);
    }
    // reject expense with given id: only the approver can call this function
    function rejectExpense(uint256 _expenseId) external onlyApprover() expenseExists(_expenseId){
        expenses[_expenseId].status = Status.Rejected;
        emit ExpenseRejected(expenses[_expenseId].amount, expenses[_expenseId].description, expenses[_expenseId].IBAN, expenses[_expenseId].payee_identifier);
    }

    // -------- Add/Remove Payees --------
     // add a payee to the known payees list
    function addPayee(address _payee) external onlyApprover {
        knownPayees[_payee] = true;
    }
    // remove a payee from the known payees list
    function removePayee(address _payee) external onlyApprover {
        knownPayees[_payee] = false;
    }

    // -------- Getters --------
    function getExpenseStatus(uint256 _expenseId) external expenseExists(_expenseId) view returns (string memory) {
        if (expenses[_expenseId].status == Status.Pending) {
            return "Pending";
        } else if (expenses[_expenseId].status == Status.Approved) {
            return "Approved";
        } else {
            return "Rejected";
        }
    }

    function getExpenseAmount(uint256 _expenseId) external expenseExists(_expenseId) view returns (uint256) {
        return expenses[_expenseId].amount;
    }

    function getExpenseDescription(uint256 _expenseId) external expenseExists(_expenseId) view returns (string memory) {
        return expenses[_expenseId].description;
    }

    function getExpenseIBAN(uint256 _expenseId) external expenseExists(_expenseId) view returns (string memory) {
        return expenses[_expenseId].IBAN;
    }

    function getExpensePayeeIdentifier(uint256 _expenseId) external expenseExists(_expenseId) view returns (address) {
        return expenses[_expenseId].payee_identifier;
    }

    function getExpenseCount() external view returns (uint256) {
        return expenseCount;
    }
}
