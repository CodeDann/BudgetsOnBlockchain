// external libraries
const { Web3 } = require('web3');
var express = require('express');
const fs = require('fs');
const ethers = require("ethers");

// middleware
var bodyParser = require('body-parser')
var cors = require('cors');


// local chain url
const chainURL = 'http://127.0.0.1:7545';

// define contract path and addresses
// note: need to update address when new contract is deployed or chain re-started
const expenseTrackerAbi = 'src/abis/ExpenseTracker.json';
const expenseTrackerAddress = '0x37ade47744D678168e8582AC421054588654Aea6';

// define sender address
const myAddress = '0x05867a49E08E81564bc3Fd29Bb34531Dba2C9c31';

// define approver address
const approverAddress = '0x4c57009d9bD53A00F58b8C5568081c9065E43E0A';

// create express app and add middleware
var app = express();
app.use(cors());
app.use(bodyParser.json()); // add this line


app.get('/listExpenses', async function (req, res) {
    expenseList = await showAllExpenses(contract);
    res.send(expenseList);
    console.log("Expense List sent");
    return
})

app.post('/createExpense', async function (req, res) {

    let dummyExpense = {
        amount: req.body.amount,
        description: req.body.description,
        payee: req.body.payee,
    }
    
    //check if any query parameters are undefined and send error code if so
    if( dummyExpense.amount == undefined || dummyExpense.description == undefined || dummyExpense.payee == undefined ){
        res.status(400).send('Amount, Description or Payee not provided');
        return;
    }

    id = await createExpense(contract, dummyExpense);
    res.send(`Expense created successfully, Expense ID: ${id}`); 
    console.log(`Expense created successfully, Expense ID: ${id}`);
    return;
});

app.post('/approveExpense', async function (req, res) {

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

    // get the event type from the req
    type = req.query.type;

    if (type == undefined){
        res.status(400).send('No event type provided');
        return;
    }

    if (type != "ExpenseCreated" && type != "ExpenseApproved"){
        res.status(400).send('Invalid event type provided');
        return;
    }

    // Set headers for SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // res.write('data: {Connection open and listening to event type: ' + type + '}');

    try {
        // Assuming ethersContract is defined and accessible here
        // Assuming listenForEvents is an async generator function that yields events

        switch( type ){

            case "ExpenseCreated":
                for await (let event of listenForEventCreated(ethersContract)) {
                    // Send event to client
                    res.write(`data: ${JSON.stringify(event)}\n\n`);
        
                    // If the event is "connection-close", close the connection
                    if (event.type === 'connection-close') {
                        res.end();
                        break;
                    }
                }
                break;
            case "ExpenseApproved":
                for await (let event of listenForEventApproved(ethersContract)) {
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


var server = app.listen(1234, function () {
    try{
        console.log("Express App running at http://127.0.0.1:1234/");

        console.log(`Connecting to ganache server at: ${chainURL}...`);

        // Connect to the Ethereum node
        const web3 = new Web3(chainURL);
        
        // get a contract instance and set default account
        contract = getContract(expenseTrackerAbi, expenseTrackerAddress, web3);
        contract.defaultAccount = myAddress;

        // Get the ethers provider and contract ( for listening to events )
        try {
            const provider = new ethers.JsonRpcProvider(chainURL);
            ethersContract = new ethers.Contract(expenseTrackerAddress, getABI(expenseTrackerAbi), provider);     
        } catch (error) {
            console.error('Error:', error);
        }

        // check if ganache server is responding
        web3.eth.net.isListening().catch( FetchError => {
            console.error("Error connecting to ganache server! Please check that it is running");
            console.log("Exiting....");
            process.exit(1);
        }).finally( () => {
            console.log("Connected!");
        });
        


    }
    catch ( Error ){
        console.error("Error starting express server: ", Error);
    }
})







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


function getABI(contractPath){
    const contractAbiFile = fs.readFileSync(contractPath, 'utf-8');
    const contractAbi = JSON.parse(contractAbiFile).abi;

    return contractAbi;
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

async function* listenForEventCreated(ethersContract) {

    // listen to any ExpenseCreated events
    while (true) {
        // Create a promise that resolves when the event occurs
        const eventPromise = new Promise((resolve) => {
            ethersContract.once("ExpenseCreated", (expenseId, amount, description, payee) => {
                customEvent = { type: "ExpenseCreated", expenseId: expenseId.toString(), amount: amount.toString(), description: description.toString(), payee: payee.toString()};
                resolve(customEvent);
            });
        });

        // Yield the promise
        yield eventPromise;
    }
}

async function* listenForEventApproved(ethersContract) {

    // listen to any ExpenseApproved events
    while (true) {
        // Create a promise that resolves when the event occurs
        const eventPromise = new Promise((resolve) => {
            ethersContract.once("ExpenseApproved", (expenseId, approver, amount, description, payee) => {
                customEvent = { type: "ExpenseApproved", expenseId: expenseId.toString(), approver: approver.toString(), amount: amount.toString(), description: description.toString(), payee: payee.toString()};
                resolve(customEvent);
            });
        });

        // Yield the promise
        yield eventPromise;
    }
}

// async function* listenForEvents(ethersContract){

//     // listen to any ExpenseCreated events
//     // ethersContract.on("ExpenseCreated", (expenseId, amount) => {
//     //     customEvent = { type: "ExpenseCreated", expenseId: expenseId, amount: amount };
//     //     yield customEvent;


//     //     // return (`Expense Created with ID: ${expenseId.toString()} and Amount: ${amount.toString()}`);
//     // });

//     //listen to any events and return them
//     ethersContract.on("event", (event) => {
//         yield event
//     }

//     // //listen to any ExpenseApproved events and flag if they are over an amount
//     // ethersContract.on("ExpenseApproved", (expenseId, approver, amount, description, payee) => {
//     //     if (approver === payee){
//     //         console.log("RED FLAG! Approver and Payee are the same!");
//     //     }
//     //     if (amount > 1000){
//     //         console.log("RED FLAG! Expense approved with amount over 1000!");
//     //     }
//     // });

//     // console.log(`Client is listening to ${chainURL}`);
//     // Keep the script running to listen for events every 500ms
//     // while(true){
//     //     await new Promise(resolve => setTimeout(resolve, 500)); // Wait for 1 second in each iteration
//     // }

// }