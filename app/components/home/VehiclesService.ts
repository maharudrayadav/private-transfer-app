import { API_BASE_URL } from '@/lib/api';

export class VehiclesService {
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
}

