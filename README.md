# BudgetsOnBlockchain
Budgets on Blockchain is a Fullstack dApp for providing transparency in City Council spending.

# Instructions for use

## Requirements
1. Make
2. npm
## Running the applicaiton
> All commands should be run at the root of this directory
1.  Start the hardhat local ethereum network
    ```console
    make start-node
    ```
    This starts the hardhat network and provides accounts preloaded with ether to use in the application

2. In a new console, Deploy Smart Contracts to Hardhat
    ```console
    make deploy
    ```
    This will compile, test, and deploy the smart contracts needed for the application to function to the node we just created.
    > Note this can take some time ( 2+ mins )

3. Copy the ExpenseTracker address from the console
    After the contracts have been deployed the address of the ExpenseTracker contract should be logged in the console. Copy this as it is needed to interact with the application.

    See here for an example. 
    
    ![Contract Deployment in terminal](/documentation/DeployedContracts.png)

4. Start the Backend
    ```console
    make start-backend
    ```
    This will start the backend Express server that allows communication between the Frontend React Web App and the contracts deployed on Chain

5. Start the Frontend
    ```console
    make start-frontend
    ```
    Frontend webapp should start and be accessable at http://localhost:5173/
