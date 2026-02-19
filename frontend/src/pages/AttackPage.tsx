import { useState, useEffect } from 'react';

interface Backup {
  timestamp: string;
  filename: string;
  created: string;
}

interface AttackResult {
  success: boolean;
  attack_type: string;
  message: string;
  target_user?: string;
  magnitude?: number;
  database_status?: {
    total_users: number;
    users_affected: number;
    status: string;
  };
}

export function AttackPage() {
  const [backups, setBackups] = useState<Backup[]>([]);
  const [loading, setLoading] = useState(false);
  const [attackResult, setAttackResult] = useState<AttackResult | null>(null);
  const [restoreStatus, setRestoreStatus] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [users, setUsers] = useState<string[]>([]);

  // Load backups and users on component mount
  useEffect(() => {
    loadBackups();
    loadUsers();
  }, []);

  const loadBackups = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/backups/list');
      const data = await response.json();
      setBackups(data.backups || []);
    } catch (error) {
      console.error('Failed to load backups:', error);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/users');
      const data = await response.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  };

  const handleMassAttack = async () => {
    setLoading(true);
    setAttackResult(null);
    try {
      const response = await fetch('http://localhost:8000/api/attack/mass-perturbation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ magnitude: 0.15 })
      });
      const data = await response.json();
      setAttackResult(data);
    } catch (error) {
      setAttackResult({
        success: false,
        attack_type: 'Error',
        message: 'Attack failed: ' + String(error)
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTargetedAttack = async () => {
    if (!selectedUser) {
      alert('Please select a user to attack');
      return;
    }

    setLoading(true);
    setAttackResult(null);
    try {
      const response = await fetch('http://localhost:8000/api/attack/perturbation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target_user: selectedUser, magnitude: 0.1 })
      });
      const data = await response.json();
      setAttackResult(data);
    } catch (error) {
      setAttackResult({
        success: false,
        attack_type: 'Error',
        message: 'Attack failed: ' + String(error)
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (timestamp: string) => {
    if (!window.confirm('Are you sure you want to restore this backup? Current database will be overwritten.')) {
      return;
    }

    setLoading(true);
    setRestoreStatus(null);
    try {
      const response = await fetch(`http://localhost:8000/api/backups/restore/${timestamp}`, {
        method: 'POST'
      });
      const data = await response.json();
      if (data.success) {
        setRestoreStatus(`✓ Database restored successfully from ${timestamp}`);
        setAttackResult(null);
        await loadUsers();
      } else {
        setRestoreStatus(`✗ Restore failed: ${data.error}`);
      }
    } catch (error) {
      setRestoreStatus('✗ Restore failed: ' + String(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="card">
        <div style={{ marginBottom: '24px' }}>
          <h2>🔥 Dataset Attack Simulator</h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            Test system security by running data poisoning attacks
          </p>
        </div>

        {/* Attack Buttons */}
        <div className="grid-2">
          <div className="attack-card-modern">
            <h3>Mass Attack</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '16px' }}>
              Attack all enrolled faces at once with noise perturbation.
            </p>
            <button
              className="btn btn-danger w-full"
              onClick={handleMassAttack}
              disabled={loading || users.length === 0}
            >
              {loading ? '🔄 Attacking...' : '💣 Execute Mass Attack'}
            </button>
          </div>

          <div className="attack-card-modern">
            <h3>Targeted Attack</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '16px' }}>
              Attack a specific user's face data.
            </p>
            <div className="form-group">
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                disabled={loading}
              >
                <option value="">Select a user...</option>
                {users.map((user) => (
                  <option key={user} value={user}>
                    👤 {user}
                  </option>
                ))}
              </select>
            </div>
            <button
              className="btn btn-danger w-full"
              onClick={handleTargetedAttack}
              disabled={loading || !selectedUser}
            >
              {loading ? '🔄 Attacking...' : '🎯 Execute Targeted Attack'}
            </button>
          </div>
        </div>

        {/* Attack Result */}
        {attackResult && (
          <div className={`alert ${attackResult.success ? 'alert-warning' : 'alert-error'} mt-4`}>
            <strong>{attackResult.attack_type}</strong>
            <p>{attackResult.message}</p>
            {attackResult.database_status && (
              <div className="mt-2 text-sm">
                <p>📊 Database Status:</p>
                <div className="grid-2" style={{ gap: '10px', marginTop: '8px' }}>
                  <span className="backup-item-modern">Total Users: {attackResult.database_status.total_users}</span>
                  <span className="backup-item-modern">Affected: {attackResult.database_status.users_affected}</span>
                </div>
                <p className="mt-2">Status: <span style={{ color: 'var(--error)' }}>{attackResult.database_status.status}</span></p>
              </div>
            )}
          </div>
        )}

        {/* Restore Status */}
        {restoreStatus && (
          <div className={`alert ${restoreStatus.includes('✓') ? 'alert-success' : 'alert-error'} mt-4`}>
            {restoreStatus}
          </div>
        )}

        {/* Backup Management */}
        <div className="mt-4 pt-4 border-t border-[var(--bg-tertiary)]">
          <h3>💾 Backup Management</h3>
          <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>
            System automatically creates backups. Use the button below to restore the most recent stable state.
          </p>

          {backups.length === 0 ? (
            <div className="alert alert-warning">
              No backups available yet. Enroll a user to create a backup.
            </div>
          ) : (
            <div className="attack-card-modern" style={{ borderColor: 'var(--success)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                <div>
                  <h3 style={{ color: 'var(--success)', margin: 0 }}>Latest Backup</h3>
                  <p style={{ margin: '5px 0', color: 'var(--text-primary)' }}>
                    {backups[0].filename}
                  </p>
                  <p style={{ margin: '0', fontSize: '12px', color: 'var(--text-secondary)' }}>
                    📅 {new Date(backups[0].created).toLocaleString()}
                  </p>
                </div>
                <button
                  className="btn btn-success"
                  onClick={() => handleRestore(backups[0].timestamp)}
                  disabled={loading}
                >
                  {loading ? '⏳ Restoring...' : '↩️ Restore Database'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
