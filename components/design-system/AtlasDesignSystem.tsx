import type { AnchorHTMLAttributes, ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';

export type AtlasActionTone = 'primary' | 'secondary' | 'ghost' | 'secure' | 'destructive';
export type AtlasSurfaceMaterial = 'glass' | 'elevated' | 'floating' | 'data' | 'reading' | 'critical';
export type AtlasNoticeTone = 'information' | 'success' | 'attention' | 'warning' | 'error' | 'blocking';
export type AtlasInformationClass =
  | 'governed-fact'
  | 'assumption'
  | 'modeled-result'
  | 'professional-input'
  | 'editorial-context'
  | 'agent-opinion'
  | 'system-status'
  | 'warning-limitation';
export type AtlasStatus =
  | 'active'
  | 'pending'
  | 'draft'
  | 'complete'
  | 'review-required'
  | 'expired'
  | 'superseded'
  | 'error'
  | 'blocked'
  | 'archived';

const informationClassLabels: Record<AtlasInformationClass, string> = {
  'governed-fact': 'Governed fact',
  assumption: 'Assumption',
  'modeled-result': 'Modeled result',
  'professional-input': 'Professional input',
  'editorial-context': 'Editorial context',
  'agent-opinion': 'Agent opinion',
  'system-status': 'System status',
  'warning-limitation': 'Warning / limitation',
};

const statusLabels: Record<AtlasStatus, string> = {
  active: 'Active',
  pending: 'Pending',
  draft: 'Draft',
  complete: 'Complete',
  'review-required': 'Review required',
  expired: 'Expired',
  superseded: 'Superseded',
  error: 'Error',
  blocked: 'Blocked',
  archived: 'Archived',
};

function joinClassNames(...values: Array<string | undefined>) {
  return values.filter(Boolean).join(' ');
}

export function AtlasSurface({
  className,
  material = 'glass',
  ...props
}: HTMLAttributes<HTMLDivElement> & { material?: AtlasSurfaceMaterial }) {
  const materialClass = material === 'glass' ? 'atlas-ds-surface-glass' : `atlas-ds-surface-${material}`;
  return <div className={joinClassNames('atlas-ds-surface', materialClass, 'font-atlas', className)} {...props} />;
}

export function AtlasButton({
  children,
  className,
  disabled,
  loading = false,
  tone = 'primary',
  type = 'button',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean; tone?: AtlasActionTone }) {
  return (
    <button
      {...props}
      aria-busy={loading || undefined}
      className={joinClassNames('atlas-ds-action', `atlas-ds-action-${tone}`, className)}
      data-loading={loading}
      disabled={disabled || loading}
      type={type}
    >
      {children}
    </button>
  );
}

export function AtlasLink({ className, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <a className={joinClassNames('atlas-ds-link', className)} {...props} />;
}

export function AtlasField({
  children,
  className,
  description,
  htmlFor,
  label,
  message,
  messageTone = 'information',
  unit,
}: {
  children: ReactNode;
  className?: string;
  description?: ReactNode;
  htmlFor?: string;
  label: ReactNode;
  message?: ReactNode;
  messageTone?: 'error' | 'warning' | 'information';
  unit?: ReactNode;
}) {
  return (
    <div className={joinClassNames('atlas-ds-field', className)}>
      <label className="atlas-ds-label" htmlFor={htmlFor}>{label}</label>
      <div className="atlas-ds-field-control">
        {children}
        {unit ? <span className="atlas-ds-field-unit">{unit}</span> : null}
      </div>
      {description ? <p className="atlas-ds-field-help">{description}</p> : null}
      {message ? <p className="atlas-ds-field-message" data-tone={messageTone}>{message}</p> : null}
    </div>
  );
}

export function AtlasNotice({
  children,
  className,
  title,
  tone = 'information',
}: {
  children: ReactNode;
  className?: string;
  title: ReactNode;
  tone?: AtlasNoticeTone;
}) {
  const role = tone === 'blocking' || tone === 'error' ? 'alert' : 'status';
  return (
    <section aria-live="polite" className={joinClassNames('atlas-ds-notice', className)} data-notice={tone} role={role}>
      <h2 className="atlas-ds-notice-title">{title}</h2>
      <div className="atlas-ds-notice-body">{children}</div>
    </section>
  );
}

export function AtlasInformationClassLabel({
  className,
  informationClass,
  label,
}: {
  className?: string;
  informationClass: AtlasInformationClass;
  label?: string;
}) {
  return (
    <span className={joinClassNames('atlas-ds-information-class', className)} data-information-class={informationClass}>
      {label ?? informationClassLabels[informationClass]}
    </span>
  );
}

export function AtlasStatusLabel({ className, label, status }: { className?: string; label?: string; status: AtlasStatus }) {
  return <span className={joinClassNames('atlas-ds-status', className)} data-status={status}>{label ?? statusLabels[status]}</span>;
}

export function AtlasEmptyState({ children, className, title }: { children: ReactNode; className?: string; title: ReactNode }) {
  return <section className={joinClassNames('atlas-ds-empty-state', className)}><h2 className="atlas-ds-panel-title">{title}</h2><div>{children}</div></section>;
}

export function AtlasLoadingState({ children = 'Loading', className }: { children?: ReactNode; className?: string }) {
  return <div aria-live="polite" className={joinClassNames('atlas-ds-loading-state', className)} role="status">{children}</div>;
}

export function AtlasErrorState({ children, className, title }: { children: ReactNode; className?: string; title: ReactNode }) {
  return <section className={joinClassNames('atlas-ds-error-state', className)} role="alert"><h2 className="atlas-ds-panel-title">{title}</h2><div>{children}</div></section>;
}
