import Hero from './components/home/Hero';
import ServicesSection from './services/ServicesSection';
import Features from './components/home/Features';
import WhyUs from './components/home/WhyUs';
import Vehicles from './components/home/Vehicles';
import MoreServices from './components/home/MoreServices';

export default async function HomePage() {
  return (
    <>
      <Hero />
      <ServicesSection />
      <WhyUs />
      <Vehicles />
      <MoreServices />
      <Features />
    </>
  );
}
