import { Check } from 'lucide-react';
import type { ReactNode } from 'react';

import styles from './PreparationWorkspace.module.css';

type SelectionOptionProps = Readonly<{
  name: string;
  value: string;
  checked: boolean;
  onChange: () => void;
  title: string;
  description: string;
}>;

export function PreparationStartingStateOption({ name, value, checked, onChange, title, description }: SelectionOptionProps) {
  return (
    <label className={styles.selectionCard} data-selected={checked}>
      <input className={styles.visuallyHidden} type="radio" name={name} value={value} checked={checked} onChange={onChange} />
      <span><span className={styles.selectionTitle}>{title}</span><span className={styles.selectionDescription}>{description}</span></span>
      <span className={styles.selectionIndicator} aria-hidden="true"><Check size={14} strokeWidth={3} /></span>
    </label>
  );
}

export function PreparationTopicOption({ checked, onChange, label }: Readonly<{ checked: boolean; onChange: () => void; label: string }>) {
  return (
    <label className={styles.topicOption} data-selected={checked}>
      <input className={styles.visuallyHidden} type="checkbox" checked={checked} onChange={onChange} />
      <span className={styles.topicIndicator} aria-hidden="true"><Check size={13} strokeWidth={3} /></span>
      <span className={styles.topicTitle}>{label}</span>
    </label>
  );
}

export function PreparationField({ label, children, helper }: Readonly<{ label: string; children: ReactNode; helper?: ReactNode }>) {
  return <label className={styles.field}><span>{label}</span>{children}{helper ? <span className={styles.fieldHelp}>{helper}</span> : null}</label>;
}

export function PreparationSessionStatus() {
  return <span className={styles.sessionStatus}>No information is saved</span>;
}

export { styles as preparationWorkspaceStyles };
