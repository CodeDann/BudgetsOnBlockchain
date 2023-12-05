var Contract = artifacts.require("DataStorage");

module.exports = function(deployer) {
  deployer.deploy(Contract);
};
