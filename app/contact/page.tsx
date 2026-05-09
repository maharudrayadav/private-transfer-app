import type { Metadata } from 'next';
import styles from './contact.module.css';

export const metadata: Metadata = {
  title: 'Contact & Booking | Private Transfer Ireland',
  description: 'Get a personalised quote or book your private transfer and day trip across Ireland.',
};

export default function ContactPage() {
  return (
    <div className={styles.page}>
      <div className={styles.banner}>
        <div className="container">
          <h1>Get a <span>Quote & Book</span></h1>
          <p>Fill in the form below and we'll get back to you with pricing and availability.</p>
        </div>
      </div>

      <div className="container">
        <div className={styles.layout}>
          {/* Contact Form */}
          <form className={styles.form}>
            <div className={styles.fieldGroup}>
              <div className={styles.field}>
                <label htmlFor="name">Full Name</label>
                <input id="name" type="text" placeholder="Your full name" />
              </div>
              <div className={styles.field}>
                <label htmlFor="email">Email Address</label>
                <input id="email" type="email" placeholder="your@email.com" />
              </div>
            </div>
            <div className={styles.fieldGroup}>
              <div className={styles.field}>
                <label htmlFor="phone">Phone Number</label>
                <input id="phone" type="tel" placeholder="+353 ..." />
              </div>
              <div className={styles.field}>
                <label htmlFor="service">Service Type</label>
                <select id="service">
                  <option value="">Select a service...</option>
                  <option>Airport Transfer</option>
                  <option>Private Driver</option>
                  <option>Business Transfer</option>
                  <option>Day Trip</option>
                  <option>Wedding Car</option>
                  <option>Golf Resort Transfer</option>
                </select>
              </div>
            </div>
            <div className={styles.fieldGroup}>
              <div className={styles.field}>
                <label htmlFor="pickup">Pickup Location</label>
                <input id="pickup" type="text" placeholder="Address or airport" />
              </div>
              <div className={styles.field}>
                <label htmlFor="dropoff">Drop-off Location</label>
                <input id="dropoff" type="text" placeholder="Destination address" />
              </div>
            </div>
            <div className={styles.fieldGroup}>
              <div className={styles.field}>
                <label htmlFor="cdate">Date</label>
                <input id="cdate" type="date" />
              </div>
              <div className={styles.field}>
                <label htmlFor="ctime">Time</label>
                <input id="ctime" type="time" />
              </div>
              <div className={styles.field}>
                <label htmlFor="passengers">Passengers</label>
                <select id="passengers">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                    <option key={n}>{n} Passenger{n > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className={styles.field}>
              <label htmlFor="message">Additional Information</label>
              <textarea id="message" rows={4} placeholder="Flight number, special requirements..." />
            </div>
            <button type="submit" className={`btn-primary ${styles.submit}`}>
              Send Quote Request
            </button>
          </form>

          {/* Contact Info */}
          <div className={styles.info}>
            <div className={styles.infoCard}>
              <h3>📞 Call Us</h3>
              <a href="tel:+353876899968">+353 876 899 968</a>
            </div>
            <div className={styles.infoCard}>
              <h3>🕐 Available</h3>
              <p>24/7 — We monitor your flight and adapt</p>
            </div>
            <div className={styles.infoCard}>
              <h3>📍 Based In</h3>
              <p>Dublin, Ireland — Serving all of Ireland</p>
            </div>
            <div className={styles.infoCard}>
              <h3>✅ Guaranteed</h3>
              <p>Fixed prices, no hidden fees, luxury fleet</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
