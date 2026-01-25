const TrxHandler = require("./GovTransactionFunctions.js");
const ethers = require("ethers");
const hre = require("hardhat");

// DEFAULT VALUES FOR KEY / CHAINURL etc...
const key = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
const chainUrl = "http://127.0.0.1:8545";
const contractName = "GovTransactions";
const contractAddr = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

// DEFAULT VALS FOR A TRX
const amount = 50;
const description = "Good Spending";
const recipientAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const recipientName = "Good Corp";

async function recordTrx(key, chainUrl, contractName, contractAddr) {
    // connect to the chain
    const provider = new ethers.JsonRpcProvider(chainUrl);

    // get an instance of the contract from the chain
    const contract = await hre.ethers.getContractAt(contractName, contractAddr);

    // connect wallet to the contract
    const wallet = new ethers.Wallet(key, provider);
    const Contract = contract.connect(wallet);

    // Test the wallet / contract connection
    if (contractAddr != await Contract.getAddress()) {
        throw "Error: Contract Address or Private Key invalid!";
    }

    // create trx
    Nonce = await wallet.getNonce();
    TrxHandler.createTrx(Contract, amount, description, recipientAddress, recipientName, Nonce);
}

recordTrx(key, chainUrl, contractName, contractAddr);
