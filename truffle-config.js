module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more about customizing your Truffle configuration!
  networks: {
    develop: {
      host: "127.0.0.1",
      port: 9545,
      network_id: "5777", // Match any network id,
      networkCheckTimeout: 10000, 
      gas: 6721975,
    },
  },
  contracts_build_directory: "./src/abis/",
  compilers: {
    solc: {
      version: "0.8.0"
    }
  }
};
