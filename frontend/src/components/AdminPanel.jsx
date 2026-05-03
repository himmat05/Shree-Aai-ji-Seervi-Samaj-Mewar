import React, { useState, useEffect } from 'react';
import { Settings, Plus, Image as ImageIcon, Loader2, MessageSquare, CheckCircle, Eye, Trash2, Edit2, X, Search, TrendingUp, DollarSign, Calendar, Users } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import imageCompression from 'browser-image-compression';

const AdminPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const [activeAdminTab, setActiveAdminTab] = useState('donors');
  const [showAnalytics, setShowAnalytics] = useState(false);

  const [donors, setDonors] = useState([]);
  const [events, setEvents] = useState([]);
  const [scholars, setScholars] = useState([]);
  const [galleryItems, setGalleryItems] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);

  const [newDonor, setNewDonor] = useState({ name: '', amount: '', date: '', purpose: '' });
  const [newEvent, setNewEvent] = useState({ title: '', date: '', location: '', description: '', image: null });
  const [newScholar, setNewScholar] = useState({ name: '', achievement: '', year: '', education: '', image: null });
  const [newGalleryItem, setNewGalleryItem] = useState({ title: '', category: 'other', image: null });

  const [editingId, setEditingId] = useState(null);
  const [donorFilter, setDonorFilter] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const fetchAll = () => {
    fetch('/api/donors').then(res => res.json()).then(data => setDonors(Array.isArray(data) ? data : []));
    fetch('/api/events').then(res => res.json()).then(data => setEvents(Array.isArray(data) ? data : []));
    fetch('/api/scholars').then(res => res.json()).then(data => setScholars(Array.isArray(data) ? data : []));
    fetch('/api/gallery').then(res => res.json()).then(data => setGalleryItems(Array.isArray(data) ? data : []));
    fetch('/api/feedback').then(res => res.json()).then(data => setFeedbacks(Array.isArray(data) ? data : []));
  };

  useEffect(() => {
    if (isAuthenticated) fetchAll();
  }, [isAuthenticated]);

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (res.ok) setIsAuthenticated(true); else alert('गलत क्रेडेंशियल्स!');
  };

  const getMonthlyData = () => {
    const months = {};
    donors.forEach(d => {
      if (!d.date) return;
      // Handle YYYY-MM-DD or other formats
      const dateObj = new Date(d.date);
      if (isNaN(dateObj.getTime())) return;

      const monthKey = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}`;
      const amt = typeof d.amount === 'string' ? parseInt(d.amount.replace(/[^0-9]/g, '')) || 0 : d.amount;
      months[monthKey] = (months[monthKey] || 0) + amt;
    });

    const sortedData = Object.keys(months).sort().map(m => {
      const [year, month] = m.split('-');
      const d = new Date(year, month - 1);
      return {
        name: d.toLocaleString('hi-IN', { month: 'short', year: '2-digit' }),
        amount: months[m]
      };
    });
    return sortedData;
  };

  const totalCollection = donors.reduce((acc, curr) => {
    const amtStr = String(curr.amount || '0');
    return acc + (parseInt(amtStr.replace(/[^0-9]/g, '')) || 0);
  }, 0);

  const handleDelete = async (collection, id) => {
    if (window.confirm('हटाना चाहते हैं?')) {
      const res = await fetch(`/api/${collection}/${id}`, { method: 'DELETE' });
      if (res.ok) fetchAll();
    }
  };

  const compressImage = async (imageFile) => {
    const options = { maxSizeMB: 0.5, maxWidthOrHeight: 1200, useWebWorker: true };
    try {
      return await imageCompression(imageFile, options);
    } catch (error) {
      console.error("Compression error:", error);
      return imageFile;
    }
  };

  const handleUpdateFeedbackStatus = async (id, status) => {
    const res = await fetch(`/api/feedback/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (res.ok) fetchAll();
  };

  const resetForms = () => {
    setNewDonor({ name: '', amount: '', date: '', purpose: '' });
    setNewEvent({ title: '', date: '', location: '', description: '', image: null });
    setNewScholar({ name: '', achievement: '', year: '', education: '', image: null });
    setNewGalleryItem({ title: '', category: 'other', image: null });
    setEditingId(null);
  };

  if (!isAuthenticated) {
    return (
      <section className="section bg-light" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ maxWidth: '400px' }}>
          <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
            <Settings size={48} color="var(--primary)" style={{ marginBottom: '1rem' }} />
            <h2>एडमिन लॉगिन</h2>
            <form onSubmit={handleLogin}>
              <input className="form-control" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} style={{marginBottom: '10px'}} />
              <input className="form-control" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} style={{marginBottom: '15px'}} />
              <button type="submit" className="btn btn-primary" style={{width: '100%'}}>लॉगिन</button>
            </form>
          </div>
        </div>
      </section>
    );
  }

  const tabStyle = (isActive) => ({
    padding: '12px 24px', cursor: 'pointer', background: isActive ? 'var(--primary)' : 'white',
    color: isActive ? 'white' : '#555', border: '1px solid #ddd', borderRadius: '8px 8px 0 0', fontWeight: 'bold', flex: 1
  });

  return (
    <section className="section bg-light" style={{ minHeight: '100vh' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2><Settings size={28} style={{verticalAlign: 'middle', marginRight: '10px'}}/> मैनेजमेंट पोर्टल</h2>
          <div style={{display: 'flex', gap: '10px'}}>
            <button className={`btn ${showAnalytics ? 'btn-primary' : 'btn-outline'}`} onClick={() => setShowAnalytics(!showAnalytics)}>
              <TrendingUp size={18} /> {showAnalytics ? 'डैशबोर्ड' : 'एनालिटिक्स'}
            </button>
            <button className="btn btn-outline" onClick={() => setIsAuthenticated(false)}>लॉगआउट</button>
          </div>
        </div>

        {showAnalytics && (
          <div className="animate-fade-in">
            <div className="grid-3" style={{ marginBottom: '2rem', gap: '20px' }}>
              <div className="card" style={{ background: 'var(--primary)', color: 'white', padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <h3>कुल कलेक्शन</h3>
                  <DollarSign size={24} />
                </div>
                <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '10px 0' }}>₹{totalCollection.toLocaleString('en-IN')}</p>
                <small>अब तक का कुल सहयोग</small>
              </div>
              <div className="card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#666' }}>
                  <h3>कुल दानदाता</h3>
                  <Users size={24} />
                </div>
                <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '10px 0' }}>{donors.length}</p>
                <small>समाज के गौरवशाली दानदाता</small>
              </div>
              <div className="card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#666' }}>
                  <h3>इस महीने का लक्ष्य</h3>
                  <Calendar size={24} />
                </div>
                <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '10px 0' }}>95%</p>
                <small>प्रगति की ओर...</small>
              </div>
            </div>

            <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
              <h3>मंथली कलेक्शन ग्राफ (Monthly Trends)</h3>
              <div style={{ width: '100%', height: 350, marginTop: '20px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={getMonthlyData()}>
                    <defs>
                      <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => `₹${value}`} />
                    <Area type="monotone" dataKey="amount" stroke="var(--primary)" fillOpacity={1} fill="url(#colorAmt)" strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {!showAnalytics && (
          <>
            <div style={{ display: 'flex', gap: '5px', marginBottom: '0', flexWrap: 'wrap' }}>
              <button style={tabStyle(activeAdminTab === 'donors')} onClick={() => {setActiveAdminTab('donors'); resetForms();}}>दानदाता</button>
              <button style={tabStyle(activeAdminTab === 'events')} onClick={() => {setActiveAdminTab('events'); resetForms();}}>कार्यक्रम</button>
              <button style={tabStyle(activeAdminTab === 'scholars')} onClick={() => {setActiveAdminTab('scholars'); resetForms();}}>प्रतिभाएं</button>
              <button style={tabStyle(activeAdminTab === 'gallery')} onClick={() => {setActiveAdminTab('gallery'); resetForms();}}>गैलरी</button>
              <button style={tabStyle(activeAdminTab === 'feedback')} onClick={() => {setActiveAdminTab('feedback'); resetForms();}}>फीडबैक ({feedbacks.filter(f => f.status === 'pending').length})</button>
            </div>

            <div className="card" style={{ borderRadius: '0 0 8px 8px', marginBottom: '2rem' }}>
              {activeAdminTab === 'donors' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3>{editingId ? 'दानदाता अपडेट' : 'नया दानदाता'}</h3>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <Search size={18} color="gray" />
                      <input type="month" className="form-control" style={{width: '150px'}} value={donorFilter} onChange={e => setDonorFilter(e.target.value)} />
                    </div>
                  </div>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const method = editingId ? 'PUT' : 'POST';
                    const url = editingId ? `/api/donors/${editingId}` : '/api/donors';
                    fetch(url, {
                      method,
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(newDonor)
                    }).then(() => { fetchAll(); resetForms(); alert('सफल!'); });
                  }} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr auto', gap: '10px', marginTop: '15px' }}>
                    <input className="form-control" placeholder="नाम" value={newDonor.name} onChange={e => setNewDonor({...newDonor, name: e.target.value})} required />
                    <input type="number" className="form-control" placeholder="राशि (उदा: 1100)" value={newDonor.amount} onChange={e => setNewDonor({...newDonor, amount: e.target.value})} required />
                    <input className="form-control" type="date" value={newDonor.date} onChange={e => setNewDonor({...newDonor, date: e.target.value})} required />
                    <input className="form-control" placeholder="उद्देश्य" value={newDonor.purpose} onChange={e => setNewDonor({...newDonor, purpose: e.target.value})} required />
                    <button type="submit" className="btn btn-primary">{editingId ? 'Update' : 'Add'}</button>
                  </form>
                  <div style={{ marginTop: '2rem', maxHeight: '400px', overflowY: 'auto' }}>
                    <table style={{width: '100%', textAlign: 'left', borderCollapse: 'collapse'}}>
                      <thead>
                        <tr style={{background: '#f8f9fa', borderBottom: '2px solid #eee'}}>
                          <th style={{padding: '12px'}}>नाम</th>
                          <th style={{padding: '12px'}}>राशि</th>
                          <th style={{padding: '12px'}}>तारीख</th>
                          <th style={{padding: '12px'}}>एक्शन</th>
                        </tr>
                      </thead>
                      <tbody>
                        {donors.filter(d => d.date.includes(donorFilter)).map(d => (
                          <tr key={d._id} style={{borderBottom: '1px solid #eee'}}>
                            <td style={{padding: '12px'}}>{d.name}</td>
                            <td style={{padding: '12px', fontWeight: 'bold', color: 'green'}}>{d.amount}</td>
                            <td style={{padding: '12px'}}>{d.date}</td>
                            <td style={{padding: '12px', display: 'flex', gap: '10px'}}>
                              <Edit2 size={16} color="blue" style={{cursor: 'pointer'}} onClick={() => {setEditingId(d._id); setNewDonor({...d});}} />
                              <Trash2 size={16} color="red" style={{cursor: 'pointer'}} onClick={() => handleDelete('donors', d._id)} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Other tabs keep existing functionality but simplified code here for brevity if needed, but I'll keep them fully functional */}
              {activeAdminTab === 'events' && (
                <div>
                  <h3>कार्यक्रम मैनेजमेंट</h3>
                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    const formData = new FormData();
                    for (const k of Object.keys(newEvent)) {
                      if (newEvent[k]) {
                        const val = (k === 'image' && newEvent.image instanceof File) 
                          ? await compressImage(newEvent.image) 
                          : newEvent[k];
                        formData.append(k, val);
                      }
                    }
                    const res = await fetch(editingId ? `/api/events/${editingId}` : '/api/events', { method: editingId ? 'PUT' : 'POST', body: formData });
                    if(res.ok) { fetchAll(); resetForms(); alert('सफल!'); }
                  }} style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px'}}>
                    <input className="form-control" placeholder="शीर्षक" value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} required />
                    <input className="form-control" type="date" value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})} required />
                    <input className="form-control" placeholder="स्थान" value={newEvent.location} onChange={e => setNewEvent({...newEvent, location: e.target.value})} required />
                    <textarea className="form-control" style={{gridColumn: '1/-1'}} placeholder="विवरण" value={newEvent.description} onChange={e => setNewEvent({...newEvent, description: e.target.value})} required />
                    <input type="file" className="form-control" style={{gridColumn: '1/-1'}} onChange={e => setNewEvent({...newEvent, image: e.target.files[0]})} />
                    <button className="btn btn-primary" style={{gridColumn: '1/-1'}}>{editingId ? 'Update' : 'Add'}</button>
                  </form>
                  <div style={{marginTop: '20px'}}>
                    {events.map(e => (
                      <div key={e._id} style={{display: 'flex', padding: '10px', borderBottom: '1px solid #eee', alignItems: 'center'}}>
                        <img src={e.imageUrl} style={{width: '50px', height: '50px', objectFit: 'cover', marginRight: '10px'}} />
                        <div style={{flex: 1}}><strong>{e.title}</strong><br/><small>{e.date}</small></div>
                        <Edit2 size={16} color="blue" onClick={() => {setEditingId(e._id); setNewEvent({...e, image: null});}} style={{marginRight: '10px', cursor: 'pointer'}} />
                        <Trash2 size={16} color="red" onClick={() => handleDelete('events', e._id)} style={{cursor: 'pointer'}} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeAdminTab === 'scholars' && (
                <div>
                   <h3>प्रतिभा मैनेजमेंट</h3>
                   <form onSubmit={async (e) => {
                    e.preventDefault();
                    const formData = new FormData();
                    for (const k of Object.keys(newScholar)) {
                      if (newScholar[k]) {
                        const val = (k === 'image' && newScholar.image instanceof File) 
                          ? await compressImage(newScholar.image) 
                          : newScholar[k];
                        formData.append(k, val);
                      }
                    }
                    const res = await fetch(editingId ? `/api/scholars/${editingId}` : '/api/scholars', { method: editingId ? 'PUT' : 'POST', body: formData });
                    if(res.ok) { fetchAll(); resetForms(); alert('सफल!'); }
                  }} style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px'}}>
                    <input className="form-control" placeholder="नाम" value={newScholar.name} onChange={e => setNewScholar({...newScholar, name: e.target.value})} required />
                    <input className="form-control" placeholder="उपलब्धि" value={newScholar.achievement} onChange={e => setNewScholar({...newScholar, achievement: e.target.value})} required />
                    <input type="number" className="form-control" placeholder="वर्ष (उदा: 2024)" value={newScholar.year} onChange={e => setNewScholar({...newScholar, year: e.target.value})} required />
                    <input className="form-control" placeholder="शिक्षा" value={newScholar.education} onChange={e => setNewScholar({...newScholar, education: e.target.value})} required />
                    <input type="file" className="form-control" style={{gridColumn: '1/-1'}} onChange={e => setNewScholar({...newScholar, image: e.target.files[0]})} />
                    <button className="btn btn-primary" style={{gridColumn: '1/-1'}}>{editingId ? 'Update' : 'Add'}</button>
                  </form>
                  <div style={{marginTop: '20px'}}>
                    {scholars.map(s => (
                      <div key={s._id} style={{display: 'flex', padding: '10px', borderBottom: '1px solid #eee', alignItems: 'center'}}>
                        <img src={s.imageUrl} style={{width: '40px', height: '40px', objectFit: 'cover', borderRadius: '50%', marginRight: '10px'}} />
                        <div style={{flex: 1}}><strong>{s.name}</strong><br/><small>{s.achievement}</small></div>
                        <Edit2 size={16} color="blue" onClick={() => {setEditingId(s._id); setNewScholar({...s, image: null});}} style={{marginRight: '10px', cursor: 'pointer'}} />
                        <Trash2 size={16} color="red" onClick={() => handleDelete('scholars', s._id)} style={{cursor: 'pointer'}} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeAdminTab === 'gallery' && (
                <div>
                  <h3>गैलरी मैनेजमेंट</h3>
                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    const formData = new FormData();
                    for (const k of Object.keys(newGalleryItem)) {
                      if (newGalleryItem[k]) {
                        const val = (k === 'image' && newGalleryItem.image instanceof File) 
                          ? await compressImage(newGalleryItem.image) 
                          : newGalleryItem[k];
                        formData.append(k, val);
                      }
                    }
                    const res = await fetch('/api/gallery', { method: 'POST', body: formData });
                    if(res.ok) { fetchAll(); resetForms(); alert('सफल!'); }
                  }} style={{display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '10px'}}>
                    <input className="form-control" placeholder="शीर्षक/नाम" value={newGalleryItem.title} onChange={e => setNewGalleryItem({...newGalleryItem, title: e.target.value})} required />
                    <select className="form-control" value={newGalleryItem.category} onChange={e => setNewGalleryItem({...newGalleryItem, category: e.target.value})}>
                      <option value="other">अन्य (Other)</option>
                      <option value="origin">उद्गम (Origin)</option>
                      <option value="event">कार्यक्रम (Event)</option>
                    </select>
                    <input type="file" className="form-control" onChange={e => setNewGalleryItem({...newGalleryItem, image: e.target.files[0]})} required />
                    <button className="btn btn-primary">Add to Gallery</button>
                  </form>
                  <div style={{marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '15px'}}>
                    {galleryItems.map(item => (
                      <div key={item._id} className="card" style={{padding: '5px', position: 'relative'}}>
                        <img src={item.imageUrl} style={{width: '100%', height: '100px', objectFit: 'cover', borderRadius: '4px'}} />
                        <div style={{fontSize: '0.8rem', marginTop: '5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{item.title}</div>
                        <button 
                          onClick={() => handleDelete('gallery', item._id)}
                          style={{position: 'absolute', top: '5px', right: '5px', background: 'rgba(255,0,0,0.8)', border: 'none', color: 'white', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', fontSize: '12px'}}
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {activeAdminTab === 'feedback' && (
                <div>
                  <h3>फीडबैक मैनेजमेंट</h3>
                  {feedbacks.map(f => (
                    <div key={f._id} style={{padding: '15px', borderBottom: '1px solid #eee', background: f.status === 'pending' ? '#fff9f0' : 'none'}}>
                      <strong>{f.name}</strong> <small>({f.status})</small>
                      <p>{f.message}</p>
                      <div style={{display: 'flex', gap: '10px'}}>
                        {f.status === 'pending' && <button className="btn btn-primary" onClick={() => handleUpdateFeedbackStatus(f._id, 'viewed')}>देखा</button>}
                        {f.status === 'viewed' && <button className="btn btn-primary" style={{background: 'green'}} onClick={() => handleUpdateFeedbackStatus(f._id, 'implemented')}>लागू किया</button>}
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default AdminPanel;
