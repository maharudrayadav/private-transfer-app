'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../../admintransfer/admin.module.css';
import {
  Clock, Car,
  RotateCcw, Calendar as CalendarIcon, Filter,
  ArrowRight, Users, Luggage, Mail
} from 'lucide-react';

interface Booking {
  id: number;
  customerName: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone: string;
  flightNumber?: string;
  pickupLocation: string;
  dropoffLocation: string;
  pickupTime?: string;
  bookingDate?: string;
  status: string;
  vehicleType: string;
  passengers?: number;
  luggage?: number;
  amount: number;
  driverName?: string;
  bookingCode?: string;
  notes?: string;
  returnDate?: string;
  returnTime?: string;
  returnPickupLocation?: string;
  returnDropoffLocation?: string;
}

export default function DriverDashboard() {
  const router = useRouter();
  const [driverName, setDriverName] = useState('');
  const [activeTab, setActiveTab] = useState<'going' | 'return'>('going');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Filter state (local — only applied on "Apply" click)
  const [statusInput, setStatusInput] = useState('');
  const [startDateInput, setStartDateInput] = useState('');
  const [endDateInput, setEndDateInput] = useState('');

  // Applied filter state
  const [appliedStatus, setAppliedStatus] = useState('');
  const [appliedStart, setAppliedStart] = useState('');
  const [appliedEnd, setAppliedEnd] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('driver_token');
    const name = localStorage.getItem('driver_name');
    if (!token || !name) {
      router.push('/driver/login');
      return;
    }
    setDriverName(name);
  }, [router]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchBookings = useCallback(async () => {
    if (!driverName) return;
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (activeTab === 'going') {
        params.set('driverName', driverName);
      } else {
        params.set('returnDriverName', driverName);
      }
      if (appliedStatus) params.set('status', appliedStatus);
      if (appliedStart) params.set('startDate', `${appliedStart}T00:00:00`);
      if (appliedEnd) params.set('endDate', `${appliedEnd}T23:59:59`);

      const url = `https://api.privatetransfers.ie/privateapi/api/bookings?${params.toString()}`;
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('driver_token')}`,
        },
      });
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();

      if (Array.isArray(data)) setBookings(data);
      else if (Array.isArray(data.bookings)) setBookings(data.bookings);
      else if (Array.isArray(data.content)) setBookings(data.content);
      else setBookings([]);
    } catch (err) {
      console.error(err);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, [driverName, activeTab, appliedStatus, appliedStart, appliedEnd]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleApplyFilters = () => {
    setAppliedStatus(statusInput);
    setAppliedStart(startDateInput);
    setAppliedEnd(endDateInput);
  };

  const handleResetFilters = () => {
    setStatusInput('');
    setStartDateInput('');
    setEndDateInput('');
    setAppliedStatus('');
    setAppliedStart('');
    setAppliedEnd('');
  };

  const handleLogout = () => {
    localStorage.removeItem('driver_token');
    localStorage.removeItem('driver_name');
    localStorage.removeItem('driver_email');
    router.push('/driver/login');
  };

  const getStatusClass = (status: string) => {
    const s = (status || '').toUpperCase().replace(/[\s_]/g, '');
    if (s === 'CONFIRMED' || s === 'APPROVED') return styles.statusCONFIRMED;
    if (s === 'PENDINGADMIN') return styles.statusPENDINGADMIN;
    if (s === 'PENDINGPAYMENT') return styles.statusPENDINGPAYMENT;
    if (s === 'CANCELLED') return styles.statusCANCELLED;
    return styles.statusPENDING;
  };

  if (loading && bookings.length === 0 && !driverName) {
    return (
      <div className={styles.adminPage} style={{ alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', fontFamily: 'var(--font-outfit), sans-serif' }}>
        <div className={styles.modalLoader}>
          <div className={styles.spinner} style={{ borderTopColor: 'var(--primary)' }}></div>
          <p style={{ color: 'var(--text)' }}>Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.adminPage} data-theme="driver-light">
      <style>{`
        [data-theme="driver-light"] {
          background-color: var(--bg) !important;
          font-family: var(--font-outfit), sans-serif !important;
          color: var(--text) !important;
        }
        [data-theme="driver-light"] h1, 
        [data-theme="driver-light"] h2, 
        [data-theme="driver-light"] h3 {
          font-family: var(--font-playfair), serif !important;
          color: var(--text) !important;
        }
        [data-theme="driver-light"] header {
          background: #FFFFFF !important;
          border-bottom: 1px solid var(--border) !important;
          box-shadow: 0 4px 20px rgba(0,0,0,0.02) !important;
        }
        [data-theme="driver-light"] .${styles.adminBadge} {
          background: var(--primary-light) !important;
          color: var(--primary) !important;
          border: 1px solid var(--border-dark) !important;
        }
        [data-theme="driver-light"] .${styles.headerIcon} {
          background: var(--primary-light) !important;
        }
        [data-theme="driver-light"] .${styles.headerIcon} svg {
          color: var(--primary) !important;
        }
        [data-theme="driver-light"] .${styles.applyBtn} {
          background: var(--primary) !important;
          color: #FFFFFF !important;
          border-radius: 4px !important;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          font-weight: 600;
          font-family: var(--font-outfit), sans-serif !important;
        }
        [data-theme="driver-light"] .${styles.applyBtn}:hover {
          background: var(--primary-hover) !important;
        }
        [data-theme="driver-light"] .${styles.filters} {
          background: #FFFFFF !important;
          border: 1px solid var(--border) !important;
          box-shadow: var(--card-shadow) !important;
          border-radius: 12px !important;
        }
        [data-theme="driver-light"] .${styles.tableWrapper} {
          background: #FFFFFF !important;
          border: 1px solid var(--border) !important;
          box-shadow: var(--card-shadow) !important;
          border-radius: 12px !important;
        }
        [data-theme="driver-light"] .${styles.table} th {
          background: var(--bg) !important;
          border-bottom: 1px solid var(--border) !important;
          color: var(--text-muted) !important;
          font-weight: 600 !important;
        }
        [data-theme="driver-light"] .${styles.table} td {
          border-bottom: 1px solid var(--border) !important;
          color: var(--text) !important;
        }
        [data-theme="driver-light"] .${styles.subText} {
          color: var(--text-muted) !important;
        }
        [data-theme="driver-light"] .${styles.logoutBtn} {
          background: #fee2e2 !important;
          color: #ef4444 !important;
          border-radius: 4px !important;
          font-weight: 600;
        }
        [data-theme="driver-light"] .${styles.logoutBtn}:hover {
          background: #fecaca !important;
        }
        [data-theme="driver-light"] button {
          font-family: var(--font-outfit), sans-serif;
        }
        [data-theme="driver-light"] .${styles.liveClock} {
          background: #f1f5f9 !important;
          border: 1px solid #e2e8f0 !important;
          box-shadow: none !important;
        }
        [data-theme="driver-light"] .${styles.timeStr} {
          color: var(--primary) !important;
        }
        [data-theme="driver-light"] .${styles.dateStr} {
          color: #475569 !important;
          border-left-color: #e2e8f0 !important;
        }
        [data-theme="driver-light"] .${styles.clockIconSvg} {
          color: var(--primary) !important;
        }
        [data-theme="driver-light"] .${styles.adminInfo} span:not(.${styles.adminBadge}) {
          color: #1e293b !important;
        }
      `}</style>

      {/* Top Bar */}
      <header className={styles.topBar}>
        <div className={styles.adminInfo}>
          <Link href="/"><img src="/logo.png" alt="Private Transfers" className={styles.adminDashboardLogo} style={{ cursor: 'pointer' }} /></Link>
          <span className={styles.adminBadge}>Driver</span>
          <span>Welcome, {driverName}</span>
        </div>
        <div className={styles.liveClock}>
          <Clock size={16} className={styles.clockIconSvg} style={{ marginRight: '6px', color: 'var(--primary)' }} />
          <span className={styles.timeStr}>
            {currentTime.toLocaleTimeString('en-IE', { timeZone: 'Europe/Dublin', hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
          <span className={styles.dateStr}>
            {currentTime.toLocaleDateString('en-IE', { timeZone: 'Europe/Dublin', weekday: 'short', day: 'numeric', month: 'short' })}
          </span>
        </div>
        <button onClick={handleLogout} className={styles.logoutBtn}>Logout</button>
      </header>

      <main className={styles.content}>
        <div className={styles.dashboardHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className={styles.headerIcon}><Car size={28} color="var(--primary)" /></div>
            <h1>My Bookings</h1>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <button
            onClick={() => setActiveTab('going')}
            style={{
              padding: '0.75rem 2rem',
              borderRadius: '12px',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.95rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
              background: activeTab === 'going'
                ? 'linear-gradient(135deg, #1a6b5a, #2a8a70)'
                : '#f1f5f9',
              color: activeTab === 'going' ? '#fff' : '#475569',
              boxShadow: activeTab === 'going' ? '0 4px 14px rgba(26,107,90,0.3)' : 'none',
            }}
          >
            <ArrowRight size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
            Going Trips
          </button>
          <button
            onClick={() => setActiveTab('return')}
            style={{
              padding: '0.75rem 2rem',
              borderRadius: '12px',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.95rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
              background: activeTab === 'return'
                ? 'linear-gradient(135deg, #1a3a8f, #2a5298)'
                : '#f1f5f9',
              color: activeTab === 'return' ? '#fff' : '#475569',
              boxShadow: activeTab === 'return' ? '0 4px 14px rgba(26,50,143,0.3)' : 'none',
            }}
          >
            <RotateCcw size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
            Return Trips
          </button>
        </div>

        {/* Filters — only call API on Apply */}
        <section className={styles.filters}>
          <div className={styles.filterGroup}>
            <label><Filter size={14} className={styles.filterIcon} /> Status</label>
            <div className={styles.filterInputWrap}>
              <select value={statusInput} onChange={e => setStatusInput(e.target.value)}>
                <option value="">All Statuses</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="PENDING_ADMIN">Pending Admin</option>
                <option value="PENDING_PAYMENT">Pending Payment</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>
          <div className={styles.filterGroup}>
            <label><CalendarIcon size={14} className={styles.filterIcon} /> Start Date</label>
            <div className={styles.filterInputWrap}>
              <input type="date" value={startDateInput} onChange={e => setStartDateInput(e.target.value)} />
            </div>
          </div>
          <div className={styles.filterGroup}>
            <label><CalendarIcon size={14} className={styles.filterIcon} /> End Date</label>
            <div className={styles.filterInputWrap}>
              <input type="date" value={endDateInput} onChange={e => setEndDateInput(e.target.value)} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', paddingBottom: '0.2rem' }}>
            <button className={styles.resetBtn} onClick={handleResetFilters} title="Reset Filters">
              <RotateCcw size={18} />
            </button>
            <button
              className={styles.applyBtn}
              onClick={handleApplyFilters}
              style={{ height: '42px', padding: '0 1.5rem' }}
            >
              Apply
            </button>
          </div>
        </section>

        {/* Loading */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
            <div className={styles.modalLoader}>
              <div className={styles.spinner}></div>
              <p>Loading bookings...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Table */}
            <section className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Pickup / Dropoff</th>
                    <th>Date &amp; Time</th>
                    <th>Vehicle</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.length > 0 ? bookings.map(b => (
                    <tr key={b.id}>
                      <td data-label="Customer">
                        <div className={styles.customerCell}>
                          <div>
                            <strong>{b.customerName || 'Unknown'}</strong>
                            <div className={styles.subText}>{b.phone}</div>
                            {b.email && (
                              <div className={styles.subText} style={{ color: '#0066cc', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Mail size={12} /> {b.email}
                              </div>
                            )}
                            {b.flightNumber && (
                              <div className={styles.subText}>✈️ {b.flightNumber}</div>
                            )}
                            {b.bookingCode && <span className={styles.codeBadge}>#{b.bookingCode}</span>}
                          </div>
                        </div>
                      </td>
                      <td data-label="Route">
                        <div className={styles.routeCell}>
                          <div className={styles.routeRow}>
                            <span className={styles.dotStart}></span>
                            <p title={b.pickupLocation}>{b.pickupLocation}</p>
                          </div>
                          <div className={styles.routeRow}>
                            <span className={styles.dotEnd}></span>
                            <p title={b.dropoffLocation}>{b.dropoffLocation}</p>
                          </div>
                          {activeTab === 'return' && b.returnPickupLocation && (
                            <div style={{ marginTop: '0.4rem', borderTop: '1px dashed #e2e8f0', paddingTop: '0.4rem' }}>
                              <div className={styles.routeRow}>
                                <span className={styles.dotStart}></span>
                                <p title={b.returnPickupLocation}>{b.returnPickupLocation}</p>
                              </div>
                              <div className={styles.routeRow}>
                                <span className={styles.dotEnd}></span>
                                <p title={b.returnDropoffLocation}>{b.returnDropoffLocation}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                      <td data-label="Date/Time">
                        <div className={styles.dateCell}>
                          <div className={styles.mainDate}>
                            {b.pickupTime
                              ? new Date(b.pickupTime).toLocaleDateString('en-IE', { timeZone: 'Europe/Dublin' })
                              : (b.bookingDate ? new Date(b.bookingDate).toLocaleDateString('en-IE', { timeZone: 'Europe/Dublin' }) : '—')}
                          </div>
                          <div className={styles.subText}>
                            {b.pickupTime
                              ? new Date(b.pickupTime).toLocaleTimeString('en-IE', { timeZone: 'Europe/Dublin', hour: '2-digit', minute: '2-digit' })
                              : (b.bookingDate ? new Date(b.bookingDate).toLocaleTimeString('en-IE', { timeZone: 'Europe/Dublin', hour: '2-digit', minute: '2-digit' }) : '—')}
                          </div>
                          {activeTab === 'return' && b.returnDate && (
                            <div className={styles.returnInfo}>
                              <span className={styles.returnBadge}>
                                <RotateCcw size={10} style={{ display: 'inline', marginRight: '4px' }} /> Return
                              </span>
                              <span className={styles.returnTime}>{b.returnDate} {b.returnTime || ''}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td data-label="Vehicle">
                        <div className={styles.vehicleCell}>
                          <div className={styles.vehicleInfo}>
                            <Car size={15} className={styles.vehicleIcon} />
                            <span className={styles.vehicleName}>{b.vehicleType || 'Standard'}</span>
                          </div>
                          <div className={styles.vSpecsMini}>
                            <span className={styles.specMini}><Users size={12} /> {b.passengers || 0}</span>
                            <span className={styles.specMini}><Luggage size={12} /> {b.luggage || 0}</span>
                          </div>
                        </div>
                      </td>
                      <td data-label="Amount">
                        <div className={styles.amountCell}>€{(b.amount || 0).toFixed(2)}</div>
                      </td>
                      <td data-label="Status">
                        <span className={`${styles.statusBadge} ${getStatusClass(b.status)}`}>
                          {(b.status || 'PENDING').replace(/_/g, ' ')}
                        </span>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                        No {activeTab === 'going' ? 'going' : 'return'} trips found for <strong>{driverName}</strong>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
