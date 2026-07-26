'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './Header.module.css';
import { API_BASE_URL } from '@/lib/api';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [services, setServices] = useState<any[]>([]);
  const [isLoadingServices, setIsLoadingServices] = useState(false);

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        {/* Logo */}
        <Link href="/" className={styles.logoContainer}>
          <img src="/logo.png" alt="Private Transfers" className={styles.logoImg} />
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
          
          <div 
            className={styles.dropdownContainer}
            onMouseEnter={async () => {
              if (services.length === 0 && !isLoadingServices) {
                setIsLoadingServices(true);
                try {
                  const res = await fetch(`${API_BASE_URL}/api/images?service=services`);
                  if (!res.ok) throw new Error('Network response was not ok');
                  const data = await res.json();
                  setServices(data || []);
                } catch (error) {
                  console.error('Failed to fetch services', error);
                } finally {
                  setIsLoadingServices(false);
                }
              }
            }}
          >
            <Link href="/services" className={styles.navLink} onClick={() => setIsMobileMenuOpen(false)}>Services</Link>
            <div className={styles.dropdownMenu}>
              {isLoadingServices ? (
                <div className={styles.dropdownItem}>Loading...</div>
              ) : services.length > 0 ? (
                services.map((service, idx) => {
                  const slug = service.mainService ? service.mainService.toLowerCase() : (service.heading || '').toLowerCase().replace(/\\s+/g, '-');
                  return (
                    <Link 
                      key={service.id || idx} 
                      href={`/services/${slug}`} 
                      className={styles.dropdownItem}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {service.heading}
                    </Link>
                  );
                })
              ) : null}
            </div>
          </div>

          <Link href="/booking" className={styles.navLink} onClick={() => setIsMobileMenuOpen(false)}>Booking</Link>
          <Link href="/payment" className={styles.navLink} onClick={() => setIsMobileMenuOpen(false)}>Payment</Link>
          <Link href="/contact" className={styles.navLink} onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
          <Link href="/about" className={styles.navLink} onClick={() => setIsMobileMenuOpen(false)}>About</Link>
          
          {/* Mobile CTA (visible only inside the open menu on small screens) */}
          <Link href="/booking" className={`${styles.btnPrimaryMobile} btn-primary`} onClick={() => setIsMobileMenuOpen(false)}>
            Get Quote
          </Link>
        </nav>

        {/* Desktop CTA */}
        <div className={styles.desktopCta}>
          <Link href="/booking" className="btn-primary">
            Get Quote
          </Link>
        </div>
      </div>
    </header>
  );
}
