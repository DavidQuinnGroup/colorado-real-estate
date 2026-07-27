'use client';

import { type FormEvent, useId, useState } from 'react';
import { ArrowLeft, CheckCircle2, Loader2, MessageSquareText, Search } from 'lucide-react';
import Link from 'next/link';

type SubmitState = 'idle' | 'submitting' | 'success' | 'error';

type SellerResponse = {
  success?: boolean;
  error?: string;
  requestId?: string;
  status?: string;
  sellerLeadStatus?: string;
  followUp?: {
    status?: string;
    emailSent?: boolean;
    nextStep?: string;
  };
};

const objectiveOptions = [
  { value: 'pricing', label: 'Pricing and positioning' },
  { value: 'prepare', label: 'Preparation priorities' },
  { value: 'timing', label: 'Timing and market strategy' },
  { value: 'equity', label: 'Equity and next move planning' },
];

const timelineOptions = [
  { value: 'now', label: 'Ready now' },
  { value: 'ninety-days', label: 'Next 90 days' },
  { value: 'six-months', label: 'Three to six months' },
  { value: 'research', label: 'Researching options' },
];

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function readResponse(response: Response): Promise<SellerResponse> {
  try {
    const body = (await response.json()) as SellerResponse;
    return body && typeof body === 'object' ? body : {};
  } catch {
    return {};
  }
}

