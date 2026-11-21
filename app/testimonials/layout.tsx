import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Client Reviews & Testimonials | Private Transfers Ireland',
  description: 'Read verified guest reviews and testimonials from travelers who experienced our private airport transfers, hotel travel, and luxury chauffeur tours across Ireland.',
  alternates: {
    canonical: 'https://www.privatetransfers.ie/testimonials',
  },
};

export default function TestimonialsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
