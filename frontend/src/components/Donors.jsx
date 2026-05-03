import React, { useState, useEffect } from 'react';
import { Heart, Search, Users, Calendar, Banknote, ScrollText } from 'lucide-react';

const Donors = () => {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredDonors = donors.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    d.purpose.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div style={{textAlign: 'center', padding: '10rem', fontSize: '1.5rem', color: 'var(--primary)'}}>जानकारी लोड हो रही है...</div>;

  return (
    <section className="section bg-light" style={{ minHeight: '90vh' }}>
      <div className="container animate-fade-in">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 className="section-title">
            <Heart className="inline-icon" style={{ verticalAlign: 'middle', marginRight: '10px', color: 'var(--primary)' }} size={40} />
            सम्मानित दानदाता सूची
          </h2>
          <p style={{ fontSize: '1.2rem', color: '#666', maxWidth: '700px', margin: '0 auto' }}>
            समाज के विकास और धार्मिक कार्यों में अपना बहुमूल्य योगदान देने वाले सभी भामाशाहों का हृदय से आभार।
          </p>
        </div>

        {/* Stats Summary */}
        <div className="grid-3" style={{ marginBottom: '2rem', gap: '20px' }}>
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '1.5rem', borderLeft: '5px solid var(--primary)' }}>
            <Users size={32} color="var(--primary)" />
            <div>
              <h4 style={{ margin: 0, color: '#666' }}>कुल दानदाता</h4>
              <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>{donors.length}</p>
            </div>
          </div>
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '1.5rem', borderLeft: '5px solid #28a745' }}>
            <Banknote size={32} color="#28a745" />
            <div>
              <h4 style={{ margin: 0, color: '#666' }}>कुल सहयोग राशि</h4>
              <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>₹ {donors.reduce((acc, curr) => acc + parseInt(curr.amount.replace(/[^0-9]/g, '') || 0), 0).toLocaleString('en-IN')}</p>
            </div>
          </div>
          <div className="card" style={{ padding: '1rem', display: 'flex', alignItems: 'center' }}>
            <div style={{ position: 'relative', width: '100%' }}>
              <Search size={20} color="gray" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="text" 
                placeholder="नाम या उद्देश्य से खोजें..." 
                className="form-control"
                style={{ paddingLeft: '40px', borderRadius: '25px', background: '#f8f9fa' }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Tabular View */}
        <div className="card" style={{ padding: 0, overflow: 'hidden', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'var(--primary)', color: 'white' }}>
                  <th style={{ padding: '18px 20px' }}>क्र.सं.</th>
                  <th style={{ padding: '18px 20px' }}><Users size={16} style={{marginRight: '8px', verticalAlign: 'text-bottom'}}/> दानदाता का नाम</th>
                  <th style={{ padding: '18px 20px' }}><Banknote size={16} style={{marginRight: '8px', verticalAlign: 'text-bottom'}}/> सहयोग राशि</th>
                  <th style={{ padding: '18px 20px' }}><Calendar size={16} style={{marginRight: '8px', verticalAlign: 'text-bottom'}}/> दिनांक</th>
                  <th style={{ padding: '18px 20px' }}><ScrollText size={16} style={{marginRight: '8px', verticalAlign: 'text-bottom'}}/> दान का उद्देश्य</th>
                </tr>
              </thead>
              <tbody>
                {filteredDonors.length > 0 ? filteredDonors.map((donor, index) => (
                  <tr key={donor._id || index} className="table-row-hover" style={{ borderBottom: '1px solid #eee', transition: 'all 0.2s' }}>
                    <td style={{ padding: '15px 20px', fontWeight: 'bold', color: '#888' }}>{index + 1}</td>
                    <td style={{ padding: '15px 20px', fontWeight: '600', fontSize: '1.1rem' }}>{donor.name}</td>
                    <td style={{ padding: '15px 20px' }}>
                      <span style={{ 
                        background: '#e8f5e9', 
                        color: '#2e7d32', 
                        padding: '4px 12px', 
                        borderRadius: '15px', 
                        fontWeight: 'bold',
                        fontSize: '1rem'
                      }}>
                        {donor.amount.includes('₹') ? donor.amount : `₹ ${donor.amount}`}
                      </span>
                    </td>
                    <td style={{ padding: '15px 20px', color: '#666' }}>{donor.date}</td>
                    <td style={{ padding: '15px 20px', color: '#555', fontStyle: 'italic' }}>{donor.purpose}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: 'gray', fontSize: '1.2rem' }}>
                      कोई रिकॉर्ड नहीं मिला।
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        <p style={{ textAlign: 'center', marginTop: '2rem', color: '#888', fontSize: '0.9rem' }}>
          * यह सूची समय-समय पर अपडेट की जाती है। यदि आपका नाम यहाँ नहीं है, तो कृपया एडमिन से संपर्क करें।
        </p>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .table-row-hover:hover {
          background-color: #fcfcfc;
          transform: scale(1.002);
          box-shadow: inset 4px 0 0 var(--primary);
        }
      `}} />
    </section>
  );
};

export default Donors;
