import { API_BASE_URL } from '@/lib/api';

export class ServicesSectionService {
  /**
   * Fetches the list of bespoke chauffeur services.
   */
  static async fetchServices(): Promise<any[]> {
    const res = await fetch(`${API_BASE_URL}/api/images?service=services&t=${Date.now()}`, {
      cache: 'no-store'
    });
    if (!res.ok) {
      throw new Error('Failed to fetch services');
    }
    return res.json();
  }
}

