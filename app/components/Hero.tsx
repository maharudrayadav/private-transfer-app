'use client';

import Link from 'next/link';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Hero.module.css';
import LocationAutocomplete from './LocationAutocomplete';

export default function Hero() {
  const router = useRouter();
  const [dateDisplay, setDateDisplay] = useState('');
  const dateInputRef = useRef<HTMLInputElement>(null);
  const timeInputRef = useRef<HTMLInputElement>(null);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value; // YYYY-MM-DD
    if (!val) {
      setDateDisplay('');
      return;
    }
    const [y, m, d] = val.split('-');
    setDateDisplay(`${d} / ${m} / ${y}`);
  };

  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');

  const handleSearch = () => {
    if (!pickup || !dropoff) {
      alert('Please enter pickup and dropoff locations');
      return;
    }
    
    // Store search details for the results section
    const searchParams = {
      pickup,
      dropoff,
      date: dateDisplay,
      time: timeInputRef.current?.value || ''
    };
    sessionStorage.setItem('lastSearch', JSON.stringify(searchParams));

    // Navigate to booking page
    router.push('/booking');
  };

  return (
    <section className={styles.hero}>
      <div className={styles.overlay}></div>
      <div className={styles.heroContainer + " container"}>
        <div className={styles.heroTextContent}>

          <h1 className={styles.title}>
            Bespoke Private <br />
            Transfers Ireland
          </h1>
          <p className={styles.description}>
            Experience luxury travel with Ireland's premier chauffeur service. 
            Reliable, professional, and tailored to your journey.
          </p>

          <div className={styles.bookingBar}>
            <div className={styles.barFields}>
              <div className={styles.barField}>
                <LocationAutocomplete 
                  id="hero-from"
                  label="From"
                  placeholder="Pickup"
                  onSelect={setPickup}
                />
              </div>

              <div className={styles.barField}>
                <LocationAutocomplete 
                  id="hero-to"
                  label="To"
                  placeholder="Dropoff"
                  onSelect={setDropoff}
                />
              </div>

              <div className={styles.barField} onClick={() => dateInputRef.current?.showPicker()}>
                <label>Date</label>
                <div className={styles.inputWithFormat}>
                  <input 
                    type="text" 
                    readOnly 
                    placeholder="DD/MM/YY" 
                    value={dateDisplay}
                  />
                  <input 
                    type="date" 
                    ref={dateInputRef}
                    className={styles.hiddenDateInput}
                    onChange={handleDateChange}
                  />
                </div>
              </div>

              <div className={styles.barField} onClick={() => timeInputRef.current?.showPicker()}>
                <label>Time</label>
                <input type="time" ref={timeInputRef} className={styles.timeInput} />
              </div>

              <div className={styles.barAction}>
                <button className={styles.searchBtn} onClick={handleSearch}>
                  <span>Get Quote</span>
                </button>
              </div>
            </div>
          </div>

          <div className={styles.heroActions}>
            <Link href="/services" className="btn-primary">View Services</Link>
          </div>
        </div>
      </div>
    </section>
  );
}


