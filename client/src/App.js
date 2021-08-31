import React from 'react';
import './App.css';
import Dashboard from './views/Dashboard.js/Dashboard';
import Login from './views/Login/Login';
require('dotenv').config();

const code  = new URLSearchParams(window.location.search).get('code');

function App() {
  return (
    <div className="App">
     {code ? <Dashboard code={code}/> : <Login />}  
    </div>
  );
}

export default App;
