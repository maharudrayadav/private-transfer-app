import Link from 'next/link';
import Hero from './components/home/Hero';
import ServicesSection from './services/ServicesSection';
import Features from './components/home/Features';
import WhyUs from './components/home/WhyUs';
import Vehicles from './components/home/Vehicles';

export default async function HomePage() {
  return (
    <>
      <Hero />
      <ServicesSection />
      <div className="container" style={{ textAlign: 'center', paddingBottom: '80px', marginTop: '-20px' }}>
        <Link href="/services" className="btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
          Explore More Services <span style={{ marginLeft: '8px' }}>→</span>
        </Link>
      </div>
      <WhyUs />
      <Vehicles />
      <Features />
    </>
  );
}
