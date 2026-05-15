'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../admin.module.css';

interface Booking {
  id: number;
  customerName: string;
  email?: string;
  phone: string;
  pickupLocation: string;
  dropoffLocation: string;
  pickupTime?: string;
  bookingDate?: string;
  status: string;
  vehicleType: string;
  amount: number;
  driverName?: string;
  bookingCode?: string;
  notes?: string;
}

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Modal State
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null);
  const [driverNameInput, setDriverNameInput] = useState('');
  const [approveLoading, setApproveLoading] = useState(false);

  // Filters
  const [statusFilter, setStatusFilter] = useState('');
  const [driverFilter, setDriverFilter] = useState('');
  const [customerFilter, setCustomerFilter] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [sortBy, setSortBy] = useState('bookingDate');
  const [sortDirection, setSortDirection] = useState('desc');

  const router = useRouter();

  // Auth check
  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admintransfer');
    }
  }, [router]);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
        sortBy: sortBy,
        sortDirection: sortDirection,
      });

      if (statusFilter) params.append('status', statusFilter);
      if (driverFilter) params.append('driverName', driverFilter);
      if (customerFilter) params.append('customerName', customerFilter);
      
      if (filterDate) {
        params.append('startDate', `${filterDate}T00:00:00`);
        params.append('endDate', `${filterDate}T23:59:59`);
      }

      const res = await fetch(`/api/bookings?${params.toString()}`);
      console.log('Fetching bookings from:', `/api/bookings?${params.toString()}`);
      
      if (!res.ok) {
        console.error('API Error:', res.status, res.statusText);
        throw new Error(`Failed to fetch bookings: ${res.status}`);
      }
      
      const data = await res.json();
      console.log('Bookings Data received:', data);
      
      // Handle different response formats
      if (data && typeof data === 'object') {
        if (Array.isArray(data.bookings)) {
          setBookings(data.bookings);
          setTotalElements(data.totalCount || data.bookings.length);
          setTotalPages(data.totalPages || Math.ceil((data.totalCount || data.bookings.length) / size) || 1);
        } else if (Array.isArray(data.content)) {
          setBookings(data.content);
          setTotalElements(data.totalElements || data.content.length);
          setTotalPages(data.totalPages || 1);
        } else if (Array.isArray(data)) {
          setBookings(data);
          setTotalElements(data.length);
          setTotalPages(1);
        } else {
          console.warn('Unexpected data format:', data);
          setBookings([]);
        }
      } else {
        setBookings([]);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, [page, size, statusFilter, driverFilter, customerFilter, filterDate, sortBy, sortDirection]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    router.push('/admintransfer');
  };

  const openApproveModal = (id: number) => {
    setSelectedBookingId(id);
    setDriverNameInput('');
    setShowApproveModal(true);
  };

  const handleConfirmApproval = async () => {
    if (!selectedBookingId || !driverNameInput) return;
    setApproveLoading(true);
    try {
      console.log('Confirming booking:', { bookingId: selectedBookingId, driverName: driverNameInput });
      const res = await fetch(`/api/admin/confirm-booking`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId: selectedBookingId,
          driverName: driverNameInput
        })
      });
      
      if (!res.ok) {
        const errorData = await res.text();
        console.error('Approval failed:', res.status, errorData);
        throw new Error(`Failed to confirm booking: ${res.status}`);
      }

      setShowApproveModal(false);
      fetchBookings(); // Refresh
    } catch (err) {
      console.error('Failed to approve:', err);
      alert(err instanceof Error ? err.message : 'Error approving booking. Please try again.');
    } finally {
      setApproveLoading(true); // Keep loading state until modal closes
      setApproveLoading(false);
    }
  };

  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (loading && bookings.length === 0) {
    return <div className={styles.loading}>Loading Dashboard...</div>;
  }

  return (
    <div className={styles.adminPage}>
      <header className={styles.topBar}>
        <div className={styles.adminInfo}>
          <span className={styles.adminBadge}>Admin</span>
          <span>Private Transfer Dashboard</span>
        </div>
        <div className={styles.liveClock}>
          <span className={styles.clockIcon}>⏰</span>
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
          <h1>Bookings</h1>
        </div>

        <section className={styles.filters}>
          <div className={styles.filterGroup}>
            <label><span className={styles.filterIcon}>📊</span> Status</label>
            <div className={styles.filterInputWrap}>
              <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}>
                <option value="">All Statuses</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="PENDING_ADMIN">Pending Admin</option>
                <option value="PENDING_PAYMENT">Pending Payment</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>
          <div className={styles.filterGroup}>
            <label><span className={styles.filterIcon}>👤</span> Driver</label>
            <div className={styles.filterInputWrap}>
              <input 
                type="text" 
                placeholder="Driver name..." 
                value={driverFilter} 
                onChange={(e) => { setDriverFilter(e.target.value); setPage(0); }} 
              />
            </div>
          </div>
          <div className={styles.filterGroup}>
            <label><span className={styles.filterIcon}>🤝</span> Customer</label>
            <div className={styles.filterInputWrap}>
              <input 
                type="text" 
                placeholder="Customer name..." 
                value={customerFilter} 
                onChange={(e) => { setCustomerFilter(e.target.value); setPage(0); }} 
              />
            </div>
          </div>
          
          <div className={styles.filterGroup}>
            <label><span className={styles.filterIcon}>📅</span> Date</label>
            <div className={styles.filterInputWrap}>
              <input 
                type="date" 
                value={filterDate} 
                onChange={(e) => { setFilterDate(e.target.value); setPage(0); }} 
              />
            </div>
          </div>

          <div className={styles.filterGroup}>
            <label><span className={styles.filterIcon}>🔃</span> Sort By</label>
            <div className={styles.filterInputWrap}>
              <select value={sortBy} onChange={(e) => { setSortBy(e.target.value); setPage(0); }}>
                <option value="bookingDate">Booking Date</option>
                <option value="amount">Amount</option>
                <option value="status">Status</option>
                <option value="pickupTime">Pickup Time</option>
                <option value="customerName">Customer</option>
              </select>
            </div>
          </div>

          <div className={styles.filterGroup}>
            <label><span className={styles.filterIcon}>↕️</span> Direction</label>
            <div className={styles.filterInputWrap}>
              <select value={sortDirection} onChange={(e) => { setSortDirection(e.target.value); setPage(0); }}>
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
          </div>

          <button 
            className={styles.resetBtn} 
            onClick={() => {
              setStatusFilter('');
              setDriverFilter('');
              setCustomerFilter('');
              setFilterDate('');
              setSortBy('bookingDate');
              setSortDirection('desc');
              setPage(0);
            }}
          >
            Reset
          </button>
        </section>

        <section className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Pickup / Dropoff</th>
                <th>Date & Time</th>
                <th>Vehicle</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length > 0 ? bookings.map((b) => (
                <tr key={b.id}>
                  <td>
                    <div className={styles.customerCell}>
                      <span className={styles.customerAvatar}>
                        {(b.customerName || 'U').charAt(0).toUpperCase()}
                      </span>
                      <div>
                        <strong>{b.customerName || 'Unknown Customer'}</strong>
                        <div className={styles.subText}>{b.phone}</div>
                        {(b.email || b.notes?.match(/Email:\s*([^\s\n]+)/)?.[1]) && (
                          <div className={styles.subText} style={{fontSize: '0.75rem', opacity: 0.8, color: 'var(--primary)'}}>
                            ✉️ {b.email || b.notes?.match(/Email:\s*([^\s\n]+)/)?.[1]}
                          </div>
                        )}
                        {b.bookingCode && <span className={styles.codeBadge}>#{b.bookingCode}</span>}
                        {b.notes && (
                          <div className={styles.notesPreview} title={b.notes}>
                            {b.notes.length > 30 ? b.notes.substring(0, 30) + '...' : b.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className={styles.routeCell}>
                      <div className={styles.routeRow}>
                        <span className={styles.dotStart}></span>
                        <p title={b.pickupLocation}>{b.pickupLocation}</p>
                      </div>
                      <div className={styles.routeRow}>
                        <span className={styles.dotEnd}></span>
                        <p title={b.dropoffLocation}>{b.dropoffLocation}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className={styles.dateCell}>
                      <div className={styles.mainDate}>
                        {b.pickupTime 
                          ? new Date(b.pickupTime).toLocaleDateString('en-IE', { timeZone: 'Europe/Dublin' }) 
                          : (b.bookingDate ? new Date(b.bookingDate).toLocaleDateString('en-IE', { timeZone: 'Europe/Dublin' }) : '—')}
                      </div>
                      <div className={styles.subText}>
                        {b.pickupTime 
                          ? new Date(b.pickupTime).toLocaleTimeString('en-IE', { timeZone: 'Europe/Dublin', hour: '2-digit', minute:'2-digit' }) 
                          : (b.bookingDate ? new Date(b.bookingDate).toLocaleTimeString('en-IE', { timeZone: 'Europe/Dublin', hour: '2-digit', minute:'2-digit' }) : '—')}
                      </div>

                      {b.notes?.includes('Return Date:') && (
                        <div className={styles.returnInfo}>
                          <span className={styles.returnBadge}>↩ Return</span>
                          <span className={styles.returnTime}>
                            {b.notes.match(/Return Date:\s*([\d-]+)/)?.[1]} {b.notes.match(/Return Time:\s*([\d:]+)/)?.[1]}
                          </span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className={styles.vehicleCell}>
                      {b.vehicleType || 'Standard'}
                      {b.driverName && <div className={styles.driverTag}>👤 {b.driverName}</div>}
                    </div>
                  </td>
                  <td className={styles.amountCell}>
                    €{b.amount?.toFixed(2)}
                  </td>
                  <td>
                    <span className={`${styles.statusBadge} ${styles['status' + (b.status?.toUpperCase() === 'CONFIRMED' || b.driverName ? 'APPROVED' : b.status?.toUpperCase().replace(/\s+/g, ''))] || ''}`}>
                      {b.status?.toUpperCase() === 'CONFIRMED' || b.driverName ? 'APPROVED' : b.status?.replace(/_/g, ' ') || 'PENDING'}
                    </span>
                  </td>
                  <td>
                    {!b.driverName && (b.status?.toUpperCase().includes('PENDING') || !b.status) && (
                      <button className={styles.approveBtn} onClick={() => openApproveModal(b.id)}>
                        Approve
                      </button>
                    )}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} style={{textAlign: 'center', padding: '3rem'}}>No bookings found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        <footer className={styles.pagination}>
          <div className={styles.pageInfo}>
            Showing {bookings.length} of {totalElements} results
          </div>
          <div className={styles.pageControls}>
            <button 
              className={styles.pageBtn} 
              disabled={page === 0} 
              onClick={() => setPage(p => p - 1)}
              title="Previous Page"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            <span className={styles.pageIndicator}>
              Page {page + 1} of {totalPages || 1}
            </span>
            <button 
              className={styles.pageBtn} 
              disabled={page >= totalPages - 1} 
              onClick={() => setPage(p => p + 1)}
              title="Next Page"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          </div>
          <div className={styles.sizeSelector}>
            <label>Rows per page:</label>
            <select value={size} onChange={(e) => { setSize(parseInt(e.target.value)); setPage(0); }}>
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
          </div>
        </footer>
      </main>

      {/* Approval Modal */}
      {showApproveModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Confirm Booking</h3>
            <p>Please assign a driver to confirm this booking (ID: {selectedBookingId})</p>
            
            <div className={styles.modalField}>
              <label>Driver Name</label>
              <input 
                type="text" 
                value={driverNameInput} 
                onChange={(e) => setDriverNameInput(e.target.value)}
                placeholder="e.g. Michael Smith"
                autoFocus
              />
            </div>

            <div className={styles.modalActions}>
              <button className={styles.cancelBtn} onClick={() => setShowApproveModal(false)}>Cancel</button>
              <button 
                className={styles.saveBtn} 
                onClick={handleConfirmApproval}
                disabled={approveLoading || !driverNameInput}
              >
                {approveLoading ? 'Saving...' : 'Save & Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