export default function HomeValueEstimator() {
  const formId = useId();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [objective, setObjective] = useState('pricing');
  const [timeline, setTimeline] = useState('research');
  const [notes, setNotes] = useState('');
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [result, setResult] = useState<SellerResponse | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedAddress = address.trim();

    if (!normalizedName) {
      setSubmitState('error');
      setErrorMessage('Enter your name so David Quinn Group can follow up.');
      return;
    }

    if (!isValidEmail(normalizedEmail)) {
      setSubmitState('error');
      setErrorMessage('Enter a valid email address.');
      return;
    }

    if (!normalizedAddress) {
      setSubmitState('error');
      setErrorMessage('Enter the property address.');
      return;
    }

    setSubmitState('submitting');
    setErrorMessage('');

    try {
      const response = await fetch('/api/valuation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: normalizedName,
          email: normalizedEmail,
          phone: phone.trim(),
          address: normalizedAddress,
          city: city.trim() || 'Colorado',
          objective,
          timeline,
          notes: notes.trim(),
          source: 'seller-page',
        }),
      });
      const body = await readResponse(response);

      if (!response.ok || !body.success) {
        throw new Error(body.error || 'Unable to save this seller request right now.');
      }

      setResult(body);
      setSubmitState('success');
    } catch (error) {
      setSubmitState('error');
      setErrorMessage(error instanceof Error ? error.message : 'Unable to save this seller request right now.');
    }
  }

  if (submitState === 'success') {
    return (
      <section
        className="rounded-[16px] bg-white/[0.065] p-8 shadow-[0_28px_80px_rgba(0,0,0,0.22)] ring-1 ring-white/12"
        data-testid="seller-intake-confirmation"
        data-seller-request-status={result?.status || ''}
        data-seller-lead-status={result?.sellerLeadStatus || ''}
        data-seller-follow-up-status={result?.followUp?.status || ''}
        data-seller-email-sent={String(result?.followUp?.emailSent ?? false)}
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-cyan-100 text-[#101820]">
          <CheckCircle2 size={30} aria-hidden="true" />
        </div>
        <h2 className="mt-6 text-3xl font-black leading-tight text-white">Seller request saved</h2>
        <p className="mt-4 text-base leading-8 text-white/68">
          David Quinn Group will review your property details, preparation priorities, timing, and market context before follow-up.
        </p>
        <p className="mt-5 text-sm leading-7 text-white/58">
          {result?.followUp?.nextStep ||
            'Expect a direct follow-up through the contact information you submitted. No brokerage relationship is created by submitting this form.'}
        </p>
        <div
          className="mt-7 grid gap-3 sm:grid-cols-2"
          data-testid="cep-conversion-seller-confirmation-recovery"
          data-conversion-source="seller-valuation"
          data-conversion-recovery-state="submitted"
        >
          <Link
            href="/sell"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/14 px-4 py-2 text-[11px] font-black uppercase tracking-[0.13em] text-white/72 transition hover:border-white/32 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-100 focus:ring-offset-2 focus:ring-offset-[#101820]"
          >
            <ArrowLeft size={14} aria-hidden="true" />
            Seller Page
          </Link>
          <Link
            href="/search"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-cyan-100 px-4 py-2 text-[11px] font-black uppercase tracking-[0.13em] text-[#101820] transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-100 focus:ring-offset-2 focus:ring-offset-[#101820]"
          >
            Continue Search
            <Search size={14} aria-hidden="true" />
          </Link>
        </div>
      </section>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[16px] bg-white/[0.065] p-7 shadow-[0_28px_80px_rgba(0,0,0,0.22)] ring-1 ring-white/12 sm:p-8"
      data-testid="seller-intake-form"
      aria-labelledby={`${formId}-title`}
      aria-describedby={`${formId}-description ${formId}-notice`}
      data-conversion-source="seller-valuation"
      data-conversion-backend-route="/api/valuation"
      data-conversion-automated-valuation="false"
      noValidate
    >
      <div>
        <p className="text-[11px] font-black uppercase tracking-[0.22em] text-cyan-100">Seller Analysis Request</p>
        <h2 id={`${formId}-title`} className="mt-4 text-3xl font-black leading-tight text-white">Request a property preparation and pricing review.</h2>
        <p id={`${formId}-description`} className="mt-4 text-sm leading-7 text-white/62">
          This is a consultation request, not an automated home-value estimate. Share the basics and David Quinn Group will review the
          property through local-market, preparation, and positioning context.
        </p>
      </div>

      <div
        className="mt-6 rounded-[10px] border border-cyan-100/18 bg-cyan-100/[0.06] p-4"
        data-testid="cep-conversion-seller-guidance"
        data-conversion-source="seller-valuation"
        data-conversion-backend-route="/api/valuation"
        data-conversion-submission-required="true"
        data-conversion-automated-valuation="false"
      >
        <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.17em] text-cyan-100/78">
          <MessageSquareText size={13} aria-hidden="true" />
          What happens next
        </p>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          <SellerCue label="Review" value="Property details and timing are organized for advisor follow-up." />
          <SellerCue label="Prepare" value="Repairs, presentation, and buyer objections can be discussed before launch." />
          <SellerCue label="Price" value="Pricing conversation stays consultative and local-market based." />
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-bold text-white/76" htmlFor={`${formId}-name`}>
          Name
          <input
            id={`${formId}-name`}
            aria-label="Name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="mt-2 box-border w-full rounded-[8px] border border-white/12 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-cyan-100"
            autoComplete="name"
            required
          />
        </label>
        <label className="block text-sm font-bold text-white/76" htmlFor={`${formId}-email`}>
          Email
          <input
            id={`${formId}-email`}
            aria-label="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-2 box-border w-full rounded-[8px] border border-white/12 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-cyan-100"
            autoComplete="email"
            inputMode="email"
            required
          />
        </label>
        <label className="block text-sm font-bold text-white/76" htmlFor={`${formId}-phone`}>
          Phone
          <input
            id={`${formId}-phone`}
            aria-label="Phone"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            className="mt-2 box-border w-full rounded-[8px] border border-white/12 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-cyan-100"
            autoComplete="tel"
            inputMode="tel"
          />
        </label>
        <label className="block text-sm font-bold text-white/76" htmlFor={`${formId}-city`}>
          City
          <input
            id={`${formId}-city`}
            aria-label="City"
            value={city}
            onChange={(event) => setCity(event.target.value)}
            className="mt-2 box-border w-full rounded-[8px] border border-white/12 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-cyan-100"
            autoComplete="address-level2"
            placeholder="Boulder"
          />
        </label>
      </div>

      <label className="mt-4 block text-sm font-bold text-white/76" htmlFor={`${formId}-address`}>
        Property address
        <input
          id={`${formId}-address`}
          aria-label="Property address"
          value={address}
          onChange={(event) => setAddress(event.target.value)}
          className="mt-2 box-border w-full rounded-[8px] border border-white/12 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-cyan-100"
          autoComplete="street-address"
          required
        />
      </label>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-bold text-white/76" htmlFor={`${formId}-objective`}>
          Main objective
          <select
            id={`${formId}-objective`}
            aria-label="Main objective"
            value={objective}
            onChange={(event) => setObjective(event.target.value)}
            className="mt-2 box-border w-full rounded-[8px] border border-white/12 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-cyan-100"
          >
            {objectiveOptions.map((option) => (
              <option key={option.value} value={option.value} className="bg-[#101820] text-white">
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-bold text-white/76" htmlFor={`${formId}-timeline`}>
          Timeline
          <select
            id={`${formId}-timeline`}
            aria-label="Timeline"
            value={timeline}
            onChange={(event) => setTimeline(event.target.value)}
            className="mt-2 box-border w-full rounded-[8px] border border-white/12 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-cyan-100"
          >
            {timelineOptions.map((option) => (
              <option key={option.value} value={option.value} className="bg-[#101820] text-white">
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="mt-5 block text-sm font-bold text-white/76" htmlFor={`${formId}-notes`}>
        Optional notes
        <textarea
          id={`${formId}-notes`}
          aria-label="Optional notes"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          className="mt-2 box-border min-h-28 w-full resize-y rounded-[8px] border border-white/12 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-cyan-100"
          placeholder="Preparation questions, updates, timing, or concerns you want reviewed."
        />
      </label>

      {submitState === 'error' ? (
        <p className="mt-5 rounded-[8px] border border-amber-200/30 bg-amber-200/10 px-4 py-3 text-sm font-semibold text-amber-100" role="alert">
          {errorMessage}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={submitState === 'submitting'}
        className="mt-7 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-cyan-100 px-6 py-3 text-sm font-black uppercase tracking-[0.14em] text-[#101820] transition hover:-translate-y-0.5 hover:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-100 focus:ring-offset-2 focus:ring-offset-[#101820] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitState === 'submitting' ? (
          <>
            <Loader2 className="mr-2 animate-spin" size={17} aria-hidden="true" />
            Saving Request
          </>
        ) : (
          'Request Seller Review'
        )}
      </button>
      <p id={`${formId}-notice`} className="mt-5 text-xs leading-6 text-white/46">
        Submitting this form requests follow-up only. Do not include confidential negotiating positions or financial limits until the
        appropriate brokerage relationship and disclosures have been discussed.
      </p>
    </form>
  );
}

function SellerCue({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[8px] border border-white/10 bg-black/18 p-3">
      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-white/40">{label}</p>
      <p className="mt-1.5 text-xs font-bold leading-5 text-white/66">{value}</p>
    </div>
  );
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/components/HomeValueEstimator.tsx
