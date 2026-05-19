export class ServicesSectionService {
  /**
   * Fetches the list of bespoke chauffeur services.
   */
  static async fetchServices(): Promise<any[]> {
    const res = await fetch(`/api/images?service=services&t=${Date.now()}`, {
      cache: 'no-store'
    });
    if (!res.ok) {
      throw new Error('Failed to fetch services');
    }
    return res.json();
  }
}
