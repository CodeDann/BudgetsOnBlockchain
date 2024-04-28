import axios from "axios";
import * as React from 'react';
import { useState } from 'react'
import TableComponent from './jsonTable.jsx'
import headerImage from '../assets/eth-logo.jpg'
import '../App.css'
import '../index.css'
import baseUrl from '../config.js'
import 'bootstrap/dist/css/bootstrap.min.css';
import { ethers } from 'ethers';


function CouncilComponent() {

    // approve expense handlers
    const [approveResponse, setApproveResponse] = useState('')
    const [approve_id, setApprove_id] = useState('')
    const [expenses, setExpenses] = useState([{}]);

    // add/remove payee handlers
    const [ARResponse, setARResponse] = useState('')
    const [payeeAddr, setpayeeAddr] = useState('')

    // setup handlers
    const [url, setUrl] = useState('')
    const [pKey, setpKey] = useState('')
    const [cAddress, setcAddress] = useState('')
    const [myWalletAddress, setMyWalletAddress] = useState('')
    const [mySessionID, setMySessionID] = useState('')
    const [setupResponse, setSetupResponse] = useState('')

    // call backend api to setup
    const callSetup = async (url, pKey, cAddress) => {

        const payload = {
            url: url,
            key: pKey,
            address: cAddress,
        }

        // save wallet from private key
    
        axios.post(baseUrl + "/login", payload).then((response) => {
            if ( response.data.message == "Connection Successful"){
                setMyWalletAddress(response.data.address);
                setMySessionID(response.data.sessionID);
                setSetupResponse(response.data.message);
            } else {
                console.log(response.data.message);
                setSetupResponse(response.data.message);
            }
        }).catch((error) => {
            setSetupResponse(error);
        });
    }
    // call backend api to approve an expense
    const callApproveExpense = async (id) => {
        const payload = {
            sessionID: mySessionID,
            id: id
        }

        console.log(payload);

        axios.post(baseUrl + "/approveExpense", payload).then((response) => {
            setApproveResponse(response.data) // Convert object to string
        }
        );
    }

    // call backend api to approve an expense
    const callRejectExpense = async (id) => {
        const payload = {
            sessionID: mySessionID,
            id: id
        }

        axios.post(baseUrl + "/rejectExpense", payload).then((response) => {
            setApproveResponse(response.data) // Convert object to string
        }
        );
    }

    // call backend api to add an payee to the list of payeesx 
    const callAddPayee = async (payeeAddr) => {
        const payload = {
            sessionID: mySessionID,
            address: payeeAddr
        }

        axios.post(baseUrl + "/addPayee", payload).then((response) => {
            setARResponse(response.data);
        });
    }

    // call backend api to remove an payee from the list of payees
    const callRemovePayee = async (payeeAddr) => {
        const payload = {
            sessionID: mySessionID,
            address: payeeAddr
        }

        axios.post(baseUrl + "/removePayee", payload).then((response) => {
            setARResponse(response.data) // Convert object to string
        });
    }

    const callListExpenses = async () => {
        const payload = {
            sessionID: mySessionID,
        }


        axios.post(baseUrl + "/listExpenses", payload).then((response) => {
            if (response.status === 200) {
                var data = response.data;
                setExpenses(data);
            } else {
                setExpenses([{
                }]);
            }
        });
    }


    if ( mySessionID == "" ){
        return <>
            {/* setup block */}
            <div className="my-card">
                <h2> Login </h2>
                <div className='custom-card'>
                    <input type="text" id="url" name="url" placeholder="Chain URL" value={url} onChange={e => setUrl(e.target.value)} />
                    <input type="text" id="pKey" name="pKey" placeholder="Wallet Private Key" value={pKey} onChange={e => setpKey(e.target.value)} />
                    <input type="text" id="cAddress" name="cAddress" placeholder="Contract Address" value={cAddress} onChange={e => setcAddress(e.target.value)} />
                    <button variant="contained" onClick={() => callSetup(url, pKey, cAddress)} disabled={!url || !pKey || !cAddress}>
                        Login
                    </button>
                </div>
                    <div>
                        <h4>API Response</h4>
                        <p className='api-response'>{setupResponse}</p>
                    </div>
            </div>
        </>
    } else {
        return <>
                <div className="App">
                     {/* header contains url, wallet address and contract address */}
                     <header>
                        <div className="header-table">
                            <TableComponent data={[{'Chain URL' : url, 'Connected Wallet Address' : myWalletAddress, 'Connected Contract Address' : cAddress}]}/>
                        </div>
                    </header>

                    <div>
                        <img src={headerImage} className="fixed-headerimag logo" alt="Blockchain background image" />
                    </div>

                    <h2>Transparent Council Spending: Council Portal</h2>

                    {/* add/ remove payee block */}
                    <div className="my-card">
                        <h2>Add / Remove Payee</h2>
                        <div className='custom-card'>
                            <input type="text" id="payeeAddr" name="payeeAddr" placeholder="Payee Wallet Address" value={payeeAddr} onChange={e => setpayeeAddr(e.target.value)} />
                            <button variant="contained" onClick={() => callAddPayee(payeeAddr)} disabled={!payeeAddr}>
                                Add Payee
                            </button>
                            <button variant="contained" onClick={() => callRemovePayee(payeeAddr)} disabled={!payeeAddr}>
                                Remove Payee
                            </button>
                        </div>
                        <p className='api-response'>{ARResponse}</p>
                    </div>

                    {/* approve expense block */}
                    <div className="my-card">
                        <h2>Approve / Reject Expense</h2>
                        <div className='custom-card'>
                            <input type="text" id="approve_id" name="approve_id" placeholder="Expense ID" value={approve_id} onChange={e => setApprove_id(e.target.value)} />
                            <button variant="contained" onClick={() => callApproveExpense(approve_id)} disabled={!approve_id}>
                                Approve Expense
                            </button>
                            <button variant="contained" onClick={() => callRejectExpense(approve_id)} disabled={!approve_id}>
                                Reject Expense
                            </button>
                        </div>
                        <p className='api-response'>{approveResponse}</p>
                    </div>


                    {/* list expenses block */}
                    <div className="my-card">
                        <h2>List Expenses</h2>
                        <div className='custom-card'>
                            <p>Click the button to fetch all expenses from the blockchain.</p>
                            <button onClick={callListExpenses}>
                                List Expenses
                            </button>
                        </div>
                        <h3>Expense Data</h3>
                        <div className="expense-table">
                            <TableComponent data={expenses} />
                        </div>
                    </div>
                </div>
            </>
    }
}

export default CouncilComponent