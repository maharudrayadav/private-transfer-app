import type { Metadata } from 'next';
import AboutContent from './AboutContent';

export const metadata: Metadata = {
  title: 'About Us | Private Transfer Ireland',
  description: 'Learn more about our commitment to excellence in private transportation services across Ireland.',
};

export default function AboutPage() {
  return <AboutContent />;
}
