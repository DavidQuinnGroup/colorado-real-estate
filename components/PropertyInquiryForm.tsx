'use client';

import { type CSSProperties, type FormEvent, type ReactNode, useState } from 'react';
import {
  CheckCircle2,
  Clock3,
  Loader2,
  Mail,
  MessageSquareText,
  Phone,
  ShieldCheck,
  Sparkles,
  UserRound,
} from 'lucide-react';
import Link from 'next/link';

type PropertyInquiryFormProps = {
  propertyId: string;
  address: string;
  city: string;
  state: string;
};

type SubmitState = 'idle' | 'submitting' | 'success' | 'error';
type Timeline = 'research' | 'ninety-days' | 'now' | 'tour';

type PropertyInquiryResponse = {
  success?: boolean;
  error?: string;
  crmTaskId?: string;
  intake?: {
    leadTemperature?: string;
    timelineLabel?: string;
  };
  notification?: {
    sent?: boolean;
    reason?: string;
    attempted?: boolean;
    required?: boolean;
    priority?: string;
    channel?: string;
  };
};

const TIMELINE_OPTIONS: { value: Timeline; label: string; detail: string }[] = [
  { value: 'tour', label: 'Schedule Tour', detail: 'Showing request and property-specific prep.' },
  { value: 'now', label: 'Ready Now', detail: 'Active buyer strategy and offer timing.' },
  { value: 'ninety-days', label: '90 Days', detail: 'Planning window and market watch.' },
  { value: 'research', label: 'Researching', detail: 'Early diligence and fit questions.' },
];

const textControlStyle: CSSProperties = {
  boxSizing: 'border-box',
  minHeight: 44,
  paddingBottom: 10,
  paddingTop: 10,
};

const iconTextControlStyle: CSSProperties = {
  ...textControlStyle,
  paddingLeft: 36,
  paddingRight: 12,
};

const timelineButtonStyle: CSSProperties = {
  boxSizing: 'border-box',
  minHeight: 44,
  padding: '10px 8px',
};

const notesControlStyle: CSSProperties = {
  boxSizing: 'border-box',
  minHeight: 96,
  padding: 12,
};

