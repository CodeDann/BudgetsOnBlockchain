# Blockchain Labs

## Uses hardhat as local ethereum provider
### install
- npm hardhat install
### start project
- npx hardhat init


## Taxonomy
1. Contracts
2. Tests
3. Ignition ( for deploying )
    - additional dependency
4. Scripts ( for interracting )


## Quickstart

1. Write Smart Contract ( Example.sol )
2. Compile Smart Contract
    ```console 
        npx hardhat compile
    ```
3. Test Smart Contract ( test/Example.js )
    ```js
        const {
        loadFixture,
        } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
        const { expect } = require("chai");

        describe("Example", function () {
        // We define a fixture to reuse the same setup in every test.
        // We use loadFixture to run this setup once, snapshot that state,
        // and reset Hardhat Network to that snapshot in every test.
        async function deployContract() {
            // Contracts are deployed using the first signer/account by default
            const [owner, otherAccount] = await ethers.getSigners();

            const Contract = await ethers.getContractFactory("Example");
            const contract = await Contract.deploy();
            // this returns the contract instance, the address of the account that deployed the contract and the address of a second account for testing purposes
            return { contract, owner, otherAccount };
        }
        // example test that the deployment came from the owner
        describe("Deployment", function () {

            it("Should set the right owner", async function () {
            const { carpark, owner } = await loadFixture(deployCarPark);

            expect(await carpark.parkOwner()).to.equal(owner.address);
            });
        });
        });
    ```
4. Run Local Ethereum Node 
    - npx hardhat node
5. Create an ignition deployer
    - ignition/modules/Deployer.js
    ```js
        const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

        module.exports = buildModule("Deployer", (m) => {
        const contract = m.contract("Example", []);

        return { contract };
        });
    ```
6. Run ignition deployer
    ```console
        npx hardhat ignition deploy ./ignition/modules/Deployer.js --network localhost
    ```
    - Note you need to remove the current deployment before redeploying
    - Should see your node process the deployment transaction
    - Copy the address the contract deploys to

7. Call Contract Functinos
    ```js
        const hre = require("hardhat");
        const ethers = require("ethers");
        // set blockchain provider
        const provider = new ethers.JsonRpcProvider(chainURL);
        // connect to the priovider with a given wallet
        const wallet = new ethers.Wallet(myPrivateKey, provider);

        // get the contract from the blockchain
        const Contract = await hre.ethers.getContractAt(contractName, contractAddress);
        // // connect to the contract with a given wallet
        const contract = Contract.connect(wallet);

        // call function 'enter' from the contract
        await contract.enter();
    ```