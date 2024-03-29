const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("Deployer", (m) => {

  const CouncilName = "Leeds City Council";
  const CouncilIdentifier = 1;
  const ProjectName = "Project Y";
  const ProjectIdentifier = 1;
  const ProjectBudget = 10000;


  const contract = m.contract("ExpenseTracker", [CouncilName, CouncilIdentifier, ProjectName, ProjectIdentifier, ProjectBudget]);

  return { contract };
});