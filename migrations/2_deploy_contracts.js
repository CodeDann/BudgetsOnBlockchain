var tracker = artifacts.require("ExpenseTracker");
// var regulator = artifacts.require("Regulator");

module.exports = function(deployer) {
  deployer.deploy(tracker);
  // deployer.deploy(regulator);

};
