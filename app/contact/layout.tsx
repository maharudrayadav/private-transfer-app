import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | Private Airport Transfers & Chauffeur Service Ireland',
  description: 'Get in touch with PrivateTransfers.ie for custom travel itineraries, private Dublin Airport transfers, or group chauffeur bookings across Ireland.',
  alternates: {
    canonical: 'https://www.privatetransfers.ie/contact',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
