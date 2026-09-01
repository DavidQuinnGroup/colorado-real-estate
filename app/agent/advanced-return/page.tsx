import type { Metadata } from 'next';
import AdvancedInvestmentReturnWorkspace from '@/components/agent/AdvancedInvestmentReturnWorkspace';

export const dynamic = 'force-dynamic'; export const revalidate = 0;
export const metadata: Metadata = { title: 'Advanced Investment Return | Project Atlas Agent', description: 'Private Agent workspace for governed holding-period investment return analysis.' };
export default function AdvancedInvestmentReturnPage() { return <AdvancedInvestmentReturnWorkspace />; }
