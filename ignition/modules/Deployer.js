const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("Alpha", (m) => {
    const CouncilName = "Leeds City Council";
    const CouncilIdentifier = 1;
    const ProjectName = "Project Y";
    const ProjectIdentifier = 1;
    const ProjectBudget = 10000;
    const approverAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"; 

    const CPR = m.contract("CouncilProjectRegulation", []);

    const ET = m.contract("ExpenseTracker", [CouncilName, CouncilIdentifier, ProjectName, ProjectIdentifier, ProjectBudget, CPR, approverAddress]);
    
    return { CPR, ET };
});