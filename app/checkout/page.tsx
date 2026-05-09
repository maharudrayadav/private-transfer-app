'use client';

import { useState, useEffect, Suspense } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from './checkout.module.css';

function CheckoutContent() {
  const [booking, setBooking] = useState<any>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    passengers: '1',
    luggage: '1',
    flightNumber: '',
    specialRequests: ''
  });

  useEffect(() => {
    const search = sessionStorage.getItem('lastSearch');
    const vehicle = sessionStorage.getItem('selectedVehicle');
    if (search && vehicle) {
      setBooking({
        ...JSON.parse(search),
        vehicle: JSON.parse(vehicle)
      });
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Booking Confirmed! (Stripe Integration Required)');
    // Here we would normally redirect to a Stripe Checkout or process payment
  };

  if (!booking) {
    return (
      <div className={styles.empty}>
        <h2>No booking session found.</h2>
        <a href="/" className="btn-primary">Start New Search</a>
      </div>
    );
  }

  return (
    <div className={styles.checkoutGrid}>
      <div className={styles.formSide}>
        <div className={styles.card}>
          <h3>Passenger <span>Details</span></h3>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.row}>
              <div className={styles.field}>
                <label>First Name</label>
                <input type="text" name="firstName" required onChange={handleChange} />
              </div>
              <div className={styles.field}>
                <label>Last Name</label>
                <input type="text" name="lastName" required onChange={handleChange} />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label>Email Address</label>
                <input type="email" name="email" required onChange={handleChange} />
              </div>
              <div className={styles.field}>
                <label>Phone Number</label>
                <input type="tel" name="phone" required onChange={handleChange} />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label>Passengers</label>
                <select name="passengers" onChange={handleChange}>
                  {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div className={styles.field}>
                <label>Luggage</label>
                <select name="luggage" onChange={handleChange}>
                  {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            </div>

            <div className={styles.field}>
              <label>Flight Number (Optional)</label>
              <input type="text" name="flightNumber" placeholder="e.g. EI105" onChange={handleChange} />
            </div>

            <div className={styles.field}>
              <label>Special Requirements</label>
              <textarea name="specialRequests" rows={4} onChange={handleChange}></textarea>
            </div>

            <button type="submit" className={styles.payBtn}>
              Complete Booking & Pay
            </button>
          </form>
        </div>
      </div>

      <div className={styles.summarySide}>
        <div className={styles.stickySummary}>
          <div className={styles.summaryCard}>
            <h3>Booking <span>Summary</span></h3>
            
            <div className={styles.vehicleInfo}>
              <div className={styles.vLabel}>SELECTED VEHICLE</div>
              <div className={styles.vName}>{booking.vehicle.heading}</div>
            </div>

            <div className={styles.journeyInfo}>
              <div className={styles.jItem}>
                <span className={styles.dot}></span>
                <div>
                  <label>PICKUP</label>
                  <p>{booking.pickup}</p>
                </div>
              </div>
              <div className={styles.jItem}>
                <span className={styles.dot + ' ' + styles.endDot}></span>
                <div>
                  <label>DROPOFF</label>
                  <p>{booking.dropoff}</p>
                </div>
              </div>
            </div>

            <div className={styles.dateTime}>
              <div className={styles.dtItem}>
                <label>DATE</label>
                <p>{booking.date}</p>
              </div>
              <div className={styles.dtItem}>
                <label>TIME</label>
                <p>{booking.time}</p>
              </div>
            </div>

            <div className={styles.totalBox}>
              <span>Estimated Total</span>
              <strong>€{booking.vehicle.price || '85.00'}</strong>
            </div>

            <div className={styles.guarantee}>
              <p>✓ All-inclusive pricing</p>
              <p>✓ Professional chauffeur</p>
              <p>✓ Free cancellation (up to 24h before)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <main>
      <Header />
      <div className={styles.page}>
        <div className="container">
          <Suspense fallback={<div>Loading checkout...</div>}>
            <CheckoutContent />
          </Suspense>
        </div>
      </div>
      <Footer />
    </main>
  );
}
