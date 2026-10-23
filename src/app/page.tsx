import { HomeExperience } from '@/components/HomeExperience';
import type { Metadata } from 'next';
export const metadata: Metadata = { alternates: { canonical: '/' } };
export default function HomePage() { return <HomeExperience />; }
