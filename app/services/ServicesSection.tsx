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

const DEFAULT_SERVICES: ServiceItem[] = [
  {
    id: 11,
    heading: 'Airport Transfers',
    subHeading: 'Effortless Airport Travel',
    description: 'Direct, reliable private airport transfers to and from Dublin Airport and all destinations across Ireland with comfort, precision, and flight tracking.',
    imageUrl: 'https://res.cloudinary.com/dl1w0pw8g/image/upload/v1778863204/ovpfqlxqv1jainiikxev.jpg',
    service: 'services',
    passengers: 7,
    mainService: 'Airport'
  },
  {
    id: 10,
    heading: 'Hotel Transfers',
    subHeading: 'Seamless Arrivals',
    description: "Direct luxury transfers from Dublin Airport to Ireland's most prestigious hotels, boutique city stays, and historic castle estates.",
    imageUrl: 'https://res.cloudinary.com/dl1w0pw8g/image/upload/v1778127273/czq2sd2gan4gzcybz5km.jpg',
    service: 'services',
    passengers: 7,
    mainService: 'Hotel'
  },
  {
    id: 12,
    heading: 'Vacation Transfers',
    subHeading: 'Stress-Free Vacation Travel',
    description: 'Comfortable and reliable private transport to resorts, tourist destinations, and scenic holiday getaways across Ireland with customizable stops.',
    imageUrl: 'https://res.cloudinary.com/dl1w0pw8g/image/upload/v1778863889/z3aaezjz6qq201lxtke3.jpg',
    service: 'services',
    passengers: 7,
    mainService: 'Vacation'
  }
];

export default function ServicesSection({ initialServices = [], showMoreServicesLink = false }: ServicesSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [displayServices, setDisplayServices] = useState<ServiceItem[]>(
    initialServices && initialServices.length > 0 ? initialServices : DEFAULT_SERVICES
  );

  useEffect(() => {
    const fetchServices = async () => {
      // Check if we already have the data in this session
      const cachedStr = sessionStorage.getItem('servicesCache');
      if (cachedStr) {
        try {
          const cached = JSON.parse(cachedStr);
          if (cached && Array.isArray(cached.data) && cached.data.length > 0) {
            setDisplayServices(cached.data);
            return;
          }
        } catch (e) {
          // fallback
        }
      }

      try {
        const data = await ServicesSectionService.fetchServices();
        if (Array.isArray(data) && data.length > 0) {
          setDisplayServices(data);
          sessionStorage.setItem('servicesCache', JSON.stringify({ data }));
        }
      } catch (error) {
        console.error('Error fetching services on client:', error);
      }
    };
    
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

  // Ensure servicesList always has verified services
  const servicesList = displayServices && displayServices.length > 0 ? displayServices : DEFAULT_SERVICES;

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

  // Helper to format heading into plural clean title
  const getCleanHeading = (heading: string) => {
    const trimmed = (heading || '').trim();
    if (trimmed.toLowerCase() === 'airport transfer') return 'Airport Transfers';
    if (trimmed.toLowerCase() === 'hotel transfer') return 'Hotel Transfers';
    if (trimmed.toLowerCase() === 'vacation transfer') return 'Vacation Transfers';
    return trimmed;
  };

  return (
    <section className={styles.section} id="services-section">
      <div className="container">
        <div className={styles.header}>
          <div className={styles.headerText}>
            <p className={styles.eyebrow}>EXCLUSIVITY &amp; COMFORT</p>
            <div className={styles.title} role="heading" aria-level={2}>Bespoke Chauffeur Services Ireland</div>
          </div>
          <div className={styles.navArea}>
            {showMoreServicesLink && (
              <Link href="/services" className={styles.moreServicesLink}>
                More Services ↗
              </Link>
            )}
            <button className={styles.sliderBtn} onClick={() => scroll('left')} aria-label="Previous services">‹</button>
            <button className={styles.sliderBtn} onClick={() => scroll('right')} aria-label="Next services">›</button>
          </div>
        </div>

        <div className={styles.grid} ref={scrollRef}>
          {servicesList.map((s, idx) => {
            const cleanHeading = getCleanHeading(s.heading);
            const slug = (s.mainService ? s.mainService.trim() : cleanHeading).toLowerCase().replace(/\s+/g, '-');
            const cleanImgUrl = s.imageUrl ? s.imageUrl.replace('/uploadv', '/upload/v') : '/service_airport.png';

            return (
              <motion.div
                key={s.id || idx}
                className={styles.cardWrapper}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
              >
                <Link 
                  href={`/services/${slug}`} 
                  className={styles.card}
                >
                  <div className={styles.imgWrap}>
                    <Image 
                      src={cleanImgUrl}
                      alt={`${cleanHeading} - Luxury Chauffeur & Private Airport Transfers Ireland`} 
                      fill 
                      sizes="(max-width:768px) 100vw, 400px" 
                      className={styles.img} 
                      priority={idx < 2}
                    />
                    <div className={styles.imgOverlay}></div>
                  </div>
                  <div className={styles.cardBody}>
                    <span className={styles.cardIcon}>{getServiceIcon(cleanHeading)}</span>
                    <span className={styles.cardSubtitle}>{(s.subHeading || '').trim()}</span>
                    <h3>{cleanHeading}</h3>
                    <p>{s.description}</p>
                    
                    {s.passengers && s.passengers > 0 ? (
                      <div className={styles.cardMeta}>
                        <span className={styles.metaItem}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                          Capacity: Up to {s.passengers}
                        </span>
                      </div>
                    ) : null}

                    <div className={styles.learnMore}>Explore Service <span>→</span></div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
          
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
