import React, { useState } from 'react'
import { SiCockroachlabs } from "react-icons/si";
import './App.css'
import LuizCRUD from './LuizCRUD';
import RodrigoCRUD from './RodrigoCRUD';
import DartHitCRUD from './DartHitCRUD';


function App() {
  const [activeTab, setActiveTab] = useState('DartHitCRUD');

  React.useEffect(() => {
    console.log(activeTab);
  }, [activeTab]);

    return (
      <>
        <div className="tabs">
          <button className='tab' onClick={() => setActiveTab('RodrigoCRUD')}>Rodrigo</button>
          <button className='tab' onClick={() => setActiveTab('LuizCRUD')}>Luiz</button>
          <button className='tab' onClick={() => setActiveTab('DartHitCRUD')}>Dart Hit</button>
        </div>
        <SiCockroachlabs />

        {activeTab === 'LuizCRUD' && (
          <LuizCRUD />
        )}

        {activeTab === 'RodrigoCRUD' && (
          <RodrigoCRUD />
        )}

        {activeTab === 'DartHitCRUD' && (
          <DartHitCRUD />
        )}
      </>
    )
}
export default App
