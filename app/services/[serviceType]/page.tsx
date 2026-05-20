'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import styles from './serviceType.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import { ServiceTypeService } from './ServiceTypeService';
import { 
  Castle, Sparkles, UserCheck, Clock, Car, 
  PlaneLanding, Timer, Luggage, Route, 
  Camera, Map, Leaf, Utensils,
  Star, ShieldCheck, Calendar
} from 'lucide-react';

interface ServiceItem {
  id: number | string;
  heading: string;
  subHeading: string;
  description: string;
  imageUrl: string;
  mainService: string;
}
const container = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.1,
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};

export default function ServiceDetailsPage() {
  const params = useParams();
  const serviceType = typeof params?.serviceType === 'string' ? params.serviceType : '';
  
  const [mainContent, setMainContent] = useState<ServiceItem | null>(null);
  const [fleetImages, setFleetImages] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!serviceType) return;

    const fetchData = async () => {
      // Check session cache
      const cacheKey = `serviceDetails_${serviceType}`;
      const cachedStr = sessionStorage.getItem(cacheKey);
      
      if (cachedStr) {
        const cached = JSON.parse(cachedStr);
        setMainContent(cached.mainContent);
        setFleetImages(cached.fleetImages);
        setLoading(false);
        return;
      }

      try {
        const { mainContent: content, fleetImages: images } = await ServiceTypeService.fetchServiceDetails(serviceType);

        setMainContent(content);
        setFleetImages(images);

        // Store in session cache
        sessionStorage.setItem(cacheKey, JSON.stringify({
          mainContent: content,
          fleetImages: images
        }));
      } catch (error) {
        console.error('Failed to fetch service details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [serviceType]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '180px 0 100px', textAlign: 'center', minHeight: '60vh' }}>
        <motion.div 
          animate={{ opacity: [0.4, 0.8, 0.4] }} 
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          style={{ width: '60%', height: '40px', background: 'rgba(0,0,0,0.05)', margin: '0 auto', borderRadius: '8px' }}
        />
        <motion.div 
          animate={{ opacity: [0.4, 0.8, 0.4] }} 
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: 0.2 }}
          style={{ width: '40%', height: '20px', background: 'rgba(0,0,0,0.05)', margin: '20px auto 0', borderRadius: '4px' }}
        />
      </div>
    );
  }

  if (!mainContent) {
    return (
      <div className="container" style={{ padding: '180px 0 100px', textAlign: 'center', minHeight: '60vh' }}>
        <h1 style={{ fontSize: '3rem', color: 'var(--secondary)', marginBottom: '1rem' }}>Service Unavailable</h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>We are currently updating our fleet and service details for this category.</p>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{ display: 'inline-block', marginTop: '2rem' }}>
          <Link href="/services" className="btn-primary">Back to Services</Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <motion.div 
        className={styles.heroBanner}
        variants={item}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="container">
          <p className={styles.eyebrow}>{mainContent.subHeading}</p>
          <h1>{(mainContent.heading || '').trim()}</h1>
          <p className={styles.description}>{mainContent.description}</p>
        </div>
      </motion.div>

      <motion.div 
        className={styles.gallerySection}
        style={{ paddingTop: fleetImages.length > 0 ? '100px' : '20px', paddingBottom: '60px' }}
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="container">
          {fleetImages.length > 0 ? (
            <>
              <h2>Our Vehicles</h2>
              <motion.div className={styles.galleryGrid} variants={container}>
                {fleetImages.map((item, idx) => (
                  <motion.div 
                    key={item.id || idx} 
                    className={styles.galleryItem}
                    variants={item}
                    whileHover={{ y: -6, boxShadow: '0 12px 30px rgba(0,0,0,0.1)' }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <Image 
                      src={item.imageUrl} 
                      alt={`${item.heading || 'Fleet Vehicle'} option ${idx + 1}`} 
                      fill 
                      sizes="(max-width: 768px) 100vw, 350px"
                      className={styles.image} 
                    />
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '15px', background: 'linear-gradient(to top, rgba(15,23,42,0.8), transparent)', color: 'white', fontWeight: 'bold' }}>
                      {item.heading}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </>
          ) : null}
          
          {(() => {
            const heading = (mainContent.heading || '').toLowerCase();
            let points: {icon: React.ReactNode, title: string, desc: string}[] = [];
            
            if (heading.includes('hotel')) {
              points = [
                { icon: <Castle />, title: 'Hotel Transfers', desc: "Reliable transport to hotels and historic locations across Ireland." },
                { icon: <Sparkles />, title: 'Seamless Travel', desc: 'Stress-free journey straight to your vacation destination.' },
                { icon: <UserCheck />, title: 'Friendly Service', desc: 'Meet & Greet with professional, courteous drivers.' },
                { icon: <Clock />, title: 'Punctual Arrivals', desc: 'We value your time, ensuring prompt pick-ups and drop-offs.' },
                { icon: <Car />, title: 'Private & Secure', desc: 'Enjoy a quiet, comfortable ride to your accommodation.' }
              ];
            } else if (heading.includes('airport')) {
              points = [
                { icon: <PlaneLanding />, title: 'Reliable Pick-ups', desc: 'We ensure your chauffeur is there on time, every time.' },
                { icon: <Timer />, title: 'Zero Waiting', desc: 'Your chauffeur will be ready at arrivals, holding a personalized sign.' },
                { icon: <Luggage />, title: 'Luggage Assistance', desc: 'Relax after your flight while we handle your heavy bags.' },
                { icon: <Route />, title: 'Direct Transfers', desc: 'Smooth, direct journeys from the airport to your destination.' },
                { icon: <Sparkles />, title: 'Comfortable Ride', desc: 'Relax and enjoy a peaceful journey after a long flight.' }
              ];
            } else if (heading.includes('vacation') || heading.includes('tour') || heading.includes('scenic')) {
              points = [
                { icon: <Camera />, title: 'Scenic Routes', desc: 'Discover hidden gems and breathtaking landscapes along the way.' },
                { icon: <Map />, title: 'Custom Itineraries', desc: 'Tailor your journey with flexible stops and personalized scheduling.' },
                { icon: <Leaf />, title: 'Local Expertise', desc: 'Travel with knowledgeable chauffeurs who know the best of Ireland.' },
                { icon: <Utensils />, title: 'Dining Recommendations', desc: 'Get insider tips on the best local restaurants and authentic pubs.' },
                { icon: <Timer />, title: 'Unrushed Experience', desc: 'Take your time at each location; we adapt entirely to your pace.' }
              ];
            } else {
              points = [
                { icon: <Car />, title: 'Clean Fleet', desc: 'Travel in our impeccably maintained and comfortable vehicles.' },
                { icon: <Star />, title: 'Friendly Service', desc: 'Experience a high standard of professional chauffeuring.' },
                { icon: <ShieldCheck />, title: 'Safe & Secure', desc: 'Your safety and comfort are our top priorities on every journey.' },
                { icon: <UserCheck />, title: 'Expert Drivers', desc: 'Fully licensed, vetted, and highly experienced chauffeurs.' },
                { icon: <Calendar />, title: '24/7 Availability', desc: 'Round-the-clock service to accommodate any travel schedule.' }
              ];
            }

            if (points.length === 0) return null;
            
            return (
              <motion.div 
                style={{ marginTop: fleetImages.length > 0 ? '6rem' : '0' }}
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
              >
                <h2>Our Features</h2>
                <motion.div className={styles.stylishPointsGrid} variants={container}>
                  {points.map((pt, i) => (
                    <motion.div 
                      key={i} 
                      className={styles.stylishPointCard}
                      variants={item}
                      whileHover={{ y: -6, boxShadow: '0 12px 30px rgba(0,0,0,0.08)' }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <div className={styles.spIcon}>{pt.icon}</div>
                      <div className={styles.spContent}>
                        <h4>{pt.title}</h4>
                        <p>{pt.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            );
          })()}
        </div>
      </motion.div>
    </div>
  );
}
