import type { Metadata } from 'next';
import SellerFinancialWorkspace from '@/components/agent/SellerFinancialWorkspace';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Seller Financial Preparation | Project Atlas', description: 'Private Agent workspace for estimated seller financial scenarios.' };
export default function SellerFinancialPage() { return <SellerFinancialWorkspace />; }
