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

function ChainExplorerComponent() {

    // setup handlers
    const [cAddress, setcAddress] = useState('')

    return <>

        <div>
            <img src={headerImage} className="fixed-headerimag logo" alt="Blockchain background image" />
        </div>

        <h2>GovScan: Search for any transaction </h2>

        {/* URL and Contract Address to listen to */}
        <div className="my-card">
            <h4> Enter Project Contract Address </h4>
            <div className='custom-card half'>
                <input type="text" id="cAddress" name="cAddress" placeholder="Contract Address" value={cAddress} onChange={e => setcAddress(e.target.value)} />
            </div>
        </div>

        {/* Listen to events Block */}
        <div className="my-card-nopad">
            <div className='regulator-table-header'>
                <h4> Live Transaction Tracker</h4>
            </div>
            <EventTable contractAddress={cAddress} eventType={"TrxLog"} />
        </div>

    </>

}

export default ChainExplorerComponent