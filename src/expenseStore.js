const { Web3 } = require('web3');
const fs = require('fs');
const { create } = require('domain');
const { get } = require('ss/lib/AggreProto');

// local chain url
const chainURL = 'http://127.0.0.1:7545';

// define contract path and addresses
// note: need to update address when new contract is deployed
const expenseTracker = 'src/abis/ExpenseTracker.json';
const expenseTrackerAddress = '0x8214b34124Edc13896890273A4BA09FE7C5C8274';

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
    showAllExpenses(contract);

    // getNumbExpenses(contract);

    // expenseDetails = {
    //     amount: 1234,
    //     description: "test expense",
    //     payee: "test payee"
    // }
    // createExpense(contract, expenseDetails);



    // getExpenseAmount(contract, "0");

} catch (error) {
    console.error('Error running function:', error);
}

async function createExpense(contract, expenseDetails) {
    try {
        // Call contract method
        // have to send as this is a transaction
        const storedData = await contract.methods.createExpense(expenseDetails.amount, expenseDetails.description, expenseDetails.payee).send({from: myAddress, gas: 3000000});
       

        /// get the expense id which is returned from the function
        var expenseId = storedData.events.ExpenseCreated.returnValues.expenseId;
        console.log('created expense with id', expenseId);
        return expenseId;
    } catch (error) {
        console.error('Error:', error);
    }
}

async function getExpenseAmount(contract, id) {
    try {
        // Call contract method
        const storedData = await contract.methods.getExpenseAmount(id).call({from: myAddress});
        console.log(`expense #${id} has value`, storedData);
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
        console.log(`there are ${numbExpenses} expenses in the system`);
        for (let i = 0; i < numbExpenses; i++) {
            const expense = getExpenseAmount(contract, i);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}