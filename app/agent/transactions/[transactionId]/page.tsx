import TransactionDetailWorkspace from '@/components/agent/TransactionDetailWorkspace';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function TransactionDetailPage({ params }: { params: Promise<{ transactionId: string }> }) {
  const { transactionId } = await params;
  return <TransactionDetailWorkspace transactionId={transactionId} />;
}
