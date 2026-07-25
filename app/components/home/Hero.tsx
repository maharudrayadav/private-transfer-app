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
  
  const [showPopup, setShowPopup] = useState(false);
  const [popupMsg, setPopupMsg] = useState('');

  const triggerPopup = (msg: string) => {
    setPopupMsg(msg);
    setShowPopup(true);
  };

  const handleSearch = () => {
    if (!pickup || !dropoff) {
      triggerPopup('Please enter both pickup and drop-off locations');
      return;
    }

    if (!dateDisplay) {
      triggerPopup('Please select a journey date');
      return;
    }

    const timeVal = timeInputRef.current?.value;
    if (!timeVal) {
      triggerPopup('Please select a journey time');
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
      <div className={`container ${styles.heroContainer}`}>
        <div className={styles.heroTextContent}>
          <h1 className={styles.title}>
            Private Chauffeur <br />
            <span>Transfers</span> Ireland
          </h1>
          <p className={styles.description}>
            Experience luxury travel with Ireland's premier chauffeur service. 
            Reliable, professional, and tailored to your journey.
          </p>

          <div className={styles.bookingBar}>
            <div className={styles.barFields}>
              <div className={styles.rowFields}>
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
              </div>

              <div className={styles.rowFields}>
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
              </div>

              <div className={styles.barAction}>
                <button className={styles.searchBtn} onClick={handleSearch}>
                  <span>Get Quote</span>
                </button>
              </div>
            </div>
          </div>

          <div className={styles.heroActions}>
            <Link href="/services" className="btn-outline">View Services</Link>
          </div>
        </div>

        <div className={styles.heroImageContainer}>
          <img 
            src="/hero_fresh.png" 
            alt="Private Chauffeur Ireland" 
            className={styles.heroImage}
            onError={(e) => {
              // Fallback if hero_fresh.png doesn't exist
              e.currentTarget.src = 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=1200';
            }}
          />
        </div>
      </div>

      {showPopup && (
        <div className={styles.customAlertOverlay}>
          <div className={styles.customAlertBox}>
            <p>{popupMsg}</p>
            <button onClick={() => setShowPopup(false)}>OK</button>
          </div>
        </div>
      )}
    </section>
  );
}
