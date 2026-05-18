'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { MapPin } from 'lucide-react';
import styles from './LocationAutocomplete.module.css';

interface LocationAutocompleteProps {
  label: string;
  placeholder: string;
  id: string;
  onSelect?: (value: string) => void;
  variant?: 'dark' | 'light';
  initialValue?: string;
}

export default function LocationAutocomplete({ label, placeholder, id, onSelect, variant = 'dark', initialValue = '' }: LocationAutocompleteProps) {
  const [query, setQuery] = useState(initialValue);

  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchSuggestions = useCallback(async (val: string) => {
    if (val.length < 2) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      const url = `/api/places/autocomplete?query=${encodeURIComponent(val)}`;
      
      const res = await fetch(url, {
        method: 'GET'
      });

      if (res.ok) {
        const data = await res.json();
        console.log('Autocomplete response:', data);
        
        let formattedResults: string[] = [];

        // Handle Structure 1: { results: [ { formatted: "..." } ] }
        if (data && Array.isArray(data.results)) {
          formattedResults = data.results.map((item: any) => item.formatted).filter(Boolean);
        } 
        // Handle Structure 2: { features: [ { properties: { name: "...", county: "...", country: "..." } } ] } (GeoJSON)
        else if (data && Array.isArray(data.features)) {
          formattedResults = data.features.map((feature: any) => {
            const props = feature.properties;
            if (!props) return null;
            
            // Try to build a clean string from properties
            const parts = [
              props.name || props.label,
              props.county || props.city || props.district,
              props.country || props.countrycode
            ].filter(Boolean);
            
            return parts.join(', ');
          }).filter(Boolean);
        }

        setSuggestions(formattedResults);
      } else {
        console.error('Autocomplete API error:', res.status);
      }
    } catch (error) {
      console.error('Autocomplete fetch error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    const timeoutId = setTimeout(() => {
      fetchSuggestions(query);
    }, 350);
    
    return () => clearTimeout(timeoutId);
  }, [query, fetchSuggestions]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setShowSuggestions(true);
  };

  const handleSelect = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    if (onSelect) onSelect(suggestion);
  };

  return (
    <div className={`${styles.wrapper} ${variant === 'light' ? styles.wrapperLight : ''}`} ref={wrapperRef}>
      <label htmlFor={id}>{label}</label>
      <div className={`${styles.inputContainer} ${variant === 'light' ? styles.inputContainerLight : ''}`}>
        <input
          type="text"
          id={id}
          value={query}
          onChange={handleInputChange}
          onFocus={() => setShowSuggestions(true)}
          placeholder={placeholder}
          autoComplete="off"
          className={variant === 'light' ? styles.inputLight : ''}
        />
        {loading && <div className={`${styles.spinner} ${variant === 'light' ? styles.spinnerLight : ''}`}></div>}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <ul className={`${styles.suggestions} ${variant === 'light' ? styles.suggestionsLight : ''}`}>
          {suggestions.map((s, idx) => (
            <li key={idx} onClick={() => handleSelect(s)}>
              <span className={styles.icon} style={{display: 'inline-flex', alignItems: 'center'}}><MapPin size={16} /></span>
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
