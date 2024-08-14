import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ContentArea from './components/ContentArea';
import './App.css';

function App() {
  const [createNoteTrigger, setCreateNoteTrigger] = useState(false);

  const handleCreateNote = () => {
    setCreateNoteTrigger(true);
  };

  return (
    <div className="bg-gray-100 flex-1">
      <Header onCreateNote={handleCreateNote} />
      <div className="flex">
        <Sidebar />
        <ContentArea createNoteTrigger={createNoteTrigger} setCreateNoteTrigger={setCreateNoteTrigger} />
      </div>
    </div>
  );
}

export default App;
