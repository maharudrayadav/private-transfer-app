import styles from './Features.module.css';

const features = [
  { icon: '🛡️', title: 'Safety First',           desc: 'Travel with fully licensed and insured professional drivers, ensuring the highest safety standards.' },
  { icon: '💶', title: 'Transparent Pricing',     desc: 'No hidden fees, no surprises. Enjoy fixed and competitive rates for premium transportation across Ireland.' },
  { icon: '🚘', title: 'Luxury & Comfort',         desc: 'Travel in style with our fleet of luxury sedans and spacious MPVs, tailored to your comfort.' },
];

export default function Features() {
  return (
    <section className={styles.section}>
      <div className="container">
        <h2 className={`section-title ${styles.center}`}>Experience Travel Tailored Just for You</h2>
        <div className={styles.grid}>
          {features.map((f, i) => (
            <div key={i} className={styles.card}>
              <div className={styles.icon}>{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
