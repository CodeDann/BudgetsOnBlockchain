const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("Deployer", (m) => {

  const CouncilName = "Leeds City Council";
  const CouncilIdentifier = 1;
  const ProjectName = "Project Y";
  const ProjectIdentifier = 1;
  const ProjectBudget = 10000;
  const RegulatorAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";


  const contract = m.contract("ExpenseTracker", [CouncilName, CouncilIdentifier, ProjectName, ProjectIdentifier, ProjectBudget, RegulatorAddress]);

  return { contract };
});