'use client';

import { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/lib/api';
import { BookingService } from '@/app/booking/BookingService';

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
  { code: '+420', flag: '🇨🇿', country: 'Czech Republic' },
  { code: '+36',  flag: '🇭🇺', country: 'Hungary' },
  { code: '+40',  flag: '🇷🇴', country: 'Romania' },
  { code: '+30',  flag: '🇬🇷', country: 'Greece' },
  { code: '+90',  flag: '🇹🇷', country: 'Turkey' },
  { code: '+7',   flag: '🇷🇺', country: 'Russia' },
  { code: '+380', flag: '🇺🇦', country: 'Ukraine' },
  { code: '+86',  flag: '🇨🇳', country: 'China' },
  { code: '+81',  flag: '🇯🇵', country: 'Japan' },
  { code: '+82',  flag: '🇰🇷', country: 'South Korea' },
  { code: '+65',  flag: '🇸🇬', country: 'Singapore' },
  { code: '+60',  flag: '🇲🇾', country: 'Malaysia' },
  { code: '+66',  flag: '🇹🇭', country: 'Thailand' },
  { code: '+84',  flag: '🇻🇳', country: 'Vietnam' },
  { code: '+62',  flag: '🇮🇩', country: 'Indonesia' },
  { code: '+63',  flag: '🇵🇭', country: 'Philippines' },
  { code: '+92',  flag: '🇵🇰', country: 'Pakistan' },
  { code: '+880', flag: '🇧🇩', country: 'Bangladesh' },
  { code: '+94',  flag: '🇱🇰', country: 'Sri Lanka' },
  { code: '+977', flag: '🇳🇵', country: 'Nepal' },
  { code: '+971', flag: '🇦🇪', country: 'UAE' },
  { code: '+966', flag: '🇸🇦', country: 'Saudi Arabia' },
  { code: '+974', flag: '🇶🇦', country: 'Qatar' },
  { code: '+965', flag: '🇰🇼', country: 'Kuwait' },
  { code: '+973', flag: '🇧🇭', country: 'Bahrain' },
  { code: '+968', flag: '🇴🇲', country: 'Oman' },
  { code: '+972', flag: '🇮🇱', country: 'Israel' },
  { code: '+20',  flag: '🇪🇬', country: 'Egypt' },
  { code: '+27',  flag: '🇿🇦', country: 'South Africa' },
  { code: '+234', flag: '🇳🇬', country: 'Nigeria' },
  { code: '+254', flag: '🇰🇪', country: 'Kenya' },
  { code: '+233', flag: '🇬🇭', country: 'Ghana' },
  { code: '+55',  flag: '🇧🇷', country: 'Brazil' },
  { code: '+54',  flag: '🇦🇷', country: 'Argentina' },
  { code: '+57',  flag: '🇨🇴', country: 'Colombia' },
  { code: '+52',  flag: '🇲🇽', country: 'Mexico' },
  { code: '+56',  flag: '🇨🇱', country: 'Chile' },
  { code: '+51',  flag: '🇵🇪', country: 'Peru' },
  { code: '+64',  flag: '🇳🇿', country: 'New Zealand' },
];

interface FleetVehicle {
  id: number;
  heading: string;
  passengers?: number | null;
  bags?: number | null;
  price?: number | null;
}

