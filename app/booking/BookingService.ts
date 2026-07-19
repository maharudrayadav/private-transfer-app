import { API_BASE_URL } from '@/lib/api';

export class BookingService {
  /**
   * Fetches the executive fleet details.
   */
  static async fetchFleet(): Promise<any[]> {
    const res = await fetch(`${API_BASE_URL}/api/images?service=FLEET&t=${Date.now()}`, {
      cache: 'no-store'
    });
    if (!res.ok) {
      throw new Error('Failed to fetch fleet data');
    }
    return res.json();
  }

  /**
   * Fetches distance and estimated time between two locations.
   */
  static async fetchDistance(from: string, to: string): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/api/routes/place-distance?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`);
    if (!res.ok) {
      throw new Error('Failed to fetch distance data');
    }
    return res.json();
  }

  /**
   * Fetches full route calculations (GeoJSON path).
   */
  static async fetchRoute(from: string, to: string): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/api/routes/calculate?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`);
    if (!res.ok) {
      throw new Error('Failed to fetch route details');
    }
    return res.json();
  }

  /**
   * Calculates dynamic pricing for a given vehicle configuration.
   */
  static async calculatePrice(
    km: number,
    rate: number,
    returnKm: number,
    passengers: string | number,
    luggage: string | number,
    languagePrice: number
  ): Promise<number> {
    const res = await fetch(
      `${API_BASE_URL}/api/admin/caldata?km=${km}&rate=${rate}&returnkm=${returnKm}&passgener=${passengers}&language=${luggage}&languagePrice=${languagePrice}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }
    );
    if (!res.ok) {
      throw new Error('Failed to calculate fare pricing');
    }
    const text = await res.text();
    return parseFloat(text);
  }

  /**
   * Submits a new booking request.
   */
  static async createBooking(payload: any): Promise<any> {
    const res = await fetch(API_BASE_URL + '/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      throw new Error('Failed to submit booking');
    }
    return res.json();
  }
}
