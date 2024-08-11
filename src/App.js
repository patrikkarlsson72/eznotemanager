// src/App.js

import React from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ContentArea from './components/ContentArea';
import './App.css';

function App() {
  return (
    <div className="app">
      <Header />
      <div className="main">
        <Sidebar />
        <ContentArea />
      </div>
    </div>
  );
}

export default App;
