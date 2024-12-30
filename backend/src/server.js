// external imports
const hre = require("hardhat");
const ethers = require("ethers");

// Express server
var express = require('express');
// express-middleware
var bodyParser = require('body-parser')
var cors = require('cors');
var session = require('express-session')


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



async function* listenForTrx(ethersContract, event) {

    // listen to any Trx events
    while (true) {
        // Create a promise that resolves when the event occurs;
        const eventPromise = new Promise((resolve) => {
            ethersContract.on(event, (GovId, TrxId, Amount, Description, SenderAddress, RecipientAddress, RecipientName) => {
                const customEvent = { type: event, GovId: GovId.toString(), TrxId: TrxId.toString(), Amount: Amount.toString(), Description: Description.toString(), SenderAddress: SenderAddress.toString(), RecipientAddress: RecipientAddress.toString(), RecipientName: RecipientName.toString()};
                resolve(customEvent);
            });

        });

        // Yield the promise
        yield eventPromise;
    }
}


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
        const Contract = await hre.ethers.getContractAt("GovTransactions", cAddress);
        console.log("new listner. type: ", type);
        res.write(`data: connected\n\n`);
        console.log("Connected successfully")

        // now listen for events
        for await (let event of listenForTrx(Contract, type)) {
            // Send event to client
            res.write(`data: ${JSON.stringify(event)}\n\n`);

            // If the event is "connection-close", close the connection
            if (event.type === 'connection-close') {
                res.end();
                break;
            }
        }

    } catch ( error ){
        console.log("Error getting contract");
        // console.log(error)
        res.write(`data: error\n\n`);
        return;
    }
    
});