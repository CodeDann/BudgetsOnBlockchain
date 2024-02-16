const ethers = require("ethers");
const fs = require('fs');

// local chain url
const chainURL = 'HTTP://127.0.0.1:9545';

// define contract path and addresses
// note: need to update address when new contract is deployed or chain re-started
const abiPath = 'src/abis/ExpenseTracker.json';
const expenseTrackerAddress = '0x963b32715f4fbF3f47D3E6f0F9c0838E9235c4f1';


function getABI(contractPath){
    const contractAbiFile = fs.readFileSync(contractPath, 'utf-8');
    const contractAbi = JSON.parse(contractAbiFile).abi;

    return contractAbi;
}

async function listenForEvents(){
    // Connect to the Ethereum node
    const provider = new ethers.JsonRpcProvider(chainURL);
    const contract = new ethers.Contract(expenseTrackerAddress, getABI(abiPath), provider); 

    

    // listen to any ExpenseCreated events
    contract.on("ExpenseCreated", (expenseId, amount) => {
        console.log(`Expense Created with ID: ${expenseId.toString()} and Amount: ${amount.toString()}`);
    });

    //listen to any ExpenseApproved events and flag if they are over an amount
    contract.on("ExpenseApproved", (expenseId, approver, amount, description, payee) => {
        if (approver === payee){
            console.log("RED FLAG! Approver and Payee are the same!");
        }
        if (amount > 1000){
            console.log("RED FLAG! Expense approved with amount over 1000!");
        }
    });

    console.log(`Client is listening to ${chainURL}`);
    // Keep the script running to listen for events every 500ms
    while(true){
        await new Promise(resolve => setTimeout(resolve, 500)); // Wait for 1 second in each iteration
    }

}

listenForEvents().catch(console.error);