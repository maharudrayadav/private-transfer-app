import type { Metadata } from 'next';
import styles from '../privacy-policy/legal.module.css';

export const metadata: Metadata = {
  title: 'FAQ | Private Transfer Ireland',
  description: 'Frequently asked questions about our private chauffeur and transfer services.',
};

export default function FAQPage() {
  const faqs = [
    {
      q: "How do I book a transfer?",
      a: "You can book directly through our website booking form or by calling us at +353 876 899 968."
    },
    {
      q: "What happens if my flight is delayed?",
      a: "We monitor all flights in real-time. Your driver will adjust the pickup time accordingly at no extra cost."
    },
    {
      q: "Do you provide child seats?",
      a: "Yes, we can provide child seats upon request. Please specify the age of the child when booking."
    },
    {
      q: "What is your cancellation policy?",
      a: "Free cancellation is available up to 24 hours before your scheduled pickup."
    }
  ];

  return (
    <div className={styles.page}>
      <div className={styles.banner}>
        <div className="container">
          <h1>Frequently Asked <span>Questions</span></h1>
        </div>
      </div>

      <div className="container">
        <div className={styles.content}>
          {faqs.map((faq, idx) => (
            <section key={idx} className={styles.section} style={{ marginBottom: '3rem' }}>
              <h2 style={{ fontSize: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                {faq.q}
              </h2>
              <p style={{ marginTop: '1rem' }}>{faq.a}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
