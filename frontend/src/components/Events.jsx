import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, CheckCircle, Clock } from 'lucide-react';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetch('/api/events')
      .then(res => res.json())
      .then(data => {
        setEvents(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch events:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{textAlign: 'center', padding: '10rem', fontSize: '1.2rem', color: 'var(--primary)'}}>कार्यक्रम लोड हो रहे हैं...</div>;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingEvents = events
    .filter(evt => {
      const eventDate = new Date(evt.date);
      return eventDate >= today;
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const completedEvents = events
    .filter(evt => {
      const eventDate = new Date(evt.date);
      return eventDate < today;
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const EventCard = ({ evt, isCompleted }) => (
    <div key={evt._id || evt.id} className="card" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      borderLeft: `6px solid ${isCompleted ? '#94a3b8' : 'var(--secondary)'}`, 
      overflow: 'hidden',
      opacity: isCompleted ? 0.85 : 1,
      transition: 'transform 0.3s ease',
      boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
    }}>
      <div style={{ position: 'relative', cursor: 'zoom-in' }} onClick={() => setSelectedImage(evt.imageUrl)}>
        {evt.imageUrl && (
          <img src={evt.imageUrl} alt={evt.title} loading="lazy" style={{ 
            width: '100%', 
            maxHeight: '350px', 
            objectFit: 'cover', 
            borderRadius: '8px',
            filter: isCompleted ? 'grayscale(30%)' : 'none'
          }} title="क्लिक करके बड़ा देखें" />
        )}
        <div style={{ 
          position: 'absolute', 
          top: '10px', 
          right: '10px', 
          background: isCompleted ? '#64748b' : 'var(--secondary)', 
          color: 'white', 
          padding: '5px 15px', 
          borderRadius: '20px', 
          fontSize: '0.8rem', 
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: '5px'
        }}>
          {isCompleted ? <><CheckCircle size={14}/> संपन्न</> : <><Clock size={14}/> आगामी</>}
        </div>
      </div>
      
      <div style={{ padding: '15px 5px' }}>
        <h3 style={{ fontSize: '1.6rem', color: isCompleted ? '#475569' : 'var(--dark)', marginBottom: '10px' }}>{evt.title}</h3>
        
        <div style={{ display: 'flex', gap: '20px', marginBottom: '15px', color: '#64748b', flexWrap: 'wrap' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '500' }}>
            <Calendar size={18} color="var(--primary)" /> {new Date(evt.date).toLocaleDateString('hi-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '500' }}>
            <MapPin size={18} color="var(--primary)" /> {evt.location}
          </span>
        </div>
        
        <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#334155' }}>{evt.description}</p>
      </div>
    </div>
  );

  return (
    <section className="section bg-light" style={{ minHeight: '100vh' }}>
      <div className="container animate-fade-in">
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 className="section-title">समाज के कार्यक्रम</h2>
          <p style={{ fontSize: '1.2rem', color: '#64748b' }}>आगामी आयोजनों और पुरानी यादों का संग्रह।</p>
        </div>

        {/* UPCOMING EVENTS SECTION */}
        {upcomingEvents.length > 0 && (
          <div style={{ marginBottom: '5rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.8rem', color: 'var(--secondary)', marginBottom: '2rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px' }}>
              <Clock size={28} /> आगामी कार्यक्रम (Upcoming Events)
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              {upcomingEvents.map(evt => <EventCard key={evt._id || evt.id} evt={evt} isCompleted={false} />)}
            </div>
          </div>
        )}

        {/* COMPLETED EVENTS SECTION */}
        {completedEvents.length > 0 && (
          <div>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.8rem', color: '#64748b', marginBottom: '2rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px' }}>
              <CheckCircle size={28} /> संपन्न कार्यक्रम (Past Events)
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              {completedEvents.map(evt => <EventCard key={evt._id || evt.id} evt={evt} isCompleted={true} />)}
            </div>
          </div>
        )}

        {events.length === 0 && (
          <div style={{ textAlign: 'center', padding: '5rem', background: 'white', borderRadius: '15px' }}>
            <Calendar size={64} color="#cbd5e1" style={{ marginBottom: '20px' }} />
            <h3>कोई कार्यक्रम नहीं मिला।</h3>
          </div>
        )}
      </div>

      {/* Image Modal (Lightbox) */}
      {selectedImage && (
        <div 
          onClick={() => setSelectedImage(null)} 
          style={{
            position: 'fixed',
            top: 0, left: 0, width: '100%', height: '100%',
            background: 'rgba(0,0,0,0.9)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 9999, cursor: 'zoom-out',
            padding: '20px'
          }}
        >
          <button 
            onClick={() => setSelectedImage(null)}
            style={{
              position: 'absolute', top: '20px', right: '20px',
              background: 'white', border: 'none', borderRadius: '50%',
              width: '40px', height: '40px', cursor: 'pointer',
              fontSize: '24px', fontWeight: 'bold', color: 'black',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 10px rgba(0,0,0,0.5)'
            }}
          >
            &times;
          </button>
          <img 
            src={selectedImage} 
            alt="Full Preview" 
            style={{ 
              maxWidth: '95%', maxHeight: '90vh', 
              objectFit: 'contain', 
              borderRadius: '8px',
              boxShadow: '0 0 30px rgba(255,255,255,0.1)'
            }} 
          />
        </div>
      )}
    </section>
  );
};

export default Events;
