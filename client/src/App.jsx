import React, { useState, useEffect, Component } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import DashboardScreen from './screens/DashboardScreen';
import LoginScreen from './screens/LoginScreen';
import PatientsScreen from './screens/PatientsScreen';
import CasesScreen from './screens/CasesScreen';
import PatientProfileScreen from './screens/PatientProfileScreen';
import SettingsScreen from './screens/SettingsScreen';
import AddCaseScreen from './screens/AddCaseScreen';
import CaseDetailsScreen from './screens/CaseDetailsScreen';

// Global Error Boundary to prevent White Screen of Death
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    console.error("System Error caught by Boundary:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', background: 'var(--bg-color)', color: 'var(--text-primary)', padding: '20px' }}>
          <h2>Sorry, an unexpected system error occurred ⚠️</h2>
          <p>Please try refreshing the page or returning to the dashboard.</p>
          <button onClick={() => window.location.href = '/dashboard'} className="btn btn-primary" style={{ marginTop: '20px' }}>Back to Home</button>
        </div>
      );
    }
    return this.props.children;
  }
}

const Layout = ({ children, toggleTheme, isDark }) => {
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Navbar toggleTheme={toggleTheme} isDark={isDark} />
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
};

function App() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    document.body.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginScreen />} />
        
        <Route path="/dashboard" element={
          <Layout toggleTheme={toggleTheme} isDark={isDark}>
            <DashboardScreen />
          </Layout>
        } />
        
        <Route path="/patients" element={
          <Layout toggleTheme={toggleTheme} isDark={isDark}>
            <PatientsScreen />
          </Layout>
        } />

        <Route path="/patients/:id" element={
          <Layout toggleTheme={toggleTheme} isDark={isDark}>
            <PatientProfileScreen />
          </Layout>
        } />

        <Route path="/cases" element={
          <Layout toggleTheme={toggleTheme} isDark={isDark}>
            <CasesScreen />
          </Layout>
        } />

        <Route path="/cases/new" element={
          <Layout toggleTheme={toggleTheme} isDark={isDark}>
            <AddCaseScreen />
          </Layout>
        } />

        <Route path="/cases/new/:patientId" element={
          <Layout toggleTheme={toggleTheme} isDark={isDark}>
            <AddCaseScreen />
          </Layout>
        } />

        <Route path="/cases/:id" element={
          <Layout toggleTheme={toggleTheme} isDark={isDark}>
            <CaseDetailsScreen />
          </Layout>
        } />

        <Route path="/settings" element={
          <Layout toggleTheme={toggleTheme} isDark={isDark}>
            <SettingsScreen />
          </Layout>
        } />
        
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
