import React from 'react';
import { BookOpen, Shield, Heart } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';

export function Resources() {
  const resources = [
    {
      title: 'Understanding Bullying',
      description: 'Learn the signs of bullying and how to safely intervene or seek help.',
      icon: <BookOpen size={24} color="var(--accent)" />
    },
    {
      title: 'Safety Planning Guide',
      description: 'Step-by-step guide on how to create a personal safety plan if you are in a risky situation.',
      icon: <Shield size={24} color="var(--error)" />
    },
    {
      title: 'Mental Health First Aid',
      description: 'Techniques for managing anxiety and grounding yourself during stressful times.',
      icon: <Heart size={24} color="#F59E0B" />
    }
  ];

  return (
    <div className="app-container animate-fade-in" style={{ maxWidth: '800px' }}>
      <h1 className="page-title">Educational Resources</h1>
      <p className="page-subtitle">Learn more about how to protect yourself and others.</p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {resources.map((res, index) => (
          <GlassCard key={index} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{ background: 'rgba(255,255,255,0.8)', padding: '1rem', borderRadius: '12px' }}>
              {res.icon}
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>{res.title}</h2>
              <p style={{ color: 'var(--text-muted)' }}>{res.description}</p>
              <button className="btn btn-outline" style={{ marginTop: '1rem', padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                Read Article
              </button>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
