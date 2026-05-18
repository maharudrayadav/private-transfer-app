import styles from './AboutContent.module.css';

export default function AboutContent() {
  return (
    <div className={styles.page}>
      <div className={styles.banner}>
        <div className="container">
          <h1>About Us</h1>
          <p>The Standard of Excellence in Irish Chauffeur Services</p>
        </div>
      </div>

      <div className="container">
        <div className={styles.content}>
          <section className={styles.section}>
            <h2>Our Story</h2>
            <p>
              Founded with a passion for exceptional service, Private Transfer Ireland has grown to become 
              a premier provider of luxury transportation. We believe that every journey should be as 
              memorable as the destination itself.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Our Mission</h2>
            <p>
              To provide safe, reliable, and sophisticated travel solutions that exceed our clients' 
              expectations, every single time. We combine local expertise with international standards 
              of luxury and professionalism.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Why Choose Us?</h2>
            <div className={styles.features}>
              <div className={styles.feature}>
                <h3>Expert Drivers</h3>
                <p>Our chauffeurs are highly trained, discreet, and possess deep knowledge of Ireland's roads.</p>
              </div>
              <div className={styles.feature}>
                <h3>Luxury Fleet</h3>
                <p>We maintain a meticulously curated fleet of the latest executive vehicles and MPVs.</p>
              </div>
              <div className={styles.feature}>
                <h3>24/7 Support</h3>
                <p>Our team is available around the clock to ensure your travel plans go perfectly.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
