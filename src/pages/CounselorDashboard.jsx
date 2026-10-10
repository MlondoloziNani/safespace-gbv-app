import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import { AlertCircle, MapPin } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { GlassCard } from '../components/GlassCard';
import 'leaflet/dist/leaflet.css';

// Helper component to change map center dynamically
function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, map, zoom]);
  return null;
}

export function CounselorDashboard() {
  const { cases } = useAppContext();
  const navigate = useNavigate();

  // Default to Johannesburg, SA
  const defaultCenter = [-26.2041, 28.0473];
  const [mapCenter, setMapCenter] = useState(defaultCenter);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMapCenter([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.warn("Geolocation denied or error, using default Johannesburg center.", error);
        }
      );
    }
  }, []);

  return (
    <div className="app-container animate-fade-in" style={{ maxWidth: '1400px' }}>
      <h1 className="page-title">Active Cases Nearby</h1>
      <p className="page-subtitle">Select a case below or on the map to review details and offer help.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', height: '600px' }}>
        
        {/* Map View */}
        <GlassCard style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <MapContainer center={mapCenter} zoom={12} style={{ flex: 1, width: '100%' }}>
            <ChangeView center={mapCenter} zoom={12} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {cases.map((c) => (
              <CircleMarker 
                key={c.id} 
                center={[c.location.lat, c.location.lng]}
                radius={12}
                pathOptions={{ color: c.type === 'Bullying' ? '#F59E0B' : '#EF4444', fillColor: c.type === 'Bullying' ? '#FCD34D' : '#FCA5A5', fillOpacity: 0.8 }}
                eventHandlers={{
                  click: () => {
                    navigate(`/case/${c.id}`);
                  },
                }}
              >
                <Popup>
                  <strong>{c.type}</strong><br/>
                  Click to view details.
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </GlassCard>

        {/* List View */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto', paddingRight: '0.5rem', paddingBottom: '8rem' }}>
          {cases.length === 0 ? (
            <GlassCard style={{ textAlign: 'center', padding: '3rem 2rem' }}>
              <p style={{ color: 'var(--text-muted)' }}>No active cases nearby. Thank you for being available.</p>
            </GlassCard>
          ) : (
            cases.map(c => (
              <GlassCard 
                key={c.id} 
                className="hover-card" 
                style={{ cursor: 'pointer', transition: 'all 0.2s ease', borderLeft: `4px solid ${c.type === 'Bullying' ? '#F59E0B' : '#EF4444'}` }}
                onClick={() => navigate(`/case/${c.id}`)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', color: 'var(--text-main)' }}>
                    <AlertCircle size={18} color={c.type === 'Bullying' ? '#F59E0B' : '#EF4444'} />
                    {c.type} Request
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {new Date(c.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {c.description}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <MapPin size={14} /> Lat: {c.location.lat.toFixed(4)}, Lng: {c.location.lng.toFixed(4)}
                </div>
              </GlassCard>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
