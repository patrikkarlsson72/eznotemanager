import React from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ContentArea from './components/ContentArea';
import './App.css';

function App() {
  return (
    <div className="bg-gray-100 flex-1">
      <Header />
      <div className="flex">
        <Sidebar />
        <ContentArea />
      </div>
    </div>
  );
}

export default App;
