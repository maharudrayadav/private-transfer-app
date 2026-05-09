import type { Metadata } from 'next';
import styles from './legal.module.css';

export const metadata: Metadata = {
  title: 'Privacy Policy | Private Transfer Ireland',
  description: 'Our commitment to protecting your personal data and privacy.',
};

export default function PrivacyPolicy() {
  return (
    <div className={styles.page}>
      <div className={styles.banner}>
        <div className="container">
          <h1>Privacy <span>Policy</span></h1>
        </div>
      </div>

      <div className="container">
        <div className={styles.content}>
          <p className={styles.lastUpdated}>Last Updated: May 2024</p>
          
          <section className={styles.section}>
            <h2>1. Information We Collect</h2>
            <p>
              We collect information you provide directly to us when you book a service, request a quote, 
              or communicate with us. This may include your name, email address, phone number, 
              pickup and drop-off locations, and flight details.
            </p>
          </section>

          <section className={styles.section}>
            <h2>2. How We Use Your Information</h2>
            <p>
              We use the information we collect to provide, maintain, and improve our services, 
              including processing bookings, sending confirmations, and responding to your enquiries.
            </p>
          </section>

          <section className={styles.section}>
            <h2>3. Data Security</h2>
            <p>
              We take reasonable measures to help protect information about you from loss, theft, 
              misuse, and unauthorised access.
            </p>
          </section>

          <section className={styles.section}>
            <h2>4. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
              <br />
              <strong>Email:</strong> info@privatetransfer.ie
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
