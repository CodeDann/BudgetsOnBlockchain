const { Web3 } = require('web3');
const fs = require('fs');

// local chain url
const chainURL = 'http://127.0.0.1:7545';

// define contract path and addresses
const dataStoragePath = 'src/abis/DataStorage.json';
const dataStorageAddress = '0x52210944Bfa69cD9F857AB5ecF6e06aDF0aACBbD';

const expensePath = 'src/abis/Expense.json';
const expenseAddress = '0xABf58CCB2131553F48E59DC95096C9b03fefC023';

// define sender address
const myAddress = '0x68a9ddd8111fb61455be43432048e84994a7e824';

try {
    // Connect to the Ethereum node
    const web3 = new Web3(chainURL);
    // get a contract instance
    // contract = getContract(expensePath, expenseAddress, web3);
    contract = getContract(dataStoragePath, dataStorageAddress, web3);

    // call function on contract
    readData(contract);

} catch (error) {
    console.error('Error reading or parsing the contract ABI file:', error);
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

async function approve(contract) {
    try {
        // approve the expense
        const message = contract.methods.approveExpense().encodeABI(); // Create a message
    
        // Sign the message
        const privateKey = 0xb4cf0722e19f9bc74a92cf11f64eca85c2c166de7b05e8c4cba9c594bc73eb30;
        const signedMessage = web3.eth.accounts.sign(message, privateKey);
    
        // Send a transaction using the signed message
        const transaction = await web3.eth.sendSignedTransaction(signedMessage.rawTransaction);
        console.log('Transaction Hash:', transaction.transactionHash);




        // if that does not fail then get the approve state
        const approved = await contract.methods.isApproved().call();
        console.log('Expense approve state:', approved);
    } catch (error) {
        console.error('Error:', error);
    }
}


async function saveData(data, contractAbi, contractAddress, senderAddress) {
    try {
        // Connect to the Ethereum node
        const web3 = new Web3(chainURL);

        // Create a contract instance
        const contract = new web3.eth.Contract(contractAbi, contractAddress);

        // Example: Call a function on the contract
        const receipt = await contract.methods.saveData("YourData").send({ from: senderAddress });
        console.log('Transaction Receipt:', receipt);

        // const storedData = await contract.methods.saveData(data).call();

        // console.log('retrieved data from smart contract:', storedData);
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