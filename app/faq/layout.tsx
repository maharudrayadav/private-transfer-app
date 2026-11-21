import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions | Dublin Airport & Chauffeur Transfers',
  description: 'Find answers to common questions about Dublin Airport transfers, private tours, flight monitoring, luggage capacity, meet and greet, and chauffeur bookings across Ireland.',
  alternates: {
    canonical: 'https://www.privatetransfers.ie/faq',
  },
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return children;
}
