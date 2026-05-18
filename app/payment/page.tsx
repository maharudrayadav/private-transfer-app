import type { Metadata } from 'next';
import PaymentForm from './PaymentForm';

export const metadata: Metadata = {
  title: 'Secure Payment | Private Transfer Ireland',
  description: 'Complete your booking reservation payment securely.',
};

export default function PaymentPage() {
  return <PaymentForm />;
}
