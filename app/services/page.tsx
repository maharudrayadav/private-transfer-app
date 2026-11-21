import type { Metadata } from 'next';
import ServicesSection from './ServicesSection';
import styles from './services.module.css';

export const metadata: Metadata = {
  title: 'Chauffeur & Transfer Services Ireland | Airport & Hotel Travel',
  description: 'Explore bespoke chauffeur services across Ireland: Dublin Airport transfers, luxury hotel and castle transfers, corporate travel, vacation tours, and golf transfers.',
  alternates: {
    canonical: 'https://www.privatetransfers.ie/services',
  },
};

export default async function ServicesPage() {
  return (
    <div className={styles.page}>
      {/* Page Hero Banner */}
      <div className={styles.banner}>
        <div className="container">
          <h1>Our <span>Services</span></h1>
          <p>Premium chauffeur services tailored to every journey across Ireland</p>
        </div>
      </div>

      {/* All Services */}
      <ServicesSection />

      {/* CTA Strip */}
      <div className={styles.cta}>
        <div className="container">
          <h2>Ready to Book?</h2>
          <p>Contact us today for a personalised quote with no hidden fees.</p>
          <a href="/contact" className="btn-primary">Get a Quote</a>
        </div>
      </div>
    </div>
  );
}
