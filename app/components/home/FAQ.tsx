'use client';

import { useState } from 'react';
import styles from './FAQ.module.css';

const faqs = [
  {
    q: 'How do I book an airport transfer?',
    a: 'Simply enter your pickup and drop-off locations, choose your vehicle, and complete your booking online.',
  },
  {
    q: 'What happens if my flight is delayed?',
    a: 'If you provide your flight number, we monitor your flight and adjust the pickup time whenever possible.',
  },
  {
    q: 'Where will I meet my driver?',
    a: 'Your driver will meet you at the designated airport pickup point. Meeting instructions will be included in your booking confirmation.',
  },
  {
    q: 'How much luggage can I bring?',
    a: 'Each vehicle has a luggage capacity. If you have extra or oversized luggage, please let us know when making your booking.',
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.inner}>
          <div className={styles.left}>
            <p className={styles.eyebrow}>FAQs</p>
            <h2 className={styles.heading}>Frequently Asked Questions</h2>
            <p className={styles.sub}>
              Everything you need to know before your journey. Can't find an answer?{' '}
              <a href="/contact">Get in touch.</a>
            </p>
          </div>

          <div className={styles.right}>
            {faqs.map((item, i) => (
              <div
                key={i}
                className={`${styles.item} ${open === i ? styles.itemOpen : ''}`}
              >
                <button
                  className={styles.question}
                  onClick={() => setOpen(open === i ? null : i)}
                  aria-expanded={open === i}
                >
                  <span>{item.q}</span>
                  <span className={`${styles.icon} ${open === i ? styles.iconOpen : ''}`}>
                    +
                  </span>
                </button>
                <div className={styles.answerWrap} style={{ maxHeight: open === i ? '200px' : '0' }}>
                  <p className={styles.answer}>{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
