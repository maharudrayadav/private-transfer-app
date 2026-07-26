'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../admin.module.css';
import { 
  Filter, X, Download, RotateCcw, 
  Calendar as CalendarIcon, User, 
  Tag, ArrowUpDown, ChevronDown,
  Search, Clock, LayoutDashboard, Pencil,
  MapPin, CreditCard, ArrowRight, CheckCircle2,
  FileText, Phone, Car, Bus, Mail, Users, Luggage
} from 'lucide-react';
import { DashboardService } from './DashboardService';

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
  driverNote?: string;
  returndriverName?: string;
  returnDriverName?: string;
  return_driver_name?: string;
  return_driver?: string;
  returndriver?: string;
  returnDriver?: string;
  returndrivername?: string;
  driverNameReturn?: string;
  driver_name_return?: string;
  driverReturn?: string;
  driver_return?: string;
  return_dr?: string;
  ret_driver?: string;
  returnDate?: string;
  returnTime?: string;
  returnPickupLocation?: string;
  returnDropoffLocation?: string;
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
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null);
  const [editingBooking, setEditingBooking] = useState<Partial<Booking>>({});
  const [driverNameInput, setDriverNameInput] = useState('');
  const [returnDriverNameInput, setReturnDriverNameInput] = useState('');
  const [approveLoading, setApproveLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [fetchingBooking, setFetchingBooking] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // Filters
  const [statusFilter, setStatusFilter] = useState('');
  const [driverFilter, setDriverFilter] = useState('');
  const [customerFilter, setCustomerFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [tripTypeFilter, setTripTypeFilter] = useState('');
  const [sortBy, setSortBy] = useState('bookingDate');
  const [sortDirection, setSortDirection] = useState('desc');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [returnDriversCache, setReturnDriversCache] = useState<Record<number, string>>({});

  const router = useRouter();

  // Helper to extract return driver name from any possible field or notes
  const getReturnDriver = (b: any) => {
    if (!b) return '';
    
    // Check local cache first (e.g. background fetched)
    if (returnDriversCache[b.id]) {
      return returnDriversCache[b.id];
    }
    
    // 1. Direct field checks (ordered by commonality)
    const directFields = [
      b.returnDriverName, 
      b.returndriverName, 
      b.return_driver_name, 
      b.returndrivername,
      b.return_driver,
      b.returndriver,
      b.returnDriver,
      b.driverNameReturn,
      b.driver_name_return,
      b.driverReturn,
      b.driver_return,
      b.return_dr,
      b.ret_driver
    ];
    for (const val of directFields) {
      if (val && typeof val === 'string' && val.trim().length > 0) return val.trim();
    }

    // 2. Scan all object keys for anything containing "return" and "driver"
    const keys = Object.keys(b);
    for (const key of keys) {
      const lowerKey = key.toLowerCase();
      if (lowerKey.includes('return') && lowerKey.includes('driver')) {
        const val = b[key];
        if (val && typeof val === 'string' && val.trim().length > 0) return val.trim();
      }
    }

    // 3. Scan notes for patterns
    if (b.notes) {
      const patterns = [
        /Return Driver:\s*([^,\n]+)/i,
        /RET Driver:\s*([^,\n]+)/i,
        /Return Leg Driver:\s*([^,\n]+)/i,
        /Return:\s*([^,\n]+)/i
      ];
      for (const pattern of patterns) {
        const match = b.notes.match(pattern);
        if (match && match[1]) return match[1].trim();
      }
    }

    return '';
  };

  const getFlightNumber = (b: any) => {
    if (!b) return '';
    if (b.flightNumber) return b.flightNumber;
    if (b.notes) {
      const match = b.notes.match(/Flight Number:\s*([^\n,]+)/i);
      if (match && match[1] && !match[0].toLowerCase().includes('return')) return match[1].trim();
    }
    return '';
  };

  // Helper to format date for datetime-local input (YYYY-MM-DDTHH:mm)
  const formatForDateTimeLocal = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return '';
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    } catch (e) {
      return '';
    }
  };

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
      
      if (startDate) params.append('startDate', `${startDate}T00:00:00`);
      if (endDate) params.append('endDate', `${endDate}T23:59:59`);
      if (tripTypeFilter) params.append('tripType', tripTypeFilter);

      const data = await DashboardService.fetchBookings(params);
      
      // Handle different response formats
      let bookingsList: Booking[] = [];
      if (data && typeof data === 'object') {
        if (Array.isArray(data.bookings)) {
          setBookings(data.bookings);
          setTotalElements(data.totalCount || data.bookings.length);
          setTotalPages(data.totalPages || Math.ceil((data.totalCount || data.bookings.length) / size) || 1);
          bookingsList = data.bookings;
        } else if (Array.isArray(data.content)) {
          setBookings(data.content);
          setTotalElements(data.totalElements || data.content.length);
          setTotalPages(data.totalPages || 1);
          bookingsList = data.content;
        } else if (Array.isArray(data)) {
          setBookings(data);
          setTotalElements(data.length);
          setTotalPages(1);
          bookingsList = data;
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
  }, [page, size, statusFilter, driverFilter, customerFilter, startDate, endDate, tripTypeFilter, sortBy, sortDirection]);

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
    setReturnDriverNameInput('');
    setShowApproveModal(true);
  };

  const handleConfirmApproval = async () => {
    if (!selectedBookingId || !driverNameInput) return;
    
    const booking = bookings.find(b => b.id === selectedBookingId);
    const returnDr = getReturnDriver(booking);
    const isReturn = !!(
      booking?.returnDate || 
      booking?.returnTime || 
      booking?.returnPickupLocation || 
      booking?.returnDropoffLocation || 
      returnDr ||
      booking?.notes?.toLowerCase().includes('return date') || 
      booking?.notes?.toLowerCase().includes('return time') ||
      booking?.notes?.toLowerCase().includes('return journey')
    );
    
    // If it's a return trip, we also need a return driver
    if (isReturn && !returnDriverNameInput) {
      alert('Please assign a driver for the return trip.');
      return;
    }

    setApproveLoading(true);
    try {
      await DashboardService.confirmBooking({
        bookingId: selectedBookingId,
        driverName: driverNameInput,
        returnDriverName: isReturn ? returnDriverNameInput : null,
        returndriverName: isReturn ? returnDriverNameInput : null
      });

      setShowApproveModal(false);
      if (selectedBookingId && returnDriverNameInput) {
        setReturnDriversCache(prev => ({
          ...prev,
          [selectedBookingId]: returnDriverNameInput
        }));
      }
      fetchBookings(); // Refresh
    } catch (err) {
      console.error('Failed to approve:', err);
      alert(err instanceof Error ? err.message : 'Error approving booking. Please try again.');
    } finally {
      setApproveLoading(false);
    }
  };

  const openEditModal = async (booking: Booking) => {
    setShowEditModal(true);
    setUpdateSuccess(false);
    setFetchingBooking(true);
    try {
      const latestData = await DashboardService.fetchBookingDetails(booking.id);
      
      let fName = latestData.firstName || '';
      let lName = latestData.lastName || '';
      
      // If firstName/lastName are missing, try splitting customerName
      if ((!fName || !lName) && latestData.customerName) {
        const parts = latestData.customerName.trim().split(' ');
        if (!fName) fName = parts[0] || '';
        if (!lName) lName = parts.slice(1).join(' ') || '';
      }

      setEditingBooking({
        ...latestData,
        firstName: fName,
        lastName: lName,
        flightNumber: getFlightNumber(latestData),
        pickupTime: formatForDateTimeLocal(latestData.pickupTime || latestData.bookingDate),
        returnDriverName: getReturnDriver(latestData),
        passengers: latestData.passengers || 0,
        luggage: latestData.luggage || 0,
        amount: latestData.amount || 0
      });
    } catch (err) {
      console.error('Fetch error:', err);
      // Fallback to local data
      setEditingBooking({...booking});
    } finally {
      setFetchingBooking(false);
    }
  };

  const handleUpdateBooking = async () => {
    if (!editingBooking.id) return;
    
    setUpdateLoading(true);
    try {
      // Ensure pickupTime has seconds (YYYY-MM-DDTHH:mm:ss)
      let formattedTime = editingBooking.pickupTime || '';
      if (formattedTime && formattedTime.length === 16) {
        formattedTime += ':00';
      }

      const payload = {
        firstName: editingBooking.firstName,
        lastName: editingBooking.lastName,
        email: editingBooking.email,
        phone: editingBooking.phone,
        pickupLocation: editingBooking.pickupLocation,
        dropoffLocation: editingBooking.dropoffLocation,
        pickupTime: formattedTime,
        passengers: Number(editingBooking.passengers) || 0,
        luggage: Number(editingBooking.luggage) || 0,
        vehicleType: editingBooking.vehicleType,
        amount: Number(editingBooking.amount) || 0,
        flightNumber: editingBooking.flightNumber,
        driverNote: editingBooking.driverNote,
        returnDate: editingBooking.returnDate,
        returnTime: editingBooking.returnTime,
        returnPickupLocation: editingBooking.returnPickupLocation,
        returnDropoffLocation: editingBooking.returnDropoffLocation,
        status: editingBooking.status,
        driverName: editingBooking.driverName,
        returnDriverName: editingBooking.returnDriverName,
        returndriverName: editingBooking.returnDriverName
      };

      await DashboardService.updateBooking(editingBooking.id, payload);

      setUpdateSuccess(true);
      if (editingBooking.id && editingBooking.returnDriverName) {
        setReturnDriversCache(prev => ({
          ...prev,
          [editingBooking.id!]: editingBooking.returnDriverName!
        }));
      }
      setTimeout(() => {
        setShowEditModal(false);
        setUpdateSuccess(false);
      }, 2000);
      fetchBookings(); // Refresh
    } catch (err) {
      console.error('Update error:', err);
      alert('Error updating booking.');
    } finally {
      setUpdateLoading(false);
    }
  };
  
  const downloadCSV = () => {
    if (bookings.length === 0) {
      alert("No data to download");
      return;
    }
    
    // Define headers
    const headers = ['ID', 'Customer Name', 'Phone', 'Email', 'Flight Number', 'Pickup Location', 'Dropoff Location', 'Date/Time', 'Return Date/Time', 'Status', 'Vehicle', 'Amount', 'Driver', 'Return Driver'];
    
    // Create CSV rows
    const rows = bookings.map(b => [
      b.id,
      `"${(b.customerName || '').replace(/"/g, '""')}"`,
      `"${b.phone || ''}"`,
      `"${b.email || b.notes?.match(/Email:\s*([^\s\n]+)/)?.[1] || ''}"`,
      `"${getFlightNumber(b)}"`,
      `"${(b.pickupLocation || '').replace(/"/g, '""')}"`,
      `"${(b.dropoffLocation || '').replace(/"/g, '""')}"`,
      `"${b.pickupTime || b.bookingDate || ''}"`,
      `"${b.returnDate ? b.returnDate + ' ' + (b.returnTime || '') : ''}"`,
      `"${b.status || ''}"`,
      `"${b.vehicleType || ''}"`,
      b.amount || 0,
      `"${b.driverName || ''}"`,
      `"${getReturnDriver(b)}"`
    ]);
    
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `bookings_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (loading && bookings.length === 0) {
    return (
      <div className={styles.adminPage} style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div className={styles.modalLoader}>
          <div className={styles.spinner}></div>
          <p>Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.adminPage}>
      <header className={styles.topBar}>
        <div className={styles.adminInfo}>
          <img src="/logo.png" alt="Private Transfers" className={styles.adminDashboardLogo} />
          <span className={styles.adminBadge}>Admin</span>
          <span>Private Transfer Dashboard</span>
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
            <div className={styles.headerIcon}><LayoutDashboard size={28} color="var(--primary)" /></div>
            <h1>Bookings</h1>
          </div>
          
          <div className={styles.headerActions}>
            <button 
              className={styles.mobileFilterBtn}
              onClick={() => setIsFilterDrawerOpen(true)}
            >
              <Filter size={18} /> Filters
            </button>
            <button className={styles.downloadBtn} onClick={downloadCSV}>
              <Download size={18} /> CSV
            </button>
          </div>
        </div>

        {/* ── Desktop Filters ─────────────────────────── */}
        <section className={styles.filters}>
          <div className={styles.filterGroup}>
            <label><Filter size={14} className={styles.filterIcon} /> Status</label>
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
            <label><RotateCcw size={14} className={styles.filterIcon} /> Trip Type</label>
            <div className={styles.filterInputWrap}>
              <select value={tripTypeFilter} onChange={(e) => { setTripTypeFilter(e.target.value); setPage(0); }}>
                <option value="">All Trips</option>
                <option value="oneway">One Way</option>
                <option value="return">Return Journey</option>
              </select>
            </div>
          </div>
          <div className={styles.filterGroup}>
            <label><User size={14} className={styles.filterIcon} /> Driver</label>
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
            <label><Search size={14} className={styles.filterIcon} /> Customer</label>
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
            <label><CalendarIcon size={14} className={styles.filterIcon} /> Start Date</label>
            <div className={styles.filterInputWrap}>
              <input 
                type="date" 
                value={startDate} 
                onChange={(e) => { setStartDate(e.target.value); setPage(0); }} 
              />
            </div>
          </div>
          <div className={styles.filterGroup}>
            <label><CalendarIcon size={14} className={styles.filterIcon} /> End Date</label>
            <div className={styles.filterInputWrap}>
              <input 
                type="date" 
                value={endDate} 
                onChange={(e) => { setEndDate(e.target.value); setPage(0); }} 
              />
            </div>
          </div>

          <div className={styles.filterGroup}>
            <label><ArrowUpDown size={14} className={styles.filterIcon} /> Sort By</label>
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

          <div style={{ display: 'flex', gap: '0.75rem', paddingBottom: '0.2rem' }}>
            <button 
              className={styles.resetBtn} 
              onClick={() => {
                setStatusFilter('');
                setDriverFilter('');
                setCustomerFilter('');
                setStartDate('');
                setEndDate('');
                setTripTypeFilter('');
                setSortBy('bookingDate');
                setSortDirection('desc');
                setPage(0);
              }}
              title="Reset Filters"
            >
              <RotateCcw size={18} />
            </button>
            <button
              className={styles.applyBtn}
              onClick={() => {
                setPage(0);
                fetchBookings();
              }}
              title="Apply Filters"
              style={{ height: '42px', padding: '0 1.5rem' }}
            >
              Apply
            </button>
          </div>
        </section>

        {/* ── Mobile Filter Drawer ────────────────────── */}
        {isFilterDrawerOpen && (
          <div className={styles.filterDrawerOverlay} onClick={() => setIsFilterDrawerOpen(false)}>
            <div className={styles.filterDrawer} onClick={e => e.stopPropagation()}>
              <div className={styles.drawerHeader}>
                <h3>Filters</h3>
                <button className={styles.closeDrawer} onClick={() => setIsFilterDrawerOpen(false)}>
                  <X size={24} />
                </button>
              </div>
              <div className={styles.drawerContent}>
                <div className={styles.filterGroup}>
                  <label><Filter size={14} /> Status</label>
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
                  <label><RotateCcw size={14} /> Trip Type</label>
                  <div className={styles.filterInputWrap}>
                    <select value={tripTypeFilter} onChange={(e) => { setTripTypeFilter(e.target.value); setPage(0); }}>
                      <option value="">All Trips</option>
                      <option value="oneway">One Way</option>
                      <option value="return">Return Journey</option>
                    </select>
                  </div>
                </div>
                <div className={styles.filterGroup}>
                  <label><User size={14} /> Driver</label>
                  <div className={styles.filterInputWrap}>
                    <input type="text" placeholder="Driver name..." value={driverFilter} onChange={e => setDriverFilter(e.target.value)} />
                  </div>
                </div>
                <div className={styles.filterGroup}>
                  <label><Search size={14} /> Customer</label>
                  <div className={styles.filterInputWrap}>
                    <input type="text" placeholder="Customer name..." value={customerFilter} onChange={e => setCustomerFilter(e.target.value)} />
                  </div>
                </div>
                <div className={styles.filterGroup}>
                  <label><CalendarIcon size={14} /> Start Date</label>
                  <div className={styles.filterInputWrap}>
                    <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
                  </div>
                </div>
                <div className={styles.filterGroup}>
                  <label><CalendarIcon size={14} /> End Date</label>
                  <div className={styles.filterInputWrap}>
                    <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
                  </div>
                </div>
                <div className={styles.filterGroup}>
                  <label><ArrowUpDown size={14} /> Sort By</label>
                  <div className={styles.filterInputWrap}>
                    <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
                      <option value="bookingDate">Booking Date</option>
                      <option value="amount">Amount</option>
                      <option value="status">Status</option>
                      <option value="pickupTime">Pickup Time</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className={styles.drawerFooter}>
                <button className={styles.resetBtn} onClick={() => {
                  setStatusFilter('');
                  setDriverFilter('');
                  setCustomerFilter('');
                  setStartDate('');
                  setEndDate('');
                  setTripTypeFilter('');
                }}>Reset</button>
                <button className={styles.applyBtn} onClick={() => setIsFilterDrawerOpen(false)}>Apply</button>
              </div>
            </div>
          </div>
        )}

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
                <th style={{ minWidth: '180px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length > 0 ? bookings.map((b) => {
                const retDr = getReturnDriver(b);
                const isReturn = !!(
                  b.returnDate || 
                  b.returnTime || 
                  b.returnPickupLocation || 
                  b.returnDropoffLocation || 
                  retDr ||
                  b.notes?.toLowerCase().includes('return date') || 
                  b.notes?.toLowerCase().includes('return time') ||
                  b.notes?.toLowerCase().includes('return journey')
                );
                return (
                  <tr key={b.id} className={isReturn ? styles.returnTripRow : ''}>
                  <td data-label="Customer">
                    <div className={styles.customerCell}>
                      <div>
                        <strong>{b.customerName || 'Unknown Customer'}</strong>
                        <div className={styles.subText}>{b.phone}</div>
                        {b.email && (
                          <div className={styles.subText} style={{ color: '#0066cc', fontWeight: '500', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Mail size={14} /> {b.email}
                          </div>
                        )}
                        {!b.email && b.notes?.match(/Email:\s*([^\s\n]+)/) && (
                          <div className={styles.subText} style={{ color: '#0066cc', fontWeight: '500', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Mail size={14} /> {b.notes.match(/Email:\s*([^\s\n]+)/)?.[1]}
                          </div>
                        )}
                        {getFlightNumber(b) && (
                          <div className={styles.subText} style={{ fontWeight: '500', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            ✈️ Flight: {getFlightNumber(b)}
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
                          ? new Date(b.pickupTime).toLocaleTimeString('en-IE', { timeZone: 'Europe/Dublin', hour: '2-digit', minute:'2-digit' }) 
                          : (b.bookingDate ? new Date(b.bookingDate).toLocaleTimeString('en-IE', { timeZone: 'Europe/Dublin', hour: '2-digit', minute:'2-digit' }) : '—')}
                      </div>

                      {(b.returnDate || b.returnTime || b.notes?.toLowerCase().includes('return')) && (
                        <div className={styles.returnInfo}>
                          <span className={styles.returnBadge}>
                            <RotateCcw size={10} style={{ display: 'inline-block', marginRight: '4px' }} /> Return
                          </span>
                          <span className={styles.returnTime}>
                            {b.returnDate || b.notes?.match(/Return Date:\s*([\d-]+)/i)?.[1] || ''} {b.returnTime || b.notes?.match(/Return Time:\s*([\d:]+)/i)?.[1] || ''}
                          </span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td data-label="Vehicle/Drivers">
                    <div className={styles.vehicleCell}>
                      <div className={styles.vehicleInfo}>
                        {b.vehicleType?.toLowerCase().includes('minivan') ? (
                          <Bus size={16} className={styles.vehicleIcon} />
                        ) : (
                          <Car size={16} className={styles.vehicleIcon} />
                        )}
                        <span className={styles.vehicleName}>{b.vehicleType || 'Standard'}</span>
                      </div>
                      
                      <div className={styles.vSpecsMini}>
                        <span className={styles.specMini} title="Passengers">
                          <Users size={12} /> {b.passengers || 0}
                        </span>
                        <span className={styles.specMini} title="Luggage">
                          <Luggage size={12} /> {b.luggage || 0}
                        </span>
                      </div>

                      <div className={styles.driverInfoSimple}>
                        <div>Outbound: <strong>{b.driverName || 'Unassigned'}</strong></div>
                        {isReturn && (
                          <div>Return: <strong>{retDr || 'Unassigned'}</strong></div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td data-label="Amount" className={styles.amountCell}>
                    €{b.amount?.toFixed(2)}
                  </td>
                  <td data-label="Status">
                    <span className={`${styles.statusBadge} ${styles['status' + (b.status?.toUpperCase() === 'CONFIRMED' || b.driverName ? 'APPROVED' : b.status?.toUpperCase().replace(/\s+/g, ''))] || ''}`}>
                      {b.status?.toUpperCase() === 'CONFIRMED' || b.driverName ? 'APPROVED' : b.status?.replace(/_/g, ' ') || 'PENDING'}
                    </span>
                  </td>
                  <td data-label="Actions">
                    <div className={styles.actionsContainer}>
                      <button 
                        className={styles.editBtn} 
                        onClick={() => openEditModal(b)}
                        title="Edit Booking"
                      >
                        <Pencil size={16} />
                      </button>
                      {!b.driverName && (b.status?.toUpperCase().includes('PENDING') || !b.status) && (
                        <button className={styles.approveBtn} onClick={() => openApproveModal(b.id)}>
                          Approve
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )
            }) : (
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

      {/* Edit Modal */}
      {showEditModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.editModalContent}>
            <div className={styles.modalHeader}>
              <h3>Edit Booking #{editingBooking.id}</h3>
              <button className={styles.closeBtn} onClick={() => setShowEditModal(false)}><X size={20} /></button>
            </div>
            
            <div className={styles.editFormScroll}>
              {fetchingBooking ? (
                <div className={styles.modalLoader}>
                  <div className={styles.spinner}></div>
                  <p>Fetching latest booking details from server...</p>
                </div>
              ) : updateSuccess ? (
                <div className={styles.successState}>
                  <CheckCircle2 size={64} color="#10b981" />
                  <h4>Booking Updated Successfully!</h4>
                  <p>Redirecting to dashboard...</p>
                </div>
              ) : (
                <div className={styles.formGrid}>
                  <div className={styles.formBox}>
                    <div className={styles.boxHeader}>
                      <User size={18} />
                      <h4>Customer Information</h4>
                    </div>
                    <div className={styles.formRow}>
                      <div className={styles.formField}>
                        <label>First Name</label>
                        <input type="text" value={editingBooking.firstName || ''} onChange={e => setEditingBooking({...editingBooking, firstName: e.target.value})} />
                      </div>
                      <div className={styles.formField}>
                        <label>Last Name</label>
                        <input type="text" value={editingBooking.lastName || ''} onChange={e => setEditingBooking({...editingBooking, lastName: e.target.value})} />
                      </div>
                    </div>
                    <div className={styles.formRow}>
                      <div className={styles.formField}>
                        <label>Email</label>
                        <input type="email" value={editingBooking.email || ''} onChange={e => setEditingBooking({...editingBooking, email: e.target.value})} />
                      </div>
                      <div className={styles.formField}>
                        <label>Phone</label>
                        <input type="text" value={editingBooking.phone || ''} onChange={e => setEditingBooking({...editingBooking, phone: e.target.value})} />
                      </div>
                    </div>
                    <div className={styles.formRow}>
                      <div className={styles.formField}>
                        <label>Flight Number</label>
                        <input type="text" value={editingBooking.flightNumber || ''} onChange={e => setEditingBooking({...editingBooking, flightNumber: e.target.value})} placeholder="e.g. FR1234" />
                      </div>
                      <div className={styles.formField}></div>
                    </div>
                  </div>

                  <div className={styles.formBox}>
                    <div className={styles.boxHeader}>
                      <MapPin size={18} />
                      <h4>Trip Details</h4>
                    </div>
                    <div className={styles.formRow}>
                      <div className={styles.formField}>
                        <label>Booking Code</label>
                        <input type="text" value={editingBooking.bookingCode || ''} readOnly className={styles.readOnlyInput} />
                      </div>
                      <div className={styles.formField}>
                        <label>Status</label>
                        <select value={editingBooking.status || ''} onChange={e => setEditingBooking({...editingBooking, status: e.target.value})}>
                          <option value="CONFIRMED">CONFIRMED</option>
                          <option value="PENDING_ADMIN">PENDING_ADMIN</option>
                          <option value="PENDING_PAYMENT">PENDING_PAYMENT</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </div>
                    </div>
                    <div className={styles.formField}>
                      <label>Pickup Location</label>
                      <input type="text" value={editingBooking.pickupLocation || ''} readOnly className={styles.readOnlyInput} />
                    </div>
                    <div className={styles.formField}>
                      <label>Dropoff Location</label>
                      <input type="text" value={editingBooking.dropoffLocation || ''} readOnly className={styles.readOnlyInput} />
                    </div>
                    <div className={styles.formRow}>
                      <div className={styles.formField}>
                        <label>Pickup Date/Time</label>
                        <input type="datetime-local" value={editingBooking.pickupTime || ''} onChange={e => setEditingBooking({...editingBooking, pickupTime: e.target.value})} />
                      </div>
                      <div className={styles.formField}>
                        <label>Passengers</label>
                        <input type="number" value={editingBooking.passengers || 0} onChange={e => setEditingBooking({...editingBooking, passengers: parseInt(e.target.value) || 0})} />
                      </div>
                      <div className={styles.formField}>
                        <label>Luggage</label>
                        <input type="number" value={editingBooking.luggage || 0} onChange={e => setEditingBooking({...editingBooking, luggage: parseInt(e.target.value) || 0})} />
                      </div>
                    </div>
                    <div className={styles.formRow}>
                      <div className={styles.formField}>
                        <label>Vehicle Type</label>
                        <select value={editingBooking.vehicleType || ''} onChange={e => setEditingBooking({...editingBooking, vehicleType: e.target.value})}>
                          <option value="Sedan">Sedan</option>
                          <option value="Minivan">Minivan</option>
                          <option value="Executive">Executive</option>
                        </select>
                      </div>
                      <div className={styles.formField}>
                        <label>Amount (€)</label>
                        <input type="number" step="0.01" value={editingBooking.amount || 0} onChange={e => setEditingBooking({...editingBooking, amount: parseFloat(e.target.value)})} />
                      </div>
                    </div>
                  </div>

                  <div className={styles.formBox}>
                    <div className={styles.boxHeader}>
                      <FileText size={18} />
                      <h4>Driver & Notes</h4>
                    </div>
                    <div className={styles.formRow}>
                      <div className={styles.formField}>
                        <label>Outbound Driver</label>
                        <input type="text" value={editingBooking.driverName || ''} onChange={e => setEditingBooking({...editingBooking, driverName: e.target.value})} placeholder="Driver name" />
                      </div>
                      <div className={styles.formField}>
                        <label>Return Driver</label>
                        <input type="text" value={editingBooking.returnDriverName || ''} onChange={e => setEditingBooking({...editingBooking, returnDriverName: e.target.value})} placeholder="Return driver name" />
                      </div>
                    </div>
                    <div className={styles.formField}>
                      <label>Driver Note</label>
                      <textarea value={editingBooking.driverNote || ''} onChange={e => setEditingBooking({...editingBooking, driverNote: e.target.value})} rows={2} />
                    </div>
                  </div>

                  {(editingBooking.returnDate || 
                    editingBooking.returnTime || 
                    editingBooking.returnPickupLocation || 
                    editingBooking.returnDropoffLocation || 
                    editingBooking.notes?.toLowerCase().includes('return')) && (
                    <div className={styles.formBox}>
                      <div className={styles.boxHeader} style={{color: '#2563eb'}}>
                        <RotateCcw size={18} />
                        <h4>Return Journey Details</h4>
                      </div>
                      <div className={styles.formRow}>
                        <div className={styles.formField}>
                          <label>Return Date</label>
                          <input type="date" value={editingBooking.returnDate || ''} onChange={e => setEditingBooking({...editingBooking, returnDate: e.target.value})} />
                        </div>
                        <div className={styles.formField}>
                          <label>Return Time</label>
                          <input type="time" value={editingBooking.returnTime || ''} onChange={e => setEditingBooking({...editingBooking, returnTime: e.target.value})} />
                        </div>
                      </div>
                      <div className={styles.formField}>
                        <label>Return Pickup Location</label>
                        <input type="text" value={editingBooking.returnPickupLocation || ''} readOnly className={styles.readOnlyInput} />
                      </div>
                      <div className={styles.formField}>
                        <label>Return Dropoff Location</label>
                        <input type="text" value={editingBooking.returnDropoffLocation || ''} readOnly className={styles.readOnlyInput} />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className={styles.modalActions} style={{marginTop: '1.5rem'}}>
              <button className={styles.cancelBtn} onClick={() => setShowEditModal(false)}>Cancel</button>
              <button 
                className={styles.saveBtn} 
                onClick={handleUpdateBooking}
                disabled={updateLoading}
              >
                {updateLoading ? 'Saving...' : 'Update Booking'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Approval Modal */}
      {showApproveModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Confirm Booking</h3>
            <p>
              Please assign {bookings.find(b => b.id === selectedBookingId)?.returnDate ? 'drivers' : 'a driver'} 
              to confirm this booking (ID: {selectedBookingId})
            </p>
            
            <div className={styles.modalField}>
              <label>{bookings.find(b => b.id === selectedBookingId)?.returnDate ? 'Outbound Driver Name' : 'Driver Name'}</label>
              <input 
                type="text" 
                value={driverNameInput} 
                onChange={(e) => setDriverNameInput(e.target.value)}
                placeholder="e.g. Michael Smith"
                autoFocus
              />
            </div>

            {bookings.find(b => b.id === selectedBookingId)?.returnDate || bookings.find(b => b.id === selectedBookingId)?.notes?.includes('Return Date:') ? (
              <div className={styles.modalField}>
                <label>Return Driver Name</label>
                <input 
                  type="text" 
                  value={returnDriverNameInput} 
                  onChange={(e) => setReturnDriverNameInput(e.target.value)}
                  placeholder="e.g. Sarah Johnson"
                />
              </div>
            ) : null}

            <div className={styles.modalActions}>
              <button className={styles.cancelBtn} onClick={() => setShowApproveModal(false)}>Cancel</button>
              <button 
                className={styles.saveBtn} 
                onClick={handleConfirmApproval}
                disabled={approveLoading || !driverNameInput || (!!(
                  getReturnDriver(bookings.find(b => b.id === selectedBookingId)) ||
                  bookings.find(b => b.id === selectedBookingId)?.returnDate || 
                  bookings.find(b => b.id === selectedBookingId)?.returnTime ||
                  bookings.find(b => b.id === selectedBookingId)?.notes?.toLowerCase().includes('return')
                ) && !returnDriverNameInput)}
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
