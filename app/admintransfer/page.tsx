'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './admin.module.css';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simple demo authentication
    // In a real app, this would call an API
    setTimeout(() => {
      if (username === 'admin' && password === 'admin') {
        localStorage.setItem('admin_token', 'demo_token_123');
        router.push('/admintransfer/dashboard');
      } else {
        setError('Invalid username or password');
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className={styles.loginWrapper}>
      <div className={styles.loginCard}>
        <div className={styles.loginHeader}>
          <div className={styles.adminLogoContainer}>
            <img src="/logo.png" alt="Private Transfers" className={styles.adminLogoImg} />
          </div>
          <p>SECURE ACCESS</p>
          <h1>Admin Portal</h1>
        </div>

        <form className={styles.loginForm} onSubmit={handleLogin}>
          {error && <div className={styles.error}>{error}</div>}
          
          <div className={styles.inputGroup}>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>

          <button type="submit" className={styles.loginBtn} disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign In →'}
          </button>
        </form>
      </div>
    </div>
  );
}
