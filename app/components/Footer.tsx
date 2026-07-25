import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>

        {/* Brand */}
        <div className={styles.col}>
          <div className={styles.logoContainer}>
            <img src="/logo.png" alt="Private Transfers" className={styles.logoImg} />
          </div>
          <p className={styles.desc}>
            Premium chauffeur and private transfer service in Ireland. Your journey, your way.
          </p>
          {/* <a href="tel:+353876899968" className={styles.phone}>+353 876 899 968</a> */}
        </div>

        {/* Company */}
        <div className={styles.col}>
          <h3>Company</h3>
          <ul>
            <li><Link href="/about">About Us</Link></li>
            <li><Link href="/services">Services</Link></li>
            <li><Link href="/booking">Booking</Link></li>
            <li><Link href="/payment">Payment</Link></li>
            <li><Link href="/contact">Contact</Link></li>
            <li><Link href="/gallery">Our Gallery</Link></li>
          </ul>
        </div>

        {/* Services */}
        <div className={styles.col}>
          <h3>Our Services</h3>
          <ul>
            <li><Link href="/services/-hotel-transfer">Hotel Transfer</Link></li>
            <li><Link href="/services/airport">Airport Service</Link></li>
            <li><Link href="/services/vacation">Vacation Transfer</Link></li>
          </ul>
        </div>

      </div>

      <div className={styles.bottom}>
        <div className="container">
          <p>&copy; {new Date().getFullYear()} PrivateTransfer.ie — All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
