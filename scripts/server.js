// external imports
const hre = require("hardhat");
const ethers = require("ethers");
const { Parser } = require('json2csv');


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
        res.send("Expense Created Successfully"); 
        console.log("Successfully created expense");
    } catch ( error ){
        res.send("Error creating expense");
        console.log(`Error creating expense: ${error}`);
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
    // Set headers for event stream
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // get query params from req

    // get contract addr
    let cAddress = req.query.contractAddress;
    if (cAddress == undefined ){
        res.send("Error: contract not provided");
        res.end();
        console.log("Error:contract not provided");
        return;
    }

    // get event type
    let type = req.query.type;
    if (type == undefined){
        console.log("Closed stream as no event was provided");
        res.send('No event type provided');
        res.end();
        return;
    }


    try {
        const Contract = await hre.ethers.getContractAt("ExpenseTracker", cAddress);
        let id = await Contract.CouncilIdentifier();
        console.log("new listner. type: ", type);
        res.write(`data: connected\n\n`);
        console.log("Connected successfully")

        // now listen for events
        switch( type ){
            case "ExpenseCreated":
            case "ExpenseRejected":
            case "ExpenseApproved":
                for await (let event of listenForStandardEvent(Contract, type)) {
                    // Send event to client
                    res.write(`data: ${JSON.stringify(event)}\n\n`);
        
                    // If the event is "connection-close", close the connection
                    if (event.type === 'connection-close') {
                        res.end();
                        break;
                    }
                }
                break;
            case "RegulatoryEvent":
                const regulatorContractAddr = await Contract.RegulatorContractAddress();
                const regulatorContract = await hre.ethers.getContractAt("CouncilProjectRegulation", regulatorContractAddr);
                for await (let event of listenForRegulatoryEvent(regulatorContract)) {
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
    } catch ( error ){
        console.log("Error getting contract");
        // console.log(error)
        res.write(`data: error\n\n`);
        return;
    }
    
});

app.get('/downloadEvents', async function (req, res) {
    if (req.query.contractAddress == undefined ){
        res.send("Error: contract not provided");
        console.log("Error:contract not provided");
        return;
    }
    if (req.query.eventType == undefined ){
        res.send("Error: eventType not provided");
        console.log("Error:eventType not provided");
        return;
    }
    console.log("Downloading events")
    try{
        const contract = await hre.ethers.getContractAt("ExpenseTracker", req.query.contractAddress);
        var filter = "";
        // parse eventType out of query and only return that type of event
        if ( req.query.eventType == "ExpenseCreated" ){
            filter = contract.filters.ExpenseCreated();
        } else if ( req.query.eventType == "ExpenseRejected" ){
            filter = contract.filters.ExpenseRejected();
        } else if ( req.query.eventType == "ExpenseApproved" ){
            filter = contract.filters.ExpenseApproved();
        } else if ( req.query.eventType == "RegulatoryEvent" ){
            // get regulator contract
            const regulatorContractAddr = await contract.RegulatorContractAddress();
            const regulatorContract = await hre.ethers.getContractAt("CouncilProjectRegulation", regulatorContractAddr);
            filter = regulatorContract.filters.ExpenseFlag();
            const regulatorEvents = await regulatorContract.queryFilter(filter, 0, 'latest');
            const data = regulatorEvents.map(event => {
                const args = {...event.args};
            
                // Create a new object with the headers as keys and the properties of args as values
                const formattedArgs = {
                    'CouncilID': args[0],
                    'ProjectID': args[1],
                    'ExpenseID': args[2],
                    'Amount': args[3],
                    'Description': args[4],
                    'PayeeID': args[5],
                    'Reason': args[6],
                };
            
                // Convert BigInt values to strings
                for (let key in formattedArgs) {
                    if (typeof formattedArgs[key] === 'bigint') {
                        formattedArgs[key] = formattedArgs[key].toString();
                    }
                }
            
                return formattedArgs;
            });
            console.log(data.length);
            res.json(data);
            return;

            
        } else {
            res.send("Error: Invalid eventType");
            console.log("Error: Invalid eventType");
            return;
        }
        const events = await contract.queryFilter(filter, 0, 'latest');


        const data = events.map(event => {
            const args = {...event.args};
        
            // Create a new object with the headers as keys and the properties of args as values
            const formattedArgs = {
                'CouncilID': args[0],
                'ProjectID': args[1],
                'ExpenseID': args[2],
                'Amount': args[3],
                'Description': args[4],
                'IBAN': args[5],
                'PayeeID': args[6],
            };
        
            // Convert BigInt values to strings
            for (let key in formattedArgs) {
                if (typeof formattedArgs[key] === 'bigint') {
                    formattedArgs[key] = formattedArgs[key].toString();
                }
            }
        
            return formattedArgs;
        });

        res.json(data);
    } catch (error){
        res.send("Error: Downloading events");
        console.log("Error: Downloading events");
    }
    return;
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


async function* listenForRegulatoryEvent(ethersContract) {
    // listen to any Regulatory Event events
    while (true) {
        // Create a promise that resolves when the event occurs;
        const eventPromise = new Promise((resolve) => {
            ethersContract.on("ExpenseFlag", (councilID, projectid, expenseId, amount, description, payee_identifier, reason) => {
                customEvent = { type: "ExpenseFlag", CouncilID: councilID.toString(), ProjectID: projectid.toString(), ExpenseID: expenseId.toString(), Amount: amount.toString(), Description: description.toString(), Reason: reason.toString(), PayeeID: payee_identifier.toString()};
                resolve(customEvent);
            });

        });

        // Yield the promise
        yield eventPromise;
    }
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