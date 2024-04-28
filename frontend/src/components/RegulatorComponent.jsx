import * as React from 'react';
import { useState } from 'react'
import TableComponent from './jsonTable.jsx'
import headerImage from '../assets/eth-logo.jpg'
import '../App.css'
import '../index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import EventTable from './EventTable.jsx';
import CsvDownloadButton from 'react-json-to-csv'
import axios from 'axios';
import baseUrl from '../config.js';
import exportFromJSON from 'export-from-json'

function RegulatorComponent() {

    // setup handlers
    const [cAddress, setcAddress] = useState('')


    async function getEventData(event) {
        if (cAddress == undefined || cAddress == "") {
            console.log("No contract address provided")
            return;
        }
        const response = await axios.get(`${baseUrl}/downloadEvents?contractAddress=${cAddress}&eventType=${event}`);
        const data = response.data;
        const now = new Date();
        const fileName = `${event}-${now.toISOString()}`
        const exportType = exportFromJSON.types.csv
        exportFromJSON({ data, fileName, exportType })
    }

    return <>

        <div>
            <img src={headerImage} className="fixed-headerimag logo" alt="Blockchain background image" />
        </div>
        <h2>Transparent Council Spending: Regulator Portal</h2>

        {/* URL and Contract Address to listen to */}
        <div className="my-card">
                <h4> Enter Project Contract Address </h4>
                <div className='custom-card half'>
                    <input type="text" id="cAddress" name="cAddress" placeholder="Contract Address" value={cAddress} onChange={e => setcAddress(e.target.value)} />
                </div>
            </div>

        <div className="my-grid">
            {/* Listen to events Block */}
            <div className="my-card-nopad">
                <div className='regulator-table-header'>
                    <h4> Events: ExpenseCreated </h4>
                    <button disabled={!cAddress} onClick={() => getEventData("ExpenseCreated")}> Download historic data </button>
                </div>
                <EventTable contractAddress={cAddress} eventType={"ExpenseCreated"}/>
            </div>

            <div className="my-card-nopad">
                <div className='regulator-table-header'>
                    <h4> Events: ExpenseRejected </h4>
                    <button disabled={!cAddress} onClick={() => getEventData("ExpenseRejected")}> Download historic data </button>
                </div>
                <EventTable contractAddress={cAddress} eventType={"ExpenseRejected"} />
            </div>

            <div className="my-card-nopad">
                <div className='regulator-table-header'>
                    <h4> Events: ExpenseApproved </h4>
                    <button disabled={!cAddress} onClick={() => getEventData("ExpenseApproved")}> Download historic data </button>
                </div>
                <EventTable contractAddress={cAddress} eventType={"ExpenseApproved"} />
            </div>

            <div className="my-card-nopad">
                <div className='regulator-table-header'>
                    <h4> Events: RegulatoryEvents </h4>
                    <button disabled={!cAddress} onClick={() => getEventData("RegulatoryEvent")}> Download historic data </button>
                </div>
                <EventTable contractAddress={cAddress} eventType={"RegulatoryEvent"} />
            </div>

        </div>

    </>

}

export default RegulatorComponent