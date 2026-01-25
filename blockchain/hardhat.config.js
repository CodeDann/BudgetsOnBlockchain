require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-ignition-ethers");

module.exports = {
  solidity: "0.8.24",
  networks: {
    hardhat: {
      gas: "auto",
      mining: {
        auto: false,
        interval: 12000
      }
    },
  },
};

