import type { Metadata } from 'next';
import Gallery from './Gallery';

export const metadata: Metadata = {
  title: 'Fleet & Journey Gallery | Private Transfers Ireland',
  description: 'Get a glimpse of our luxury executive vehicles, scenic Irish journeys, and private airport transfers across Ireland with professional chauffeurs.',
  alternates: {
    canonical: 'https://www.privatetransfers.ie/gallery',
  },
};

export default function GalleryPage() {
  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh', background: '#f8fafc' }}>
      <Gallery />
    </div>
  );
}
