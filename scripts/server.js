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
var session = require('express-session')





// const chainURL = "http://127.0.0.1:8545/";
// const myPrivateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
// const otherPrivateKey = "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d"
// const otherAddress = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
// const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
// const contractName = "ExpenseTracker"

var app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(session({
    secret: "budget-on-chain",
    resave: false,
    saveUninitialized: true
}));
let users = {};
var server = app.listen(1234, async function () {
    try {
        console.log("Express App running at http://127.0.0.1:1234/");
    }
    catch ( Error ){
        console.error("Error starting express server: ", Error);
    }
});

app.post('/login', async function (req, res) {
    let data = {
        url: req.body.url,
        key: req.body.key,
        address: req.body.address,
    }

    try {
        let [contract, address] = await setup(data.url, data.key, "ExpenseTracker", data.address);
        users[req.sessionID] = contract;
        let response = {
            "message": "Connection Successful",
            "sessionID": req.sessionID,
            "address": address,
        }
        res.send(response);
        console.log("Contract setup successful");
    } catch ( error ){
        let response = {
            message: `${error}`
        }
        res.send(response);
        console.log(`Error setting up contract: ${error}`);
    }
    return;
});


app.post('/listExpenses', async function (req, res) {
    if (req.body.sessionID == undefined ){
        res.send("Error: Session ID not provided");
        console.log("Error: Session ID not provided");
        return;
    }
    if (users[req.body.sessionID] == undefined ){
        res.send("Error: Please login");
        console.log("Error: Please login");
        return;
    }
    ExpenseTracker = users[req.body.sessionID];

    try{
        expenseList = await ETHandler.getAllExpenses(ExpenseTracker);
        res.send(expenseList);
        console.log("Expense List sent");
    } catch ( error ){
        res.send("Error fetching expenses");
        console.log(`Error fetching expenses: ${error}`);
    }

    return
});



app.post('/listMyExpenses', async function (req, res) {
    if (req.body.sessionID == undefined ){
        res.send("Error: Session ID not provided");
        console.log("Error: Session ID not provided");
        return;
    }
    if (users[req.body.sessionID] == undefined ){
        res.send("Error: Please login");
        console.log("Error: Please login");
        return;
    }
    ExpenseTracker = users[req.body.sessionID];

    let data = {
        address: req.body.address,
    }

    if (data.address == undefined ){
        res.send('Address not provided');
        return;
    }

    expenseList = await ETHandler.getMyExpenses(ExpenseTracker, data.address);
    res.send(expenseList);
    console.log("Expense List sent");
    return
});


app.post('/createExpense', async function (req, res) {
    if (req.body.sessionID == undefined ){
        res.send("Error: Session ID not provided");
        console.log("Error: Session ID not provided");
        return;
    }
    if (users[req.body.sessionID] == undefined ){
        res.send("Error: Please login");
        console.log("Error: Please login");
        return;
    }
    ExpenseTracker = users[req.body.sessionID];


    let dummyExpense = {
        amount: req.body.amount,
        description: req.body.description,
        iban: req.body.iban,
    }

    //check if any query parameters are undefined and send error code if so
    if( dummyExpense.amount == undefined || dummyExpense.description == undefined || dummyExpense.iban == undefined ){
        res.send('Amount, Description or IBAN not provided');
        return;
    }

    try {
        result = await ETHandler.createExpense(ExpenseTracker, dummyExpense.amount, dummyExpense.description, dummyExpense.iban);
        // todo send id back instead of object
        res.send(`${result}`); 
        console.log("Successfully created expense");
    } catch ( error ){
        if (error.reason != undefined ){
            res.send(error.reason);
            console.log(`Error creating expense: ${error.reason}`);
        } else {
            res.send(error);
            console.log(`Error creating expense: ${error}`);
        }
    }

    return;
});

app.post('/addPayee', async function (req, res) {
    if (req.body.sessionID == undefined ){
        res.send("Error: Session ID not provided");
        console.log("Error: Session ID not provided");
        return;
    }
    if (users[req.body.sessionID] == undefined ){
        res.send("Error: Please login");
        console.log("Error: Please login");
        return;
    }
    ExpenseTracker = users[req.body.sessionID];

    let data = {
        address: req.body.address,
    }

    if (data.address == undefined ){
        res.send('Address not provided');
        return;
    }

    try {
        await ETHandler.addPayee(ExpenseTracker, data.address);
        res.send("Payee added successfully");
        console.log("Payee added successfully");
    } catch ( error ){
        res.send("Error adding payee");
        console.log(`Error adding payee: ${error}`);
    }
    return;
});

app.post('/removePayee', async function (req, res) {

    if (req.body.sessionID == undefined ){
        res.send("Error: Session ID not provided");
        console.log("Error: Session ID not provided");
        return;
    }
    if (users[req.body.sessionID] == undefined ){
        res.send("Error: Please login");
        console.log("Error: Please login");
        return;
    }
    ExpenseTracker = users[req.body.sessionID];


    let data = {
        address: req.body.address,
    }

    if (data.address == undefined ){
        res.send('Address not provided');
        return;
    }

    try {
        await ETHandler.removePayee(ExpenseTracker, data.address);
        res.send("Payee removed successfully");
        console.log("Payee removed successfully");
    } catch ( error ){
        res.send("Error removing payee");
        console.log(`Error removing payee: ${error}`);
    }
    return;
});


app.post('/approveExpense', async function (req, res) {
    if (req.body.sessionID == undefined ){
        res.send("Error: Session ID not provided");
        console.log("Error: Session ID not provided");
        return;
    }
    if (users[req.body.sessionID] == undefined ){
        res.send("Error: Please login");
        console.log("Error: Please login");
        return;
    }
    ExpenseTracker = users[req.body.sessionID];

    let data = {
        expenseId: req.body.id,
    }

    if (data.id == undefined ){
        res.send('Expense ID not provided');
        return;
    }

    try {
        await ETHandler.approveExpense(ExpenseTracker, data.expenseId);
        res.send("Expense approved successfully");
        console.log("Expense approved successfully");
    } catch ( error ){
        res.send("Error approving expense");
        console.log(`Error approving expense: ${error}`);
    }
    return;
});

app.post('/rejectExpense', async function (req, res) {
    if (req.body.sessionID == undefined ){
        res.send("Error: Session ID not provided");
        console.log("Error: Session ID not provided");
        return;
    }
    if (users[req.body.sessionID] == undefined ){
        res.send("Error: Please login");
        console.log("Error: Please login");
        return;
    }
    ExpenseTracker = users[req.body.sessionID];

    let data = {
        expenseId: req.body.id,
    }

    if (data.id == undefined ){
        res.send('Expense ID not provided');
        return;
    }

    try {
        await ETHandler.rejectExpense(ExpenseTracker, data.expenseId);
        res.send("Expense rejected successfully");
        console.log("Expense rejected successfully");
    } catch ( error ){
        res.send("Error rejecting expense");
        console.log(`Error rejecting expense: ${error}`);
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

        const provider = new ethers.JsonRpcProvider(url);
        const wallet = new ethers.Wallet(key, provider);
        const Contract = await hre.ethers.getContractAt(contractName, contractAddress);
        const contract = Contract.connect(wallet);

        // actually try use the wallet / contract combo
        const addr = await contract.getAddress();

        if ( contractAddress != addr ){
            throw "Error: Contract Address or Private Key invalid!";
        }


        return [contract, wallet.address];
    } catch (error){
        throw "Error: Contract Address or Private Key invalid!";
    }
}

// main()
//     .then(() => process.exit(0))
//     .catch((error) => {
//         console.error(error);
//         process.exit(1);
// });
