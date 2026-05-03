import React, { useState, useEffect } from 'react';
import { GraduationCap, Award } from 'lucide-react';

const Scholars = () => {
  const [scholars, setScholars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/scholars')
      .then(res => res.json())
      .then(data => {
        setScholars(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch scholars:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{textAlign: 'center', padding: '5rem'}}>Loading...</div>;

  return (
    <section className="section">
      <div className="container animate-fade-in">
        <h2 className="section-title">
          <GraduationCap className="inline-icon" style={{ verticalAlign: 'middle', marginRight: '10px' }} size={32} />
          समाज की प्रतिभाएं
        </h2>

        <p style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '1.2rem' }}>
          शिक्षा एवं अन्य क्षेत्रों में उत्कृष्ट प्रदर्शन कर समाज का नाम रोशन करने वाले प्रतिभावान विद्यार्थी।
        </p>

        <div className="grid-3">
          {scholars.map((scholar) => (
            <div key={scholar.id} className="card" style={{ textAlign: 'center', paddingTop: '2rem' }}>
              <Award size={48} color="var(--secondary)" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>{scholar.name}</h3>
              <p style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '10px' }}>
                {scholar.achievement}
              </p>
              <div style={{ background: 'var(--bg-color)', padding: '10px', borderRadius: '5px', marginTop: '15px' }}>
                <p style={{ margin: 0 }}><strong>शिक्षा:</strong> {scholar.education}</p>
                <p style={{ margin: 0 }}><strong>वर्ष:</strong> {scholar.year}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Scholars;
