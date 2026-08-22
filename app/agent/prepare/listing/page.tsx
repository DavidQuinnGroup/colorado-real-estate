import type { Metadata } from 'next';
import ListingPreparationExperience from '@/components/agent/ListingPreparationExperience';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Listing Preparation | Project Atlas', description: 'Read-only Agent listing preparation using explicit, session-only inputs.' };
export default function AgentListingPreparationPage() { return <ListingPreparationExperience />; }
