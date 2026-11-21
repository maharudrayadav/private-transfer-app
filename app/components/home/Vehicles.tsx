'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import styles from './Vehicles.module.css';
import { Users, Luggage } from 'lucide-react';
import { VehiclesService } from './VehiclesService';

interface FleetItem {
  id: number;
  heading: string;
  imageUrl: string;
  service: string;
  passengers?: number | null;
  bags?: number | null;
  price?: number | null;
  languagePrice?: number | null;
  description?: string | null;
  subHeading?: string | null;
}

interface VehiclesProps {
  initialFleet?: FleetItem[];
}

const DEFAULT_FLEET: FleetItem[] = [
  {
    id: 23,
    heading: 'Mercedes-Benz E-Class',
    subHeading: 'Executive Sedan',
    service: 'FLEET',
    price: 2.9,
    imageUrl: 'https://res.cloudinary.com/dl1w0pw8g/image/upload/v1778874175/txbaw2aj5yxgmwf1c3g8.jpg',
    description: 'Executive chauffeur sedan for business travel and private airport transfers.',
    passengers: 3,
    bags: 3
  },
  {
    id: 3,
    heading: 'Mercedes-Benz V-Class',
    subHeading: 'Luxury MPV',
    service: 'FLEET',
    price: 2.9,
    imageUrl: 'https://res.cloudinary.com/dl1w0pw8g/image/upload/v1778038037/rp8x3d92rp3v6mayyjd2.jpg',
    description: 'Spacious luxury MPV perfect for families, executive groups, and airport luggage.',
    passengers: 7,
    bags: 7
  },
  {
    id: 6,
    heading: 'Mercedes-Benz Sprinter',
    subHeading: 'Executive Minibus',
    service: 'FLEET',
    price: 1250.0,
    imageUrl: 'https://res.cloudinary.com/dl1w0pw8g/image/upload/v1778086164/rthqlxuvm50n68gzxpcm.jpg',
    description: 'Luxury touring minibus for larger groups, corporate events, and Ireland sightseeing.',
    passengers: 16,
    bags: 16
  }
];

import { useRouter } from 'next/navigation';

export default function Vehicles({ initialFleet = [] }: VehiclesProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isBookingPage = pathname === '/booking';
  const [fleetData, setFleetData] = useState<FleetItem[]>(
    initialFleet && initialFleet.length > 0 ? initialFleet : DEFAULT_FLEET
  );
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
      const cachedStr = sessionStorage.getItem('fleetCache');
      let useCache = false;
      if (cachedStr) {
        try {
          const cached = JSON.parse(cachedStr);
          if (cached && Array.isArray(cached.data) && cached.data.length > 0 && Date.now() - cached.timestamp < 120000) {
            setFleetData(cached.data);
            useCache = true;
          }
        } catch (e) {
          // fallback to fetch
        }
      }

      if (!useCache) {
        try {
          const data = await VehiclesService.fetchFleet();
          if (Array.isArray(data) && data.length > 0) {
            setFleetData(data);
            sessionStorage.setItem('fleetCache', JSON.stringify({ data, timestamp: Date.now() }));
          }
        } catch (error) {
          console.error('Error fetching fleet on client:', error);
        }
      }
    };
    
    fetchFleet();
  }, []);

  // Helper to determine capacity/luggage based on vehicle name
  const getVehicleDetails = (name: string) => {
    if (name.toLowerCase().includes('v-class') || name.toLowerCase().includes('mpv') || name.toLowerCase().includes('van')) {
      return { type: 'Luxury MPV', capacity: '7 Passengers', luggage: '6 Large Bags' };
    }
    if (name.toLowerCase().includes('sprinter') || name.toLowerCase().includes('minibus')) {
      return { type: 'Executive Minibus', capacity: '16 Passengers', luggage: '16 Large Bags' };
    }
    return { type: 'Executive Sedan', capacity: '3 Passengers', luggage: '2 Large Bags' };
  };

  const vehiclesToShow = fleetData && fleetData.length > 0 ? fleetData : DEFAULT_FLEET;

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
            {searchDetails ? 'Select Your Chauffeur' : 'Our Luxury Fleet'}
          </h2>
          {!searchDetails && (
            <p className={styles.subtitle}>
              Every vehicle in our meticulously maintained fleet is chosen for its comfort, 
              safety, and presence on the road.
            </p>
          )}
        </div>
        
        <div className={styles.grid}>
          {vehiclesToShow.map((v) => {
            const details = getVehicleDetails(v.heading);
            const displayPassengers = v.passengers ?? details.capacity;
            const displayBags = v.bags ?? details.luggage;
            const cleanImgUrl = v.imageUrl ? v.imageUrl.replace('/uploadv', '/upload/v') : '/vehicle_sedan.png';

            return (
              <div key={v.id} className={styles.card}>
                <div className={styles.imageWrap}>
                  <Image
                    src={cleanImgUrl}
                    alt={`${v.heading} - Luxury Chauffeur Fleet & Airport Transfers Ireland`}
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
                      <Users size={18} />
                      <p>{typeof displayPassengers === 'number' ? `${displayPassengers} Passengers` : displayPassengers}</p>
                    </div>
                    <div className={styles.feature}>
                      <Luggage size={18} />
                      <p>{typeof displayBags === 'number' ? `${displayBags} Large Bags` : displayBags}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
