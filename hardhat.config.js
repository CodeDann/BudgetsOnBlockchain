require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-ignition-ethers");

module.exports = {
  solidity: "0.8.24",
  networks: {
    hardhat: {
      mempool: {
        order: "fifo"
      },
      gas: "auto",
      mining: {
        auto: false,
        interval: 12000
      }
    },
  },
};

