'use client';

import Link from 'next/link';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Hero.module.css';
import LocationAutocomplete from '../../booking/LocationAutocomplete';

export default function Hero() {
  const router = useRouter();
  const [dateDisplay, setDateDisplay] = useState('');
  const dateInputRef = useRef<HTMLInputElement>(null);
  const timeInputRef = useRef<HTMLInputElement>(null);
  const [timeDisplay, setTimeDisplay] = useState('');

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTimeDisplay(e.target.value);
  };

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
  const [errorMsg, setErrorMsg] = useState('');

  const handleSearch = () => {
    setErrorMsg('');
    if (!pickup || !dropoff) {
      setErrorMsg('Please enter both pickup and drop-off locations');
      return;
    }

    if (!dateDisplay) {
      setErrorMsg('Please select a journey date');
      return;
    }

    const timeVal = timeInputRef.current?.value;
    if (!timeVal) {
      setErrorMsg('Please select a journey time');
      return;
    }
    
    // Store search details for the results section
    const searchParams = {
      pickup,
      dropoff,
      date: dateDisplay,
      time: timeVal
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
                  variant="light"
                />
              </div>

              <div className={styles.barField}>
                <LocationAutocomplete 
                  id="hero-to"
                  label="To"
                  placeholder="Dropoff"
                  onSelect={setDropoff}
                  variant="light"
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

              <div className={styles.barField} onClick={() => { try { timeInputRef.current?.showPicker(); } catch(e){} }}>
                <label>Time</label>
                <div className={styles.inputWithFormat}>
                  <input 
                    type="text" 
                    readOnly 
                    placeholder="HH:MM" 
                    value={timeDisplay}
                  />
                  <input 
                    type="time" 
                    ref={timeInputRef} 
                    className={styles.hiddenDateInput} 
                    onChange={handleTimeChange}
                  />
                </div>
              </div>

              <div className={styles.barAction}>
                <button className={styles.searchBtn} onClick={handleSearch}>
                  <span>Get Quote</span>
                </button>
              </div>
            </div>
          </div>

          {errorMsg && (
            <div style={{ 
              color: '#ef4444', 
              marginTop: '1.5rem', 
              fontWeight: '500', 
              padding: '0.75rem 1.5rem', 
              background: 'rgba(239, 68, 68, 0.1)', 
              border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: '8px', 
              display: 'inline-block',
              backdropFilter: 'blur(4px)'
            }}>
              {errorMsg}
            </div>
          )}

          <div className={styles.heroActions}>
            <Link href="/services" className="btn-primary">View Services</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
