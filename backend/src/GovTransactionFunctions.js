// create transaction
async function createTrx(contract, amount, description, recipientAddress, recipientName, myNonce){
    try {
        const val = await contract.createTrx(amount, description, recipientAddress, recipientName, {nonce: myNonce});
        return val.nonce+1;
    } catch ( error ){
        throw error;
    }
}

// get all trx details
async function getTrxDetails(contract, trxId){
    trxCount = await contract.getTrxCount();
    if (trxId >= trxCount){
        return "Error: Transaction ID out of bounds!";
    }
    const amount = await contract.getTrxAmount(trxId);
    const description = await contract.getTrxDescription(trxId);
    const senderAddress = await contract.getTrxSenderAddress(trxId);
    const recipientAddress = await contract.getTrxRecipientAddress(trxId);
    const recipientName = await contract.getTrxRecipientName(trxId);

    return {amount, description, senderAddress, recipientAddress, recipientName};
}

async function getAllTrx(contract){
    try {
        const count = await contract.getTrxCount();
        const transactions = [];
        for (let i = 0; i < count; i++){
            const details = await getTrxDetails(contract, i);
            transactions.push(details);
        }
        return transactions;
    } catch ( error ){
        throw error;
    }
}


module.exports = {
    createTrx,
    getTrxDetails,
    getAllTrx
};