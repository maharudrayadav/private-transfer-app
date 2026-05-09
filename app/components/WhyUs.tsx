import Link from 'next/link';
import Image from 'next/image';
import styles from './WhyUs.module.css';

export default function WhyUs() {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.layout}>
          {/* Text */}
          <div className={styles.text}>
            <h2 className={styles.heading}>
              Luxury Private Transfers across Ireland
            </h2>
            <p className={styles.sub}>Professional chauffeur services &amp; custom itineraries</p>
            <ul className={styles.list}>
              <li>Friendly private driver, comfortable car</li>
              <li>Airport transfers with flight monitoring</li>
              <li>Hotel and castle transfers across the country</li>
              <li>Flexible stops and timings to fit your schedule</li>
            </ul>
            <Link href="/contact" className={styles.link}>Plan your trip today →</Link>
          </div>

          {/* Image */}
          <div className={styles.imgWrap}>
            <Image
              src="/service_airport.png"
              alt="Luxury private transfer vehicle"
              fill
              sizes="(max-width:768px) 100vw, 50vw"
              className={styles.img}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
