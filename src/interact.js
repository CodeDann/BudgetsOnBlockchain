const { Web3 } = require('web3');
const fs = require('fs');

// local chain url
const chainURL = 'http://127.0.0.1:7545';

// define contract path and addresses
const dataStoragePath = 'src/abis/DataStorage.json';
const dataStorageAddress = '0x17eEEf97fa7a70342DA28fa21f37fcaCd401BBa9';

const expensePath = 'src/abis/Expense.json';
const expenseAddress = '0xaE60fA9fE5E7435DcE59A09Db15532E28b7Ce559';

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
    // approve(contract);
    // saveData("data", contract);
    // createExpense(contract, 100);
    getExpenseAmount(contract, 1);


} catch (error) {
    console.error('Error running function:', error);
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

async function getValue(contract) {
    try {
    
        // Example: Call a function on the contract
        const storedData = await contract.methods.getValue().call();

        // console.log('retrieved data from smart contract:', storedData);
        console.log('Expense Value:', parseInt(storedData.toString()));
    } catch (error) {
        console.error('Error:', error);
    }
}

async function approve(contract, web3) {
    try {
        // approve the expense
        const message = contract.methods.approveExpense().call(); // Create a message
    
        // // Sign the message
        // const privateKey = '0x15448d5699e2d77662a5448077c215f875804804d081f3b3c61024363d11181a';
        // const signedMessage = web3.eth.accounts.sign(message, privateKey);
    
        // // Send a transaction using the signed message
        // const transaction = await web3.eth.sendSignedTransaction(signedMessage.rawTransaction);
        // console.log('Transaction Hash:', transaction.transactionHash);




        // if that does not fail then get the approve state
        const approved = await contract.methods.getApproved().call();
        console.log('Expense approve state:', approved);
    } catch (error) {
        console.error('Error:', error);
    }
}


async function saveData(data, contract) {
    try {
        const receipt = await contract.methods.saveData("YourData").send();
        console.log('Transaction Receipt:', receipt);

        console.log('saved data to smart contract:');

    } catch (error) {
        console.error('Error:', error);
    }
}

async function readData(contract) {
    try {
        // Call readData on the contract
        const storedData = await contract.methods.readData().call();

        // console.log('retrieved data from smart contract:', storedData);
        console.log('data read from smart contract:', storedData);
        console.log(typeof(storedData));
        console.log(storedData.length);

    } catch (error) {
        console.error('Error:', error);
    }
}

async function createExpense(contract, amount) {
    try {
        // Call contract method
        const storedData = await contract.methods.createExpense(amount).send({from: myAddress});
        console.log('created expense with id', storedData);
    } catch (error) {
        console.error('Error:', error);
    }
}

async function getExpenseAmount(contract, id) {
    try {
        // Call contract method
        const storedData = await contract.methods.getExpenseAmount(id).send({from: myAddress});
        console.log('expense has value', storedData);
    } catch (error) {
        console.error('Error:', error);
    }
}



// notes
// getContractVal(web3, expenseAddress);
// web3.eth.getStorageAt(address, 0) simply needs contract address to read data from it
async function getContractVal(web3, address){
    try{
        // const val = await web3.eth.getStorageAt(address, 0);
        web3.eth.getStorageAt(address, 0).then(result => {
            console.log(web3.utils.hexToAscii(result));
          });
        // console.log('Value:', val);
    } catch (error) {
        console.error('Error:', error);
    }
}