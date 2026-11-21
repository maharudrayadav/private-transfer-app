import type { Metadata } from 'next';
import PaymentForm from './PaymentForm';

export const metadata: Metadata = {
  title: 'Secure Payment | Private Transfers Ireland',
  description: 'Complete your private airport transfer and chauffeur booking payment securely with encrypted transaction processing.',
  alternates: {
    canonical: 'https://www.privatetransfers.ie/payment',
  },
};

export default function PaymentPage() {
  return <PaymentForm />;
}
