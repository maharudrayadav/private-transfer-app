import type { Metadata } from 'next';
import styles from '../privacy-policy/legal.module.css';

export const metadata: Metadata = {
  title: 'Terms of Service | Private Transfer Ireland',
  description: 'Terms and conditions for using our private transfer services.',
};

export default function TermsPage() {
  return (
    <div className={styles.page}>
      <div className={styles.banner}>
        <div className="container">
          <h1>Terms of <span>Service</span></h1>
        </div>
      </div>

      <div className="container">
        <div className={styles.content}>
          <p className={styles.lastUpdated}>Last Updated: May 2024</p>
          
          <section className={styles.section}>
            <h2>1. Booking & Cancellation</h2>
            <p>
              Bookings are confirmed only after receiving a confirmation email from us. 
              Cancellations made more than 24 hours before the scheduled pickup time are eligible for a full refund.
            </p>
          </section>

          <section className={styles.section}>
            <h2>2. Passenger Conduct</h2>
            <p>
              We reserve the right to refuse service to any passenger who is abusive, intoxicated, 
              or poses a safety risk to our drivers or other passengers.
            </p>
          </section>

          <section className={styles.section}>
            <h2>3. Liability</h2>
            <p>
              While we strive to ensure timely arrivals, we are not liable for delays caused by 
              traffic, weather, or other circumstances beyond our control.
            </p>
          </section>

          <section className={styles.section}>
            <h2>4. Pricing</h2>
            <p>
              All prices are inclusive of tolls and taxes unless otherwise stated. 
              Waiting time may incur additional charges after a grace period.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
