import React, { useState, useEffect } from 'react';
import { Calendar, MapPin } from 'lucide-react';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div style={{textAlign: 'center', padding: '5rem'}}>Loading...</div>;

  return (
    <section className="section bg-light">
      <div className="container animate-fade-in">
        <h2 className="section-title">
          <Calendar className="inline-icon" style={{ verticalAlign: 'middle', marginRight: '10px' }} size={32} />
          आगामी एवं पिछले कार्यक्रम
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {events.map((evt) => (
            <div key={evt.id} className="card" style={{ display: 'flex', flexDirection: 'column', borderLeft: '5px solid var(--secondary)' }}>
              <h3 style={{ fontSize: '1.5rem', color: 'var(--dark)' }}>{evt.title}</h3>
              
              <div style={{ display: 'flex', gap: '20px', margin: '10px 0', color: 'gray' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Calendar size={16} /> {evt.date}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <MapPin size={16} /> {evt.location}
                </span>
              </div>
              
              <p style={{ marginTop: '10px', fontSize: '1.1rem' }}>{evt.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Events;
