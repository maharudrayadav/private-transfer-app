'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import styles from './Vehicles.module.css';

interface FleetItem {
  id: number;
  heading: string;
  imageUrl: string;
  service: string;
  passengers?: number | null;
  bags?: number | null;
  price?: number | null;
}

interface VehiclesProps {
  initialFleet?: FleetItem[];
}

import { useRouter } from 'next/navigation';

export default function Vehicles({ initialFleet = [] }: VehiclesProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isBookingPage = pathname === '/booking';
  const [fleetData, setFleetData] = useState<FleetItem[]>(initialFleet);
  const [searchDetails, setSearchDetails] = useState<any>(null);

  const handleSelectVehicle = (vehicle: FleetItem) => {
    router.push('/booking');
  };

  useEffect(() => {
    const updateSearch = () => {
      if (!isBookingPage) {
        setSearchDetails(null);
        return;
      }
      const stored = sessionStorage.getItem('lastSearch');
      if (stored) {
        setSearchDetails(JSON.parse(stored));
      }
    };

    updateSearch();
    window.addEventListener('searchUpdated', updateSearch);
    return () => window.removeEventListener('searchUpdated', updateSearch);
  }, [isBookingPage]);

  useEffect(() => {
    const fetchFleet = async () => {
      // Check if we already have the data in this session
      const cachedStr = sessionStorage.getItem('fleetCache');
      if (cachedStr) {
        const cached = JSON.parse(cachedStr);
        setFleetData(cached.data);
        return; // Use session cache on refresh
      }

      try {
        const res = await fetch(`/api/images?service=FLEET&t=${Date.now()}`, {
          cache: 'no-store'
        });
        if (res.ok) {
          const data = await res.json();
          setFleetData(data);
          // Store data for the current session (persists on refresh)
          sessionStorage.setItem('fleetCache', JSON.stringify({
            data: data
          }));
        }
      } catch (error) {
        console.error('Error fetching fleet on client:', error);
      }
    };
    
    fetchFleet();
  }, []);

  // Helper to determine capacity/luggage based on vehicle name
  const getVehicleDetails = (name: string) => {
    if (name.toLowerCase().includes('v-class') || name.toLowerCase().includes('mpv') || name.toLowerCase().includes('van')) {
      return { type: 'Luxury MPV', capacity: '7 Passengers', luggage: '6 Large Bags' };
    }
    return { type: 'Executive Sedan', capacity: '3 Passengers', luggage: '2 Large Bags' };
  };

  return (
    <section className={styles.section} id="fleet-selection">
      <div className="container">
        {searchDetails && (
          <div className={styles.searchSummary}>
            <div className={styles.summaryItem}>
              <span>FROM</span>
              <strong>{searchDetails.pickup}</strong>
            </div>
            <div className={styles.summaryItem}>
              <span>TO</span>
              <strong>{searchDetails.dropoff}</strong>
            </div>
            <div className={styles.summaryItem}>
              <span>DATE</span>
              <strong>{searchDetails.date || 'ASAP'}</strong>
            </div>
            <div className={styles.summaryItem}>
              <span>TIME</span>
              <strong>{searchDetails.time || '--:--'}</strong>
            </div>
          </div>
        )}

        <div className={styles.headerArea}>
          <p className={styles.eyebrow}>{searchDetails ? 'STEP 2: SELECT VEHICLE' : 'EXECUTIVE FLEET'}</p>
          <h2 className={styles.title}>
            {searchDetails ? 'Select Your ' : 'Our Luxury '}
            <span>{searchDetails ? 'Chauffeur' : 'Fleet'}</span>
          </h2>
          {!searchDetails && (
            <p className={styles.subtitle}>
              Every vehicle in our meticulously maintained fleet is chosen for its comfort, 
              safety, and presence on the road.
            </p>
          )}
        </div>
        
        <div className={styles.grid}>
          {fleetData.length > 0 ? (
            fleetData.map((v) => {
              const details = getVehicleDetails(v.heading);
              const displayPassengers = v.passengers ?? details.capacity;
              const displayBags = v.bags ?? details.luggage;

              return (
                <div key={v.id} className={styles.card}>
                  <div className={styles.imageWrap}>
                    <Image
                      src={v.imageUrl}
                      alt={v.heading}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className={styles.image}
                    />
                    <div className={styles.overlay}>
                      <button 
                        className={styles.hoverBookBtn}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectVehicle(v);
                        }}
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                  <div className={styles.content}>
                    <h3>{v.heading}</h3>
                    <div className={styles.features}>
                      <div className={styles.feature}>
                        <span>👥</span>
                        <p>{typeof displayPassengers === 'number' ? `${displayPassengers} Passengers` : displayPassengers}</p>
                      </div>
                      <div className={styles.feature}>
                        <span>🧳</span>
                        <p>{typeof displayBags === 'number' ? `${displayBags} Large Bags` : displayBags}</p>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className={styles.noData}>
              <p>Fleet currently unavailable. Please contact us for bookings.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
