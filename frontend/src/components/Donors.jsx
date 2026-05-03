import React, { useState, useEffect } from 'react';
import { Users, Heart } from 'lucide-react';

const Donors = () => {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/donors')
      .then(res => res.json())
      .then(data => {
        setDonors(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch donors:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{textAlign: 'center', padding: '5rem'}}>Loading...</div>;

  return (
    <section className="section">
      <div className="container animate-fade-in">
        <h2 className="section-title">
          <Heart className="inline-icon" style={{ verticalAlign: 'middle', marginRight: '10px', color: 'var(--primary)' }} size={32} />
          सम्मानित दानदाता
        </h2>
        
        <p style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '1.2rem' }}>
          समाज के विकास और उत्थान में अपना बहुमूल्य योगदान देने वाले भामाशाहों की सूची।
        </p>

        <div className="grid-3">
          {donors.map((donor) => (
            <div key={donor.id} className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                <div style={{ 
                  background: 'var(--primary-light)', 
                  color: 'white', 
                  width: '50px', 
                  height: '50px', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  fontWeight: 'bold'
                }}>
                  {donor.name.charAt(0)}
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.3rem' }}>{donor.name}</h3>
                  <span style={{ color: 'gray', fontSize: '0.9rem' }}>दिनांक: {donor.date}</span>
                </div>
              </div>
              <div style={{ borderTop: '1px solid #eee', paddingTop: '15px' }}>
                <p><strong>राशि:</strong> <span style={{ color: 'green', fontWeight: 'bold' }}>{donor.amount}</span></p>
                <p><strong>उद्देश्य:</strong> {donor.purpose}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Donors;
