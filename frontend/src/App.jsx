import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import History from './components/History';
import Donors from './components/Donors';
import Events from './components/Events';
import Scholars from './components/Scholars';
import Gallery from './components/Gallery';
import AdminPanel from './components/AdminPanel';

import FeedbackForm from './components/FeedbackForm';

function App() {
  const [activeTab, setActiveTab] = useState('home');

  const renderContent = () => {
    switch(activeTab) {
      case 'home':
        return (
          <>
            <Hero />
            <History />
            <section className="section bg-light">
              <div className="container" style={{ maxWidth: '800px' }}>
                <FeedbackForm />
              </div>
            </section>
          </>
        );
      case 'donors':
        return <Donors />;
      case 'events':
        return <Events />;
      case 'scholars':
        return <Scholars />;
      case 'gallery':
        return <Gallery />;
      case 'admin':
        return <AdminPanel />;
      default:
        return <Hero />;
    }
  };

  return (
    <div>
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main style={{ paddingTop: '80px' }}>
        {renderContent()}
      </main>
      
      <footer style={{ background: 'var(--dark)', color: 'white', padding: '2rem 0', textAlign: 'center', marginTop: 'auto' }}>
        <div className="container">
          <h3>श्री आई जी मेवाड़ सीरवी समाज</h3>
          <p>© 2024 सर्वाधिकार सुरक्षित | धर्म की जय हो, अधर्म का नाश हो।</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
