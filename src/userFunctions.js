// external libraries
const { Web3 } = require('web3');
var express = require('express');
const fs = require('fs');

// local chain url
const chainURL = 'http://127.0.0.1:9545';

// define contract path and addresses
// note: need to update address when new contract is deployed or chain re-started
const expenseTracker = 'src/abis/ExpenseTracker.json';
const expenseTrackerAddress = '0x970952aad18f988Cc1722C849863F8bcFbe9f1AC';

// define sender address
const myAddress = '0x05867a49E08E81564bc3Fd29Bb34531Dba2C9c31';

// define approver address
const approverAddress = '0x4c57009d9bD53A00F58b8C5568081c9065E43E0A';


var app = express();

app.get('/listExpenses', async function (req, res) {
    expenseList = await showAllExpenses(contract);
    res.send(expenseList);
})

app.post('/createExpense', async function (req, res) {

    let dummyExpense = {
        amount: req.query.amount,
        description: req.query.description,
        payee: req.query.payee,
    }

    //check if any query parameters are undefined and send error code if so
    if( dummyExpense.amount == undefined || dummyExpense.description == undefined || dummyExpense.payee == undefined ){
        res.status(400).send('Amount, Description or Payee not provided');
        return;
    }

    id = await createExpense(contract, dummyExpense);
    res.send(`Expense created successfully, Expense ID: ${id}`); 
    return;
});

app.post('/approveExpense', async function (req, res) {

    let id = req.query.id;
    if( id == undefined ){
        res.status(400).send('No id provided');
        return;
    }

    id = await approveExpenseWithId(contract, id);

    res.send(`Expense approved successfully, Expense ID: ${String(id)}`); 
    return;
});

var server = app.listen(1234, function () {
    try{
        console.log("Express App running at http://127.0.0.1:1234/");

        console.log(`Connecting to ganache server at: ${chainURL}...`);

        // Connect to the Ethereum node
        const web3 = new Web3(chainURL);
        
        // get a contract instance and set default account
        // contract = getContract(expensePath, expenseAddress, web3);
        contract = getContract(expenseTracker, expenseTrackerAddress, web3);
        contract.defaultAccount = myAddress;

        console.log(`Connected Successfully!`);
    }
    catch ( Error ){
        console.error("Error starting express server");
    }
})

async function main(){
    try {
        // Connect to the Ethereum node
        const web3 = new Web3(chainURL);
    
    
        // get a contract instance and set default account
        // contract = getContract(expensePath, expenseAddress, web3);
        contract = getContract(expenseTracker, expenseTrackerAddress, web3);
        contract.defaultAccount = myAddress;
    
    
        // call function on contract        
        
        // ----------- EXAMPLES ------------
        // EXAMPLE 1: Create an expense
        // Expense details gathered from: https://datamillnorth.org/dataset/2gpp0/council-spending
        // December 2023

        // expenseDetail1 = {
        //     amount: 5400,
        //     description: "Sheltered Accommodation",
        //     payee: "A & V TRANSITIONAL HOMES",
        // }

        // expenseDetail2 = {
        //     amount: 198,
        //     description: "Operational Materials",
        //     payee: "A C Entertainment Technologies Ltd",
        // }

        // await createExpense(contract, expenseDetail1);
        // await createExpense(contract, expenseDetail2);


        // EXAMPLE 2: Show details of all expenses
        // await showAllExpenses(contract);


        // EXAMPLE 3: Approve an expense ( with correct approver address)
        await approveExpenseWithId(contract, 0);    

        await showAllExpenses(contract);

    
    } catch (error) {
        console.error('Error running function:', error);
    }    
}

async function createExpense(contract, expenseDetails) {
    try {
        // Call contract method
        // have to send as this is a transaction
        const storedData = await contract.methods.createExpense(expenseDetails.amount, expenseDetails.description, expenseDetails.payee).send({from: myAddress, gas: 3000000});
        /// get the expense id which is returned from the function
        var expenseId = storedData.events.ExpenseCreated.returnValues.expenseId;
        // console.log('created expense with id', expenseId);
        return expenseId;
    } catch (error) {
        console.error('Error:', error);
    }
}

async function getExpenseAmount(contract, id) {
    try {
        // Call contract method
        const storedData = await contract.methods.getExpenseAmount(id).call({from: myAddress});
        // console.log(`expense #${id} has value`, storedData);
        return storedData;
    } catch (error) {
        console.error('Error:', error);
    }
}


function getContract(contractPath, contractAddress, web3) {
    try{
        // react contract from file and parse it out
        const contractAbiFile = fs.readFileSync(contractPath, 'utf-8');
        const contractAbi = JSON.parse(contractAbiFile).abi;
        // Create a contract instance
        const contract = new web3.eth.Contract(contractAbi, contractAddress);
        return contract;
    } catch (error) {
        console.error('Error reading or parsing the contract ABI file:', error);
    }

}

async function getNumbExpenses(contract) { 
    try {
        // Call contract method
        const numbExpenses = await contract.methods.expenseCount().call({from: myAddress});
        console.log(`there are ${numbExpenses} expenses in the system`);
    } catch (error) {
        console.error('Error:', error);
    }
}

async function showAllExpenses(contract){
    try {
        // Call contract method
        const numbExpenses = await contract.methods.expenseCount().call({from: myAddress});
        // console.log(`there are ${numbExpenses} expenses in the system`);
        const expenseList = [];
        for (let i = 0; i < numbExpenses; i++) {
            const expense = {}

            // print expense details to console
            // console.log("\n--------------------------\n");
            const amount = await getExpenseAmount(contract, i);
            const description = await getExpenseDescriptionWithId(contract, i);
            const payee = await getExpensePayeeWithId(contract, i);
            const approved = await getExpenseStatus(contract, i);
            // console.log("\n--------------------------");

            // extract expense details and return as a JSON
            expense["id"] = String(i);
            expense["amount"] = String(amount);
            expense["description"] = String(description);
            expense["payee"] = String(payee);
            expense["approved"] = String(approved);
            expenseList.push(expense);
        }
        return expenseList;
    } catch (error) {
        console.error('Error:', error);
    }
}

async function getExpenseStatus(contract, id) {
    try {
        // Call contract method
        const status = await contract.methods.getExpenseStatus(id).call({from: myAddress});
        // console.log(`expense #${id} has approval status:`, status);
        return status;
    } catch (error) {
        console.error('Error:', error);
    }
}

async function approveExpenseWithId(contract, id) {
    try {
        // approve the expense
        const message = await contract.methods.approveExpense(id).send({from: approverAddress, gas: 3000000}); // Create a message
        return message.events.ExpenseApproved.returnValues.expenseId;
    } catch (error) {
        console.error('Error:', error);
    }
}

async function getExpenseDescriptionWithId(contract, id) {
    try {
        // Call contract method
        const description = await contract.methods.getExpenseDescription(id).call({from: myAddress});
        // console.log(`expense #${id} has description:`, description);
        return description;
    } catch (error) {
        console.error('Error:', error);
    }
}

async function getExpensePayeeWithId(contract, id) {
    try {
        // Call contract method
        const address = await contract.methods.getExpensePayee(id).call({from: myAddress});
        // console.log(`expense #${id} has payee address:`, address);
        return address;
    } catch (error) {
        console.error('Error:', error);
    }
}

// main();