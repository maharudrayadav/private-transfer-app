import { API_BASE_URL } from '@/lib/api';

export async function generateStaticParams() {
  const defaultServices = [
    { serviceType: 'airport-transfers' },
    { serviceType: 'corporate-travel' },
    { serviceType: 'wedding-chauffeurs' },
    { serviceType: 'golf-tours' },
    { serviceType: 'hourly-chauffeur' },
  ];

  try {
    const res = await fetch(`${API_BASE_URL}/api/images?service=services`);
    if (res.ok) {
      const data = await res.json();
      const apiServices = data.map((item: any) => ({
        serviceType: item.mainService ? item.mainService.toLowerCase() : (item.heading || '').toLowerCase().replace(/\s+/g, '-'),
      }));
      // Merge unique service types
      const allServices = [...defaultServices, ...apiServices];
      const uniqueServices = Array.from(new Set(allServices.map(s => s.serviceType)))
        .map(type => ({ serviceType: type }));
      return uniqueServices;
    }
  } catch (error) {
    console.error('Failed to fetch services for static export:', error);
  }

  return defaultServices;
}

export default function ServiceTypeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
