'use client';

import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default Leaflet icon issues in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface RouteMapProps {
  routeData: any; // The GeoJSON features
}

export default function RouteMap({ routeData }: RouteMapProps) {
  const mapRef = useRef<L.Map>(null);

  // When route data changes, fit the map bounds to the route
  useEffect(() => {
    if (mapRef.current && routeData && routeData.features) {
      const geoJsonLayer = L.geoJSON(routeData);
      const bounds = geoJsonLayer.getBounds();
      if (bounds.isValid()) {
        mapRef.current.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [routeData]);

  if (!routeData || !routeData.features || !Array.isArray(routeData.features)) {
    return (
      <div style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#e2e8f0', borderRadius: '16px' }}>
        <p>Route visualization not available for this trip.</p>
      </div>
    );
  }

  // Fallback center (Ireland)
  const center: [number, number] = [53.1424, -7.6921];

  return (
    <div style={{ height: '400px', width: '100%', borderRadius: '16px', overflow: 'hidden', position: 'relative', zIndex: 1 }}>
      <MapContainer
        center={center}
        zoom={7}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        <GeoJSON
          data={routeData}
          style={{
            color: '#3182ce',
            weight: 5,
            opacity: 0.8
          }}
        />
      </MapContainer>
    </div>
  );
}
