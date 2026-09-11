import type { Metadata } from 'next';
import MultiDimensionalStrategyWorkspace from '@/components/agent/MultiDimensionalStrategyWorkspace';
import MultiPropertyFinancialScenarioWorkspace from '@/components/agent/MultiPropertyFinancialScenarioWorkspace';

export const dynamic = 'force-dynamic'; export const revalidate = 0;
export const metadata: Metadata = { title: 'Financial Strategy | Project Atlas Agent', description: 'Private Agent workspace for governed multi-property financial scenario analysis.' };
export default function StrategySuitePage() { return <><MultiPropertyFinancialScenarioWorkspace /><MultiDimensionalStrategyWorkspace /></>; }
