// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./GovTransactionRegulation.sol";


contract GovTransactions {
    // public details for this contract
    string public GovName;
    uint256 public GovId;
    address public RegulatorContractAddress;
    GovTransactionRegulation regulator;

    // list of approved addresses
    // address[] public validAddressArray;
    mapping(address => bool) public validAddressArray;


    // these details are set upon creation
    // the approver is set as the person who deploys the contract
    constructor(string memory _GovName, uint256 _GovId, address _RegulatorContractAddress, address[] memory _validAddresses) {
        GovName = _GovName;
        GovId = _GovId;
        // add all valid addresses to the array
        for( uint256 i = 0; i < _validAddresses.length; i ++){
            validAddressArray[_validAddresses[i]] = true;
        }
        // setup the regulator        
        RegulatorContractAddress = _RegulatorContractAddress;
        regulator = GovTransactionRegulation(RegulatorContractAddress);
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
        address senderAddress;
        address recipientAddress;
        string recipientName;
    }

    // Mapping of transactions
    mapping(uint256 => Transaction) public transactions;
    // transaction counter
    uint256 public trxCount;

    // -------- Events --------
    // event to log the creation of an trx
    event TrxLog(uint256 GovId, uint256 trxCount, uint256 amount, string description, address senderAddress, address recipientAddress, string recipientName);

    // -------- Functions -------
    // Create an expense with given parameters
    function createTrx(uint256 _amount, string calldata _description, address _recipientAddress, string calldata _recipientName) external approvedAddress(){
        transactions[trxCount] = Transaction(trxCount, _amount, _description, msg.sender, _recipientAddress, _recipientName);
        emit TrxLog(GovId, trxCount, _amount, _description, msg.sender, _recipientAddress, _recipientName);
        trxCount++;
    }

    // -------- Getters ---------
    function getTrxAmount(uint256 _trxId) external validTrx(_trxId) view returns (uint256) {
        return transactions[_trxId].amount;
    }
    function getTrxDescription(uint256 _trxId) external validTrx(_trxId) view returns (string memory) {
        return transactions[_trxId].description;
    }
    function getTrxSenderAddress(uint256 _trxId) external validTrx(_trxId) view returns (address) {
        return transactions[_trxId].senderAddress;
    }
    function getTrxRecipientAddress(uint256 _trxId) external validTrx(_trxId) view returns (address) {
        return transactions[_trxId].recipientAddress;
    }
    function getTrxRecipientName(uint256 _trxId) external validTrx(_trxId) view returns (string memory) {
        return transactions[_trxId].recipientName;
    }

    function getTrxCount() external view returns (uint256) {
        return trxCount;
    }
}
