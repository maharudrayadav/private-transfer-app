import Hero from './components/Hero';
import ServicesSection from './components/ServicesSection';
import Features from './components/Features';
import WhyUs from './components/WhyUs';
import Vehicles from './components/Vehicles';
import Gallery from './components/Gallery';

export default async function HomePage() {
  return (
    <>
      <Hero />
      <ServicesSection />
      <WhyUs />
      <Vehicles />
      <Features />
      <Gallery />
    </>
  );
}
