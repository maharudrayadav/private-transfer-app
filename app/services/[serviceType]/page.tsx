'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import styles from './serviceType.module.css';
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
        <p style={{ color: 'var(--primary)', fontSize: '1.2rem' }}>Loading service details...</p>
      </div>
    );
  }

  if (!mainContent) {
    return (
      <div className="container" style={{ padding: '180px 0 100px', textAlign: 'center', minHeight: '60vh' }}>
        <h1 style={{ fontSize: '3rem', color: 'var(--secondary)', marginBottom: '1rem' }}>Service Unavailable</h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>We are currently updating our fleet and service details for this category.</p>
        <Link href="/services" className="btn-primary" style={{ marginTop: '2rem' }}>Back to Services</Link>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.heroBanner}>
        <div className="container">
          <p className={styles.eyebrow}>{mainContent.subHeading}</p>
          <h1>{(mainContent.heading || '').trim()}</h1>
          <p className={styles.description}>{mainContent.description}</p>
        </div>
      </div>

      <div 
        className={styles.gallerySection}
        style={{ paddingTop: fleetImages.length > 0 ? '100px' : '20px', paddingBottom: '60px' }}
      >
        <div className="container">
          {fleetImages.length > 0 ? (
            <>
              <h2>Our Vehicles</h2>
              <div className={styles.galleryGrid}>
                {fleetImages.map((item, idx) => (
                  <div key={item.id || idx} className={styles.galleryItem}>
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
                  </div>
                ))}
              </div>
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
              <div style={{ marginTop: fleetImages.length > 0 ? '6rem' : '0' }}>
                <h2>Our Features</h2>
                <div className={styles.stylishPointsGrid}>
                  {points.map((pt, i) => (
                    <div key={i} className={styles.stylishPointCard}>
                      <div className={styles.spIcon}>{pt.icon}</div>
                      <div className={styles.spContent}>
                        <h4>{pt.title}</h4>
                        <p>{pt.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
