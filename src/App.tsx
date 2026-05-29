import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import Dashboard from '@/pages/Dashboard';
import Campaigns from '@/pages/Campaigns';
import Settings from '@/pages/Settings';
import { useAuthStore } from '@/store/authStore';

function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    // Check authentication status on mount
    checkAuth();
  }, [checkAuth]);

  // For now, we'll skip the login page and assume authenticated
  // In production, you would add proper authentication flow
  const mockAuth = true;

  return (
    <BrowserRouter>
      {mockAuth ? (
        <AppLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/campaigns" element={<Campaigns />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppLayout>
      ) : (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' as const }}>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>Nostr Marketing Platform</h1>
            <p style={{ color: 'var(--text-tertiary)' }}>Please log in to continue</p>
          </div>
        </div>
      )}
    </BrowserRouter>
  );
}

export default App;

// Made with Bob
