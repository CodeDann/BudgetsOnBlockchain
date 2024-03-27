// external imports
const hre = require("hardhat");
const ethers = require("ethers");

// ExpenseTracker Handler
const ETHandler = require("./ExpenseTrackerFunctions.js");

// Express server
var express = require('express');
// express-middleware
var bodyParser = require('body-parser')
var cors = require('cors');




const chainURL = "http://127.0.0.1:8545/";
const myPrivateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
const otherPrivateKey = "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d"
const otherAddress = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const contractName = "ExpenseTracker"

var app = express();
app.use(cors());
app.use(bodyParser.json());
var server = app.listen(1234, async function () {
    try {
        console.log("Express App running at http://127.0.0.1:1234/");
        // ExpenseTracker = await setup(chainURL, myPrivateKey, contractName, contractAddress);
    }
    catch ( Error ){
        console.error("Error starting express server: ", Error);
    }
});

app.post('/setup', async function (req, res) {
    let data = {
        url: req.body.url,
        key: req.body.key,
        address: req.body.address,
    }

    try {
        ExpenseTracker = await setup(data.url, data.key, "ExpenseTracker", data.address);
        res.send("Setup Successful");
        console.log("Contract setup successful");
    } catch ( error ){
        res.status(400).send("Error setting up contract");
        console.log("Error setting up contract");
    }
    return;
});


app.get('/listExpenses', async function (req, res) {
    expenseList = await ETHandler.getAllExpenses(ExpenseTracker);
    console.log(expenseList);
    res.send(expenseList);
    // console.log("Expense List sent");
    return
});


app.post('/createExpense', async function (req, res) {

    let dummyExpense = {
        amount: req.body.amount,
        description: req.body.description,
        iban: req.body.iban,
    }

    //check if any query parameters are undefined and send error code if so
    if( dummyExpense.amount == undefined || dummyExpense.description == undefined || dummyExpense.iban == undefined ){
        res.status(400).send('Amount, Description or IBAN not provided');
        return;
    }

    result = await ETHandler.createExpense(ExpenseTracker, dummyExpense.amount, dummyExpense.description, dummyExpense.iban);
    // res.send(`${result}`); 
    // TODO HANDLE CREATE EXPENSE RETURN ID
    res.send("Expense created successfully");
    console.log(`API Call to createExpense: ${result}`);
    console.log(result);
    return;
});

app.post('/addPayee', async function (req, res) {
    let data = {
        address: req.body.address,
    }

    try {
        await ETHandler.addPayee(ExpenseTracker, data.address);
        res.send("Payee added successfully");
        console.log("Payee added successfully");
    } catch ( error ){
        res.status(400).send("Error adding payee");
        console.log(`Error adding payee ${error}`);
    }
    return;
});

app.post('/removePayee', async function (req, res) {
    let data = {
        address: req.body.address,
    }

    try {
        await ETHandler.removePayee(ExpenseTracker, data.address);
        res.send("Payee removed successfully");
        console.log("Payee removed successfully");
    } catch ( error ){
        res.status(400).send("Error removing payee");
        console.log("Error removing payee");
    }
    return;
});











async function main(){
    ExpenseTracker = await setup(chainURL, myPrivateKey, "ExpenseTracker", contractAddress);

    try {
        // await ETHandler.createExpense(ExpenseTracker, 1000, "House Building", "IBAN1234567890");
        
        await ETHandler.addPayee(ExpenseTracker, otherAddress);
        // await ETHandler.approveExpense(ExpenseTracker, 4);
        // console.log(await ETHandler.getExpenseCount(ExpenseTracker));
        // await ETHandler.createExpense(ExpenseTracker, 2000, "House Building", "IBAN1234567890");
        // await ETHandler.rejectExpense(ExpenseTracker, 1);



        // console.log(await ETHandler.getAllExpenses(ExpenseTracker));
        // const val = await ETHandler.getExpenseCount(ExpenseTracker);
        // console.log(val);
    } catch ( error ) {
        if ( error.reason ) {
            console.log(`Error: ${error.reason}`);
        } else {
            console.log( `Error: ${error}` )
        }
    }

    // const val =  await expense_tracker.createExpense(1000, "House Building", "IBAN1234567890");
       
    // const val = await expenseTrackerFunctions.getExpenseStatus(expense_tracker, 0);
    // console.log(val);
}

async function setup(url, key, contractName, contractAddress){
    try{
        if (url == "" || key == "" || contractAddress == ""){
            throw "Please provide all the required parameters";
        }
        console.log("Connecting to node...")
        const provider = new ethers.JsonRpcProvider(url);
        console.log("Connected");
        console.log("Attaching wallet to contract...")
        const wallet = new ethers.Wallet(key, provider);
        const Contract = await hre.ethers.getContractAt(contractName, contractAddress);
        const contract = Contract.connect(wallet);
        console.log("Success");
        return contract;
    } catch (error){
        console.log(error);
    }
}

// main()
//     .then(() => process.exit(0))
//     .catch((error) => {
//         console.error(error);
//         process.exit(1);
// });
