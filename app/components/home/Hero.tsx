'use client';

import Link from 'next/link';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Hero.module.css';
import LocationAutocomplete from '../../booking/LocationAutocomplete';

export default function Hero() {
  const router = useRouter();
  const [dateDisplay, setDateDisplay] = useState('');
  const [rawDate, setRawDate] = useState('');
  const dateInputRef = useRef<HTMLInputElement>(null);
  const timeInputRef = useRef<HTMLInputElement>(null);
  const [timeDisplay, setTimeDisplay] = useState('');

  // Get current local date and time
  const now = new Date();
  const today = new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
  const currentTime = now.toTimeString().slice(0, 5);

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (rawDate === today && val < currentTime) {
      triggerPopup('Journey time cannot be in the past. Please select a future time.');
      setTimeDisplay('');
      if (timeInputRef.current) timeInputRef.current.value = '';
      return;
    }
    setTimeDisplay(val);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value; // YYYY-MM-DD
    if (!val) {
      setRawDate('');
      setDateDisplay('');
      return;
    }
    if (val < today) {
      triggerPopup('Journey date cannot be in the past. Please select today or a future date.');
      setRawDate('');
      setDateDisplay('');
      if (dateInputRef.current) dateInputRef.current.value = '';
      return;
    }
    setRawDate(val);
    const [y, m, d] = val.split('-');
    setDateDisplay(`${d} / ${m} / ${y}`);

    // If date changed to today and selected time is in the past, reset time
    if (val === today && timeDisplay && timeDisplay < currentTime) {
      setTimeDisplay('');
      if (timeInputRef.current) timeInputRef.current.value = '';
    }
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

    if (!dateDisplay || !rawDate) {
      triggerPopup('Please select a journey date');
      return;
    }

    if (rawDate < today) {
      triggerPopup('Journey date cannot be in the past');
      return;
    }

    const timeVal = timeInputRef.current?.value || timeDisplay;
    if (!timeVal) {
      triggerPopup('Please select a journey time');
      return;
    }

    if (rawDate === today && timeVal < currentTime) {
      triggerPopup('Journey time cannot be in the past');
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
                      min={today}
                      value={rawDate}
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
                      min={rawDate === today ? currentTime : undefined}
                      value={timeDisplay}
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
              // Fallback
              e.currentTarget.src = 'https://www.irishvacationtours.ie/wp-content/uploads/2025/10/314eb1f767f740ff8cd0e8795798a887.jpeg';
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
