'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '@/lib/api';

const COUNTRY_CODES = [
  { code: '+353', flag: '🇮🇪', country: 'Ireland' },
  { code: '+1',   flag: '🇺🇸', country: 'USA' },
  { code: '+44',  flag: '🇬🇧', country: 'UK' },
  { code: '+91',  flag: '🇮🇳', country: 'India' },
  { code: '+61',  flag: '🇦🇺', country: 'Australia' },
  { code: '+1',   flag: '🇨🇦', country: 'Canada' },
  { code: '+49',  flag: '🇩🇪', country: 'Germany' },
  { code: '+33',  flag: '🇫🇷', country: 'France' },
  { code: '+39',  flag: '🇮🇹', country: 'Italy' },
  { code: '+34',  flag: '🇪🇸', country: 'Spain' },
  { code: '+351', flag: '🇵🇹', country: 'Portugal' },
  { code: '+31',  flag: '🇳🇱', country: 'Netherlands' },
  { code: '+32',  flag: '🇧🇪', country: 'Belgium' },
  { code: '+41',  flag: '🇨🇭', country: 'Switzerland' },
  { code: '+43',  flag: '🇦🇹', country: 'Austria' },
  { code: '+46',  flag: '🇸🇪', country: 'Sweden' },
  { code: '+47',  flag: '🇳🇴', country: 'Norway' },
  { code: '+45',  flag: '🇩🇰', country: 'Denmark' },
  { code: '+358', flag: '🇫🇮', country: 'Finland' },
  { code: '+48',  flag: '🇵🇱', country: 'Poland' },
  { code: '+971', flag: '🇦🇪', country: 'UAE' },
  { code: '+966', flag: '🇸🇦', country: 'Saudi Arabia' },
  { code: '+65',  flag: '🇸🇬', country: 'Singapore' },
  { code: '+64',  flag: '🇳🇿', country: 'New Zealand' },
];

type AuthMode = 'login' | 'forgot_request' | 'forgot_verify' | 'forgot_reset' | 'forgot_success';

