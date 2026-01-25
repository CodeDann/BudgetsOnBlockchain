const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("Alpha", (m) => {
    const name = "The Transparency Charity";
    const id = 1;
    const validAddressses = ["0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"]

    const CPR = m.contract("TransactionRegulation", []);

    const GT = m.contract("TransparentTransactions", [name, id, CPR, validAddressses]);
    
    return { CPR, GT};
});