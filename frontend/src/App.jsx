import './App.css'
import * as React from 'react';


// import packages
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


// import custom components
import ChainExplorerComponent from './components/ChainExplorer';

// import boostrap css
import 'bootstrap/dist/css/bootstrap.min.css';


// main app component

function App() {
  return (
    <Router>
      <Routes>
          <Route path="/portal" element={<ChainExplorerComponent />} />
      </Routes>
    </Router>
  );
}
export default App
