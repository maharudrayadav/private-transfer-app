'use client';

import { Quote, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import styles from './page.module.css';

const testimonials = [
  {
    title: "Simply the Best Way to Tour Ireland",
    text: "We toured Ireland with Ciaran, Dan, and Dave across several days and each one was fantastic. Comfortable vehicle, amazing stories, and breath-taking locations across the island. We recommend Irish Vacation Tours to everyone we know.",
    author: "Chris & Natalie H.",
    location: "Arizona, USA"
  },
  {
    title: "A Once-in-a-Lifetime Trip Made Perfect",
    text: "Ireland was always on our bucket list and Dave made it truly special. From the Wild Atlantic Way to the Giant’s Causeway, everything was perfectly organized. His knowledge, humor, and care made this trip unforgettable.",
    author: "Mark T.",
    location: "Colorado, USA"
  },
  {
    title: "Outstanding Value and Personal Attention",
    text: "Traveling from Boston, we wanted an authentic Irish experience and that’s exactly what Ciaran and Dan delivered. Smaller groups, relaxed pacing, and unforgettable scenery. Irish Vacation Tours was the best decision we made for our trip.",
    author: "Laura B.",
    location: "Massachusetts, USA"
  },
  {
    title: "Best Tour Company in Ireland",
    text: "From our first day with Dave to our final stop with Shannon, everything was seamless. The multi-day tour covered so much of Ireland without ever feeling rushed. Every guide was knowledgeable, funny, and genuinely cared about our experience.",
    author: "Robert S.",
    location: "Florida, USA"
  },
  {
    title: "Exceptional Guides and Stunning Scenery",
    text: "We did two tours with Irish Vacation Tours — one with Dan and another with Ciaran — and both were outstanding. The Giant’s Causeway tour was a highlight of our trip. The passion and professionalism of the guides truly set this company apart.",
    author: "Emily K.",
    location: "Washington, USA"
  },
  {
    title: "More Than Just a Tour – A True Irish Experience",
    text: "Our tour with Shannon felt like travelling with a friend who knew Ireland inside out. The Cliffs of Moher were breathtaking and perfectly timed to avoid crowds. Shannon was friendly, professional, and full of fascinating history.",
    author: "David P.",
    location: "Illinois, USA"
  },
  {
    title: "Perfect Way to See Ireland",
    text: "We booked a 5-day tour around the island and were lucky enough to have Dave as our guide. He knew every back road, viewpoint, and hidden gem. The Giant’s Causeway was incredible, but Dave made the journey just as memorable as the destination.",
    author: "Jennifer L.",
    location: "New York, USA"
  },
  {
    title: "Absolutely Outstanding from Start to Finish",
    text: "Our Cliffs of Moher tour with Dan was fantastic. He brought us to so many extra stops and never rushed us. Dan’s storytelling and local insights made the day unforgettable. Easily the best tour experience of our entire Ireland trip.",
    author: "Michael R.",
    location: "Texas, USA"
  },
  {
    title: "Unforgettable Irish Experience – Highly Recommend!",
    text: "We travelled from California and booked a multi-day tour around Ireland with Irish Vacation Tours. Ciaran was an exceptional guide — knowledgeable, warm, and incredibly proud of Ireland. From the Cliffs of Moher to the Giant’s Causeway, every day was perfectly planned. This tour exceeded every expectation.",
    author: "Sarah M.",
    location: "California, USA"
  },
  {
    title: "Relaxed, Scenic, and Informative",
    text: "We loved how much time we had at the Cliffs of Moher compared to other tours we saw. No rushing, no stress, just incredible views and stories. This felt like touring Ireland with a knowledgeable friend.",
    author: "Amanda W.",
    location: "Oregon, USA"
  },
  {
    title: "Best Tour Company in Ireland",
    text: "We compared many companies before booking and are so glad we chose Irish Vacation Tours. The multi-day itinerary was flexible, relaxed, and covered so much of Ireland without ever feeling rushed. The Cliffs of Moher at sunset was unforgettable.",
    author: "Robert S.",
    location: "Florida, USA"
  },
  {
    title: "More Than Just a Tour – A True Irish Experience",
    text: "This was not a typical bus tour. We had time to explore, take photos, enjoy coffee stops, and really experience Ireland. The Cliffs of Moher were stunning and never felt overcrowded thanks to great timing. Highly professional and very personal service.",
    author: "David P.",
    location: "Illinois, USA"
  }
];

export default function TestimonialsPage() {
  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.header}>
          <p className={styles.eyebrow}>Guest Reviews</p>
          <h1 className={styles.title}>What Our Guests Say</h1>
          <p className={styles.sub}>
            Read about the experiences of travelers who have explored the beauty, history, and hidden gems of Ireland with our expert driver-guides.
          </p>
        </div>

        <div className={styles.grid}>
          {testimonials.map((item, idx) => (
            <motion.div 
              key={idx} 
              className={styles.cardWrapper}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: (idx % 3) * 0.15 }}
            >
              <div className={styles.card}>
                <div className={styles.quoteIcon}>
                  <Quote size={48} />
                </div>
                
                <div className={styles.stars}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>

                <h3 className={styles.cardTitle}>"{item.title}"</h3>
                <p className={styles.cardText}>{item.text}</p>
                
                <div className={styles.authorMeta}>
                  <div className={styles.authorAvatar}>
                    {item.author.charAt(0)}
                  </div>
                  <div className={styles.authorInfo}>
                    <span className={styles.authorName}>{item.author}</span>
                    <span className={styles.authorLocation}>{item.location}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
