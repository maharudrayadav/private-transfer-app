'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './Header.module.css';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

        {/* Hamburger Icon */}
        <button 
          className={styles.mobileMenuBtn} 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle navigation"
        >
          <span className={`${styles.hamburgerLine} ${isMobileMenuOpen ? styles.lineTop : ''}`}></span>
          <span className={`${styles.hamburgerLine} ${isMobileMenuOpen ? styles.lineMiddle : ''}`}></span>
          <span className={`${styles.hamburgerLine} ${isMobileMenuOpen ? styles.lineBottom : ''}`}></span>
        </button>

        {/* Nav */}
        <nav className={`${styles.nav} ${isMobileMenuOpen ? styles.navOpen : ''}`}>
          <Link href="/" className={styles.navLink} onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
          <Link href="/services" className={styles.navLink} onClick={() => setIsMobileMenuOpen(false)}>Services</Link>
          <Link href="/booking" className={styles.navLink} onClick={() => setIsMobileMenuOpen(false)}>Booking</Link>
          <Link href="/payment" className={styles.navLink} onClick={() => setIsMobileMenuOpen(false)}>Payment</Link>
          <Link href="/contact" className={styles.navLink} onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
          <Link href="/about" className={styles.navLink} onClick={() => setIsMobileMenuOpen(false)}>About</Link>
          
          {/* Mobile CTA (visible only inside the open menu on small screens) */}
          <Link href="/booking" className={`${styles.btnPrimaryMobile} btn-primary`} onClick={() => setIsMobileMenuOpen(false)}>
            Get Quote & Book
          </Link>
        </nav>

        {/* Desktop CTA */}
        <div className={styles.desktopCta}>
          <Link href="/booking" className="btn-primary">
            Get Quote & Book
          </Link>
        </div>
      </div>
    </header>
  );
}
