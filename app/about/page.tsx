import type { Metadata } from 'next';
import AboutContent from './AboutContent';

export const metadata: Metadata = {
  title: 'About Us | Private Chauffeur & Airport Transfers Ireland',
  description: "Learn about PrivateTransfers.ie, Ireland's premier chauffeur service offering luxury private airport transfers, hotel travel, and bespoke touring itineraries.",
  keywords: ["About PrivateTransfers", "Chauffeur Services Ireland", "Dublin Airport Transfers", "Private Transportation Ireland"],
  alternates: {
    canonical: 'https://www.privatetransfers.ie/about',
  },
};

export default function AboutPage() {
  return <AboutContent />;
}
