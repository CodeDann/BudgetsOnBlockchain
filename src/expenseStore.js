const { Web3 } = require('web3');
const fs = require('fs');
const { create } = require('domain');
const { get } = require('ss/lib/AggreProto');

// local chain url
const chainURL = 'http://127.0.0.1:7545';

// define contract path and addresses
// note: need to update address when new contract is deployed or chain re-started
const expenseTracker = 'src/abis/ExpenseTracker.json';
const expenseTrackerAddress = '0x710ae80C39cc325e06B14bD8D60F9D66E9C921ed';

// define sender address
const myAddress = '0x05867a49E08E81564bc3Fd29Bb34531Dba2C9c31';

// define approver address
const approverAddress = '0x05867a49E08E81564bc3Fd29Bb34531Dba2C9c31';

async function main(){
    try {
        // Connect to the Ethereum node
        const web3 = new Web3(chainURL);
    
    
        // get a contract instance and set default account
        // contract = getContract(expensePath, expenseAddress, web3);
        contract = getContract(expenseTracker, expenseTrackerAddress, web3);
        contract.defaultAccount = myAddress;
    
    
        // call function on contract
        await showAllExpenses(contract);
        await approveExpenseWithId1(contract, 0);
        // await getExpenseDescriptionWithId(contract, 0);
        
    
        // expenseDetails = {
        //     amount: 1234,
        //     description: "test expense",
        //     payee: "test payee",
        // }
        // createExpense(contract, expenseDetails);
    
    
    
        // getExpenseAmount(contract, "0");
    
    } catch (error) {
        console.error('Error running function:', error);
    }    
}


async function createExpense(contract, expenseDetails) {
    try {
        // Call contract method
        // have to send as this is a transaction
        const storedData = await contract.methods.createExpense(expenseDetails.amount, expenseDetails.description, expenseDetails.payee).send({from: myAddress, gas: 3000000});
       

        /// get the expense id which is returned from the function
        var expenseId = storedData.events.ExpenseCreated.returnValues.expenseId;
        console.log('created expense with id', expenseId);
        return expenseId;
    } catch (error) {
        console.error('Error:', error);
    }
}

async function getExpenseAmount(contract, id) {
    try {
        // Call contract method
        const storedData = await contract.methods.getExpenseAmount(id).call({from: myAddress});
        console.log(`expense #${id} has value`, storedData);
    } catch (error) {
        console.error('Error:', error);
    }
}


function getContract(contractPath, contractAddress, web3) {
    try{
        // react contract from file and parse it out
        const contractAbiFile = fs.readFileSync(contractPath, 'utf-8');
        const contractAbi = JSON.parse(contractAbiFile).abi;
        // Create a contract instance
        const contract = new web3.eth.Contract(contractAbi, contractAddress);
        return contract;
    } catch (error) {
        console.error('Error reading or parsing the contract ABI file:', error);
    }

}

async function getNumbExpenses(contract) { 
    try {
        // Call contract method
        const numbExpenses = await contract.methods.expenseCount().call({from: myAddress});
        console.log(`there are ${numbExpenses} expenses in the system`);
    } catch (error) {
        console.error('Error:', error);
    }
}

async function showAllExpenses(contract){
    try {
        // Call contract method
        const numbExpenses = await contract.methods.expenseCount().call({from: myAddress});
        console.log(`there are ${numbExpenses} expenses in the system`);
        for (let i = 0; i < numbExpenses -1; i++) {
            const expense = await contract.methods.printExpense(i).call({from: myAddress});
            console.log(expense);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function showExpenseStatus(contract, id) {
    try {
        // Call contract method
        const status = await contract.methods.isExpenseApproved(id).call({from: myAddress});
        console.log(`expense #${id} has approval status:`, status);
    } catch (error) {
        console.error('Error:', error);
    }
}

async function approveExpenseWithId(contract, id) {
    try {
        // approve the expense
        const message = await contract.methods.approveExpense(id).send({from: myAddress, gas: 3000000}); // Create a message
        console.log('expense with id ', id, ' has been approved');

    } catch (error) {
        console.error('Error:', error);
    }
}

async function getExpenseDescriptionWithId(contract, id) {
    try {
        // Call contract method
        const description = await contract.methods.getExpenseDescription(id).call({from: myAddress});
        console.log(`expense #${id} has description:`, description);
    } catch (error) {
        console.error('Error:', error);
    }
}

async function getExpensePayeeWithId(contract, id) {
    try {
        // Call contract method
        const address = await contract.methods.getExpensePayee(id).call({from: myAddress});
        console.log(`expense #${id} has payee address:`, address);
    } catch (error) {
        console.error('Error:', error);
    }
}

main();