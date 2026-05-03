import React, { useState } from 'react';
import { Send, MessageSquare } from 'lucide-react';

const FeedbackForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setSubmitted(true);
        setFormData({ name: '', email: '', message: '' });
      } else {
        alert('सबमिट करने में त्रुटि हुई।');
      }
    } catch (err) {
      console.error(err);
      alert('सर्वर से कनेक्ट नहीं हो सका।');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
        <MessageSquare size={48} color="var(--primary)" style={{ marginBottom: '1rem' }} />
        <h3>धन्यवाद!</h3>
        <p>आपका सुझाव सफलतापूर्वक प्राप्त हो गया है।</p>
        <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => setSubmitted(false)}>एक और सुझाव भेजें</button>
      </div>
    );
  }

  return (
    <div className="card" id="feedback">
      <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
        <MessageSquare size={24} color="var(--primary)" />
        सुझाव एवं फीडबैक
      </h3>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
          <div className="form-group">
            <label>आपका नाम</label>
            <input 
              type="text" 
              className="form-control" 
              value={formData.name} 
              onChange={(e) => setFormData({...formData, name: e.target.value})} 
              required 
              placeholder="आपका नाम लिखें"
            />
          </div>
          <div className="form-group">
            <label>ईमेल (वैकल्पिक)</label>
            <input 
              type="email" 
              className="form-control" 
              value={formData.email} 
              onChange={(e) => setFormData({...formData, email: e.target.value})} 
              placeholder="आपका ईमेल"
            />
          </div>
        </div>
        <div className="form-group">
          <label>आपका सुझाव / संदेश</label>
          <textarea 
            className="form-control" 
            style={{ minHeight: '100px' }} 
            value={formData.message} 
            onChange={(e) => setFormData({...formData, message: e.target.value})} 
            required 
            placeholder="यहाँ अपना सुझाव या फीडबैक लिखें..."
          />
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={isSubmitting}>
          {isSubmitting ? 'भेजा जा रहा है...' : <><Send size={18} /> सबमिट करें</>}
        </button>
      </form>
    </div>
  );
};

export default FeedbackForm;
