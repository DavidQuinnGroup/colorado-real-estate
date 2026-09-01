import type { Metadata } from 'next';
import MultiDimensionalStrategyWorkspace from '@/components/agent/MultiDimensionalStrategyWorkspace';

export const dynamic = 'force-dynamic'; export const revalidate = 0;
export const metadata: Metadata = { title: 'Strategy Suite | Project Atlas Agent', description: 'Private Agent workspace for multi-dimensional real-estate strategy analysis.' };
export default function StrategySuitePage() { return <MultiDimensionalStrategyWorkspace />; }
