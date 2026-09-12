export function humanizeTransactionValue(value: string | null | undefined) {
  if (!value) return 'Not recorded';
  const labels: Record<string, string> = {
    BUYER: 'Buyer purchase',
    SELLER: 'Seller listing',
    DRAFT: 'Draft',
    ACTIVE: 'Active',
    CLOSED: 'Closed',
    CANCELLED: 'Cancelled',
    PREPARATION: 'Preparation',
    UNDER_CONTRACT: 'Under contract',
    INSPECTION_PERIOD: 'Inspection period',
    TITLE_DUE_DILIGENCE: 'Title due diligence',
    APPRAISAL_FINANCING: 'Appraisal and financing',
    PRE_CLOSING: 'Pre-closing',
    CANCELLED_REPORTED: 'Cancelled (reported)',
    OTHER_REVIEW_REQUIRED: 'Review required',
    AUTHORIZED_REPRESENTATIVE: 'Authorized representative',
  };
  return labels[value] ?? value.split('_').map((part) => part.charAt(0) + part.slice(1).toLowerCase()).join(' ');
}
