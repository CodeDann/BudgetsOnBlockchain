const hre = require("hardhat");
const ethers = require("ethers");


// create expense
async function createExpense(expenseTracker, amount, description, iban){
    try {
        const val = await expenseTracker.createExpense(amount, description, iban);
        return val;
    } catch ( error ){
        if ( error.reason ) {
            console.log(`Error: ${error.reason}`);
        } else {
            console.log( `Error: ${error}` )
        }    }
}

// --- Approve / Reject ---
async function approveExpense(expenseTracker, expenseId){
    try {
        const val = await expenseTracker.approveExpense(expenseId);
        return val;
    } catch ( error ){
        if ( error.reason ) {
            console.log(`Error: ${error.reason}`);
        } else {
            console.log( `Error: ${error}` )
        }    }
}

async function rejectExpense(expenseTracker, expenseId){
    try {
        const val = await expenseTracker.rejectExpense(expenseId);
        return val;
    } catch ( error ){
        if ( error.reason ) {
            console.log(`Error: ${error.reason}`);
        } else {
            console.log( `Error: ${error}` )
        }    }
}

// --- Add / Remove Payees ---

async function addPayee(expenseTracker, payeeIdentifier){
    try {
        await expenseTracker.addPayee(payeeIdentifier);
    } catch ( error ){
        if ( error.reason ) {
            console.log(`Error: ${error.reason}`);
        } else {
            console.log( `Error: ${error}` )
        }
    }
}

async function removePayee(expenseTracker, payeeIdentifier){
    try {
        await expenseTracker.removePayee(payeeIdentifier);
    } catch ( error ){
        if ( error.reason ) {
            console.log(`Error: ${error.reason}`);
        } else {
            console.log( `Error: ${error}` )
        }
    }
}


// --- Getters ---

async function getExpenseStatus(expenseTracker, expenseId){
    try {
        const status = await expenseTracker.getExpenseStatus(expenseId);
        return status;
    } catch ( error ){
        if ( error.reason ) {
            console.log(`Error: ${error.reason}`);
        } else {
            console.log( `Error: ${error}` )
        }    }
}

async function getExpenseAmount(expenseTracker, expenseId){
    try {
        const amount = await expenseTracker.getExpenseAmount(expenseId);
        return amount;
    } catch ( error ){
        if ( error.reason ) {
            console.log(`Error: ${error.reason}`);
        } else {
            console.log( `Error: ${error}` )
        }    }
}

async function getExpenseDescription(expenseTracker, expenseId){
    try {
        const description = await expenseTracker.getExpenseDescription(expenseId);
        return description;
    } catch ( error ){
        if ( error.reason ) {
            console.log(`Error: ${error.reason}`);
        } else {
            console.log( `Error: ${error}` )
        }    }
}

async function getExpenseIBAN(expenseTracker, expenseId){
    try {
        const iban = await expenseTracker.getExpenseIBAN(expenseId);
        return iban;
    } catch ( error ){
        if ( error.reason ) {
            console.log(`Error: ${error.reason}`);
        } else {
            console.log( `Error: ${error}` )
        }    }
}

async function getExpensePayeeIdentifier(expenseTracker, expenseId){
    try {
        const payeeIdentifier = await expenseTracker.getExpensePayeeIdentifier(expenseId);
        return payeeIdentifier;
    } catch ( error ){
        if ( error.reason ) {
            console.log(`Error: ${error.reason}`);
        } else {
            console.log( `Error: ${error}` )
        }    }
}

async function getExpenseCount(expenseTracker){
    try {
        const count = await expenseTracker.getExpenseCount();
        return count;
    } catch ( error ){
        if ( error.reason ) {
            console.log(`Error: ${error.reason}`);
        } else {
            console.log( `Error: ${error}` )
        }    }
}

// -- get all details of an expense
async function getExpenseDetails(expenseTracker, expenseId){
    try {
        const details = {
            status: await getExpenseStatus(expenseTracker, expenseId),
            amount: await getExpenseAmount(expenseTracker, expenseId),
            description: await getExpenseDescription(expenseTracker, expenseId),
            iban: await getExpenseIBAN(expenseTracker, expenseId),
            payeeIdentifier: await getExpensePayeeIdentifier(expenseTracker, expenseId)
        }
        return details;
    } catch ( error ){
        if ( error.reason ) {
            console.log(`Error: ${error.reason}`);
        } else {
            console.log( `Error: ${error}` )
        }    }
}

async function getAllExpenses(expenseTracker){
    try {
        const count = await getExpenseCount(expenseTracker);
        const expenses = [];
        for (let i = 0; i < count; i++){
            const details = await getExpenseDetails(expenseTracker, i);
            expenses.push(details);
        }
        return expenses;
    } catch ( error ){
        if ( error.reason ) {
            console.log(`Error: ${error.reason}`);
        } else {
            console.log( `Error: ${error}` )
        }    }
}

module.exports = {
    rejectExpense,
    approveExpense,
    getExpenseStatus,
    createExpense,
    getExpenseAmount,
    getExpenseDescription,
    getExpenseIBAN,
    getExpensePayeeIdentifier,
    getExpenseCount,
    getExpenseDetails,
    getAllExpenses,
    addPayee,
    removePayee
};