import React, { useState, useEffect } from 'react';
import { ImageIcon, Filter, X, Maximize2, ChevronLeft, ChevronRight } from 'lucide-react';

const Gallery = () => {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/gallery');
        const gallery = await res.json();

        const combined = gallery.map(g => ({ 
          url: g.imageUrl, 
          title: g.title, 
          type: g.category 
        })).filter(item => item.url);

        setItems(combined);
        setLoading(false);
      } catch (err) {
        console.error('Gallery fetch error:', err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredItems = filter === 'all' ? items : items.filter(item => item.type === filter);

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : filteredItems.length - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex(prev => (prev < filteredItems.length - 1 ? prev + 1 : 0));
  };

  if (loading) return <div style={{textAlign: 'center', padding: '10rem', fontSize: '1.2rem'}}>गैलरी लोड हो रही है...</div>;

  return (
    <section className="section bg-light" style={{ minHeight: '100vh' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 className="section-title"><ImageIcon style={{verticalAlign: 'middle', marginRight: '10px'}} size={32}/> समाज गैलरी</h2>
          <p style={{ color: '#666', fontSize: '1.1rem' }}>समाज के कार्यक्रम, प्रतिभाशाली छात्र और गौरवशाली इतिहास की झलकियां।</p>
        </div>

        {/* Filter Bar */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '10px', 
          marginBottom: '3rem', 
          flexWrap: 'wrap' 
        }}>
          {[
            { id: 'all', label: 'सभी (All)' },
            { id: 'event', label: 'कार्यक्रम (Events)' },
            { id: 'origin', label: 'उद्गम (Origin)' },
            { id: 'other', label: 'अन्य (Other)' }
          ].map(btn => (
            <button 
              key={btn.id}
              onClick={() => { setFilter(btn.id); setCurrentIndex(null); }}
              style={{
                padding: '10px 25px',
                borderRadius: '30px',
                border: 'none',
                background: filter === btn.id ? 'var(--primary)' : 'white',
                color: filter === btn.id ? 'white' : '#555',
                cursor: 'pointer',
                fontWeight: '600',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease'
              }}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Image Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
          gap: '20px' 
        }}>
          {filteredItems.map((item, idx) => (
            <div 
              key={idx} 
              className="card animate-fade-in" 
              style={{ 
                padding: '0', 
                overflow: 'hidden', 
                position: 'relative', 
                cursor: 'pointer',
                aspectRatio: '4/3'
              }}
              onClick={() => setCurrentIndex(idx)}
            >
              <img 
                src={item.url} 
                alt={item.title} 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover',
                  transition: 'transform 0.5s ease'
                }} 
                onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
              />
              <div style={{
                position: 'absolute',
                bottom: 0, left: 0, width: '100%',
                background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                padding: '20px 15px',
                color: 'white'
              }}>
                <h4 style={{ margin: 0, fontSize: '1rem' }}>{item.title}</h4>
                <small style={{ opacity: 0.8, textTransform: 'capitalize' }}>{item.type}</small>
              </div>
              <div style={{
                position: 'absolute', top: '10px', right: '10px',
                background: 'rgba(255,255,255,0.2)',
                padding: '5px', borderRadius: '50%', color: 'white'
              }}>
                <Maximize2 size={16} />
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div style={{ textAlign: 'center', padding: '5rem', color: '#999' }}>
            इस केटेगरी में कोई फोटो नहीं मिली।
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {currentIndex !== null && (
        <div 
          onClick={() => setCurrentIndex(null)}
          style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            background: 'rgba(0,0,0,0.95)',
            zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'default'
          }}
        >
          {/* Close Button */}
          <button 
            onClick={() => setCurrentIndex(null)}
            style={{
              position: 'absolute', top: '25px', right: '25px',
              background: 'white', border: 'none', borderRadius: '50%',
              width: '45px', height: '45px', cursor: 'pointer',
              fontSize: '28px', color: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 10001
            }}
          >
            &times;
          </button>

          {/* Navigation Buttons */}
          <button 
            onClick={handlePrev}
            style={{
              position: 'absolute', left: '20px', 
              background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%',
              width: '50px', height: '50px', cursor: 'pointer', color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.3s'
            }}
            onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.4)'}
            onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
          >
            <ChevronLeft size={32} />
          </button>

          <button 
            onClick={handleNext}
            style={{
              position: 'absolute', right: '20px', 
              background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%',
              width: '50px', height: '50px', cursor: 'pointer', color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.3s'
            }}
            onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.4)'}
            onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
          >
            <ChevronRight size={32} />
          </button>

          <div style={{ position: 'relative', maxWidth: '85%', maxHeight: '85vh', textAlign: 'center' }}>
            <img 
              src={filteredItems[currentIndex].url} 
              style={{ maxWidth: '100%', maxHeight: '85vh', borderRadius: '5px', boxShadow: '0 0 30px rgba(0,0,0,0.5)', objectFit: 'contain' }} 
              alt="Full Preview"
              onClick={(e) => e.stopPropagation()}
            />
            <div style={{ color: 'white', marginTop: '15px', fontSize: '1.2rem', fontWeight: '500' }}>
              {filteredItems[currentIndex].title}
            </div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
              {currentIndex + 1} / {filteredItems.length}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Gallery;
