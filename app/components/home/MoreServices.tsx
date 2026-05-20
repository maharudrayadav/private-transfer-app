'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Briefcase, Map, Users, GlassWater } from 'lucide-react';
import styles from './MoreServices.module.css';

const services = [
  {
    id: 1,
    title: 'Corporate Travel',
    description: 'Executive transport solutions for corporate events, roadshows, and business meetings with complete discretion.',
    icon: <Briefcase size={32} strokeWidth={1.5} />,
    link: '/services/corporate',
  },
  {
    id: 2,
    title: 'Golf Tours',
    description: 'Bespoke transport to Ireland’s world-renowned golf courses, featuring vehicles with ample space for clubs and luggage.',
    icon: <Map size={32} strokeWidth={1.5} />,
    link: '/services/golf',
  },
  {
    id: 3,
    title: 'Wedding Transport',
    description: 'Elegant and punctual chauffeur services to ensure the transportation on your special day is completely flawless.',
    icon: <Users size={32} strokeWidth={1.5} />,
    link: '/services/wedding',
  },
  {
    id: 4,
    title: 'Special Events',
    description: 'Arrive in style at galas, sporting events, or private parties. Our chauffeurs guarantee a memorable entrance.',
    icon: <GlassWater size={32} strokeWidth={1.5} />,
    link: '/services/events',
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      type: 'spring',
      stiffness: 70,
      damping: 15,
      duration: 0.6 
    } 
  }
};

export default function MoreServices() {
  return (
    <section className={styles.section}>
      <div className="container">
        <motion.div 
          className={styles.header}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className={styles.eyebrow}>Tailored Experiences</span>
          <h2 className={styles.title}>More Services</h2>
        </motion.div>

        <motion.div 
          className={styles.grid}
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {services.map((service) => (
            <Link href={service.link} key={service.id} passHref legacyBehavior>
              <motion.a 
                className={styles.card}
                variants={itemVariants}
                whileHover={{ 
                  y: -8, 
                  boxShadow: '0 12px 30px rgba(0,0,0,0.06)',
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <div className={styles.iconWrapper}>
                  {service.icon}
                </div>
                <h3 className={styles.cardTitle}>{service.title}</h3>
                <p className={styles.cardDescription}>{service.description}</p>
                
                <div className={styles.learnMore}>
                  Discover <span>→</span>
                </div>
              </motion.a>
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
