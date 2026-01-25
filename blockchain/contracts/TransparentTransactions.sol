// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./TransactionRegulation.sol";


contract TransparentTransactions {
    // public details for this contract
    string public name;
    uint256 public id;
    address public RegulationContractAddress;
    TransactionRegulation regulation;

    // list of approved addresses
    // address[] public validAddressArray;
    mapping(address => bool) public validAddressArray;


    // these details are set upon creation
    // the approver is set as the person who deploys the contract
    constructor(string memory _name, uint256 _id, address _RegulationContractAddress, address[] memory _validAddresses) {
        name = _name;
        id = _id;
        // add all valid addresses to the array
        for( uint256 i = 0; i < _validAddresses.length; i ++){
            validAddressArray[_validAddresses[i]] = true;
        }
        // setup the regulator        
        RegulationContractAddress = _RegulationContractAddress;
        regulation = TransactionRegulation(RegulationContractAddress);
    }

    // modifier to check if the caller is a known address
    modifier approvedAddress() {
        require(validAddressArray[msg.sender], "Only approved addresses can record transactions");
        _;
    }

    // modifier for quick trx existance
    modifier validTrx(uint256 _trxId) {
        require(_trxId <= trxCount, "Transaction does not exist!");
        _;
    }



    // Define a transaction
    // ID: unique identifier
    // Amount: the value of the transaction
    // Description: short text description
    // Department: the address of the department making the transaction
    // Recipient: Who the money was sent to

    struct Transaction {
        uint256 id;
        uint256 amount;
        string description;
        string recipientName;
        address proccessedBy;
    }

    // Mapping of transactions
    mapping(uint256 => Transaction) public transactions;
    // transaction counter
    uint256 public trxCount;

    // -------- Events --------
    // event to log the creation of an trx
    event TrxLog(uint256 id, uint256 trxCount, uint256 amount, string description, string recipientName, address proccessedBy);

    // -------- Functions -------
    // Create an expense with given parameters
    function createTrx(uint256 _amount, string calldata _description, string calldata _recipientName) external approvedAddress(){
        transactions[trxCount] = Transaction(trxCount, _amount, _description, _recipientName, msg.sender);
        emit TrxLog(id, trxCount, _amount, _description, _recipientName, msg.sender);
        trxCount++;
    }

    // -------- Getters ---------
    function getTrxAmount(uint256 _trxId) external validTrx(_trxId) view returns (uint256) {
        return transactions[_trxId].amount;
    }
    function getTrxDescription(uint256 _trxId) external validTrx(_trxId) view returns (string memory) {
        return transactions[_trxId].description;
    }
    function getTrxRecipientName(uint256 _trxId) external validTrx(_trxId) view returns (string memory) {
        return transactions[_trxId].recipientName;
    }
    function getTrxProcessorAddress(uint256 _trxId) external validTrx(_trxId) view returns (address) {
        return transactions[_trxId].proccessedBy;
    }

    function getTrxCount() external view returns (uint256) {
        return trxCount;
    }
}
