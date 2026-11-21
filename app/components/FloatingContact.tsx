'use client';

import { Phone } from 'lucide-react';
import styles from './FloatingContact.module.css';

export default function FloatingContact() {
  return (
    <div className={styles.floatingContainer}>
      <a href="tel:00353894881562" className={`${styles.floatingBtn} ${styles.phoneBtn}`} aria-label="Call Us">
        <Phone className={styles.icon} strokeWidth={2.5} />
      </a>
      <a 
        href="https://api.whatsapp.com/send/?phone=353894881562&text=Hi&type=phone_number&app_absent=0" 
        target="_blank" 
        rel="noopener noreferrer" 
        className={`${styles.floatingBtn} ${styles.whatsappBtn}`}
        aria-label="WhatsApp Us"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={styles.icon} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
        </svg>
      </a>
    </div>
  );
}
