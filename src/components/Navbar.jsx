import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut, ShieldAlert, HeartHandshake, Home, BookOpen, PhoneCall, MessageCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export function Navbar() {
  const { currentUser, logout } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!currentUser) return null;

  const isCounselor = currentUser.role === 'counselor';
  const navLinks = [
    { name: 'Home', path: isCounselor ? '/counselor' : '/victim', icon: Home },
    { name: 'Resources', path: '/resources', icon: BookOpen },
    { name: 'Contacts', path: '/contacts', icon: PhoneCall },
    { name: 'Messages', path: '/messages', icon: MessageCircle }
  ];

  return (
    <>
      {/* Top Navbar */}
      <nav style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: '1rem 2rem',
        background: 'rgba(255, 255, 255, 0.4)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.5)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', fontSize: '1.25rem', color: 'var(--accent)' }}>
          {isCounselor ? <HeartHandshake size={28} /> : <ShieldAlert size={28} color="var(--error)" />}
          SafeSpace
        </div>
        
        {/* Desktop Nav Links */}
        <div className="desktop-nav-links" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          {navLinks.map(link => {
            const Icon = link.icon;
            const isActive = location.pathname.startsWith(link.path);
            return (
              <a 
                key={link.name}
                onClick={() => navigate(link.path)}
                style={{ 
                  cursor: 'pointer', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  fontWeight: '500',
                  color: isActive ? 'var(--accent)' : 'var(--text-muted)',
                  borderBottom: isActive ? '2px solid var(--accent)' : '2px solid transparent',
                  paddingBottom: '0.25rem'
                }}
              >
                <Icon size={18} />
                {link.name}
              </a>
            );
          })}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span className="desktop-nav-links" style={{ fontWeight: '500', color: 'var(--text-muted)' }}>
            {currentUser.role === 'anonymous' ? 'Anonymous Mode' : isCounselor ? 'Counselor Mode' : 'Victim Mode'}
          </span>
          <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>
            <LogOut size={18} /> <span className="desktop-nav-links">Logout</span>
          </button>
        </div>
      </nav>

      {/* Bottom Nav for Mobile */}
      <div className="bottom-nav">
        {navLinks.map(link => {
          const Icon = link.icon;
          const isActive = location.pathname.startsWith(link.path);
          return (
            <a 
              key={link.name}
              className={`bottom-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => navigate(link.path)}
              style={{ cursor: 'pointer' }}
            >
              <Icon size={24} />
              {link.name}
            </a>
          );
        })}
      </div>
    </>
  );
}
