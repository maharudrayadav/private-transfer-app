'use client';

import { useState } from 'react';
import styles from './page.module.css';

const faqs = [
  {
    "q": "What is a private tour?",
    "a": "A private tour means the itinerary, pace, and experience are designed exclusively for you and your group. You travel with your own driver-guide and vehicle, without sharing with other guests."
  },
  {
    "q": "What are the benefits of a private tour in Ireland?",
    "a": "Private tours offer flexibility, personalized experiences, local insight, and comfort. You can customize destinations, stop whenever you like, and explore Ireland at your own pace with expert guidance."
  },
  {
    "q": "How many people can join a private tour?",
    "a": "Private tours are available for solo travelers, couples, families, and small groups—typically up to 6–15 guests depending on vehicle size."
  },
  {
    "q": "Can the itinerary be customized?",
    "a": "Yes. Every private tour can be fully customized based on your interests, schedule, mobility needs, and travel style—whether you prefer history, scenery, food, genealogy, or hidden gems."
  },
  {
    "q": "How long do private tours last?",
    "a": "Private tours can range from half-day and full-day experiences to multi-day journeys covering multiple regions of Ireland."
  },
  {
    "q": "What destinations can be included?",
    "a": "Popular destinations include Dublin, Galway, Cliffs of Moher, Ring of Kerry, Dingle Peninsula, Giant’s Causeway, Belfast, Connemara, and many off-the-beaten-path locations."
  },
  {
    "q": "Are entrance fees included?",
    "a": "Some tours include entrance fees, while others are priced separately depending on the itinerary. All inclusions are clearly outlined before booking."
  },
  {
    "q": "Who are the driver-guides?",
    "a": "Our driver-guides are fully licensed, highly knowledgeable locals with a passion for Irish history, culture, and storytelling. Many have years of guiding experience."
  },
  {
    "q": "Is hotel pickup included?",
    "a": "Yes. Most private tours include pickup and drop-off at your hotel, accommodation, cruise port, or airport within the tour area."
  },
  {
    "q": "What type of vehicle is used?",
    "a": "Tours are conducted in modern, comfortable vehicles such as luxury sedans, MPVs, or minibuses, depending on group size."
  },
  {
    "q": "Are private tours suitable for families?",
    "a": "Absolutely. Private tours are ideal for families, allowing flexible schedules, child-friendly stops, and tailored pacing."
  },
  {
    "q": "Can you accommodate mobility needs?",
    "a": "Yes. Please advise us in advance of any mobility requirements so we can plan suitable routes, vehicles, and attractions."
  },
  {
    "q": "Do tours operate year-round?",
    "a": "Yes. Private tours operate all year, though daylight hours and weather vary by season. Winter tours offer fewer crowds and a more relaxed pace."
  },
  {
    "q": "What is the booking process?",
    "a": "Simply contact us with your travel dates and interests. We’ll design a proposed itinerary, confirm pricing, and secure your booking once approved."
  },
  {
    "q": "How far in advance should I book?",
    "a": "We recommend booking several weeks to months in advance, especially during peak travel seasons (May–September)."
  },
  {
    "q": "What is the cancellation policy?",
    "a": "Cancellation policies vary depending on the tour length and inclusions. Full details are provided at the time of booking."
  },
  {
    "q": "Are tips expected?",
    "a": "Tipping is not mandatory in Ireland but is appreciated if you feel your guide provided excellent service."
  },
  {
    "q": "What should I bring on the tour?",
    "a": "Comfortable walking shoes, weather-appropriate clothing, a light rain jacket, and a camera are recommended."
  }
];

export default function FAQPage() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.header}>
          <p className={styles.eyebrow}>Support & Information</p>
          <h1 className={styles.title}>Frequently Asked Questions</h1>
          <p className={styles.sub}>
            Everything you need to know about our private tours. Can't find an answer?{' '}
            <a href="/contact" style={{ color: 'var(--primary)', fontWeight: 600 }}>Get in touch.</a>
          </p>
        </div>

        <div className={styles.faqContainer}>
          {faqs.map((item, i) => (
            <div
              key={i}
              className={`${styles.item} ${open === i ? styles.itemOpen : ''}`}
            >
              <button
                className={styles.question}
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
              >
                <span>{item.q}</span>
                <span className={`${styles.icon} ${open === i ? styles.iconOpen : ''}`}>
                  +
                </span>
              </button>
              <div className={styles.answerWrap} style={{ maxHeight: open === i ? '300px' : '0' }}>
                <p className={styles.answer}>{item.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
