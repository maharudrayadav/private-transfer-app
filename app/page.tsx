import Hero from './components/home/Hero';
import ServicesSection from './services/ServicesSection';
import InfoBlock from './components/home/InfoBlock';
import Features from './components/home/Features';
import ProcessBlock from './components/home/ProcessBlock';
import WhyUs from './components/home/WhyUs';
import Vehicles from './components/home/Vehicles';
import FAQ from './components/home/FAQ';

export default async function HomePage() {
  return (
    <>
      <Hero />
      <ServicesSection showMoreServicesLink={true} />
      <WhyUs />
      <Vehicles />
      <ProcessBlock />
      <Features />
      <InfoBlock />
      <FAQ />
    </>
  );
}
