import { API_BASE_URL } from '@/lib/api';

const POPULAR_LOCATIONS: string[] = [
  'Dublin Airport (DUB), Terminal 1 & 2',
  'Dublin City Centre, Dublin',
  'The Shelbourne, Autograph Collection, St Stephen\'s Green, Dublin',
  'The Merrion Hotel, Upper Merrion St, Dublin',
  'The Marker Hotel, Grand Canal Square, Dublin',
  'The Westbury Hotel, Grafton Street, Dublin',
  'InterContinental Dublin, Simmonscourt Rd, Ballsbridge',
  'Conrad Dublin, Earlsfort Terrace, Dublin',
  'Clontarf Castle Hotel, Castle Ave, Clontarf, Dublin',
  'Carton House, Fairmont Hotel, Maynooth, Co. Kildare',
  'The K Club, Straffan, Co. Kildare',
  'Powerscourt Hotel, Resort & Spa, Enniskerry, Co. Wicklow',
  'Ashford Castle, Cong, Co. Mayo',
  'Adare Manor, Adare, Co. Limerick',
  'Dromoland Castle Hotel, Newmarket-on-Fergus, Co. Clare',
  'Ballyfin Demesne, Ballyfin, Co. Laois',
  'Cork Airport (ORK), Cork',
  'Cork City Centre, Cork',
  'Shannon Airport (SNN), Co. Clare',
  'Galway City Centre, Galway',
  'Belfast International Airport (BFS)',
  'George Best Belfast City Airport (BHD)',
  'Belfast City Centre, Northern Ireland',
  'Killarney, Co. Kerry',
  'Kenmare, Co. Kerry',
  'Limerick City Centre, Co. Limerick',
  'Kilkenny City, Co. Kilkenny',
  'Waterford City, Co. Waterford',
  'Sligo Town, Co. Sligo',
  'Athlone, Co. Westmeath',
  'Clifden, Connemara, Co. Galway',
  'Doolin (Cliffs of Moher), Co. Clare',
  'Kinsale, Co. Cork',
  'Westport, Co. Mayo',
  'Donegal Town, Co. Donegal',
  'Dun Laoghaire Ferry Port, Co. Dublin',
  'Dublin Port, Terminal 1 & 2, Dublin',
  'Heuston Train Station, Dublin',
  'Connolly Train Station, Dublin',
];

export class LocationService {
  /**
   * Fetches location autocomplete suggestions for a query.
   * @param query The search query (e.g. airport name or street)
   */
  static async fetchSuggestions(query: string): Promise<string[]> {
    if (!query || query.trim().length < 2) return [];
    const cleanQuery = query.trim().toLowerCase();

    // 1. Try Primary Backend API
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const url = `${API_BASE_URL}/api/places/autocomplete?query=${encodeURIComponent(query)}`;
      const res = await fetch(url, { method: 'GET', signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        let formattedResults: string[] = [];

        if (data && Array.isArray(data.results)) {
          formattedResults = data.results.map((item: any) => item.formatted).filter(Boolean);
        } else if (data && Array.isArray(data.features)) {
          formattedResults = data.features.map((feature: any) => {
            const props = feature.properties;
            if (!props) return null;
            const parts = [
              props.name || props.label,
              props.county || props.city || props.district,
              props.country || props.countrycode
            ].filter(Boolean);
            return parts.join(', ');
          }).filter(Boolean);
        } else if (data && Array.isArray(data.predictions)) {
          formattedResults = data.predictions.map((item: any) => item.description).filter(Boolean);
        }

        if (formattedResults.length > 0) {
          return formattedResults;
        }
      }
    } catch (err) {
      // Backend unavailable or error; proceed to instant fallback
    }

    // 2. Instant Local Match against Ireland landmarks & popular destinations
    const localMatches = POPULAR_LOCATIONS.filter(loc =>
      loc.toLowerCase().includes(cleanQuery)
    );

    // 3. Fallback to OpenStreetMap / Photon geocoding for Ireland
    try {
      const photonUrl = `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&lat=53.35&lon=-6.26&limit=6`;
      const pRes = await fetch(photonUrl);
      if (pRes.ok) {
        const pData = await pRes.json();
        if (pData && Array.isArray(pData.features)) {
          const photonResults: string[] = pData.features.map((f: any) => {
            const p = f.properties || {};
            const parts = [p.name, p.city || p.county || p.state, p.country].filter(Boolean);
            return parts.join(', ');
          }).filter(Boolean);

          const combined = Array.from(new Set([...localMatches, ...photonResults]));
          if (combined.length > 0) {
            return combined.slice(0, 8);
          }
        }
      }
    } catch (photonErr) {
      // Offline fallback
    }

    return localMatches.slice(0, 8);
  }
}