export default function DriverLoginPage() {
  const router = useRouter();

  // Login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Forgot password flow state
  const [mode, setMode] = useState<AuthMode>('login');
  const [forgotMethod, setForgotMethod] = useState<'phone' | 'email'>('phone');
  const [phoneCountry, setPhoneCountry] = useState('+353');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');
  const [activeIdentifier, setActiveIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [forgotMsg, setForgotMsg] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

  const resetForgotFlow = () => {
    setMode('login');
    setForgotError('');
    setForgotMsg('');
    setOtp('');
    setResetToken('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/driver/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      if (!res.ok) {
        const text = await res.text();
        let parsedMessage = text;
        try {
          const json = JSON.parse(text);
          parsedMessage = json.message || text;
        } catch (_) {}
        throw new Error(parsedMessage || 'Invalid credentials');
      }
      const data = await res.json();
      localStorage.setItem('driver_token', data.token || data.accessToken || 'driver_session');
      localStorage.setItem('driver_name', data.name || data.driverName || email.split('@')[0]);
      localStorage.setItem('driver_email', email);
      router.push('/driver/dashboard');
    } catch (err: any) {
      setLoginError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoginLoading(false);
    }
  };

  // Step 1: Send OTP for forgot password
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setForgotError('');
    setForgotMsg('');

    let identifier = '';
    if (forgotMethod === 'phone') {
      const cleanedPhone = phoneNumber.trim();
      if (!cleanedPhone) {
        setForgotError('Please enter your mobile phone number.');
        return;
      }
      identifier = cleanedPhone.startsWith('+') ? cleanedPhone : `${phoneCountry}${cleanedPhone}`;
    } else {
      identifier = forgotEmail.trim();
      if (!identifier) {
        setForgotError('Please enter your registered email address.');
        return;
      }
    }

    setForgotLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/driver/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier }),
      });

      const text = await res.text();
      let resData: any = {};
      try {
        resData = JSON.parse(text);
      } catch (_) {}

      if (!res.ok) {
        throw new Error(resData.message || text || 'Failed to send verification OTP.');
      }

      setActiveIdentifier(identifier);
      setForgotMsg(resData.message || `OTP sent to ${identifier}. Please check your inbox or SMS.`);
      setMode('forgot_verify');
    } catch (err: any) {
      setForgotError(err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setForgotLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');
    setForgotMsg('');

    const cleanOtp = otp.trim();
    if (!cleanOtp) {
      setForgotError('Please enter the OTP code received.');
      return;
    }

    setForgotLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/driver/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: activeIdentifier,
          otp: cleanOtp,
        }),
      });

      const text = await res.text();
      let resData: any = {};
      try {
        resData = JSON.parse(text);
      } catch (_) {}

      if (!res.ok) {
        throw new Error(resData.message || text || 'Invalid or expired OTP code.');
      }

      const receivedToken = resData.resetToken || resData.token || resData.reset_token || (typeof resData === 'string' ? resData : '');
      if (!receivedToken) {
        throw new Error(resData.message || 'OTP verification succeeded but no reset token was returned.');
      }

      setResetToken(receivedToken);
      setForgotMsg('Code verified successfully. Now create your new password.');
      setMode('forgot_reset');
    } catch (err: any) {
      setForgotError(err.message || 'OTP verification failed. Please try again.');
    } finally {
      setForgotLoading(false);
    }
  };

  // Step 3: Reset password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');
    setForgotMsg('');

    if (newPassword.length < 6) {
      setForgotError('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setForgotError('Passwords do not match. Please re-enter.');
      return;
    }

    setForgotLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/driver/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: activeIdentifier,
          resetToken,
          newPassword,
        }),
      });

      const text = await res.text();
      let resData: any = {};
      try {
        resData = JSON.parse(text);
      } catch (_) {}

      if (!res.ok) {
        throw new Error(resData.message || text || 'Failed to reset password.');
      }

      setMode('forgot_success');
      if (activeIdentifier.includes('@')) {
        setEmail(activeIdentifier);
      }
    } catch (err: any) {
      setForgotError(err.message || 'Failed to update password. Please try again.');
    } finally {
      setForgotLoading(false);
    }
  };

  const perks = [
    { icon: '📱', title: 'Manage Bookings', desc: 'View and accept new private transfer requests instantly.' },
    { icon: '📅', title: 'Schedule Control', desc: 'See all your upcoming going and return trips at a glance.' },
    { icon: '💶', title: 'Track Earnings', desc: 'Monitor your completed rides and track your revenue.' },
    { icon: '🗺️', title: 'Route Details', desc: 'Access full pickup, dropoff, and flight information.' },
  ];

  return (
    <>
      <style>{`
        .driver-page {
          min-height: 100vh;
          padding-top: 90px;
          box-sizing: border-box;
          background-color: var(--bg);
          font-family: var(--font-outfit), sans-serif;
          color: var(--text);
        }
        .driver-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 3rem 1.5rem;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }
        @media (max-width: 900px) {
          .driver-inner { grid-template-columns: 1fr; gap: 2rem; }
        }

        /* LEFT: SEO / marketing */
        .driver-left { padding-top: 1rem; }
        .driver-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: var(--primary-light); border: 1px solid var(--border-dark);
          color: var(--primary); padding: 6px 16px; border-radius: 50px;
          font-size: 0.78rem; font-weight: 700; letter-spacing: 1.5px;
          text-transform: uppercase; margin-bottom: 1.5rem;
        }
        .driver-left h1 {
          font-family: var(--font-playfair), serif;
          font-size: clamp(2.5rem, 4.5vw, 3.5rem);
          font-weight: 500; line-height: 1.15;
          margin: 0 0 1rem 0;
          color: var(--text);
          letter-spacing: 0.02em;
        }
        .driver-left p {
          color: var(--text-muted); font-size: 1.05rem; line-height: 1.7;
          margin: 0 0 2.5rem 0;
          font-weight: 300;
        }
        
        .perks-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .perk {
          background: var(--card-bg);
          border: 1px solid var(--border);
          box-shadow: var(--card-shadow);
          border-radius: 14px; padding: 1.25rem 1.1rem;
          transition: all 0.2s;
        }
        .perk:hover { border-color: var(--primary); transform: translateY(-2px); }
        .perk-icon { font-size: 1.5rem; margin-bottom: 8px; display: block; color: var(--primary); }
        .perk h3 { font-size: 0.95rem; font-weight: 600; margin: 0 0 4px; color: var(--text); }
        .perk p { font-size: 0.85rem; color: var(--text-muted); margin: 0; line-height: 1.5; font-weight: 300; }

        /* RIGHT: Form card */
        .driver-card {
          background: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: 24px;
          padding: 3rem 2.5rem;
          box-shadow: 0 10px 40px rgba(0,0,0,0.04);
          max-width: 480px;
          margin: 0 auto;
          width: 100%;
          box-sizing: border-box;
        }
        .card-logo { display: flex; justify-content: center; margin-bottom: 1.5rem; }
        .card-logo img { height: 52px; object-fit: contain; }
        .card-title { text-align: center; margin-bottom: 2rem; }
        .card-title h2 { font-family: var(--font-playfair), serif; font-size: 1.8rem; font-weight: 500; margin: 0 0 4px; color: var(--text); }
        .card-title p { font-size: 0.85rem; color: var(--text-muted); margin: 0; font-weight: 300; }

        .method-tabs {
          display: flex;
          background: #f1f5f9;
          border-radius: 8px;
          padding: 4px;
          margin-bottom: 1.5rem;
          gap: 4px;
        }
        .method-tab {
          flex: 1;
          padding: 8px 12px;
          border: none;
          background: transparent;
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--text-muted);
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
          font-family: var(--font-outfit), sans-serif;
        }
        .method-tab.active {
          background: #ffffff;
          color: var(--primary);
          box-shadow: 0 2px 6px rgba(0,0,0,0.06);
        }

        .field { display: flex; flex-direction: column; gap: 8px; margin-bottom: 1.25rem; }
        .field label {
          font-size: 0.72rem; font-weight: 600; color: var(--text-muted);
          text-transform: uppercase; letter-spacing: 1.5px;
        }
        .field input, .field select {
          background: #FFFFFF;
          border: 1px solid var(--border-input);
          color: var(--text); padding: 0.9rem 1rem;
          border-radius: 6px; font-size: 1rem; font-family: var(--font-outfit), sans-serif;
          transition: all 0.3s ease; outline: none; width: 100%; box-sizing: border-box;
        }
        .field input::placeholder { color: var(--text-muted); opacity: 0.7; }
        .field input:focus, .field select:focus {
          border-color: var(--primary); box-shadow: inset 0 2px 4px rgba(0,0,0,0.05), 0 0 0 1px var(--primary);
        }

        .otp-input {
          letter-spacing: 6px;
          text-align: center;
          font-size: 1.35rem !important;
          font-weight: 700;
        }

        .error-box {
          background: #fff1f2; border: 1px solid #fecdd3;
          color: #e11d48; padding: 0.8rem 1rem; border-radius: 6px;
          font-size: 0.85rem; margin-bottom: 1.25rem; text-align: center; font-family: var(--font-outfit), sans-serif;
        }
        .info-box {
          background: #f0fdf4; border: 1px solid #bbf7d0;
          color: #166534; padding: 0.8rem 1rem; border-radius: 6px;
          font-size: 0.85rem; margin-bottom: 1.25rem; text-align: center; font-family: var(--font-outfit), sans-serif;
        }

        .btn-action {
          width: 100%; padding: 1.1rem;
          background: var(--primary);
          color: #FFFFFF; font-weight: 600; font-size: 0.95rem;
          border: 1px solid transparent; border-radius: 4px; cursor: pointer;
          letter-spacing: 2.5px; text-transform: uppercase; margin-top: 0.5rem;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          font-family: var(--font-outfit), sans-serif;
        }
        .btn-action:hover:not(:disabled) {
          background: var(--primary-hover);
        }
        .btn-action:disabled { opacity: 0.6; cursor: not-allowed; }

        .forgot-link-wrap {
          display: flex;
          justify-content: flex-end;
          margin-top: -0.5rem;
          margin-bottom: 1.25rem;
        }
        .forgot-btn {
          background: none;
          border: none;
          color: var(--primary);
          font-size: 0.85rem;
          cursor: pointer;
          font-weight: 500;
          padding: 0;
          text-decoration: underline;
          font-family: var(--font-outfit), sans-serif;
        }
        .forgot-btn:hover { color: var(--primary-hover); }

        .form-footer-links {
          margin-top: 1.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.88rem;
          color: var(--text-muted);
        }
        .form-footer-links a, .form-footer-links button {
          color: var(--primary);
          font-weight: 600;
          text-decoration: none;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          font-size: 0.88rem;
          font-family: var(--font-outfit), sans-serif;
        }
        .form-footer-links a:hover, .form-footer-links button:hover {
          text-decoration: underline;
          color: var(--primary-hover);
        }

        .success-box {
          text-align: center;
          padding: 1rem 0;
        }
        .success-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
          display: block;
        }

        /* SEO keywords section at bottom */
        .seo-footer {
          max-width: 1200px; margin: 3rem auto 0; padding: 0 1.5rem 3rem;
        }
        .seo-footer h2 {
          font-family: var(--font-playfair), serif;
          font-size: 1.5rem; font-weight: 500; color: var(--text);
          margin-bottom: 1.25rem;
        }
        .seo-tags { display: flex; flex-wrap: wrap; gap: 0.75rem; }
        .seo-tag {
          background: #fff; border: 1px solid var(--border);
          color: var(--text-muted); padding: 6px 16px; border-radius: 50px;
          font-size: 0.8rem; font-weight: 400; transition: all 0.3s;
        }
        .seo-tag:hover { border-color: var(--primary); color: var(--primary); }
      `}</style>

      <div className="driver-page">
        <div className="driver-inner">

          {/* ── LEFT: Info + Perks ── */}
          <div className="driver-left">
            <div className="driver-badge">🔒 Secure Access</div>
            <h1>Driver Dashboard<br />Portal</h1>
            <p>
              Welcome to Private Transfers Ireland. Access your driver dashboard to view your schedule, manage your upcoming airport and city transfers, and track your revenue.
            </p>

            <div className="perks-grid">
              {perks.map((p, i) => (
                <div className="perk" key={i}>
                  <span className="perk-icon">{p.icon}</span>
                  <h3>{p.title}</h3>
                  <p>{p.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Form Card ── */}
          <div className="driver-card">
            <div className="card-logo">
              <img src="/logo.png" alt="Private Transfers Ireland" />
            </div>

            {/* 1. SIGN IN MODE */}
            {mode === 'login' && (
              <>
                <div className="card-title">
                  <h2>Welcome Back</h2>
                  <p>Enter your credentials to access your account</p>
                </div>

                {loginError && <div className="error-box">⚠️ {loginError}</div>}

                <form onSubmit={handleLogin}>
                  <div className="field">
                    <label>Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder=""
                      required
                      autoComplete="off"
                    />
                  </div>

                  <div className="field">
                    <label>Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder=""
                      required
                      autoComplete="current-password"
                    />
                  </div>

                  <div className="forgot-link-wrap">
                    <button
                      type="button"
                      className="forgot-btn"
                      onClick={() => {
                        setForgotError('');
                        setForgotMsg('');
                        setMode('forgot_request');
                      }}
                    >
                      Forgot password?
                    </button>
                  </div>

                  <button type="submit" className="btn-action" disabled={loginLoading}>
                    {loginLoading ? 'Authenticating...' : 'Sign In →'}
                  </button>

                  <div className="form-footer-links">
                    <span>
                      Not registered yet?{' '}
                      <a href="/driver/register">Register as Driver</a>
                    </span>
                  </div>
                </form>
              </>
            )}

            {/* 2. FORGOT PASSWORD - STEP 1: REQUEST OTP */}
            {mode === 'forgot_request' && (
              <>
                <div className="card-title">
                  <h2>Forgot Password</h2>
                  <p>Choose your verification method to reset password</p>
                </div>

                <div className="method-tabs">
                  <button
                    type="button"
                    className={`method-tab ${forgotMethod === 'phone' ? 'active' : ''}`}
                    onClick={() => { setForgotMethod('phone'); setForgotError(''); }}
                  >
                    📱 Mobile Number
                  </button>
                  <button
                    type="button"
                    className={`method-tab ${forgotMethod === 'email' ? 'active' : ''}`}
                    onClick={() => { setForgotMethod('email'); setForgotError(''); }}
                  >
                    ✉️ Email Address
                  </button>
                </div>

                {forgotError && <div className="error-box">⚠️ {forgotError}</div>}

                <form onSubmit={handleSendOtp}>
                  {forgotMethod === 'phone' ? (
                    <div className="field">
                      <label>Mobile Number</label>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <select
                          value={phoneCountry}
                          onChange={e => setPhoneCountry(e.target.value)}
                          style={{
                            padding: '0.85rem 0.5rem',
                            borderRadius: '6px',
                            border: '1px solid var(--border-input)',
                            background: '#fff',
                            width: '120px',
                            fontSize: '0.9rem'
                          }}
                        >
                          {COUNTRY_CODES.map(c => (
                            <option key={c.country + c.code} value={c.code}>
                              {c.flag} {c.code}
                            </option>
                          ))}
                        </select>
                        <input
                          type="tel"
                          value={phoneNumber}
                          onChange={e => setPhoneNumber(e.target.value)}
                          placeholder=""
                          required
                          style={{ flex: 1 }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="field">
                      <label>Registered Email</label>
                      <input
                        type="email"
                        value={forgotEmail}
                        onChange={e => setForgotEmail(e.target.value)}
                        placeholder=""
                        required
                        autoComplete="email"
                      />
                    </div>
                  )}

                  <button type="submit" className="btn-action" disabled={forgotLoading}>
                    {forgotLoading ? 'Sending OTP...' : 'Send OTP Code →'}
                  </button>

                  <div className="form-footer-links">
                    <button type="button" onClick={resetForgotFlow}>
                      ← Back to Sign In
                    </button>
                  </div>
                </form>
              </>
            )}

            {/* 3. FORGOT PASSWORD - STEP 2: VERIFY OTP */}
            {mode === 'forgot_verify' && (
              <>
                <div className="card-title">
                  <h2>Verify OTP</h2>
                  <p>
                    Enter verification code sent to <br />
                    <strong style={{ color: 'var(--text)' }}>{activeIdentifier}</strong>
                  </p>
                </div>

                {forgotMsg && <div className="info-box">✓ {forgotMsg}</div>}
                {forgotError && <div className="error-box">⚠️ {forgotError}</div>}

                <form onSubmit={handleVerifyOtp}>
                  <div className="field">
                    <label>6-Digit OTP Code</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      className="otp-input"
                      value={otp}
                      onChange={e => setOtp(e.target.value)}
                      placeholder=""
                      required
                      autoComplete="one-time-code"
                    />
                  </div>

                  <button type="submit" className="btn-action" disabled={forgotLoading}>
                    {forgotLoading ? 'Verifying...' : 'Verify OTP →'}
                  </button>

                  <div className="form-footer-links">
                    <button
                      type="button"
                      disabled={forgotLoading}
                      onClick={() => handleSendOtp()}
                      style={{ fontSize: '0.85rem' }}
                    >
                      Didn't receive code? Resend OTP
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setForgotError('');
                        setMode('forgot_request');
                      }}
                      style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}
                    >
                      Change phone number or email
                    </button>
                    <button type="button" onClick={resetForgotFlow}>
                      ← Back to Sign In
                    </button>
                  </div>
                </form>
              </>
            )}

            {/* 4. FORGOT PASSWORD - STEP 3: RESET PASSWORD */}
            {mode === 'forgot_reset' && (
              <>
                <div className="card-title">
                  <h2>Create New Password</h2>
                  <p>Enter a secure new password for your account</p>
                </div>

                {forgotMsg && <div className="info-box">✓ {forgotMsg}</div>}
                {forgotError && <div className="error-box">⚠️ {forgotError}</div>}

                <form onSubmit={handleResetPassword}>
                  <div className="field">
                    <label>New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      placeholder=""
                      required
                      minLength={6}
                      autoComplete="new-password"
                    />
                  </div>

                  <div className="field">
                    <label>Confirm New Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder=""
                      required
                      minLength={6}
                      autoComplete="new-password"
                    />
                  </div>

                  <button type="submit" className="btn-action" disabled={forgotLoading}>
                    {forgotLoading ? 'Updating Password...' : 'Reset Password →'}
                  </button>

                  <div className="form-footer-links">
                    <button type="button" onClick={resetForgotFlow}>
                      ← Back to Sign In
                    </button>
                  </div>
                </form>
              </>
            )}

            {/* 5. FORGOT PASSWORD - STEP 4: SUCCESS */}
            {mode === 'forgot_success' && (
              <div className="success-box">
                <span className="success-icon">🎉</span>
                <div className="card-title">
                  <h2>Password Reset Complete!</h2>
                  <p>Your password has been successfully updated. You can now log in with your new credentials.</p>
                </div>

                <button
                  type="button"
                  className="btn-action"
                  onClick={resetForgotFlow}
                >
                  Sign In With New Password →
                </button>
              </div>
            )}
          </div>
        </div>

        {/* SEO Footer Keywords */}
        <div className="seo-footer">
          <h2>Chauffeur &amp; Driver Portal Ireland</h2>
          <div className="seo-tags">
            {['Driver login Ireland', 'Chauffeur portal', 'Private transfer driver login', 'Manage bookings driver',
              'Driver dashboard Ireland', 'Private hire portal', 'Executive driver login', 'Dublin chauffeur login',
              'Airport transfer driver access', 'Driver partner login', 'Chauffeur schedule manager'].map(tag => (
              <span className="seo-tag" key={tag}>{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