export default function DriverRegisterPage() {
  const [form, setForm] = useState({
    name: '', address: '', carType: '', phone: '', email: '', password: '', amount: '',
  });
  const [availableCars, setAvailableCars] = useState<FleetVehicle[]>([]);
  const [loadingFleet, setLoadingFleet] = useState(true);
  const [loading, setLoading] = useState(false);
  const [countryCode, setCountryCode] = useState('+353');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Fetch available fleet vehicles using the exact same BookingService API from the booking page
    setLoadingFleet(true);

    const defaultBookingFleet: FleetVehicle[] = [
      { id: 23, heading: 'Mercedes-Benz E-Class', passengers: 4, price: 2.5 },
      { id: 3, heading: 'Mercedes-Benz V-Class', passengers: 6, price: 2.5 },
      { id: 6, heading: 'Mercedes-Benz Sprinter', passengers: 14, price: 2.5 }
    ];

    BookingService.fetchFleet()
      .then((data: FleetVehicle[]) => {
        if (Array.isArray(data) && data.length > 0) {
          setAvailableCars(data);
          try {
            sessionStorage.setItem('fleetCache', JSON.stringify({ data, timestamp: Date.now() }));
          } catch (_) {}
        } else {
          // If backend returns empty list, show standard booking fleet vehicles
          setAvailableCars(defaultBookingFleet);
        }
      })
      .catch((err) => {
        console.error('Failed to load fleet vehicles via BookingService.fetchFleet:', err);
        setAvailableCars(defaultBookingFleet);
      })
      .finally(() => {
        setLoadingFleet(false);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => {
      const updated = { ...prev, [name]: value };
      if (name === 'carType') {
        const found = availableCars.find(c => c.heading === value);
        if (found && found.price && !prev.amount) {
          updated.amount = String(found.price);
        }
      }
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const fullPhone = `${countryCode}${form.phone.trim()}`;
      const res = await fetch(`${API_BASE_URL}/api/driver/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          phone: fullPhone,
          amount: parseFloat(form.amount) || 0
        }),
      });
      if (!res.ok) throw new Error((await res.text()) || 'Registration failed');
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const perks = [
    { icon: '💶', title: 'Earn More', desc: 'Set your own rate per km and keep more of what you earn.' },
    { icon: '🗓️', title: 'Flexible Schedule', desc: 'Work when you want — full-time or part-time, your choice.' },
    { icon: '📍', title: 'All of Ireland', desc: 'Trips across Dublin, Cork, Galway, Limerick and beyond.' },
    { icon: '📱', title: 'Easy Dashboard', desc: 'Manage all your going and return trips from one place.' },
    { icon: '✈️', title: 'Airport Runs', desc: 'High-demand airport transfers with guaranteed bookings.' },
    { icon: '🛡️', title: 'Safe & Insured', desc: 'Fully insured platform with customer support 24/7.' },
  ];

  return (
    <>
      <style>{`
        .driver-page {
          min-height: 100vh;
          padding-top: 90px; /* offset for fixed header */
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
          align-items: start;
        }
        @media (max-width: 900px) {
          .driver-inner { grid-template-columns: 1fr; gap: 2rem; }
        }

        /* ── LEFT: SEO / marketing ── */
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
          margin: 0 0 2rem 0;
          font-weight: 300;
        }
        .driver-stats {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 1rem; margin-bottom: 2.5rem;
        }
        .stat-box {
          background: var(--card-bg);
          border: 1px solid var(--border);
          box-shadow: var(--card-shadow);
          border-radius: 14px; padding: 1.25rem 1rem; text-align: center;
        }
        .stat-num {
          font-family: var(--font-playfair), serif;
          font-size: 1.8rem; font-weight: 500; color: var(--primary);
          display: block; margin-bottom: 4px;
        }
        .stat-lbl { font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; font-weight: 500; }
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

        /* ── RIGHT: Form card ── */
        .driver-card {
          background: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: 24px;
          padding: 2.5rem;
          box-shadow: 0 10px 40px rgba(0,0,0,0.04);
          position: sticky; top: 2rem;
        }
        .card-logo { display: flex; justify-content: center; margin-bottom: 1.5rem; }
        .card-logo img { height: 52px; object-fit: contain; }
        .card-title { text-align: center; margin-bottom: 2rem; }
        .card-title h2 { font-family: var(--font-playfair), serif; font-size: 1.8rem; font-weight: 500; margin: 0 0 4px; color: var(--text); }
        .card-title p { font-size: 0.85rem; color: var(--text-muted); margin: 0; font-weight: 300; }

        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; margin-bottom: 1.25rem; }
        .form-full { grid-column: 1 / -1; }
        .field { display: flex; flex-direction: column; gap: 8px; }
        .field label {
          font-size: 0.72rem; font-weight: 600; color: var(--text-muted);
          text-transform: uppercase; letter-spacing: 1.5px;
        }
        .field input {
          background: #FFFFFF;
          border: 1px solid var(--border-input);
          color: var(--text); padding: 0.85rem 1rem;
          border-radius: 6px; font-size: 0.95rem; font-family: var(--font-outfit), sans-serif;
          transition: all 0.3s ease; outline: none; width: 100%; box-sizing: border-box;
        }
        .field input::placeholder { color: var(--text-muted); opacity: 0.7; }
        .field input:focus { border-color: var(--primary); box-shadow: inset 0 2px 4px rgba(0,0,0,0.05), 0 0 0 1px var(--primary); }

        .error-box {
          background: #fff1f2; border: 1px solid #fecdd3;
          color: #e11d48; padding: 0.8rem 1rem; border-radius: 6px;
          font-size: 0.85rem; margin-bottom: 1.25rem; font-family: var(--font-outfit), sans-serif;
        }
        .btn-register {
          width: 100%; padding: 1rem;
          background: var(--primary);
          color: #FFFFFF; font-weight: 600; font-size: 0.9rem;
          border: 1px solid transparent; border-radius: 4px; cursor: pointer;
          letter-spacing: 2.5px; text-transform: uppercase; margin-top: 0.5rem;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          font-family: var(--font-outfit), sans-serif;
        }
        .btn-register:hover:not(:disabled) {
          background: var(--primary-hover);
        }
        .btn-register:disabled { opacity: 0.6; cursor: not-allowed; }

        .login-link {
          text-align: center; margin-top: 1.5rem;
          font-size: 0.9rem; color: var(--text-muted);
        }
        .login-link a { color: var(--primary); font-weight: 600; text-decoration: none; }
        .login-link a:hover { text-decoration: underline; color: var(--primary-hover); }

        /* Success */
        .success-wrap { text-align: center; padding: 1.5rem 0; }
        .success-wrap .emoji { font-size: 3.5rem; margin-bottom: 1rem; display: block; }
        .success-wrap h2 { font-family: var(--font-playfair), serif; font-size: 1.8rem; font-weight: 500; color: var(--primary); margin: 0 0 0.5rem; }
        .success-wrap p { color: var(--text-muted); margin: 0 0 2rem; font-size: 0.95rem; }
        .btn-go {
          display: inline-block;
          background: var(--primary);
          color: #FFFFFF; padding: 1rem 3rem; border-radius: 4px;
          text-decoration: none; font-weight: 600; font-size: 0.9rem;
          text-transform: uppercase; letter-spacing: 2.5px;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .btn-go:hover { background: var(--primary-hover); }

        /* SEO keywords section at bottom */
        .seo-footer {
          max-width: 1200px; margin: 2rem auto 0; padding: 0 1.5rem 3rem;
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
            <div className="driver-badge">🚗 Driver Portal</div>
            <h1>Drive with Private<br />Transfers Ireland</h1>
            <p>
              Join Ireland's fastest-growing private chauffeur network. Register today and start
              accepting premium bookings — airport transfers, business travel, and special occasions
              across all of Ireland.
            </p>

            <div className="driver-stats">
              <div className="stat-box">
                <span className="stat-num">500+</span>
                <span className="stat-lbl">Bookings / Month</span>
              </div>
              <div className="stat-box">
                <span className="stat-num">€2.5</span>
                <span className="stat-lbl">Avg Rate / km</span>
              </div>
              <div className="stat-box">
                <span className="stat-num">32+</span>
                <span className="stat-lbl">Cities Covered</span>
              </div>
            </div>

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

          {/* ── RIGHT: Registration Form ── */}
          <div className="driver-card">
            <div className="card-logo">
              <img src="/logo.png" alt="Private Transfers Ireland" />
            </div>

            {success ? (
              <div className="success-wrap">
                <span className="emoji">🎉</span>
                <h2>Registration Successful!</h2>
                <p>Your driver account has been created. Login to access your dashboard and start accepting trips.</p>
                <a href="/driver/login" className="btn-go">Go to Driver Login →</a>
              </div>
            ) : (
              <>
                <div className="card-title">
                  <h2>Create Driver Account</h2>
                  <p>Fill in your details to get started</p>
                </div>

                {error && <div className="error-box">⚠️ {error}</div>}

                <form onSubmit={handleSubmit}>
                  <div className="form-grid">
                    <div className="field form-full">
                      <label>Full Name</label>
                      <input name="name" type="text" value={form.name} onChange={handleChange} placeholder="" required />
                    </div>
                    <div className="field form-full">
                      <label>Address</label>
                      <input name="address" type="text" value={form.address} onChange={handleChange} placeholder="" required />
                    </div>
                    <div className="field form-full">
                      <label>Car Type</label>
                      <select
                        name="carType"
                        value={form.carType}
                        onChange={handleChange}
                        required
                        style={{
                          background: '#FFFFFF',
                          border: '1px solid var(--border-input)',
                          color: 'var(--text)',
                          padding: '0.85rem 1rem',
                          borderRadius: '6px',
                          fontSize: '0.95rem',
                          fontFamily: 'var(--font-outfit), sans-serif',
                          outline: 'none',
                          width: '100%',
                          boxSizing: 'border-box'
                        }}
                      >
                        <option value="">{loadingFleet ? 'Loading vehicles...' : 'Select Vehicle Type'}</option>
                        {availableCars.map(c => (
                          <option key={c.id || c.heading} value={c.heading}>
                            {c.heading}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="field form-full">
                      <label>Mobile Number</label>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <select
                          value={countryCode}
                          onChange={e => setCountryCode(e.target.value)}
                          style={{
                            padding: '0.85rem 0.5rem',
                            borderRadius: '6px',
                            border: '1px solid var(--border-input)',
                            background: '#fff',
                            width: '110px',
                            fontSize: '0.9rem'
                          }}
                        >
                          {COUNTRY_CODES.map(c => (
                            <option key={c.country + c.code} value={c.code}>{c.flag} {c.code}</option>
                          ))}
                        </select>
                        <input name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="" required style={{ flex: 1 }} />
                      </div>
                    </div>
                    <div className="field">
                      <label>Email</label>
                      <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="" required autoComplete="off" />
                    </div>
                    <div className="field">
                      <label>Rate (€/km)</label>
                      <input name="amount" type="number" step="0.1" min="0" value={form.amount} onChange={handleChange} placeholder="" required />
                    </div>
                    <div className="field form-full">
                      <label>Password</label>
                      <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="" required minLength={6} autoComplete="new-password" />
                    </div>
                  </div>

                  <button type="submit" className="btn-register" disabled={loading}>
                    {loading ? 'Registering...' : '🚗 Register as Driver'}
                  </button>

                  <div className="login-link">
                    Already registered?{' '}
                    <a href="/driver/login">Login here</a>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>

        {/* SEO Footer Keywords */}
        <div className="seo-footer">
          <h2>Driver Opportunities Across Ireland</h2>
          <div className="seo-tags">
            {['Driver jobs Ireland', 'Private hire driver Ireland', 'Chauffeur jobs Dublin', 'Airport transfer driver Ireland',
              'Become a chauffeur Ireland', 'Private transfer driver signup', 'Cork driver jobs', 'Galway chauffeur work',
              'Limerick driver employment', 'Shannon airport driver', 'Dublin airport chauffeur', 'Executive driver Ireland',
              'Self-employed driver Ireland', 'Taxi alternative Ireland', 'Private car hire driver'].map(tag => (
              <span className="seo-tag" key={tag}>{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
