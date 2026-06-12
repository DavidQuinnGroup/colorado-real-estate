'use client';

import { type FormEvent, useState } from 'react';
import { CheckCircle2, Loader2, Mail, MessageSquareText, Phone, UserRound } from 'lucide-react';

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
};

const TIMELINE_OPTIONS: { value: Timeline; label: string }[] = [
  { value: 'tour', label: 'Schedule Tour' },
  { value: 'now', label: 'Ready Now' },
  { value: 'ninety-days', label: '90 Days' },
  { value: 'research', label: 'Researching' },
];

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();
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
          name: name.trim() || null,
          email: normalizedEmail,
          phone: phone.trim() || null,
          timeline,
          notes: notes.trim() || null,
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
      <section id="property-contact" className="rounded-[8px] border border-cyan-100/28 bg-cyan-100/10 p-5">
        <CheckCircle2 className="text-cyan-100" size={26} aria-hidden="true" />
        <h2 className="mt-3 text-[15px] font-black uppercase tracking-[0.08em] text-white">Inquiry Saved</h2>
        <p className="mt-2 text-sm leading-6 text-white/62">
          This property inquiry is now routed into the REIE CRM queue for follow-up.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-[5px] border border-white/10 bg-white/[0.05] px-2.5 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-white/48">
            {result?.intake?.timelineLabel || 'Property inquiry'}
          </span>
          <span className="rounded-[5px] border border-cyan-100/28 bg-cyan-100/10 px-2.5 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-cyan-100">
            {result?.intake?.leadTemperature || 'warm'}
          </span>
        </div>
      </section>
    );
  }

  return (
    <section id="property-contact" className="rounded-[8px] border border-cyan-100/24 bg-cyan-100/[0.075] p-5">
      <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-cyan-100/76">
        <Mail size={14} aria-hidden="true" />
        Property Inquiry
      </p>
      <h2 className="mt-3 text-[15px] font-black uppercase tracking-[0.08em] text-white">Discuss This Asset</h2>
      <p className="mt-2 text-sm leading-6 text-white/58">
        Request a showing, risk read, or buyer strategy brief for {address}, {city}, {state}.
      </p>

      <form onSubmit={handleSubmit} className="mt-5 space-y-3">
        <label className="relative block">
          <span className="sr-only">Name</span>
          <UserRound className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/28" size={15} aria-hidden="true" />
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Name"
            maxLength={120}
            className="h-11 w-full rounded-[6px] border border-white/10 bg-white/[0.055] pl-9 pr-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-cyan-100/55"
          />
        </label>

        <label className="relative block">
          <span className="sr-only">Email address</span>
          <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/28" size={15} aria-hidden="true" />
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email"
            className="h-11 w-full rounded-[6px] border border-white/10 bg-white/[0.055] pl-9 pr-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-cyan-100/55"
          />
        </label>

        <label className="relative block">
          <span className="sr-only">Phone</span>
          <Phone className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/28" size={15} aria-hidden="true" />
          <input
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="Phone optional"
            maxLength={40}
            className="h-11 w-full rounded-[6px] border border-white/10 bg-white/[0.055] pl-9 pr-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-cyan-100/55"
          />
        </label>

        <div className="grid grid-cols-2 gap-2">
          {TIMELINE_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              aria-pressed={timeline === option.value}
              onClick={() => setTimeline(option.value)}
              className={`h-10 rounded-[6px] border text-[10px] font-black uppercase tracking-[0.12em] transition ${
                timeline === option.value
                  ? 'border-cyan-100 bg-cyan-100 text-[#061017]'
                  : 'border-white/10 bg-white/[0.055] text-white/48 hover:border-cyan-100/35 hover:text-white'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <label className="relative block">
          <span className="sr-only">Notes</span>
          <MessageSquareText className="pointer-events-none absolute left-3 top-3 text-white/28" size={15} aria-hidden="true" />
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Optional context"
            maxLength={600}
            className="min-h-24 w-full resize-none rounded-[6px] border border-white/10 bg-white/[0.055] py-3 pl-9 pr-3 text-sm leading-6 text-white outline-none transition placeholder:text-white/25 focus:border-cyan-100/55"
          />
        </label>

        {errorMessage ? (
          <p aria-live="polite" className="rounded-[6px] border border-red-400/24 bg-red-500/10 px-3 py-2 text-xs font-bold text-red-100">
            {errorMessage}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={submitState === 'submitting'}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-[6px] bg-cyan-100 text-[10px] font-black uppercase tracking-[0.16em] text-[#061017] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitState === 'submitting' ? <Loader2 size={14} className="animate-spin" aria-hidden="true" /> : <Mail size={14} aria-hidden="true" />}
          {submitState === 'submitting' ? 'Saving' : 'Send Inquiry'}
        </button>
      </form>
    </section>
  );
}

