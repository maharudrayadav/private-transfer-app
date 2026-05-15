import Gallery from '../components/Gallery';

export const metadata = {
  title: 'Our Gallery | Private Transfer',
  description: 'Get a glimpse of the exceptional service we provide. From private transfers and business travel to scenic day trips across Ireland, our professional chauffeurs ensure a seamless and comfortable experience.',
};

export default function GalleryPage() {
  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh', background: '#f8fafc' }}>
      <Gallery />
    </div>
  );
}
