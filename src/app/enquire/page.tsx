import type { Metadata } from 'next';
import { EnquiryForm } from '@/components/EnquiryForm';
export const metadata: Metadata = { title: 'Start your build', alternates: { canonical: '/enquire/' } };
export default function EnquirePage() { return <EnquiryForm />; }
