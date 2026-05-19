'use client';

import { useState } from 'react';
import styles from './PaymentForm.module.css';
import { PaymentService } from './PaymentService';

interface BookingDetails {
  id: number;
  customerName: string;
  pickupLocation: string;
  dropoffLocation: string;
  pickupTime: string;
  amount: number;
  status: string;
}

export default function PaymentForm() {
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
      const data = await PaymentService.getBookingByCode(code);
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
              <div className={styles.fieldWrapper}>
                <input 
                  id="resCode"
                  type="text" 
                  placeholder="e.g. AB12345" 
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                />
              </div>
            </div>

            <div className={styles.inputGroup} style={{marginTop: '1.5rem'}}>
              <label htmlFor="payAmount">Payment Amount (€)</label>
              <div className={styles.fieldWrapper}>
                <input 
                  id="payAmount"
                  type="number" 
                  placeholder="0.00" 
                  value={editableAmount}
                  onChange={(e) => setEditableAmount(e.target.value)}
                />
              </div>
            </div>

            <button 
              className={styles.payBtn} 
              style={{marginTop: '2rem'}}
              onClick={handleSearch}
              disabled={loading || !code || !editableAmount}
            >
              {loading ? 'Processing...' : `Pay €${parseFloat(editableAmount || '0').toFixed(2)} Now`}
            </button>

            {error && <div className={styles.error}>{error}</div>}
          </div>

          {booking && (
            <div className={styles.resultSection}>
              <div className={styles.bookingSummary}>
                <p>Booking found for <strong>{booking.customerName}</strong></p>
                <p>{booking.pickupLocation} ➔ {booking.dropoffLocation}</p>
                <p className={styles.amountHint}>Original booking total: €{booking.amount.toFixed(2)}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