const submitButtonStyle: CSSProperties = {
  boxSizing: 'border-box',
  minHeight: 44,
  padding: '12px 12px',
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getTimelineDetail(timeline: Timeline) {
  return TIMELINE_OPTIONS.find((option) => option.value === timeline)?.detail || 'Property-specific follow-up.';
}

function getTimelineLabel(timeline: Timeline) {
  return TIMELINE_OPTIONS.find((option) => option.value === timeline)?.label || 'Property Inquiry';
}

function isNotificationRequired(timeline: Timeline) {
  return timeline === 'tour' || timeline === 'now';
}

async function readResponse(response: Response): Promise<PropertyInquiryResponse> {
  try {
    const body = (await response.json()) as PropertyInquiryResponse;
    return body && typeof body === 'object' ? body : {};
  } catch {
    return {};
  }
}

export default function PropertyInquiryForm({ propertyId, address, city, state }: PropertyInquiryFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [timeline, setTimeline] = useState<Timeline>('tour');
  const [notes, setNotes] = useState('');
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [result, setResult] = useState<PropertyInquiryResponse | null>(null);
  const normalizedName = name.trim();
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedPhone = phone.trim();
  const normalizedNotes = notes.trim();
  const hasValidEmail = isValidEmail(normalizedEmail);
  const timelineLabel = result?.intake?.timelineLabel || getTimelineLabel(timeline);
  const leadTemperature = result?.intake?.leadTemperature || (timeline === 'tour' || timeline === 'now' ? 'hot' : 'warm');
  const notification = result?.notification;
  const notificationChannel = notification?.channel || 'property-inquiry-email';
  const notificationRequired = notification?.required ?? isNotificationRequired(timeline);
  const notificationAttempted = notification?.attempted ?? false;
  const notificationSent = notification?.sent ?? false;
  const notificationReason = notification?.reason || '';

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isValidEmail(normalizedEmail)) {
      setSubmitState('error');
      setErrorMessage('Enter a valid email address.');
      return;
    }

    setSubmitState('submitting');
    setErrorMessage('');
    setResult(null);

    try {
      const response = await fetch('/api/property-inquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          propertyId,
          name: normalizedName || null,
          email: normalizedEmail,
          phone: normalizedPhone || null,
          timeline,
          notes: normalizedNotes || null,
          source: 'property-page',
        }),
      });
      const payload = await readResponse(response);

      if (!response.ok || !payload.success) {
        throw new Error(payload.error || 'Unable to save this inquiry.');
      }

      setResult(payload);
      setSubmitState('success');
    } catch (error) {
      setSubmitState('error');
      setErrorMessage(error instanceof Error ? error.message : 'Unable to save this inquiry.');
    }
  }

  if (submitState === 'success') {
    return (
      <section
        id="property-contact"
        tabIndex={-1}
        aria-labelledby="property-contact-heading"
        aria-live="polite"
        className="scroll-mt-24 overflow-hidden rounded-[8px] border border-cyan-100/28 bg-[#071017] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-100/45"
        data-testid="reie-property-inquiry"
        data-property-inquiry-state={submitState}
        data-property-inquiry-property-id={propertyId}
        data-property-inquiry-address={address}
        data-property-inquiry-city={city}
        data-property-inquiry-region={state}
        data-property-inquiry-source="property-page"
        data-property-inquiry-route="/api/property-inquiry"
        data-property-inquiry-timeline={timeline}
        data-property-inquiry-timeline-label={timelineLabel}
        data-property-inquiry-lead-temperature={leadTemperature}
        data-property-inquiry-crm-task-id={result?.crmTaskId || ''}
        data-property-inquiry-notification-channel={notificationChannel}
        data-property-inquiry-notification-required={notificationRequired ? 'true' : 'false'}
        data-property-inquiry-notification-attempted={notificationAttempted ? 'true' : 'false'}
        data-property-inquiry-notification-sent={notificationSent ? 'true' : 'false'}
        data-property-inquiry-notification-reason={notificationReason}
        data-property-inquiry-error=""
      >
        <div className="border-b border-cyan-100/14 bg-cyan-100/[0.075] p-5">
          <CheckCircle2 className="text-cyan-100" size={26} aria-hidden="true" />
          <h2 id="property-contact-heading" className="mt-3 text-[15px] font-black uppercase tracking-[0.08em] text-white">Inquiry Saved</h2>
          <p className="mt-2 text-sm leading-6 text-white/62">
            This property inquiry has been saved for David Quinn Group follow-up.
          </p>
        </div>
        <div
          className="grid gap-2 p-4 sm:grid-cols-2"
          data-testid="reie-property-inquiry-success"
          data-property-inquiry-timeline-label={timelineLabel}
          data-property-inquiry-lead-temperature={leadTemperature}
          data-property-inquiry-crm-task-id={result?.crmTaskId || ''}
          data-property-inquiry-notification-channel={notificationChannel}
          data-property-inquiry-notification-required={notificationRequired ? 'true' : 'false'}
          data-property-inquiry-notification-attempted={notificationAttempted ? 'true' : 'false'}
          data-property-inquiry-notification-sent={notificationSent ? 'true' : 'false'}
          data-property-inquiry-notification-reason={notificationReason}
        >
          <SuccessMetric label="Request" value={timelineLabel} />
          <SuccessMetric label="Follow-up" value={leadTemperature} tone="cyan" />
        </div>
      </section>
    );
  }

  return (
    <section
      id="property-contact"
      tabIndex={-1}
      aria-labelledby="property-contact-heading"
      className="scroll-mt-24 overflow-hidden rounded-[8px] border border-cyan-100/24 bg-[#071017] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-100/45"
      data-testid="reie-property-inquiry"
      data-property-inquiry-state={submitState}
      data-property-inquiry-property-id={propertyId}
      data-property-inquiry-address={address}
      data-property-inquiry-city={city}
      data-property-inquiry-region={state}
      data-property-inquiry-source="property-page"
      data-property-inquiry-route="/api/property-inquiry"
      data-property-inquiry-timeline={timeline}
      data-property-inquiry-timeline-label={timelineLabel}
      data-property-inquiry-lead-temperature={leadTemperature}
      data-property-inquiry-notification-channel={notificationChannel}
      data-property-inquiry-notification-required={notificationRequired ? 'true' : 'false'}
      data-property-inquiry-notification-attempted={notificationAttempted ? 'true' : 'false'}
      data-property-inquiry-notification-sent={notificationSent ? 'true' : 'false'}
      data-property-inquiry-notification-reason={notificationReason}
      data-property-inquiry-name-present={normalizedName ? 'true' : 'false'}
      data-property-inquiry-phone-present={normalizedPhone ? 'true' : 'false'}
      data-property-inquiry-email-present={normalizedEmail ? 'true' : 'false'}
      data-property-inquiry-email-valid={hasValidEmail ? 'true' : 'false'}
      data-property-inquiry-notes-present={normalizedNotes ? 'true' : 'false'}
      data-property-inquiry-notes-length={notes.length}
      data-property-inquiry-notes-max-length="600"
      data-property-inquiry-error={errorMessage}
    >
      <div className="border-b border-cyan-100/14 bg-cyan-100/[0.075] p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-cyan-100/76">
              <Mail size={14} aria-hidden="true" />
              Property Inquiry
            </p>
            <h2 id="property-contact-heading" className="mt-3 text-[18px] font-black uppercase leading-tight tracking-[0.06em] text-white">Ask About This Property</h2>
          </div>
          <span className="rounded-[5px] border border-cyan-100/24 bg-black/30 px-2.5 py-1.5 text-[9px] font-black uppercase tracking-[0.14em] text-cyan-100/78">
            Follow-up
          </span>
        </div>
        <p className="mt-3 text-sm leading-6 text-white/62">
          Ask about the property, financial assumptions, construction records, market context, or appropriate next steps for {address}, {city}, {state}.
        </p>
      </div>

      <div
        className="grid gap-2 border-b border-white/10 p-4 sm:grid-cols-2"
        data-testid="reie-property-inquiry-status"
        data-property-inquiry-timeline={timeline}
        data-property-inquiry-timeline-detail={getTimelineDetail(timeline)}
      >
        <StatusTile icon={<ShieldCheck size={13} />} label="Follow-up routing" value="Property-specific inquiry saved" />
        <StatusTile icon={<Clock3 size={13} />} label="Current Request" value={getTimelineDetail(timeline)} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 p-5"
        data-testid="reie-property-inquiry-form"
        data-property-inquiry-state={submitState}
        data-property-inquiry-source="property-page"
        data-property-inquiry-route="/api/property-inquiry"
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <FieldShell icon={<UserRound size={15} aria-hidden="true" />} label="Name">
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Name"
              maxLength={120}
              style={iconTextControlStyle}
              className="h-11 w-full rounded-[6px] border border-white/10 bg-white/[0.055] pl-9 pr-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-cyan-100/55"
              data-testid="reie-property-inquiry-name"
              data-property-inquiry-name-present={normalizedName ? 'true' : 'false'}
              data-property-inquiry-name-length={name.length}
              data-property-inquiry-name-max-length="120"
            />
          </FieldShell>

          <FieldShell icon={<Phone size={15} aria-hidden="true" />} label="Phone">
            <input
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="Phone optional"
              maxLength={40}
              style={iconTextControlStyle}
              className="h-11 w-full rounded-[6px] border border-white/10 bg-white/[0.055] pl-9 pr-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-cyan-100/55"
              data-testid="reie-property-inquiry-phone"
              data-property-inquiry-phone-present={normalizedPhone ? 'true' : 'false'}
              data-property-inquiry-phone-length={phone.length}
              data-property-inquiry-phone-max-length="40"
            />
          </FieldShell>
        </div>

        <FieldShell icon={<Mail size={15} aria-hidden="true" />} label="Email address" required>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email"
            style={iconTextControlStyle}
            className="h-11 w-full rounded-[6px] border border-white/10 bg-white/[0.055] pl-9 pr-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-cyan-100/55"
            data-testid="reie-property-inquiry-email"
            data-property-inquiry-email-present={normalizedEmail ? 'true' : 'false'}
            data-property-inquiry-email-valid={hasValidEmail ? 'true' : 'false'}
          />
        </FieldShell>

        <div>
          <div className="mb-2 flex items-center justify-between gap-3">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/40">Timing / Intent</p>
            <p className="truncate text-[10px] font-black uppercase tracking-[0.12em] text-cyan-100/70">{getTimelineLabel(timeline)}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {TIMELINE_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                aria-pressed={timeline === option.value}
                onClick={() => setTimeline(option.value)}
                style={timelineButtonStyle}
                data-testid="reie-property-inquiry-timeline"
                data-property-inquiry-timeline={option.value}
                data-property-inquiry-timeline-label={option.label}
                data-property-inquiry-timeline-detail={option.detail}
                data-property-inquiry-timeline-selected={timeline === option.value ? 'true' : 'false'}
                className={`min-h-11 rounded-[6px] border px-2 text-[10px] font-black uppercase tracking-[0.12em] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-100 ${
                  timeline === option.value
                    ? 'border-cyan-100 bg-cyan-100 text-[#061017] shadow-[0_0_0_1px_rgba(207,250,254,0.22)]'
                    : 'border-white/10 bg-white/[0.055] text-white/48 hover:border-cyan-100/35 hover:text-white'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <label className="relative block rounded-[6px] border border-white/10 bg-white/[0.035] p-3">
          <span className="mb-2 flex items-center justify-between gap-3 text-[10px] font-black uppercase tracking-[0.14em] text-white/40">
            <span className="flex items-center gap-2">
              <MessageSquareText size={13} aria-hidden="true" className="text-cyan-100/62" />
              Notes optional but helpful
            </span>
            <span>{notes.length}/600</span>
          </span>
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Property questions, records to verify, market context, timing, or next-step concerns"
            maxLength={600}
            style={notesControlStyle}
            className="min-h-24 w-full resize-none rounded-[6px] border border-white/10 bg-[#071017]/70 px-3 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-white/25 focus:border-cyan-100/55"
            data-testid="reie-property-inquiry-notes"
            data-property-inquiry-notes-present={normalizedNotes ? 'true' : 'false'}
            data-property-inquiry-notes-length={notes.length}
            data-property-inquiry-notes-max-length="600"
          />
        </label>

        {errorMessage ? (
          <p
            aria-live="polite"
            className="rounded-[6px] border border-red-400/24 bg-red-500/10 px-3 py-2 text-xs font-bold text-red-100"
            data-testid="reie-property-inquiry-error"
            data-property-inquiry-error={errorMessage}
          >
            {errorMessage}
          </p>
        ) : null}

        <p
          className="text-xs leading-5 text-white/40"
          data-testid="reie-property-inquiry-consent-notice"
          data-public-trust-form-notice="property-inquiry"
        >
          Email is required. Name, phone, timing, and notes are optional. This inquiry is used for property-specific follow-up routing and
          does not automatically create a brokerage relationship. Review the{' '}
          <Link href="/privacy" className="font-bold text-cyan-100 underline underline-offset-4">
            Privacy Notice
          </Link>{' '}
          and{' '}
          <Link href="/terms" className="font-bold text-cyan-100 underline underline-offset-4">
            Terms of Use
          </Link>
          . Do not submit confidential negotiating positions, motivation, financial limits, or client-confidential information until the
          applicable brokerage relationship and disclosures have been discussed.
        </p>

        <button
          type="submit"
          disabled={submitState === 'submitting'}
          style={submitButtonStyle}
          className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-[6px] bg-cyan-100 px-3 py-3 text-[10px] font-black uppercase tracking-[0.16em] text-[#061017] transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-100 disabled:cursor-not-allowed disabled:opacity-60"
          data-testid="reie-property-inquiry-submit"
          data-property-inquiry-state={submitState}
          data-property-inquiry-disabled={submitState === 'submitting' ? 'true' : 'false'}
          data-property-inquiry-email-valid={hasValidEmail ? 'true' : 'false'}
        >
          {submitState === 'submitting' ? <Loader2 size={14} className="animate-spin" aria-hidden="true" /> : <Mail size={14} aria-hidden="true" />}
          {submitState === 'submitting' ? 'Saving' : 'Ask About This Property'}
        </button>
      </form>
    </section>
  );
}

function FieldShell({
  icon,
  label,
  required,
  children,
}: {
  icon: ReactNode;
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center justify-between gap-3 text-[10px] font-black uppercase tracking-[0.14em] text-white/38">
        <span>{label}</span>
        {required ? <span className="text-cyan-100/70">Required</span> : null}
      </span>
      <span className="relative block">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/28">{icon}</span>
        {children}
      </span>
    </label>
  );
}

function StatusTile({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-[6px] border border-white/10 bg-white/[0.045] px-3 py-2.5">
      <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.14em] text-cyan-100/72">
        {icon}
        {label}
      </p>
      <p className="mt-2 text-xs leading-5 text-white/50">{value}</p>
    </div>
  );
}

function SuccessMetric({ label, value, tone = 'white' }: { label: string; value: string; tone?: 'white' | 'cyan' }) {
  const valueClass = tone === 'cyan' ? 'text-cyan-100' : 'text-white/72';

  return (
    <div className="rounded-[6px] border border-white/10 bg-white/[0.045] p-3">
      <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.14em] text-white/38">
        <Sparkles size={12} aria-hidden="true" className="text-cyan-100/62" />
        {label}
      </p>
      <p className={`mt-2 truncate text-xs font-black uppercase tracking-[0.1em] ${valueClass}`}>{value}</p>
    </div>
  );
}
