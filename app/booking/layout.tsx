import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Book Private Airport & Chauffeur Transfers | PrivateTransfers.ie',
  description: 'Reserve your private Dublin Airport transfer or luxury chauffeur service across Ireland. Calculate fares instantly with all-inclusive fixed rates and meet & greet service.',
  alternates: {
    canonical: 'https://www.privatetransfers.ie/booking',
  },
};

export default function BookingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
