import './App.css'
import * as React from 'react';


// import packages
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


// import custom components
import CharityComponent from './components/CharityComponent';
import CouncilComponent from './components/CouncilComponent';
import RegulatorComponent from './components/RegulatorComponent';

// import boostrap css
import 'bootstrap/dist/css/bootstrap.min.css';


// main app component

function App() {
  return (
    <Router>
      <Routes>
          <Route path="/gov" element={<CouncilComponent />} />
          <Route path="/portal" element={<RegulatorComponent />} />
      </Routes>
    </Router>
  );
}
export default App
