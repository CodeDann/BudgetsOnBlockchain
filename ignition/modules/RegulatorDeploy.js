const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("RegulatorDeployer", (m) => {

  const contract = m.contract("CouncilProjectRegulation", []);

  return { contract };
});