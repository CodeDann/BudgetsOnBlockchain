const contract = new web3.eth.Contract(abi, contractAddress);

const acc1privateKey = "f5eb4998f1d3566f931d43d410bc06436d1ba2903d13163047521185f79d8f9d";
const acc1 = web3.eth.accounts.privateKeyToAccount(acc1privateKey);

// Assuming you have the private key for the owner's address
const privateKey = Buffer.from('your_private_key', 'hex');


const data = "Your data to be stored";

const transaction = contract.methods.storeData(data);
const gas = await transaction.estimateGas({ from: owner });

const options = {
    to: contractAddress,
    gas: gas,
    gasPrice: web3.utils.toWei('10', 'gwei'),
    data: transaction.encodeABI(),
    nonce: await web3.eth.getTransactionCount(owner),
};

const signedTransaction = await web3.eth.accounts.signTransaction(options, privateKey);
const receipt = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);

console.log('Transaction receipt:', receipt);
