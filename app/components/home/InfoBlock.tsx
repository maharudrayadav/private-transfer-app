import { CheckCircle } from 'lucide-react';
import styles from './InfoBlock.module.css';

export default function InfoBlock() {
  return (
    <section className={styles.section}>
      <div className={`container ${styles.content}`}>
        <h2 className={styles.mainTitle}>Private Chauffeur Transfers Across Ireland</h2>
        <p className={styles.mainSubtitle}>
          Whether you're arriving at Dublin Airport, travelling for business, attending an event or heading to a hotel, VIPtransfer.ie offers private chauffeur service tailored to your journey.
        </p>

        <div className={styles.glassCard}>
          <h3 className={styles.cardTitle}>Why Choose Our Chauffeur Service in Ireland?</h3>
          <p className={styles.cardDesc}>
            Our professional chauffeurs, premium fleet and friendly service make private travel comfortable, punctual and easy to arrange.
          </p>
          <ul className={styles.list}>
            <li>
              <CheckCircle className={styles.icon} strokeWidth={1.5} />
              <span>Private airport transfers and long-distance chauffeur journeys</span>
            </li>
            <li>
              <CheckCircle className={styles.icon} strokeWidth={1.5} />
              <span>Business travel, hotels and event transport</span>
            </li>
            <li>
              <CheckCircle className={styles.icon} strokeWidth={1.5} />
              <span>Premium vehicles, discreet service and clear booking details</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
