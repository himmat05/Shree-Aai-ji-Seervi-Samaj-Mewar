import React, { useState, useEffect } from 'react';
import { Settings, Plus, Save } from 'lucide-react';

const AdminPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const [donors, setDonors] = useState([]);
  const [newDonor, setNewDonor] = useState({ name: '', amount: '', date: '', purpose: '' });

  useEffect(() => {
    if (isAuthenticated) {
      fetch('/api/donors')
        .then(res => res.json())
        .then(data => setDonors(Array.isArray(data) ? data : []))
        .catch(err => console.error(err));
    }
  }, [isAuthenticated]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (res.ok) {
        setIsAuthenticated(true);
      } else {
        alert('गलत यूज़रनेम या पासवर्ड!');
      }
    } catch (err) {
      console.error(err);
      alert('सर्वर से कनेक्ट नहीं हो सका!');
    }
  };

  const handleAddDonor = async (e) => {
    e.preventDefault();
    if (!newDonor.name || !newDonor.amount) return;
    
    try {
      const res = await fetch('/api/donors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDonor)
      });
      const savedDonor = await res.json();
      setDonors([savedDonor, ...donors]);
      setNewDonor({ name: '', amount: '', date: '', purpose: '' });
      alert('दानदाता सफलतापूर्वक जोड़ा गया!');
    } catch (err) {
      console.error(err);
      alert('त्रुटि! दानदाता नहीं जुड़ पाया।');
    }
  };

  if (!isAuthenticated) {
    return (
      <section className="section bg-light" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ maxWidth: '400px' }}>
          <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
            <Settings size={48} color="var(--primary)" style={{ marginBottom: '1rem' }} />
            <h2 style={{ marginBottom: '1.5rem' }}>एडमिन लॉगिन</h2>
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="यूज़रनेम (Username)" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={{ marginBottom: '15px' }}
                />
                <input 
                  type="password" 
                  className="form-control" 
                  placeholder="पासवर्ड (Password)" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>लॉगिन करें</button>
            </form>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section bg-light" style={{ minHeight: '80vh' }}>
      <div className="container animate-fade-in">
        <h2 className="section-title">
          <Settings className="inline-icon" style={{ verticalAlign: 'middle', marginRight: '10px' }} size={32} />
          एडमिन डैशबोर्ड
        </h2>

        <div className="card" style={{ marginBottom: '2rem' }}>
          <h3>नया दानदाता जोड़ें</h3>
          <form onSubmit={handleAddDonor} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginTop: '15px' }}>
            <input className="form-control" placeholder="नाम" value={newDonor.name} onChange={e => setNewDonor({...newDonor, name: e.target.value})} required />
            <input className="form-control" placeholder="राशि (उदा: ₹1100)" value={newDonor.amount} onChange={e => setNewDonor({...newDonor, amount: e.target.value})} required />
            <input className="form-control" type="date" value={newDonor.date} onChange={e => setNewDonor({...newDonor, date: e.target.value})} required />
            <input className="form-control" placeholder="उद्देश्य" value={newDonor.purpose} onChange={e => setNewDonor({...newDonor, purpose: e.target.value})} required />
            <button type="submit" className="btn btn-primary" style={{ gridColumn: '1 / -1' }}><Plus size={18} /> सुरक्षित करें</button>
          </form>
        </div>

        <div className="card">
          <h3>वर्तमान दानदाता ({donors.length})</h3>
          <ul style={{ listStyle: 'none', padding: 0, marginTop: '15px' }}>
            {donors.map(d => (
              <li key={d.id} style={{ padding: '10px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
                <span><strong>{d.name}</strong> - {d.amount}</span>
                <span style={{ color: 'gray' }}>{d.date}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <p style={{ textAlign: 'center', marginTop: '20px', color: 'gray' }}>
          नोट: इस डेमो में केवल 'दानदाता' जोड़ने की सुविधा लागू की गई है।
        </p>

      </div>
    </section>
  );
};

export default AdminPanel;
