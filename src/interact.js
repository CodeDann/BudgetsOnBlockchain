const { Web3 } = require('web3');
const fs = require('fs');

// Replace with your Infura URL or Ethereum node URL
const chainURL = 'http://127.0.0.1:8545';

// Load contract ABI from file
const contractAbiPath = 'src/abis/DataStorage.json';
const myAddress = '0x68a9ddd8111fb61455be43432048e84994a7e824';

try {
    const contractAbiFile = fs.readFileSync(contractAbiPath, 'utf-8');
    const contractAbi = JSON.parse(contractAbiFile).abi;

    // Replace with your contract address
    const contractAddress = '0x52210944Bfa69cD9F857AB5ecF6e06aDF0aACBbD';

    

    // Call the function
    // saveData("data", contractAbi, contractAddress, myAddress);
    readData(contractAbi, contractAddress);
} catch (error) {
    console.error('Error reading or parsing the contract ABI file:', error);
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

async function readData(contractAbi, contractAddress) {
    try {
        // Connect to the Ethereum node
        const web3 = new Web3(chainURL);

        // Create a contract instance
        const contract = new web3.eth.Contract(contractAbi, contractAddress);

        // Example: Call a function on the contract
        const storedData = await contract.methods.readData().call();

        // console.log('retrieved data from smart contract:', storedData);
        console.log('data read from smart contract:', storedData);
        console.log(typeof(storedData));
        console.log(storedData.length   );

    } catch (error) {
        console.error('Error:', error);
    }
}