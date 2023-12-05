const { Web3 } = require('web3');
const fs = require('fs');

// local chain url
const chainURL = 'http://127.0.0.1:7545';

const expenseTracker = 'src/abis/ExpenseTracker.json';
const expenseTrackerAddress = '0x26348e169a7e294424BAbc64380d18BA712A51f3';

// define sender address
const myAddress = '0x05867a49E08E81564bc3Fd29Bb34531Dba2C9c31';

try {
    // Connect to the Ethereum node
    const web3 = new Web3(chainURL);


    // get a contract instance and set default account
    // contract = getContract(expensePath, expenseAddress, web3);
    contract = getContract(expenseTracker, expenseTrackerAddress, web3);
    contract.defaultAccount = myAddress;


    // call function on contract
    // createExpense(contract, 99);
    // getExpenseAmount(contract, "4");


} catch (error) {
    console.error('Error running function:', error);
}

async function createExpense(contract, amount) {
    try {
        // Call contract method
        // have to send as this is a transaction
        const storedData = await contract.methods.createExpense(amount).send({from: myAddress});
        /// get the expense id which is returned from the function
        console.log('created expense with id', storedData.events.ExpenseCreated.returnValues.expenseId);
    } catch (error) {
        console.error('Error:', error);
    }
}

async function getExpenseAmount(contract, id) {
    try {
        // Call contract method
        const storedData = await contract.methods.getExpenseAmount(id).call({from: myAddress});
        console.log('expense has value', storedData);
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
