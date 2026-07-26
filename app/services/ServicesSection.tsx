'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Building, Plane, Heart, Map, Briefcase, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

import styles from './ServicesSection.module.css';
import { ServicesSectionService } from './ServicesSectionService';

interface ServiceItem {
  id: number | string;
  heading: string;
  subHeading: string;
  description: string;
  imageUrl: string;
  service: string;
  passengers?: number;
  mainService?: string;
}

interface ServicesSectionProps {
  initialServices?: ServiceItem[];
  showMoreServicesLink?: boolean;
}

export default function ServicesSection({ initialServices = [], showMoreServicesLink = false }: ServicesSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [displayServices, setDisplayServices] = useState<ServiceItem[]>(initialServices);

  useEffect(() => {
    const fetchServices = async () => {
      // Check if we already have the data in this session
      const cachedStr = sessionStorage.getItem('servicesCache');
      if (cachedStr) {
        const cached = JSON.parse(cachedStr);
        setDisplayServices(cached.data);
        return; // Use session cache on refresh
      }

      try {
        const data = await ServicesSectionService.fetchServices();
        setDisplayServices(data);
        // Store data for the current session (persists on refresh)
        sessionStorage.setItem('servicesCache', JSON.stringify({
          data: data
        }));
      } catch (error) {
        console.error('Error fetching services on client:', error);
      }
    };
    
    // Only fetch if initialServices wasn't provided or we want to ensure fresh data
    fetchServices();
  }, []);

  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: dir === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Final list of services to show
  const servicesList = displayServices;

  const getServiceIcon = (title: string) => {
    const t = title.toLowerCase();
    const size = 20;
    if (t.includes('hotel')) return <Building size={size} />;
    if (t.includes('airport')) return <Plane size={size} />;
    if (t.includes('wedding')) return <Heart size={size} />;
    if (t.includes('tour') || t.includes('scenic')) return <Map size={size} />;
    if (t.includes('business') || t.includes('executive')) return <Briefcase size={size} />;
    return <Sparkles size={size} />;
  };

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <div className={styles.headerText}>
            <p className={styles.eyebrow}>EXCLUSIVITY & COMFORT</p>
            <h2 className={styles.title}>Bespoke Chauffeur Services</h2>
          </div>
          <div className={styles.navArea}>
            {showMoreServicesLink && (
              <Link href="/services" className={styles.moreServicesLink}>
                More Services ↗
              </Link>
            )}
            <button className={styles.sliderBtn} onClick={() => scroll('left')}>‹</button>
            <button className={styles.sliderBtn} onClick={() => scroll('right')}>›</button>
          </div>
        </div>

        <div className={styles.grid} ref={scrollRef}>
          {servicesList.length > 0 ? (
            servicesList.map((s, idx) => (
              <motion.div
                key={s.id || idx}
                className={styles.cardWrapper}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
              >
                {(() => {
                  const rawHeading = (s.heading || '').trim();
                  const slug = (s.mainService ? s.mainService.trim() : rawHeading).toLowerCase().replace(/\s+/g, '-');
                  return (
                    <Link 
                      href={`/services/${slug}`} 
                      className={styles.card}
                    >
                      <div className={styles.imgWrap}>
                        <Image 
                          src={s.imageUrl ? s.imageUrl.replace('/uploadv', '/upload/v') : '/placeholder_service.png'}
                      alt={s.heading || 'Service Image'} 
                      fill 
                      sizes="(max-width:768px) 100vw, 400px" 
                      className={styles.img} 
                      priority={idx < 2}
                    />
                    <div className={styles.imgOverlay}></div>
                  </div>
                  <div className={styles.cardBody}>
                    <span className={styles.cardIcon}>{getServiceIcon(s.heading || '')}</span>
                    <span className={styles.cardSubtitle}>{(s.subHeading || '').trim()}</span>
                    <h3>{(s.heading || '').trim()}</h3>
                    <p>{s.description}</p>
                    
                    {s.passengers && s.passengers > 0 ? (
                      <div className={styles.cardMeta}>
                        <span className={styles.metaItem}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                          Capacity: {s.passengers}
                        </span>
                      </div>
                    ) : null}

                    <div className={styles.learnMore}>Explore Service <span>→</span></div>
                  </div>
                </Link>
                  );
                })()}
              </motion.div>
            ))
          ) : (
            <div className={styles.noData}>
              <p>Services are currently being updated. Please check back soon or contact us directly.</p>
            </div>
          )}
          
          {/* Uniform CTA Card */}
          <motion.div 
            className={styles.cardWrapper}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: servicesList.length * 0.15 }}
          >
            <div className={styles.ctaCard}>
              <div className={styles.ctaContent}>
                <h3>Custom Journey?</h3>
                <p>Specializing in bespoke itineraries across Ireland.</p>
                <Link href="/contact" className="btn-primary">Enquire Now</Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
