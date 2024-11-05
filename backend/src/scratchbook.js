const TrxHandler = require("./GovTransactionFunctions.js");
const ethers = require("ethers");
const hre = require("hardhat");

async function run(){
    // connect to the chain
    const url = "http://127.0.0.1:8545";
    const provider = new ethers.JsonRpcProvider(url);

    // get an instance of the contract from the chain
    const contractName = "GovTransactions";
    const contractAddress = "0x0165878A594ca255338adfa4d48449f69242Eb8F";
    const contract = await hre.ethers.getContractAt(contractName, contractAddress);

    // connect a wallet to the contract
    const key = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
    const wallet = new ethers.Wallet(key, provider);
    const Contract = contract.connect(wallet);

    // Test the wallet / contract connection
    const addr = await contract.getAddress();

    if ( contractAddress != addr ){
        throw "Error: Contract Address or Private Key invalid!";
    }

    var Nonce = await wallet.getNonce()



    // Test the contract
    // allTrx = await TrxHandler.getAllTrx(Contract);
    // console.log(allTrx);

    Nonce = TrxHandler.createTrx(Contract, 59, "good Gov Spending2", "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", "GoodCorp", Nonce);

}

run();



// {nonce: myNonce}