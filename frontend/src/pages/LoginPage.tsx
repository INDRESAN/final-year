import React, { useState } from 'react';
import { api } from '../api/client';

interface LoginPageProps {
  onLoginSuccess: (adminUsername: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.adminLogin({ username, password });
      if (response.success && response.admin_username) {
        onLoginSuccess(response.admin_username);
      } else {
        setError(response.message || 'Login failed');
      }
    } catch (err: any) {
      if (err.code === 'ECONNREFUSED') {
        setError('Cannot connect to backend. Is it running on localhost:8000?');
      } else {
        setError(err.response?.data?.detail || 'Login failed. Check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>🔐 Admin Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="admin"
            required
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            disabled={loading}
          />
        </div>
        <button type="submit" className="btn btn-primary w-full" disabled={loading}>
          {loading ? '🔄 Logging in...' : '✅ Login'}
        </button>
      </form>
      {error && <div className="alert alert-error mt-4">{error}</div>}
    </div>
  );
};
