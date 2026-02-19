import { useState } from 'react';
import { LoginPage } from './pages/LoginPage';
import { VerificationPage } from './pages/VerificationPage';
import { EnrollmentPage } from './pages/EnrollmentPage';
import { UsersPage } from './pages/UsersPage';
import { AttackPage } from './pages/AttackPage';

type Tab = 'verify' | 'enroll' | 'users' | 'attack';

export default function App() {
  const [adminUsername, setAdminUsername] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('verify');

  if (!adminUsername) {
    return (
      <div className="page auth-page">
        <div className="card text-center" style={{ maxWidth: '400px' }}>
          <h1 style={{ marginBottom: '1rem' }}>🔐 Face System</h1>
          <p className="mb-4">Admin Portal Login</p>
          <LoginPage onLoginSuccess={setAdminUsername} />
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <header className="header">
        <div className="header-content">
          <div>
            <h1>🎯 Face Shield</h1>
            <p>Advanced Biometric Security System</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p className="mb-4">Logged in as <strong>{adminUsername}</strong></p>
            <button
              className="btn btn-secondary"
              onClick={() => setAdminUsername(null)}
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </header>

      <main className="content">
        <div className="nav-tabs">
          <button
            className={`nav-tab ${activeTab === 'verify' ? 'active' : ''}`}
            onClick={() => setActiveTab('verify')}
          >
            👤 Verify
          </button>
          <button
            className={`nav-tab ${activeTab === 'enroll' ? 'active' : ''}`}
            onClick={() => setActiveTab('enroll')}
          >
            ✏️ Enroll
          </button>
          <button
            className={`nav-tab ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            👥 Users
          </button>
          <button
            className={`nav-tab ${activeTab === 'attack' ? 'active' : ''}`}
            onClick={() => setActiveTab('attack')}
            style={{ color: activeTab === 'attack' ? '#ef4444' : '' }}
          >
            🔥 Attack & Restore
          </button>
        </div>

        <div className="container">
          {activeTab === 'verify' && <VerificationPage />}
          {activeTab === 'enroll' && <EnrollmentPage adminUsername={adminUsername} />}
          {activeTab === 'users' && <UsersPage />}
          {activeTab === 'attack' && <AttackPage />}
        </div>
      </main>
    </div>
  );
}
