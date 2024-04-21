// external imports
const hre = require("hardhat");
const ethers = require("ethers");
const chainURL = "http://127.0.0.1:8545/";
const axios = require("axios");
const { parse } = require('json2csv');
const fs = require('fs');


const myPrivateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
const otherPrivateKey = "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d"
const otherAddress = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";


async function testBackend(){
        // const payload = {
    //     url: chainURL,
    //     key: myPrivateKey,
    //     address: contractAddress,
    // }

    // let response = await axios.post("http://127.0.0.1:1234/login", payload);
    // const mySessionID = response.data.sessionID;
    // console.log("Approver login: ", mySessionID);

   

    // // add payee
    // const addPayeePayload = {
    //     sessionID: mySessionID,
    //     address: otherPrivateKey.toString(),
    // }
    // response = await axios.post("http://127.0.0.1:1234/addPayee", addPayeePayload);
    // console.log(response.data);

    // login as other address
    const payload2 = {
        url: chainURL,
        key: otherPrivateKey,
        address: contractAddress,
    }

    const loginResponse2 = await axios.post("http://127.0.0.1:1234/login", payload2);
    const mySessionID2 = loginResponse2.data.sessionID;

    // setup test
    const startTime = Date.now();

    // create n expenses
    for (let i = 0; i < 10; i++) {
        const expensePayload = {
            sessionID: mySessionID2,
            amount: Math.floor(Math.random() * 501).toString(),
            description: "test",
            iban: "1234",
            // Add other expense data here
        };

        let response = await axios.post("http://127.0.0.1:1234/createExpense", expensePayload);
        console.log(response.data);
        console.log(`Created expense ${i}`);
        console.log(Date.now() - startTime);
    }

    // End timer and calculate time taken
    const endTime = Date.now();
    const timeTaken = endTime - startTime;

    console.log(`Time taken to create 10 expenses: ${timeTaken} ms`);

}


async function testOnChain(){
    // login as regulator


    // setup wallets
    const provider = new ethers.JsonRpcProvider(chainURL);
    const wallet = new ethers.Wallet(myPrivateKey, provider);
    const otherWallet = new ethers.Wallet(otherPrivateKey, provider);
    const Contract = await hre.ethers.getContractAt("ExpenseTracker", contractAddress);
    const contract = Contract.connect(wallet);
    console.log("Connected to contract", await contract.getAddress());

    let transactions = [];
    let myTx = await wallet.getNonce();
    const startTxCount = myTx;
    let N = 100;
    for (let i = 0; i < N; i++) {
        // time now in unix format
        let start_time = new Date();
        let currBlockTime = await provider.getBlock("latest");
        const expense = await contract.createExpense(
            Math.floor(Math.random() * 501).toString(),
            "test", 
            "1234", 
            {nonce: myTx}
        );
        transactions.push({ "hash": expense.hash, "tx-sent-time": start_time}); 
        console.log("Expense created: ", expense.hash, expense.nonce);   
        if( myTx <= expense.nonce){
            // console.log("Nonce not updated.. transaction still pending");
            myTx = expense.nonce + 1;
        }        
    }
    let pendingBlock = await provider.send("eth_getBlockByNumber", [
        "pending",
        false,
      ]);
    console.log("Pending block: ", pendingBlock.transactions.length);
    while(pendingBlock.transactions.length != 0){
        console.log("Waiting for transactions to be added to a block..");
        await new Promise(resolve => setTimeout(resolve, 1000));
        pendingBlock = await provider.send("eth_getBlockByNumber", [
            "pending",
            false,
          ]);
    }
    console.log("Pending block: ", pendingBlock.transactions.length);


    // for every transaction, check if it has been included. Once it has been included get the block number
    let minedTx = [];
    let maxBlockNumber = 0;
    while(minedTx.length < N){
        for (let i = 0; i < transactions.length; i++) {
            // dont keep checking mined transactions
            if(minedTx.includes(transactions[i].hash)){ continue; }

            // otherwise get transaction and check if it is inlcuded in a block
            const tx = await provider.getTransaction(transactions[i].hash);
            if( tx.isMined() ){
                minedTx.push(tx.hash);
                // get the block number it is included in
                transactions[i]["tx-mined-block"] = tx.blockNumber;
                // keep track of max block number
                if(tx.blockNumber > maxBlockNumber){
                    maxBlockNumber = tx.blockNumber;
                }
            }
        }
    }
    console.log("All transactions inlcuded");



    // wait for the maxBlockNumber + 1 to be mined
    let currBlockNo = await provider.getBlockNumber();
    while(currBlockNo < maxBlockNumber + 1){
        console.log("Waiting for next block to be mined..");
        await new Promise(resolve => setTimeout(resolve, 1000));
        currBlockNo = await provider.getBlockNumber();
    };
    console.log("All maxBlockNumber + 1 mined");


    for( let i = 0; i < transactions.length; i++){
        // get the block time of the block the transaction was included in + 1
        const block = await provider.getBlock(transactions[i]["tx-mined-block"] + 1);
        minedTime = new Date(block.timestamp * 1000);
        transactions[i]["mined-block-time"] = minedTime;
        let sentTime = new Date(transactions[i]["tx-sent-time"]);
        // calculate the diff
        transactions[i]["time-diff"] = minedTime - sentTime;
    }
    console.table(transactions);
    const csv = parse(transactions);
    fs.writeFileSync(`transactions-${N}-${Date.now()}.csv`, csv);
}


async function check(){
    const provider = new ethers.JsonRpcProvider(chainURL);
    const wallet = new ethers.Wallet(myPrivateKey, provider);
    const otherWallet = new ethers.Wallet(otherPrivateKey, provider);
    const Contract = await hre.ethers.getContractAt("ExpenseTracker", contractAddress);
    const contract = Contract.connect(otherWallet);
    console.log("Connected to contract", await contract.getAddress());
    // await contract.createExpense(100, "Test", "1234");
    // console.log("Created expense");
    const expenseCount = (await contract.getExpenseCount()).toNumber();
    console.log(expenseCount);
}
// testBackend();
testOnChain();
// check();