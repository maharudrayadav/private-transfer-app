'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from './Gallery.module.css';

interface GalleryItem {
  id: number;
  imageUrl: string;
  heading?: string;
  description?: string;
}

export default function Gallery() {
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await fetch('https://private-transfer-app-nine.vercel.app/api/images?service=gallery');
        if (res.ok) {
          const data = await res.json();
          setImages(data);
        }
      } catch (error) {
        console.error('Error fetching gallery:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchGallery();
  }, []);

  if (loading) {
    return (
      <section className={styles.section}>
        <div className="container">
          <div className={styles.headerArea}>
            <h2 className={styles.title}>Our <span>Gallery</span></h2>
          </div>
          <div className={styles.loading}>Loading gallery...</div>
        </div>
      </section>
    );
  }

  if (images.length === 0) {
    return null; // Do not show if no images
  }

  return (
    <section className={styles.section} id="gallery">
      <div className="container">
        <div className={styles.headerArea}>
          <p className={styles.eyebrow}>EXPERIENCE THE LUXURY</p>
          <h2 className={styles.title}>Explore Our <span>Gallery</span></h2>
          <p className={styles.subtitle}>
            Get a glimpse of the exceptional service we provide. From private transfers and business travel to scenic day trips across Ireland, our professional chauffeurs ensure a seamless and comfortable experience.
          </p>
        </div>
        
        <div className={styles.grid}>
          {images.map((img, idx) => (
            <div key={img.id || idx} className={styles.imageCard}>
              <div className={styles.imageWrap}>
                <Image
                  src={img.imageUrl}
                  alt={img.heading || 'Gallery Image'}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className={styles.image}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
