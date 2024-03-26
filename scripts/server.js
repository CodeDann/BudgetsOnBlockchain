const hre = require("hardhat");
const ethers = require("ethers");
const ETHandler = require("./ExpenseTrackerFunctions.js");


const chainURL = "http://127.0.0.1:8545/";
const myPrivateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
const otherPrivateKey = "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d"
const otherAddress = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
const contractAddress = "0x59b670e9fA9D0A427751Af201D676719a970857b";
const contractName = "ExpenseTracker"


async function main(){
    // set blockchain provider
    const provider = new ethers.JsonRpcProvider(chainURL);
    // connect to the priovider with a given wallet
    const wallet = new ethers.Wallet(otherPrivateKey, provider);
    // get the contract from the blockchain
    const Contract = await hre.ethers.getContractAt(contractName, contractAddress);
    // // connect to the contract with a given wallet
    const myExpenseTracker = Contract.connect(wallet);

    try {
        await ETHandler.createExpense(myExpenseTracker, 1000, "House Building", "IBAN1234567890");
        // await ETHandler.addPayee(myExpenseTracker, otherAddress);
        // await ETHandler.approveExpense(myExpenseTracker, 4);
        // console.log(await ETHandler.getExpenseCount(myExpenseTracker));
        // await ETHandler.createExpense(myExpenseTracker, 2000, "House Building", "IBAN1234567890");
        // await ETHandler.rejectExpense(myExpenseTracker, 1);



        // console.log(await ETHandler.getAllExpenses(myExpenseTracker));
        // const val = await ETHandler.getExpenseCount(myExpenseTracker);
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

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
});
