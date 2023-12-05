var dataStorage = artifacts.require("DataStorage");
// var expense = artifacts.require("Expense");

module.exports = function(deployer) {
  deployer.deploy(dataStorage);
  // deployer.deploy(expense);
};
