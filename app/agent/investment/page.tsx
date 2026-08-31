import type { Metadata } from 'next';
import InvestmentBreakevenWorkspace from '@/components/agent/InvestmentBreakevenWorkspace';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const metadata: Metadata = { title: 'Investment Breakeven | Project Atlas Agent', description: 'Private Agent workspace for assumption-based investment breakeven analysis.' };
export default function InvestmentBreakevenPage() { return <InvestmentBreakevenWorkspace />; }
