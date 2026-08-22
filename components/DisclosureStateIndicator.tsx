'use client';

import { ChevronDown, ChevronUp } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { getDisclosureState } from '@/lib/disclosureState';

type DisclosureStateIndicatorProps = {
  className?: string;
  testId?: string;
};

/**
 * Mirrors the closest native details element. The details `open` property
 * remains the only source of truth for both content visibility and this cue.
 */
export default function DisclosureStateIndicator({
  className = 'h-5 w-5',
  testId = 'project-atlas-disclosure-indicator',
}: DisclosureStateIndicatorProps) {
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const details = indicatorRef.current?.closest('details');
    if (!details) return;

    const synchronize = () => setOpen(details.open);
    synchronize();
    details.addEventListener('toggle', synchronize);
    return () => details.removeEventListener('toggle', synchronize);
  }, []);

  const Icon = open ? ChevronUp : ChevronDown;

  return (
    <span
      ref={indicatorRef}
      aria-hidden="true"
      className="inline-flex shrink-0"
      data-disclosure-indicator={getDisclosureState(open)}
      data-testid={testId}
    >
      <Icon className={className} aria-hidden="true" />
    </span>
  );
}
