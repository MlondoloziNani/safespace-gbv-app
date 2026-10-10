import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  
  const [cases, setCases] = useState([
    {
      id: '1',
      type: 'GBV',
      description: 'Need help near the park.',
      location: { lat: -26.2041, lng: 28.0473 },
      status: 'active',
      timestamp: new Date().toISOString(),
      reporterId: 'user_mock_1'
    },
    {
      id: '2',
      type: 'Bullying',
      description: 'Harassment at school grounds.',
      location: { lat: -26.1950, lng: 28.0300 },
      status: 'active',
      timestamp: new Date().toISOString(),
      reporterId: 'user_mock_2'
    }
  ]);

  const [messages, setMessages] = useState({});

  const login = (role) => {
    setCurrentUser({ id: `user_${Date.now()}`, role });
  };

  const loginAnonymous = () => {
    setCurrentUser({ id: `anon_${Date.now()}`, role: 'anonymous' });
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const reportCase = (newCase) => {
    const caseId = `case_${Date.now()}`;
    setCases(prev => [{
      ...newCase,
      id: caseId,
      status: 'active',
      timestamp: new Date().toISOString(),
      reporterId: currentUser?.id || 'anonymous'
    }, ...prev]);
    return caseId;
  };

  const acceptCase = (caseId) => {
    setCases(prev => prev.map(c => 
      c.id === caseId ? { ...c, status: 'accepted', counselorId: currentUser.id } : c
    ));
    // Initialize chat
    if (!messages[caseId]) {
      setMessages(prev => ({
        ...prev,
        [caseId]: [{
          id: Date.now().toString(),
          senderId: 'system',
          text: 'A counselor has accepted this case. You can now chat securely.',
          timestamp: new Date().toISOString()
        }]
      }));
    }
  };

  const sendMessage = (caseId, text) => {
    setMessages(prev => {
      const caseMsgs = prev[caseId] || [];
      return {
        ...prev,
        [caseId]: [...caseMsgs, {
          id: Date.now().toString(),
          senderId: currentUser.id,
          text,
          timestamp: new Date().toISOString()
        }]
      };
    });
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      cases,
      messages,
      login,
      loginAnonymous,
      logout,
      reportCase,
      acceptCase,
      sendMessage
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => useContext(AppContext);
