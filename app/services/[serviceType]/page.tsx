'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import styles from './serviceType.module.css';

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
        const [servicesRes, fleetRes] = await Promise.all([
          fetch(`/api/images?service=services&t=${Date.now()}`, { cache: 'no-store' }),
          fetch(`/api/images?service=FLEET&t=${Date.now()}`, { cache: 'no-store' })
        ]);
        
        if (servicesRes.ok && fleetRes.ok) {
          const allServices: ServiceItem[] = await servicesRes.json();
          const allFleet: ServiceItem[] = await fleetRes.json();

          const matchingServices = allServices.filter(item => 
            item.mainService?.toLowerCase() === serviceType.toLowerCase() || 
            item.heading?.toLowerCase().replace(/ /g, '-') === serviceType.toLowerCase()
          );
          
          const content = matchingServices.length > 0 ? matchingServices[0] : null;
          const images = allFleet.filter(item => 
            item.mainService?.toLowerCase() === serviceType.toLowerCase()
          );

          setMainContent(content);
          setFleetImages(images);

          // Store in session cache
          sessionStorage.setItem(cacheKey, JSON.stringify({
            mainContent: content,
            fleetImages: images
          }));
        }
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
          
          {(mainContent.heading || '').toLowerCase().includes('hotel') && (
            <div style={{ marginTop: '2rem', textAlign: 'left', maxWidth: '800px', margin: '2rem auto 0' }}>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem', color: '#fff' }}>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <span style={{ color: 'var(--primary)', fontSize: '1.2rem' }}>✓</span>
                  <span style={{ fontSize: '1.1rem', fontWeight: 500 }}>Ireland's best luxury transfer service for premium hotels and historic castles.</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <span style={{ color: 'var(--primary)', fontSize: '1.2rem' }}>✓</span>
                  <span style={{ fontSize: '1.1rem', fontWeight: 500 }}>Seamless, stress-free travel straight from the airport to your vacation destination.</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <span style={{ color: 'var(--primary)', fontSize: '1.2rem' }}>✓</span>
                  <span style={{ fontSize: '1.1rem', fontWeight: 500 }}>VIP Meet &amp; Greet with professional, courteous chauffeurs.</span>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className={styles.gallerySection}>
        <div className="container">
          <h2>Select Your Vehicle</h2>
          
          {fleetImages.length > 0 ? (
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
          ) : (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Gallery images are being updated for this service.</p>
          )}
          
          <div style={{ textAlign: 'center', marginTop: '4rem' }}>
            <Link href="/contact" className="btn-primary">Book This Service</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
