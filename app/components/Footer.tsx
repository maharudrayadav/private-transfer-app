import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>

        {/* Brand */}
        <div className={styles.col}>
          <div className={styles.logo}>
            <span className={styles.logoMark}>P</span>
            <span><span className={styles.blue}>Private</span>Transfer</span>
          </div>
          <p className={styles.desc}>
            Premium chauffeur and private transfer service in Ireland. Your journey, your way.
          </p>
          <a href="tel:+353876899968" className={styles.phone}>+353 876 899 968</a>
        </div>

        {/* Company */}
        <div className={styles.col}>
          <h3>Company</h3>
          <ul>
            <li><Link href="/about">About Us</Link></li>
            <li><Link href="/services">Services</Link></li>
            <li><Link href="/booking">Booking</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </div>

        {/* Services */}
        <div className={styles.col}>
          <h3>Our Services</h3>
          <ul>
            <li><Link href="/services">Hotel Transfer</Link></li>
            <li><Link href="/services">Airport Service</Link></li>
            <li><Link href="/services">Vacation Transfer</Link></li>
            <li><Link href="/services">Business Transfer</Link></li>
            <li><Link href="/services">Wedding Car</Link></li>
          </ul>
        </div>

        {/* Legal */}
        <div className={styles.col}>
          <h3>Legal</h3>
          <ul>
            <li><Link href="/privacy-policy">Privacy Policy</Link></li>
            <li><Link href="/terms">Terms of Service</Link></li>
            <li><Link href="/faq">FAQ</Link></li>
          </ul>
        </div>

      </div>

      <div className={styles.bottom}>
        <div className="container">
          <p>&copy; {new Date().getFullYear()} PrivateTransfer.ie — All rights reserved.</p>
          <div className={styles.bottomLinks}>
            <Link href="/privacy-policy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
