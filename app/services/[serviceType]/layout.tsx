import type { Metadata } from 'next';
import { API_BASE_URL } from '@/lib/api';

export async function generateStaticParams() {
  const defaultServices = [
    { serviceType: 'airport' },
    { serviceType: 'airport-transfers' },
    { serviceType: 'hotel' },
    { serviceType: 'hotel-transfers' },
    { serviceType: 'vacation' },
    { serviceType: 'vacation-transfers' },
    { serviceType: 'corporate-travel' },
    { serviceType: 'wedding-chauffeurs' },
    { serviceType: 'golf-tours' },
    { serviceType: 'hourly-chauffeur' },
  ];

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1500);
    const res = await fetch(`${API_BASE_URL}/api/images?service=services`, { signal: controller.signal });
    clearTimeout(timeoutId);
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
    // Falls back immediately if network unavailable
  }

  return defaultServices;
}

export async function generateMetadata({ params }: { params: Promise<{ serviceType: string }> }): Promise<Metadata> {
  const { serviceType } = await params;
  const formatted = (serviceType || '')
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  return {
    title: `${formatted} | Private Transfers Ireland`,
    description: `Professional ${formatted} service across Ireland with PrivateTransfers.ie. Luxury executive vehicles, transparent fixed pricing, and dedicated professional chauffeurs.`,
    alternates: {
      canonical: `https://www.privatetransfers.ie/services/${serviceType}`,
    },
  };
}

export default function ServiceTypeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
