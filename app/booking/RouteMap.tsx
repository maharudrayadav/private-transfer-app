'use client';

import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function decodePolyline(str: string, precision = 5): [number, number][] {
  let index = 0, lat = 0, lng = 0;
  const coordinates: [number, number][] = [];
  const factor = Math.pow(10, precision);
  while (index < str.length) {
    let shift = 0, result = 0, byte: number;
    do { byte = str.charCodeAt(index++) - 63; result |= (byte & 0x1f) << shift; shift += 5; } while (byte >= 0x20);
    lat += (result & 1) ? ~(result >> 1) : result >> 1;
    shift = 0; result = 0;
    do { byte = str.charCodeAt(index++) - 63; result |= (byte & 0x1f) << shift; shift += 5; } while (byte >= 0x20);
    lng += (result & 1) ? ~(result >> 1) : result >> 1;
    coordinates.push([lat / factor, lng / factor]);
  }
  return coordinates;
}

/** Extract [lat, lng][] from a place-distance API route object. */
function extractPositions(routeObj: any): [number, number][] {
  if (!routeObj) return [];
  if (typeof routeObj.polyline === 'string' && routeObj.polyline.length > 0) {
    return decodePolyline(routeObj.polyline);
  }
  const nestedRoutes: any[] = (routeObj.route ?? routeObj)?.routes ?? [];
  if (nestedRoutes.length === 0) return [];
  const route = nestedRoutes[0];
  let decoded: [number, number][] = [];
  if (route.overview_polyline?.points) {
    decoded = decodePolyline(route.overview_polyline.points);
  } else if (route.legs) {
    for (const leg of route.legs) {
      for (const step of leg.steps ?? []) {
        if (step.polyline?.points) {
          decoded = decoded.concat(decodePolyline(step.polyline.points));
        }
      }
    }
  }
  return decoded;
}

const ROUTE_COLORS = ['#1a6fd4', '#e53e3e', '#38a169', '#d69e2e', '#805ad5', '#dd6b20', '#00b5d8'];

interface RouteMapProps {
  allRouteData: any[];
  availableRoutes: any[];
  selectedRouteNumber?: number;
  onSelectRoute?: (route: any) => void;
}

export default function RouteMap({ allRouteData, availableRoutes, selectedRouteNumber, onSelectRoute }: RouteMapProps) {
  const mapRef = useRef<L.Map>(null);
  const [routesPositions, setRoutesPositions] = useState<[number, number][][]>([]);

  const activeIndex = Math.max(0, availableRoutes.findIndex(r => r.route_number === selectedRouteNumber));

  useEffect(() => {
    const positions = allRouteData.map(d => extractPositions(d));
    setRoutesPositions(positions);
  }, [allRouteData]);

  useEffect(() => {
    if (!mapRef.current || routesPositions.length === 0) return;
    const pts = routesPositions[activeIndex] ?? routesPositions[0];
    if (pts && pts.length > 0) {
      const bounds = L.latLngBounds(pts);
      if (bounds.isValid()) mapRef.current.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [routesPositions, activeIndex]);

  const center: [number, number] = [53.1424, -7.6921];

  return (
    <div style={{ width: '100%', borderRadius: '14px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>

      {/* ── Map tile ─────────────────────────────────────── */}
      <div style={{ width: '100%', height: 'clamp(200px, 40vw, 360px)' }}>
        <MapContainer
          center={center}
          zoom={7}
          style={{ height: '100%', width: '100%' }}
          ref={mapRef}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {routesPositions.map((pts, idx) =>
            idx !== activeIndex && pts.length > 0 ? (
              <Polyline
                key={`bg-${idx}`}
                positions={pts}
                pathOptions={{ color: ROUTE_COLORS[idx % ROUTE_COLORS.length], weight: 4, opacity: 0.4, dashArray: '10 8' }}
              />
            ) : null
          )}

          {routesPositions.map((pts, idx) =>
            idx === activeIndex && pts.length > 0 ? (
              <Polyline
                key={`fg-${idx}`}
                positions={pts}
                pathOptions={{ color: ROUTE_COLORS[idx % ROUTE_COLORS.length], weight: 6, opacity: 1 }}
              />
            ) : null
          )}
        </MapContainer>
      </div>

      {/* ── Route legend — always BELOW the map ──────────── */}
      {availableRoutes.length > 0 && (
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          padding: '10px 12px',
          background: '#f8fafc',
          borderTop: '1px solid #e2e8f0',
        }}>
          {availableRoutes.map((r, idx) => {
            const isSelected = r.route_number === selectedRouteNumber || (!selectedRouteNumber && idx === 0);
            const color = ROUTE_COLORS[idx % ROUTE_COLORS.length];
            const hours = Math.floor(r.time_minutes / 60);
            const mins = r.time_minutes % 60;
            const duration = hours > 0 ? `${hours}h ${mins}m` : `${mins} min`;

            return (
              <div
                key={idx}
                onClick={() => onSelectRoute?.(r)}
                style={{
                  cursor: 'pointer',
                  padding: '8px 14px',
                  borderRadius: '10px',
                  background: '#fff',
                  border: isSelected ? `2.5px solid ${color}` : '1.5px solid #e2e8f0',
                  boxShadow: isSelected ? `0 2px 10px ${color}33` : '0 1px 4px rgba(0,0,0,0.06)',
                  transition: 'all 0.18s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  flex: '1 1 auto',
                  minWidth: '130px',
                }}
              >
                {/* colour swatch */}
                <div style={{
                  width: '24px',
                  height: '4px',
                  borderRadius: '2px',
                  flexShrink: 0,
                  background: idx !== activeIndex
                    ? `repeating-linear-gradient(to right,${color} 0,${color} 6px,transparent 6px,transparent 10px)`
                    : color,
                }} />
                <div>
                  <strong style={{ fontSize: '0.82rem', color: '#1a202c', display: 'block' }}>
                    {r.summary || `Route ${idx + 1}`}
                  </strong>
                  <span style={{ fontSize: '0.73rem', color: '#64748b' }}>
                    {r.distance_km} km · {duration}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
