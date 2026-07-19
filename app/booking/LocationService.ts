export class LocationService {
  /**
   * Fetches location autocomplete suggestions for a query.
   * @param query The search query (e.g. airport name or street)
   */
  static async fetchSuggestions(query: string): Promise<string[]> {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://privateproject-r0ry.onrender.com';
    if (!process.env.NEXT_PUBLIC_API_URL) {
      console.warn('[LocationService] NEXT_PUBLIC_API_URL is not set. Falling back to production backend.');
    }
    const url = `${baseUrl}/api/places/autocomplete?query=${encodeURIComponent(query)}`;
    const res = await fetch(url, { method: 'GET' });

    if (!res.ok) {
      throw new Error(`Failed to fetch autocomplete suggestions: ${res.status}`);
    }

    const data = await res.json();
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

    return formattedResults;
  }
}
