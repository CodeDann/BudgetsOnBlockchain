import axios from "axios";
import * as React from 'react';
import { useState } from 'react'
import TableComponent from './jsonTable.jsx'
import headerImage from '../assets/eth-logo.jpg'
import '../App.css'
import '../index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import baseUrl from '../config.js'
import { ethers } from 'ethers';


function CharityComponent() {
    // setup handlers
    const [url, setUrl] = useState('')
    const [pKey, setpKey] = useState('')
    const [cAddress, setcAddress] = useState('')
    const [myWalletAddress, setMyWalletAddress] = useState('')
    const [mySessionID, setMySessionID] = useState('')
    const [setupResponse, setSetupResponse] = useState('')


    // create expense handlers
    const [amount, setAmount] = useState('')
    const [description, setDescription] = useState('')
    const [iban, setPayee] = useState('')
    const [apiResponse, setApiResponse] = useState('')


    // get expenses handlers
    const [expenses, setExpenses] = useState([{}]);


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
                setSetupResponse(response.data.message);
            }
        }).catch((error) => {
            setSetupResponse("Error logging in");
        });
    }


    // call backend api to create an expense
    const callCreateExpense = async (amount, description, iban) => {

        const payload = {
            amount: amount,
            description: description,
            iban: iban,
            sessionID: mySessionID,
        }

        axios.post(baseUrl + "/createExpense", payload).then((response) => {
            // todo handle response
            console.log(response);
            setApiResponse(response.data.toString());
            
        }).catch((error) => {
            setApiResponse(error.message);
        });
    }

    // call backend api to list expenses
    const callListMyExpenses = async () => {
        const payload = {
            sessionID: mySessionID,
            address: myWalletAddress,
        }

        axios.post(baseUrl + "/listMyExpenses", payload).then((response) => {
            if (response.status === 200){
                console.log(response);
                var data = response.data;
                console.log(data);
                setExpenses(data);
            } else {
                console.log(response.data);
                setExpenses([{
                }]);
            }
        }).catch((error) => {
            setExpenses([{"Error": "Unable to fetch data"}]);
        });
    };

    if ( mySessionID == "" ){
        return <>
            {/* setup block */}
            <div className="my-card">
                <h2>Login</h2>
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
                    {/* header contains url, wallet address and contract address */}
                    <header>
                        <div className="header-table">
                            <TableComponent data={[{'Chain URL' : url, 'Connected Wallet Address' : myWalletAddress, 'Connected Contract Address' : cAddress}]}/>
                        </div>
                    </header>

                    <div>
                        <img src={headerImage} className="fixed-headerimag logo" alt="Blockchain background image" />
                    </div>

                    <h2>Transparent Council Spending: Charity Portal</h2>

                    {/* create expense block */}
                    <div className="my-card">
                        <h2>Create Expense</h2>
                        <div className='custom-card'>
                            <input type="text" id="amount" name="amount" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} />
                            <input type="text" id="description" name="description" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
                            <input type="text" id="iban" name="iban" placeholder="IBAN" value={iban} onChange={e => setPayee(e.target.value)} />
                            <button variant="contained" onClick={() => callCreateExpense(amount, description, iban)} disabled={!amount || !description || !iban}>
                                Create Expense
                            </button>
                        </div>
                        <div>
                            <h4>API Response</h4>
                            <p className='api-response'>{apiResponse}</p>
                        </div>
                    </div>


                    {/* list expenses block */}
                    <div className="my-card">
                        <h2>List My Expenses</h2>
                        <div className='custom-card'>
                            <p>Click the button to fetch all expenses belonging to you from the blockchain.</p>
                            <button onClick={() => callListMyExpenses()}>
                                List Expenses
                            </button>
                        </div>
                        <h3>Expense Data</h3>
                        <div className="expense-table">
                            <TableComponent data={expenses} />
                        </div>
                    </div>
        </>
    }

}

export default CharityComponent