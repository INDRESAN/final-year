import React, { useState, useEffect } from 'react';
import { api } from '../api/client';

export const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    setMessage('');
    try {
      const response = await api.getUsers();
      setUsers(response.users);
      if (response.users.length === 0) {
        setMessage('ℹ️ No users enrolled yet');
      }
    } catch (err: any) {
      setMessage('❌ Failed to fetch users');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (username: string) => {
    if (!window.confirm(`Are you sure you want to delete "${username}"?`)) {
      return;
    }

    setLoading(true);
    try {
      await api.deleteUser(username);
      setUsers(users.filter((u) => u !== username));
      setMessage(`✅ User "${username}" deleted successfully`);
    } catch (err: any) {
      setMessage('❌ Failed to delete user');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ margin: 0 }}>👥 User Management</h2>
        <button className="btn btn-secondary" onClick={fetchUsers} disabled={loading}>
          {loading ? '🔄 Loading...' : '🔄 Refresh'}
        </button>
      </div>

      {message && (
        <div className={`alert ${message.includes('✅') ? 'alert-success' : 'alert-warning'}`}>
          {message}
        </div>
      )}

      {users.length > 0 ? (
        <div className="user-list">
          {users.map((user) => (
            <div key={user} className="user-list-item">
              <strong style={{ fontSize: '1.1rem', color: 'var(--primary)' }}>👤 {user}</strong>
              <button
                className="btn btn-danger"
                onClick={() => deleteUser(user)}
                disabled={loading}
                style={{ width: 'auto', padding: '8px 16px', fontSize: '0.9em' }}
              >
                🗑️ Delete
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center" style={{ padding: '40px', color: 'var(--text-muted)' }}>
          <p>No users found in the database.</p>
        </div>
      )}
    </div>
  );
};
