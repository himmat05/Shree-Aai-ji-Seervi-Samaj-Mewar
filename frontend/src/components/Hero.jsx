import React from 'react';
import background from '../assets/background.png';

const Hero = () => {
  return (
    <div style={{
      position: 'relative',
      minHeight: '85vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#000', // fallback color
      backgroundImage: `url(${background})`,
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'top center',
      color: 'white',
      textAlign: 'center',
      padding: '20px'
    }}>
      {/* Overlay to ensure text readability */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(217,72,15,0.2) 100%)',
        zIndex: 1
      }}></div>

      <div className="animate-fade-in" style={{
        position: 'relative',
        zIndex: 2,
        padding: '3rem',
        borderRadius: '20px',
        maxWidth: '800px',
        background: 'rgba(0, 0, 0, 0.15)',
        backdropFilter: 'blur(3px)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
      }}>
        <h1 style={{ 
          fontSize: '3.5rem', 
          color: 'var(--secondary)', 
          textShadow: '2px 2px 8px rgba(0,0,0,0.9), 0 0 20px rgba(0,0,0,0.6)',
          marginBottom: '1rem'
        }}>
          जय श्री आई माता जी
        </h1>
        <h2 style={{ 
          fontSize: '2rem', 
          marginBottom: '1.5rem', 
          color: 'white',
          textShadow: '1px 1px 6px rgba(0,0,0,0.9)'
        }}>
          श्री आई जी मेवाड़ सीरवी समाज में आपका स्वागत है
        </h2>
        <p style={{ 
          fontSize: '1.25rem', 
          marginBottom: '2rem', 
          color: 'white',
          textShadow: '1px 1px 4px rgba(0,0,0,0.9)',
          fontWeight: '500'
        }}>
          सत्य, धर्म और सेवा के मार्ग पर चलते हुए समाज के उत्थान के लिए समर्पित। 
          आइए हम सब मिलकर समाज को नई ऊंचाइयों पर ले जाएं।
        </p>
      </div>
    </div>
  );
};

export default Hero;
