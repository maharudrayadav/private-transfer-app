import Link from 'next/link';
import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          <span className={styles.logoMark}>P</span>
          <span className={styles.logoText}>
            <span>Private</span>Transfer
          </span>
        </Link>

        {/* Nav */}
        <nav className={styles.nav}>
          <Link href="/" className={styles.navLink}>Home</Link>
          <Link href="/services" className={styles.navLink}>Services</Link>
          <Link href="/booking" className={styles.navLink}>Booking</Link>
          <Link href="/contact" className={styles.navLink}>Contact</Link>
        </nav>

        {/* CTA */}
        <Link href="/booking" className="btn-primary">
          Get Quote & Book
        </Link>
      </div>
    </header>
  );
}
