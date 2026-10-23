import type { Metadata } from 'next';
import { EnquiryForm } from '@/components/EnquiryForm';
import { pageMetadata } from '@/lib/seo';
export const metadata: Metadata = pageMetadata('Request a Car Customisation Quote in Hyderabad', 'Tell CARTUNEZ your car, upgrade ideas and budget direction. Request a vehicle-specific quote or arrange a visit to our Secunderabad workshop.', '/enquire/');
export default function EnquirePage() { return <EnquiryForm />; }
