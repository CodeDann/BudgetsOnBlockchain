const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("Deployer", (m) => {

  const CouncilName = "Leeds City Council";
  const CouncilIdentifier = 1;
  const ProjectName = "Project Y";
  const ProjectIdentifier = 1;
  const ProjectBudget = 10000;
  const RegulatorAddress = "0x322813Fd9A801c5507c9de605d63CEA4f2CE6c44";


  const contract = m.contract("ExpenseTracker", [CouncilName, CouncilIdentifier, ProjectName, ProjectIdentifier, ProjectBudget, RegulatorAddress]);

  return { contract };
});