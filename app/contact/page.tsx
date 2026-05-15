'use client';

import styles from './contact.module.css';

export default function ContactPage() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className="container">
          <h1>Let's <span>Connect</span></h1>
          <p>Have a question or special request? We're here to help you plan your perfect journey across Ireland.</p>
        </div>
      </section>

      <div className={`container ${styles.content}`}>
        <div className={styles.grid}>
          {/* Contact Info Centered */}
          <div className={`${styles.card} ${styles.contactInfo}`} style={{ maxWidth: '600px', margin: '0 auto', gridColumn: '1 / -1' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Get in Touch</h2>
            <div className={styles.infoItems}>
              <div className={styles.infoItem}>
                <div className={styles.icon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                </div>
                <div>
                  <span className={styles.itemLabel}>Call or WhatsApp</span>
                  <a href="tel:+353876899968" className={styles.itemValue}>+353 876 899 968</a>
                </div>
              </div>

              <div className={styles.infoItem}>
                <div className={styles.icon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                </div>
                <div>
                  <span className={styles.itemLabel}>Email Us directly</span>
                  <a href="mailto:info@privatetransfer.ie" className={styles.itemValue}>info@privatetransfer.ie</a>
                </div>
              </div>

              <div className={styles.infoItem}>
                <div className={styles.icon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                </div>
                <div>
                  <span className={styles.itemLabel}>Based In</span>
                  <span className={styles.itemValue}>Dublin, Ireland</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
