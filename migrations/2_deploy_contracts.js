var tracker = artifacts.require("ExpenseTracker");

module.exports = function(deployer) {
  deployer.deploy(tracker);

};
