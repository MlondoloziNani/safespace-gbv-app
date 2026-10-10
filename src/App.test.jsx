import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders login screen by default', () => {
    render(<App />);
    expect(screen.getByText('SafeSpace')).toBeInTheDocument();
    expect(screen.getByText(/A safe place to seek help and offer support/i)).toBeInTheDocument();
    expect(screen.getByText(/Report Anonymously/i)).toBeInTheDocument();
  });

  it('allows user to login as victim', () => {
    render(<App />);
    const victimBtn = screen.getByText(/I Need Help/i);
    fireEvent.click(victimBtn);
    
    // Should navigate to Victim Dashboard
    expect(screen.getByText(/You are not alone/i)).toBeInTheDocument();
    expect(screen.getByText(/Report an Issue Now/i)).toBeInTheDocument();
  });

  it('allows user to login as counselor', () => {
    render(<App />);
    const counselorBtn = screen.getByText(/I'm a Counselor/i);
    fireEvent.click(counselorBtn);
    
    // Should navigate to Counselor Dashboard
    expect(screen.getByText(/Active Cases Nearby/i)).toBeInTheDocument();
  });

  it('allows user to report anonymously', () => {
    render(<App />);
    const anonBtn = screen.getByText(/Report Anonymously/i);
    fireEvent.click(anonBtn);
    
    // Should navigate directly to the report form
    expect(screen.getByText(/Report an Issue/i)).toBeInTheDocument();
  });
});
