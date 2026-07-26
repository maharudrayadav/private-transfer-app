import { API_BASE_URL } from '@/lib/api';

export class ServiceTypeService {
  /**
   * Fetches service type details and matching fleet vehicles.
   * @param serviceType The service type parameter from routing
   */
  static async fetchServiceDetails(serviceType: string): Promise<{ mainContent: any; fleetImages: any[] }> {
    const servicesRes = await fetch(`${API_BASE_URL}/api/images?service=services&t=${Date.now()}`, { cache: 'no-store' });

    if (!servicesRes.ok) {
      throw new Error('Failed to fetch service details');
    }

    const allServices = await servicesRes.json();

    const matchingServices = allServices.filter((item: any) => 
      item.mainService?.toLowerCase() === serviceType.toLowerCase() || 
      item.heading?.toLowerCase().replace(/ /g, '-') === serviceType.toLowerCase()
    );
    
    const mainContent = matchingServices.length > 0 ? matchingServices[0] : null;
    const fleetImages: any[] = [];

    return { mainContent, fleetImages };
  }
}
