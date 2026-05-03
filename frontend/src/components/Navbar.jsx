import React, { useState } from 'react';
import { Menu, X, Home, Users, Calendar, GraduationCap, Settings, Image as ImageIcon } from 'lucide-react';
import logo from '../assets/logo.png';

const Navbar = ({ activeTab, setActiveTab }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'मुख्य पृष्ठ', icon: <Home size={18} /> },
    { id: 'donors', label: 'दानदाता', icon: <Users size={18} /> },
    { id: 'events', label: 'कार्यक्रम', icon: <Calendar size={18} /> },
    { id: 'scholars', label: 'प्रतिभाएं', icon: <GraduationCap size={18} /> },
    { id: 'gallery', label: 'गैलरी', icon: <ImageIcon size={18} /> },
    { id: 'admin', label: 'एडमिन', icon: <Settings size={18} /> }
  ];

  return (
    <nav className="glass" style={{
      position: 'fixed',
      top: 0,
      width: '100%',
      zIndex: 1000,
      padding: '1rem 0'
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
          onClick={() => setActiveTab('home')}
        >
          <img src={logo} alt="Mewar Logo" style={{ width: '45px', height: '45px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)' }} />
          <h2 style={{ margin: 0, color: 'var(--primary)', fontSize: '1.5rem' }}>श्री आई जी मेवाड़ सीरवी समाज</h2>
        </div>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', gap: '2rem' }} className="desktop-nav">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                background: 'none',
                color: activeTab === item.id ? 'var(--primary)' : 'var(--text-main)',
                fontWeight: activeTab === item.id ? '700' : '500',
                fontSize: '1.1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                borderBottom: activeTab === item.id ? '2px solid var(--primary)' : 'none',
                paddingBottom: '5px'
              }}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </div>

        {/* Mobile Toggle */}
        <button
          className="mobile-toggle"
          style={{ background: 'none', color: 'var(--primary)', display: 'none' }}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
      `}</style>

      {/* Mobile Nav */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          width: '100%',
          background: 'white',
          boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsOpen(false);
              }}
              style={{
                background: 'none',
                textAlign: 'left',
                padding: '10px',
                color: activeTab === item.id ? 'var(--primary)' : 'var(--text-main)',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                borderRadius: '8px',
                backgroundColor: activeTab === item.id ? 'rgba(217, 72, 15, 0.1)' : 'transparent'
              }}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
