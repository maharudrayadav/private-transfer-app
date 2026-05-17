'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import LocationAutocomplete from '../components/LocationAutocomplete';
import styles from './booking.module.css';
import dynamic from 'next/dynamic';
import { 
  MapPin, Calendar, Clock, Pencil, 
  Hourglass, Map, Users, Luggage, 
  Info, AlertTriangle 
} from 'lucide-react';

const RouteMap = dynamic(() => import('../components/RouteMap'), { ssr: false });

interface FleetItem {
  id: number;
  heading: string;
  imageUrl: string;
  service: string;
  passengers?: number | null;
  bags?: number | null;
  price?: number | null;
  languagePrice?: number | null;
}

const COUNTRY_CODES = [
  { code: '+353', flag: '🇮🇪', country: 'Ireland' },
];

export default function BookingPage() {
  const [search, setSearch] = useState<any>(null);
  const [fleet, setFleet] = useState<FleetItem[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<FleetItem | null>(null);
  const [tripType, setTripType] = useState<'one-way' | 'return'>('one-way');
  const [countryCode, setCountryCode] = useState('+353');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [fleetPrices, setFleetPrices] = useState<Record<number, number>>({});
  const [isCalculatingPrice, setIsCalculatingPrice] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  // ── Auto-scroll to success message when submitted ───────────
  useEffect(() => {
    if (submitted) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [submitted]);

  // ── Modify Search state ─────────────────────────────────────
  const [modifyOpen, setModifyOpen] = useState(false);
  const [modPickup, setModPickup] = useState('');
  const [modDropoff, setModDropoff] = useState('');
  const [modDateDisplay, setModDateDisplay] = useState('');
  const [modDateRaw, setModDateRaw] = useState('');
  const [modTime, setModTime] = useState('');
  const modDateRef = useRef<HTMLInputElement>(null);
  const modTimeRef = useRef<HTMLInputElement>(null);
  const returnDateRef = useRef<HTMLInputElement>(null);
  const returnTimeRef = useRef<HTMLInputElement>(null);
  const [returnDateDisplay, setReturnDateDisplay] = useState('');

  // ── Return journey address state ───────────────────────────
  const [returnPickup, setReturnPickup] = useState('');
  const [returnDropoff, setReturnDropoff] = useState('');

  // ── Route Info state ──────────────────────────────────────
  const [routeInfo, setRouteInfo] = useState<{ distance_km: number; time_minutes: number } | null>(null);
  const [returnRouteInfo, setReturnRouteInfo] = useState<{ distance_km: number; time_minutes: number } | null>(null);
  const [routeData, setRouteData] = useState<any>(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [showRouteMap, setShowRouteMap] = useState(false);

  const [form, setForm] = useState({
    firstName: '', lastName: '',
    email: '', phone: '',
    passengers: '1',
    luggage: '1', notes: '',
    returnDate: '', returnTime: ''
  });

  useEffect(() => {
    const stored = sessionStorage.getItem('lastSearch');
    if (stored) {
      const parsed = JSON.parse(stored);
      setSearch(parsed);
      // Pre-fill modify fields with current search values
      setModPickup(parsed.pickup || '');
      setModDropoff(parsed.dropoff || '');
      setModDateDisplay(parsed.date || '');
      setModTime(parsed.time || '');
      // Pre-fill return addresses as reverse of outbound by default
      setReturnPickup(parsed.dropoff || '');
      setReturnDropoff(parsed.pickup || '');
    } else {
      // If direct open without search, show the search inputs by default
      setModifyOpen(true);
    }

    const cachedStr = sessionStorage.getItem('fleetCache');
    let useCache = false;
    if (cachedStr) {
      try {
        const cached = JSON.parse(cachedStr);
        // Expiration limit: 2 minutes (120,000 ms) to avoid duplicate API load while navigating
        if (cached && cached.data && Date.now() - cached.timestamp < 120000) {
          setFleet(cached.data);
          useCache = true;
        }
      } catch (e) {
        // ignore and fallback
      }
    }

    if (!useCache) {
      fetch(`/api/images?service=FLEET&t=${Date.now()}`, { cache: 'no-store' })
        .then(r => r.ok ? r.json() : [])
        .then(data => {
          setFleet(data);
          sessionStorage.setItem('fleetCache', JSON.stringify({ data, timestamp: Date.now() }));
        })
        .catch(() => { });
    }
  }, []);

  useEffect(() => {
    if (search?.pickup && search?.dropoff) {
      const from = encodeURIComponent(search.pickup);
      const to = encodeURIComponent(search.dropoff);

      setRouteLoading(true);

      // Fetch Distance/Time
      fetch(`/api/routes/place-distance?from=${from}&to=${to}`)
        .then(r => r.ok ? r.json() : null)
        .then(data => setRouteInfo(data))
        .catch(() => setRouteInfo(null));

      // Fetch Full Route Data (GeoJSON)
      fetch(`/api/routes/calculate?from=${from}&to=${to}`)
        .then(r => r.ok ? r.json() : null)
        .then(data => {
          setRouteData(data);
          setRouteLoading(false);
        })
        .catch(() => {
          setRouteData(null);
          setRouteLoading(false);
        });
    }
  }, [search?.pickup, search?.dropoff]);

  // Fetch Return Trip Info
  useEffect(() => {
    if (tripType === 'return' && returnPickup && returnDropoff) {
      const from = encodeURIComponent(returnPickup);
      const to = encodeURIComponent(returnDropoff);

      fetch(`/api/routes/place-distance?from=${from}&to=${to}`)
        .then(r => r.ok ? r.json() : null)
        .then(data => setReturnRouteInfo(data))
        .catch(() => setReturnRouteInfo(null));
    } else {
      setReturnRouteInfo(null);
    }
  }, [tripType, returnPickup, returnDropoff]);

  // Calculate Combined Journey Price for all vehicles
  useEffect(() => {
    if (fleet.length > 0 && routeInfo?.distance_km) {
      const km = routeInfo.distance_km;
      let returnKm = 0;

      if (tripType === 'return') {
        if (!returnRouteInfo?.distance_km) {
          setFleetPrices({});
          return;
        }
        returnKm = returnRouteInfo.distance_km;
      }

      setIsCalculatingPrice(true);
      
      const pricePromises = fleet.map(v => {
        if (!v.price) return Promise.resolve({ id: v.id, price: null });
        
        return fetch(`/api/admin/caldata?km=${km}&rate=${v.price}&returnkm=${returnKm}&passgener=${form.passengers}&language=${form.luggage}&languagePrice=${v.languagePrice || 0}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        })
        .then(res => res.text())
        .then(text => ({ id: v.id, price: parseFloat(text) }))
        .catch(err => {
          console.error(`Error calculating price for ${v.heading}:`, err);
          return { id: v.id, price: null };
        });
      });

      Promise.all(pricePromises).then(results => {
        const newPrices: Record<number, number> = {};
        results.forEach(res => {
          if (res.price !== null && !isNaN(res.price)) {
            newPrices[res.id] = res.price;
          }
        });
        setFleetPrices(newPrices);
      })
      .finally(() => setIsCalculatingPrice(false));
    } else {
      setFleetPrices({});
    }
  }, [fleet, routeInfo?.distance_km, tripType, returnRouteInfo?.distance_km, form.passengers, form.luggage]);

  const handleSelect = (vehicle: FleetItem) => {
    setSelectedVehicle(vehicle);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    let value = e.target.value;
    if (e.target.name === 'phone') {
      value = value.replace(/\D/g, '').slice(0, 10);
    }
    setForm({ ...form, [e.target.name]: value });
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.firstName.trim()) newErrors.firstName = 'First name is required';
    else if (form.firstName.trim().length < 2) newErrors.firstName = 'First name is too short';
    
    if (!form.lastName.trim()) newErrors.lastName = 'Last name is required';
    else if (form.lastName.trim().length < 2) newErrors.lastName = 'Last name is too short';
    
    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!form.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (form.phone.trim().length !== 10) {
      newErrors.phone = 'Phone number must be exactly 10 digits';
    }
    
    if (tripType === 'return') {
      if (!form.returnDate) newErrors.returnDate = 'Return date is required';
      if (!form.returnTime) newErrors.returnTime = 'Return time is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!selectedVehicle) {
      setSubmitError('Please select a vehicle first.');
      return;
    }

    if (!search || !search.date || !search.time) {
      setSubmitError('Search details are incomplete. Please update your search.');
      return;
    }

    if (!validate()) {
      // Scroll to first error
      const firstError = Object.keys(errors)[0];
      if (firstError) {
        const el = document.getElementsByName(firstError)[0];
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setLoading(true);

    try {
      // Format Date/Time to YYYY-MM-DDTHH:mm:ss
      // Expected search.date: DD/MM/YYYY
      // Expected search.time: HH:mm
      const [d, m, y] = search.date.split('/').map((s: string) => s.trim());
      const timeStr = search.time ? search.time.trim() : '00:00';
      const pickupTime = `${y}-${m}-${d}T${timeStr}:00`;

      const payload = {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: countryCode + form.phone,
        pickupLocation: search.pickup,
        dropoffLocation: search.dropoff,
        pickupTime: pickupTime,
        passengers: parseInt(form.passengers),
        luggage: parseInt(form.luggage),
        vehicleType: selectedVehicle.heading,
        amount: total,
        driverNote: form.notes,
        ...(tripType === 'return' ? {
          returnDate: form.returnDate,
          returnTime: form.returnTime,
          returnPickupLocation: returnPickup || search.dropoff,
          returnDropoffLocation: returnDropoff || search.pickup
        } : {}),
        notes: `
          Trip Type: ${tripType.toUpperCase()}
          Luggage: ${form.luggage}
          ${tripType === 'return' ? `
          Return Date: ${form.returnDate}, Return Time: ${form.returnTime}
          Return Pickup: ${returnPickup || search.dropoff}
          Return Drop-off: ${returnDropoff || search.pickup}
          `.trim() : ''}
        `.trim()
      };

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('Failed to submit booking');
      }

      setSubmitted(true);
      // The useEffect will handle the scrolling
    } catch (err: any) {
      console.error(err);
      setSubmitError(err.message || 'Something went wrong while processing your booking. Please try again or contact us.');
    } finally {
      setLoading(false);
    }
  };

  // ── Modify Search handlers ───────────────────────────────────
  const handleModDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setModDateRaw(val);
    if (!val) { setModDateDisplay(''); return; }
    const [y, m, d] = val.split('-');
    setModDateDisplay(`${d}/${m}/${y}`);
  };

  const handleReturnDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setForm({ ...form, returnDate: val });
    if (!val) { setReturnDateDisplay(''); return; }
    const [y, m, d] = val.split('-');
    setReturnDateDisplay(`${d}/${m}/${y}`);
  };

  const handleApplyModify = () => {
    if (!modPickup || !modDropoff) {
      alert('Please enter both pickup and dropoff locations');
      return;
    }
    const updated = {
      pickup: modPickup,
      dropoff: modDropoff,
      date: modDateDisplay,
      time: modTime,
    };
    sessionStorage.setItem('lastSearch', JSON.stringify(updated));
    setSearch(updated);
    setModifyOpen(false);
    // Reset selected vehicle when route changes
    setSelectedVehicle(null);
  };

  const journeyFare = (selectedVehicle && fleetPrices[selectedVehicle.id]) 
    ? fleetPrices[selectedVehicle.id] 
    : ((selectedVehicle?.price || 0) * (tripType === 'return' ? 2 : 1));
  const total = journeyFare;

  // ... (previous logic)

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        
        {submitted ? (
          <div ref={successRef} className={styles.successFullWidth}>
            <div className={styles.successCard}>
              <div className={styles.successIcon}>✓</div>
              <h2>Booking Request Submitted!</h2>
              <p>No payment is required at this stage. Our team will review availability and send you a confirmation email with a payment link shortly.</p>
              <div className={styles.successActions}>
                <a href="/" className={styles.homeBtn}>Return to Home</a>
                <button onClick={() => window.location.reload()} className={styles.secondaryBtn}>Make Another Booking</button>
              </div>
            </div>
          </div>
        ) : (
          <>

        {/* ── Return Journey Details Card (slides in when Return chosen) ── */}
        {/* Redundant top card removed to keep actions localized in the form */}

        {/* ── Search Summary Bar ──────────────────────────────── */}
        <div className={styles.searchBar}>
          <div className={styles.routeDisplay}>
            <span className={styles.routePin + ' ' + styles.pinFrom}><MapPin size={16} /></span>
            <div className={styles.routeText}>
              <span className={styles.routeLabel}>Pickup</span>
              <span className={styles.routeValue}>{search?.pickup || 'Not set'}</span>
            </div>
            <div className={styles.routeArrow}>→</div>
            <span className={styles.routePin + ' ' + styles.pinTo}><MapPin size={16} /></span>
            <div className={styles.routeText}>
              <span className={styles.routeLabel}>Drop-off</span>
              <span className={styles.routeValue}>{search?.dropoff || 'Not set'}</span>
            </div>
          </div>

          <div className={styles.tripMeta}>
            <div className={styles.metaItem}>
              <span style={{display: 'flex'}}><Calendar size={18} /></span>
              <div>
                <label>Date</label>
                <p>{search?.date || '—'}</p>
              </div>
            </div>
            <div className={styles.metaItem}>
              <span style={{display: 'flex'}}><Clock size={18} /></span>
              <div>
                <label>Time</label>
                <p>{search?.time || '—'}</p>
              </div>
            </div>

            <button
              className={styles.modifyBtn}
              onClick={() => setModifyOpen(v => !v)}
              aria-expanded={modifyOpen}
            >
              {modifyOpen ? '✕ Close' : <span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><Pencil size={14} /> Modify Search</span>}
            </button>
          </div>

          {/* ── Inline Modify Search Panel ───────────────────── */}
          {modifyOpen && (
            <div className={styles.modifyPanel}>
              <div className={styles.modifyGrid}>
                <div className={styles.modifyField}>
                  <LocationAutocomplete
                    id="mod-pickup"
                    label="Pickup Location"
                    placeholder="Enter pickup"
                    variant="light"
                    initialValue={modPickup}
                    onSelect={setModPickup}
                  />
                </div>
                <div className={styles.modifyField}>
                  <LocationAutocomplete
                    id="mod-dropoff"
                    label="Drop-off Location"
                    placeholder="Enter drop-off"
                    variant="light"
                    initialValue={modDropoff}
                    onSelect={setModDropoff}
                  />
                </div>
                <div className={styles.modifyField}>
                  <label className={styles.modLabel}>Date</label>
                  <div
                    className={styles.modDateWrap}
                    onClick={() => modDateRef.current?.showPicker()}
                  >
                    <input
                      type="text"
                      readOnly
                      placeholder="DD / MM / YYYY"
                      value={modDateDisplay}
                      className={styles.modDateDisplay}
                    />
                    <input
                      type="date"
                      ref={modDateRef}
                      className={styles.hiddenDateInput}
                      value={modDateRaw}
                      onChange={handleModDateChange}
                    />
                  </div>
                </div>
                <div className={styles.modifyField}>
                  <label className={styles.modLabel}>Time</label>
                  <input
                    type="time"
                    className={styles.modTimeInput}
                    ref={modTimeRef}
                    value={modTime}
                    onChange={e => setModTime(e.target.value)}
                    onClick={() => modTimeRef.current?.showPicker()}
                  />
                </div>
              </div>
              <button className={styles.applyModifyBtn} onClick={handleApplyModify}>
                Update Search →
              </button>
            </div>
          )}
        </div>

        {/* ── Route Map Section ─────────────────────────────────── */}
        {search?.pickup && search?.dropoff && (
          <div className={styles.routeMapSection}>
            <button
              className={styles.toggleRouteBtn}
              onClick={() => setShowRouteMap(!showRouteMap)}
            >
              {showRouteMap ? 'Hide Route' : 'Show Route'}
            </button>

            {showRouteMap && (
              <div className={styles.mapContainer}>
                <div className={styles.mapInfo}>
                  <span className={styles.mapDistance}>Distance: {routeInfo?.distance_km ?? '—'} km</span>
                  {routeInfo?.time_minutes && (
                    <span className={styles.mapTime}>Est. Time: {routeInfo.time_minutes} min</span>
                  )}
                </div>
                {routeLoading ? (
                  <div className={styles.mapPlaceholder}>
                    <div className={styles.mapPlaceholderContent}>
                      <span className={styles.mapIcon}><Hourglass size={24} /></span>
                      <p>Calculating route path...</p>
                    </div>
                  </div>
                ) : routeData ? (
                  <RouteMap routeData={routeData.route || routeData} />
                ) : (
                  <div className={styles.mapPlaceholder}>
                    <div className={styles.mapPlaceholderContent}>
                      <span className={styles.mapIcon}><Map size={24} /></span>
                      <p>Route visualization not available for this trip.</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* LEFT COLUMN (Vehicles & Form) */}
        <div className={styles.leftCol}>




          {/* Vehicle Cards */}
          <div className={styles.sectionTitle}>
            <h2>Available Vehicles</h2>
            <p>All prices include tolls, bottled water and Wi-Fi on board.</p>
          </div>

          <div className={styles.vehicleList}>
            {fleet.length > 0 ? (
              fleet.map(v => {
                const isSelected = selectedVehicle?.id === v.id;
                return (
                  <div key={v.id} className={`${styles.vehicleCard} ${isSelected ? styles.vehicleCardActive : ''}`}>
                    <div className={styles.vehicleImg}>
                      <Image src={v.imageUrl} alt={v.heading} fill sizes="300px" className={styles.vImg} />
                    </div>
                    <div className={styles.vehicleDetails}>
                      <h3>{v.heading}</h3>
                      <p className={styles.vDesc}>Professional chauffeur service with all-inclusive pricing for your comfort and convenience.</p>
                      <div className={styles.vSpecs}>
                        <span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><Users size={14} /> Passengers {v.passengers ?? '—'}</span>
                        <span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><Luggage size={14} /> Luggage {v.bags ?? '—'}</span>
                      </div>
                      <div className={styles.vFeatures}>
                        <span>✓ Welcome service</span>
                        <span>✓ Flexible cancellation</span>
                        <span>✓ Inclusive waiting time</span>
                        <span>✓ Safe &amp; secure travel</span>
                      </div>
                    </div>
                    <div className={styles.vehiclePricing}>
                      {fleetPrices[v.id] ? (
                        <>
                          <div className={styles.price}>€{fleetPrices[v.id].toFixed(2)}</div>
                          <div className={styles.priceNote}>All-inclusive price</div>
                        </>
                      ) : (
                        <div className={styles.priceOnRequest}>
                          {isCalculatingPrice ? 'Calculating...' : (v.price ? `€${v.price.toFixed(2)}/km` : 'Price on request')}
                        </div>
                      )}
                      <button
                        className={`${styles.selectBtn} ${isSelected ? styles.selectedBtn : ''}`}
                        onClick={() => handleSelect(v)}
                      >
                        {isSelected ? 'Selected ✓' : 'Select ↗'}
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              // Premium Shimmer skeleton loaders matching the exact visual card layout
              <>
                {[1, 2, 3].map(i => (
                  <div key={i} className={`${styles.vehicleCard} ${styles.shimmerCard}`}>
                    <div className={`${styles.vehicleImg} ${styles.shimmerImg}`}></div>
                    <div className={styles.vehicleDetails}>
                      <div className={styles.shimmerLine} style={{ width: '50%', height: '22px', marginBottom: '14px' }}></div>
                      <div className={styles.shimmerLine} style={{ width: '85%', height: '14px', marginBottom: '8px' }}></div>
                      <div className={styles.shimmerLine} style={{ width: '40%', height: '14px', marginBottom: '20px' }}></div>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <div className={styles.shimmerLine} style={{ width: '90px', height: '24px', borderRadius: '12px' }}></div>
                        <div className={styles.shimmerLine} style={{ width: '90px', height: '24px', borderRadius: '12px' }}></div>
                      </div>
                    </div>
                    <div className={styles.vehiclePricing}>
                      <div className={styles.shimmerLine} style={{ width: '80px', height: '28px', marginBottom: '12px', alignSelf: 'flex-end' }}></div>
                      <div className={styles.shimmerLine} style={{ width: '110px', height: '42px', borderRadius: '8px', alignSelf: 'flex-end' }}></div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Passenger Details — appears after vehicle selected */}
          {selectedVehicle && (
            <div ref={formRef} className={styles.passengerSection}>
              <h2 className={styles.passengerTitle}>Passenger Details</h2>

              <form className={styles.passengerForm} onSubmit={handleSubmit}>
                <div className={styles.formRow}>
                  <div className={styles.formField}>
                    <label>Name</label>
                    <input 
                      type="text" 
                      name="firstName" 
                      className={errors.firstName ? styles.inputError : ''} 
                      value={form.firstName} 
                      onChange={handleChange} 
                      placeholder="First name" 
                    />
                    {errors.firstName && <span className={styles.errorText}>{errors.firstName}</span>}
                  </div>
                  <div className={styles.formField}>
                    <label>Last Name</label>
                    <input 
                      type="text" 
                      name="lastName" 
                      className={errors.lastName ? styles.inputError : ''} 
                      value={form.lastName} 
                      onChange={handleChange} 
                      placeholder="Last name" 
                    />
                    {errors.lastName && <span className={styles.errorText}>{errors.lastName}</span>}
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formField}>
                    <label>Email Address</label>
                    <input 
                      type="email" 
                      name="email" 
                      className={errors.email ? styles.inputError : ''} 
                      value={form.email} 
                      onChange={handleChange} 
                      placeholder="your@email.com" 
                    />
                    {errors.email && <span className={styles.errorText}>{errors.email}</span>}
                  </div>
                  <div className={styles.formField}>
                    <label>Phone Number</label>
                    <div className={`${styles.phoneGroup} ${errors.phone ? styles.inputError : ''}`}>
                      <select className={styles.phoneCode} value={countryCode} onChange={e => setCountryCode(e.target.value)}>
                        {COUNTRY_CODES.map(c => (
                          <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
                        ))}
                      </select>
                      <input 
                        type="tel" 
                        name="phone" 
                        maxLength={10}
                        value={form.phone} 
                        onChange={handleChange} 
                        placeholder="Enter 10-digit phone number" 
                      />
                    </div>
                    {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formField}>
                    <label>Passengers</label>
                    <select name="passengers" value={form.passengers} onChange={handleChange}>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                  <div className={styles.formField}>
                    <label>Luggage</label>
                    <select name="luggage" value={form.luggage} onChange={handleChange}>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                </div>

                {/* ── One Way / Return toggle inside form ─ matches reference site ── */}
                <div className={styles.formTripToggle}>
                  <button
                    type="button"
                    id="form-oneway-btn"
                    className={`${styles.formTripBtn} ${tripType === 'one-way' ? styles.formTripBtnOneWay : styles.formTripBtnInactive}`}
                    onClick={() => setTripType('one-way')}
                  >
                    One Way
                  </button>
                  <button
                    type="button"
                    id="form-return-btn"
                    className={`${styles.formTripBtn} ${tripType === 'return' ? styles.formTripBtnReturn : styles.formTripBtnInactive}`}
                    onClick={() => setTripType('return')}
                  >
                    Return
                  </button>
                </div>

                {/* ── Return Details (shown when Return is selected) ── */}
                {tripType === 'return' && (
                  <div className={styles.formReturnSection}>
                    <div className={styles.formRow}>
                      <div className={styles.formField}>
                        <label>Return Pickup Address</label>
                        <LocationAutocomplete
                          id="return-pickup-form"
                          label=""
                          placeholder={search?.dropoff || 'Enter return pickup location'}
                          variant="light"
                          initialValue={returnPickup}
                          onSelect={setReturnPickup}
                        />
                      </div>
                      <div className={styles.formField}>
                        <label>Return Drop-off Address</label>
                        <LocationAutocomplete
                          id="return-dropoff-form"
                          label=""
                          placeholder={search?.pickup || 'Enter return drop-off location'}
                          variant="light"
                          initialValue={returnDropoff}
                          onSelect={setReturnDropoff}
                        />
                      </div>
                    </div>

                    <div className={styles.formReturnFields}>
                      <div className={styles.formField}>
                        <label>Return Date</label>
                        <div
                          className={`${styles.formReturnInput} ${errors.returnDate ? styles.inputError : ''}`}
                          onClick={() => { try { returnDateRef.current?.showPicker(); } catch(e){} }}
                        >
                          <input
                            type="text"
                            readOnly
                            placeholder="Select date"
                            value={returnDateDisplay}
                          />
                          <input
                            type="date"
                            ref={returnDateRef}
                            className={styles.hiddenDateInput}
                            name="returnDate"
                            value={form.returnDate}
                            onChange={handleReturnDateChange}
                          />
                        </div>
                        {errors.returnDate && <span className={styles.errorText}>{errors.returnDate}</span>}
                      </div>
                      <div className={styles.formField}>
                        <label>Return Time</label>
                        <div
                          className={`${styles.formReturnInput} ${errors.returnTime ? styles.inputError : ''}`}
                          onClick={() => { try { returnTimeRef.current?.showPicker(); } catch(e){} }}
                        >
                          <input
                            type="text"
                            readOnly
                            placeholder="Select time"
                            value={form.returnTime}
                          />
                          <input
                            type="time"
                            ref={returnTimeRef}
                            className={styles.hiddenDateInput}
                            name="returnTime"
                            value={form.returnTime}
                            onChange={handleChange}
                          />
                        </div>
                        {errors.returnTime && <span className={styles.errorText}>{errors.returnTime}</span>}
                      </div>
                    </div>
                  </div>
                )}
                <div className={styles.formField}>
                  <label>Notes to Driver (Optional)</label>
                  <textarea name="notes" rows={3} value={form.notes} onChange={handleChange} placeholder="Any special instructions..." />
                </div>


                <div className={styles.finalPriceBox}>
                  <div className={styles.finalPriceRow}>
                    <span>{tripType === 'return' ? 'Journey Fare (Outbound & Return)' : 'Outbound Journey'}</span>
                    <strong>{isCalculatingPrice ? '...' : `€${journeyFare.toFixed(2)}`}</strong>
                  </div>

                  <div className={`${styles.finalPriceRow} ${styles.finalTotalRow}`}>
                    <span>Total Amount</span>
                    <strong>€{total.toFixed(2)}</strong>
                  </div>
                </div>

                <div className={styles.noPaymentNote}>
                  <strong><Info size={16} style={{display: 'inline-block', verticalAlign: 'text-bottom', marginRight: '4px'}}/> Important:</strong> No payment is required at this stage. Once you submit your request, our team will review availability and send you a confirmation email with a payment link.
                </div>

                {submitError && (
                  <div className={styles.submitErrorMessage}>
                    <span><AlertTriangle size={16} /></span> {submitError}
                  </div>
                )}

                <button type="submit" className={styles.submitBtn} disabled={loading}>
                  {loading ? 'Processing...' : 'Request Availability →'}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* RIGHT SIDEBAR */}
        <div className={styles.rightCol}>
          <div className={styles.stickySidebar}>
            <div className={styles.summaryCard}>
              <h3>Ride Summary</h3>

              {search && (
                <div className={styles.summaryRoute}>
                  <div className={styles.summaryRouteItem}>
                    <span className={styles.pinRed}><MapPin size={16} /></span>
                    <div>
                      <label>From</label>
                      <p>{search.pickup}</p>
                    </div>
                  </div>
                  <div className={styles.routeDots}></div>
                  <div className={styles.summaryRouteItem}>
                    <span className={styles.pinBlue}><MapPin size={16} /></span>
                    <div>
                      <label>To</label>
                      <p>{search.dropoff}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className={styles.summaryMeta}>
                <div>
                  <label>Date</label>
                  <p>{search?.date || '—'}</p>
                </div>
                <div>
                  <label>Time</label>
                  <p>{search?.time || '—'}</p>
                </div>
                <div>
                  <label>Trip Type</label>
                  <p>{tripType === 'one-way' ? 'One Way' : 'Return'}</p>
                </div>
                {tripType === 'return' && (
                  <>
                    <div>
                      <label>Return Date</label>
                      <p>{form.returnDate || '—'}</p>
                    </div>
                    <div>
                      <label>Return Time</label>
                      <p>{form.returnTime || '—'}</p>
                    </div>
                  </>
                )}
              </div>

              {routeInfo && (
                <div className={styles.summaryRouteStats}>
                  <div className={styles.statItem}>
                    <span className={styles.statIcon}>📏</span>
                    <div>
                      <label>Outbound Distance</label>
                      <p>{routeInfo.distance_km} km</p>
                    </div>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statIcon}>⏱️</span>
                    <div>
                      <label>Outbound Est. Time</label>
                      <p>{routeInfo.time_minutes} min</p>
                    </div>
                  </div>
                </div>
              )}

              {returnRouteInfo && (
                <div className={styles.summaryRouteStats} style={{marginTop: '-1rem', borderTop: 'none'}}>
                  <div className={styles.statItem}>
                    <span className={styles.statIcon}>📏</span>
                    <div>
                      <label>Return Distance</label>
                      <p>{returnRouteInfo.distance_km} km</p>
                    </div>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statIcon}>⏱️</span>
                    <div>
                      <label>Return Est. Time</label>
                      <p>{returnRouteInfo.time_minutes} min</p>
                    </div>
                  </div>
                </div>
              )}

              <div className={styles.summaryPricing}>
                <div className={styles.priceRow}>
                  <span>{tripType === 'return' ? 'Journey Fare' : 'Outbound Journey'}</span>
                  <span>{isCalculatingPrice ? 'Calculating...' : (selectedVehicle ? `€${journeyFare.toFixed(2)}` : '—')}</span>
                </div>

                <div className={styles.totalRow}>
                  <span>Total</span>
                  <strong>{isCalculatingPrice ? '...' : (selectedVehicle ? `€${total.toFixed(2)}` : '—')}</strong>
                </div>
              </div>

              <div className={styles.summaryGuarantees}>
                <p>✓ All prices include tolls &amp; parking</p>
                <p>✓ Free cancellation up to 24h before</p>
                <p>✓ Meet &amp; greet service</p>
              </div>

              {!selectedVehicle && (
                <p className={styles.selectPrompt}>← Select a vehicle to continue</p>
              )}
            </div>
          </div>
        </div>
          </>
        )}

      </div>
    </div>
  );
}
