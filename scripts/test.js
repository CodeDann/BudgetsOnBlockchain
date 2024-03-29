// external imports
const hre = require("hardhat");
const ethers = require("ethers");
const chainURL = "http://127.0.0.1:8545/";
const myPrivateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
const otherPrivateKey = "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d"
const otherAddress = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
const contractAddress = "0x59b670e9fA9D0A427751Af201D676719a970857b";
const contractName = "ExpenseTracker"


async function main(){
    const provider = new ethers.JsonRpcProvider(chainURL);
    const wallet = new ethers.Wallet(myPrivateKey, provider);
    const Contract = await hre.ethers.getContractAt(contractName, contractAddress);
    const contract = Contract.connect(wallet);


    const regulatorAddress = await contract.RegulatorContractAddress();
    // console.log(regulatorAddress);
    const regulatorContract = await hre.ethers.getContractAt("CouncilProjectRegulation", regulatorAddress);
    // regulatorContract.on("ExpenseFlag", (CouncilID) => {
    //     console.log(CouncilID);
    // });

    // provider.on("pending", async (tx) => {
    //     const transaction = await provider.getTransaction(tx);
    //     if (transaction.to === contractAddress) {
    //         const methodId = transaction.data.slice(0, 10);
    //         const fragment = contract.interface.getFunction(methodId);
    //         if (fragment && fragment.name === "checkExpenseValue") {
    //             console.log("checkExpenseValue function called");
    //         }
    //     }
    // });

    regulatorContract.on("ExpenseFlag", (councilID, projectid, expenseId, amount, description, IBAN, payee_identifier) => {
        customEvent = { CouncilID: councilID.toString(), ProjectID: projectid.toString(), ExpenseID: expenseId.toString(), Amount: amount.toString(), Description: description.toString(), IBAN: IBAN.toString(), PayeeID: payee_identifier.toString()};
        console.log(customEvent);
        resolve(customEvent);

    });
}
main();