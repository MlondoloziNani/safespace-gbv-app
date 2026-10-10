import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useAppContext } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Login } from './pages/Login';
import { VictimDashboard } from './pages/VictimDashboard';
import { ReportForm } from './pages/ReportForm';
import { CounselorDashboard } from './pages/CounselorDashboard';
import { CaseDetails } from './pages/CaseDetails';
import { Resources } from './pages/Resources';
import { Contacts } from './pages/Contacts';
import { MessagesList } from './pages/MessagesList';
import { ChatView } from './pages/ChatView';

function ProtectedRoute({ children, role }) {
  const { currentUser } = useAppContext();
  
  if (!currentUser) return <Navigate to="/" />;
  
  // If role is explicitly required and user is not that role
  // Note: 'victim' role requirement here usually allows 'anonymous' for reporting purposes
  if (role) {
    if (role === 'victim' && currentUser.role === 'counselor') {
      return <Navigate to="/counselor" />;
    }
    if (role === 'counselor' && currentUser.role !== 'counselor') {
      return <Navigate to={currentUser.role === 'anonymous' ? '/report' : '/victim'} />;
    }
  }
  
  return children;
}

function AppRoutes() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        
        {/* Victim / Anonymous Routes */}
        <Route path="/victim" element={
          <ProtectedRoute role="victim"><VictimDashboard /></ProtectedRoute>
        } />
        <Route path="/report" element={
          <ProtectedRoute role="victim"><ReportForm /></ProtectedRoute>
        } />

        {/* Counselor Routes */}
        <Route path="/counselor" element={
          <ProtectedRoute role="counselor"><CounselorDashboard /></ProtectedRoute>
        } />
        <Route path="/case/:id" element={
          <ProtectedRoute role="counselor"><CaseDetails /></ProtectedRoute>
        } />

        {/* Shared Routes (Accessible by all logged in users, including anonymous) */}
        <Route path="/resources" element={
          <ProtectedRoute><Resources /></ProtectedRoute>
        } />
        <Route path="/contacts" element={
          <ProtectedRoute><Contacts /></ProtectedRoute>
        } />
        <Route path="/messages" element={
          <ProtectedRoute><MessagesList /></ProtectedRoute>
        } />
        <Route path="/chat/:id" element={
          <ProtectedRoute><ChatView /></ProtectedRoute>
        } />

      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
}

export default App;
