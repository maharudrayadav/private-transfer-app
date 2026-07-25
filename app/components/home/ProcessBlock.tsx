'use client';

import { motion } from 'framer-motion';
import styles from './ProcessBlock.module.css';

const steps = [
  {
    num: '1',
    title: 'Request your quote',
    desc: 'Send your journey details, pickup location, destination, date, time and any special requirements.'
  },
  {
    num: '2',
    title: 'Confirm availability',
    desc: 'We check the route, vehicle availability and requirements before confirming the private transfer.'
  },
  {
    num: '3',
    title: 'Receive a fixed price',
    desc: 'You receive a clear fixed fare before travelling, with no hidden fees or unexpected extras.'
  },
  {
    num: '4',
    title: 'Meet your chauffeur',
    desc: 'Your professional driver meets you at the agreed location and takes care of the journey.'
  }
];

export default function ProcessBlock() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <motion.div 
          className={styles.header}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className={styles.title}>Private transfers arranged clearly<br />from start to finish</h2>
          <p className={styles.subtitle}>
            From the first enquiry to your arrival, every journey is handled with a clear process, professional communication and a confirmed private chauffeur service.
          </p>
        </motion.div>
        
        <div className={styles.grid}>
          {steps.map((step, idx) => (
            <motion.div 
              key={idx} 
              className={styles.card}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
            >
              <div className={styles.stepNumber}>{step.num}</div>
              <h3 className={styles.cardTitle}>{step.title}</h3>
              <p className={styles.cardDesc}>{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
