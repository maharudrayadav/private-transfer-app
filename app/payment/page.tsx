'use client';

import { useState } from 'react';
import styles from './payment.module.css';

interface BookingDetails {
  id: number;
  customerName: string;
  pickupLocation: string;
  dropoffLocation: string;
  pickupTime: string;
  amount: number;
  status: string;
}

export default function PaymentPage() {
  const [code, setCode] = useState('');
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [editableAmount, setEditableAmount] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!code) return;
    setLoading(true);
    setError('');
    setBooking(null);

    try {
      const res = await fetch(`/api/bookings/code/${code.toUpperCase()}`);
      
      if (!res.ok) {
        throw new Error('Reservation not found. Please check your code.');
      }

      const data = await res.json();
      const mappedBooking = {
        id: data.id,
        customerName: data.firstName ? `${data.firstName} ${data.lastName}` : data.customerName,
        pickupLocation: data.pickupLocation,
        dropoffLocation: data.dropoffLocation,
        pickupTime: data.pickupTime,
        amount: data.amount,
        status: data.status
      };
      
      setBooking(mappedBooking);
      setEditableAmount(mappedBooking.amount.toString());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.paymentPage}>
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.header}>
            <h1>Secure Payment</h1>
            <p>Enter your reservation code to view details and complete your booking.</p>
          </div>

          <div className={styles.searchSection}>
            <div className={styles.inputGroup}>
              <label htmlFor="resCode">Reservation Code</label>
              <div className={styles.inputWrapper}>
                <input 
                  id="resCode"
                  type="text" 
                  placeholder="e.g. AB12345" 
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button 
                  className={styles.searchBtn} 
                  onClick={handleSearch}
                  disabled={loading || !code}
                >
                  {loading ? '...' : 'Search'}
                </button>
              </div>
            </div>
            {error && <div className={styles.error}>{error}</div>}
          </div>

          {booking && (
            <div className={styles.resultSection}>
              <div className={styles.bookingSummary}>
                <p>Booking for <strong>{booking.customerName}</strong></p>
                <p>{booking.pickupLocation} ➔ {booking.dropoffLocation}</p>
              </div>

              <div className={styles.paymentFields}>
                <div className={styles.inputGroup}>
                  <label htmlFor="payAmount">Payment Amount (€)</label>
                  <input 
                    id="payAmount"
                    type="number"
                    className={styles.amountInput}
                    value={editableAmount}
                    onChange={(e) => setEditableAmount(e.target.value)}
                    placeholder="0.00"
                  />
                  <p className={styles.amountHint}>Total booking amount: €{booking.amount.toFixed(2)}</p>
                </div>

                <button className={styles.payBtn}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                  Pay €{parseFloat(editableAmount || '0').toFixed(2)} Now
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
