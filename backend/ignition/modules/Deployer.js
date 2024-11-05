const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("Alpha", (m) => {
    const GovName = "GovOfTransparency";
    const GovId = 1;
    const validAddressses = ["0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"]

    const CPR = m.contract("GovTransactionRegulation", []);

    const GT = m.contract("GovTransactions", [GovName, GovId, CPR, validAddressses]);
    
    return { CPR, GT};
});