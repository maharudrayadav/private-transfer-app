export interface Service {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  link: string;
  featured?: boolean;
  size?: 'small' | 'medium' | 'large'; // For Bento Grid
}

export const services: Service[] = [
  {
    id: 'airport',
    icon: '✈️',
    title: 'Airport Transfers',
    subtitle: 'VIP Meet & Greet',
    description: 'Executive door-to-door service to and from Dublin, Shannon, and Cork airports with professional chauffeurs.',
    image: '/service_airport.png',
    link: '/services',
    featured: true,
    size: 'large'
  },
  {
    id: 'tours',
    icon: '🍀',
    title: 'Irish Scenic Tours',
    subtitle: 'Bespoke Itineraries',
    description: 'Experience the Wild Atlantic Way and Ireland’s historic landmarks in absolute luxury and comfort.',
    image: '/cliffs_of_moher.png',
    link: '/services',
    featured: true,
    size: 'medium'
  },
  {
    id: 'hotel',
    icon: '🏨',
    title: 'Hotel & Castle Transfers',
    subtitle: 'Seamless Arrivals',
    description: "Direct transfers to Ireland's most prestigious hotels and historic castle estates.",
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1200&auto=format&fit=crop',
    link: '/services',
    size: 'small'
  },
  {
    id: 'business',
    icon: '💼',
    title: 'Executive Travel',
    subtitle: 'Professional Excellence',
    description: 'Dedicated corporate service for business professionals requiring punctuality and discretion.',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop',
    link: '/services',
    size: 'small'
  },
  {
    id: 'wedding',
    icon: '💍',
    title: 'Wedding Luxury',
    subtitle: 'Your Special Day',
    description: 'Sophisticated transportation for weddings, ensuring a grand entrance and a smooth journey.',
    image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1200&auto=format&fit=crop',
    link: '/services',
    size: 'medium'
  }
];
