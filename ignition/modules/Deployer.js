const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("Deployer", (m) => {
  const contract = m.contract("ExpenseTracker", []);

  return { contract };
});