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

    console.log(await ExpenseTracker.CouncilName());
    console.log(await ExpenseTracker.CouncilIdentifier());
    console.log(await ExpenseTracker.approverAddress());



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
        res.send(result); 
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

    if (data.expenseId == undefined ){
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

    if (data.expenseId == undefined ){
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

    let id = req.body.id;

    if( id == undefined ){
        res.status(400).send('No id provided');
        return;
    }

    id = await approveExpenseWithId(contract, id);

    res.send(`Expense approved successfully, Expense ID: ${String(id)}`); 
    return;
});


app.get('/listenForEvents', async function (req, res) {
    if (req.query.contractAddress == undefined ){
        res.send("Error: contrac t not provided");
        console.log("Error:contract  not provided");
        return;
    }
    const contract = await hre.ethers.getContractAt("ExpenseTracker", req.query.contractAddress);
    // get the event type from the req
    type = req.query.type;

    if (type == undefined){
        console.log("Closed stream as no event was provided");
        res.status(400).send('No event type provided');
        return;
    }

    // Set headers for SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    try {
        // Assuming ethersContract is defined and accessible here
        // Assuming listenForEvents is an async generator function that yields events

        switch( type ){
            case "ExpenseCreated":
            case "ExpenseRejected":
            case "ExpenseApproved":
                for await (let event of listenForStandardEvent(contract, type)) {
                    // Send event to client
                    res.write(`data: ${JSON.stringify(event)}\n\n`);
        
                    // If the event is "connection-close", close the connection
                    if (event.type === 'connection-close') {
                        res.end();
                        break;
                    }
                }
                break;
        }
        
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error listening for events');
    }
});


async function* listenForStandardEvent(ethersContract, event) {

    // listen to any ExpenseCreated events
    while (true) {
        // Create a promise that resolves when the event occurs;
        const eventPromise = new Promise((resolve) => {
            ethersContract.on(event, (councilID, projectid, expenseId, amount, description, IBAN, payee_identifier) => {
                customEvent = { type: event, CouncilID: councilID.toString(), ProjectID: projectid.toString(), ExpenseID: expenseId.toString(), Amount: amount.toString(), Description: description.toString(), IBAN: IBAN.toString(), PayeeID: payee_identifier.toString()};
                resolve(customEvent);
            });

        });

        // Yield the promise
        yield eventPromise;
    }
}








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
        // handle errors correctly
        const addr = await contract.getAddress();

        if ( contractAddress != addr ){
            throw "Error: Contract Address or Private Key invalid!";
        }


        return [contract, wallet.address];
    } catch (error){
        throw "Error: Contract Address or Private Key invalid!";
    }
}
