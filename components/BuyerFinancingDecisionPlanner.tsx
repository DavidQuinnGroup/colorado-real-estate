'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';

type PlannerValues = {
  purchasePrice: string;
  downPayment: string;
  interestRate: string;
  loanTermYears: '15' | '20' | '30';
  propertyTaxes: string;
  homeownersInsurance: string;
  hoaDues: string;
  mortgageInsurance: string;
  maintenance: string;
  utilities: string;
  otherRecurringCosts: string;
  closingCosts: string;
};

type NumericFieldKey = keyof Omit<PlannerValues, 'loanTermYears'>;

const initialValues: PlannerValues = {
  purchasePrice: '',
  downPayment: '',
  interestRate: '',
  loanTermYears: '30',
  propertyTaxes: '',
  homeownersInsurance: '',
  hoaDues: '',
  mortgageInsurance: '',
  maintenance: '',
  utilities: '',
  otherRecurringCosts: '',
  closingCosts: '',
};

const coreFields: Array<{
  key: NumericFieldKey;
  label: string;
  description: string;
  prefix?: string;
  suffix?: string;
}> = [
  {
    key: 'purchasePrice',
    label: 'Purchase price assumption',
    description: 'Use the price you want to discuss, not a REIE recommendation.',
    prefix: '$',
  },
  {
    key: 'downPayment',
    label: 'Down payment assumption',
    description: 'Enter a dollar amount. The planner does not decide whether it is enough.',
    prefix: '$',
  },
  {
    key: 'interestRate',
    label: 'Interest-rate assumption',
    description: 'User-entered only. No live rates or lender quotes are used.',
    suffix: '%',
  },
];

const optionalMonthlyFields: Array<{
  key: NumericFieldKey;
  label: string;
  verifyPrompt: string;
}> = [
  {
    key: 'propertyTaxes',
    label: 'Property taxes',
    verifyPrompt: 'Confirm current property-tax assumptions with qualified sources.',
  },
  {
    key: 'homeownersInsurance',
    label: 'Homeowners insurance',
    verifyPrompt: 'Ask an insurance professional what coverage assumptions are included.',
  },
  {
    key: 'hoaDues',
    label: 'HOA dues',
    verifyPrompt: 'Review association materials and confirm what dues include or exclude.',
  },
  {
    key: 'mortgageInsurance',
    label: 'Monthly mortgage-insurance assumption',
    verifyPrompt: 'Ask a lender whether mortgage insurance applies and how it is determined.',
  },
  {
    key: 'maintenance',
    label: 'Maintenance',
    verifyPrompt: 'Discuss property condition, reserves, and repair exposure before relying on this assumption.',
  },
  {
    key: 'utilities',
    label: 'Utilities',
    verifyPrompt: 'Verify utility costs using property-specific and current information where available.',
  },
  {
    key: 'otherRecurringCosts',
    label: 'Other recurring ownership costs',
    verifyPrompt: 'Identify whether any recurring cost category remains outside this planner.',
  },
];

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

function parsePlannerNumber(value: string): number | null {
  if (value.trim() === '') {
    return null;
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return null;
  }

  return parsed;
}

function formatCurrency(value: number) {
  return currencyFormatter.format(Math.round(value));
}

function calculatePrincipalAndInterest(loanAmount: number, annualRate: number, loanTermYears: number) {
  const months = loanTermYears * 12;

  if (annualRate === 0) {
    return loanAmount / months;
  }

  const monthlyRate = annualRate / 100 / 12;
  const factor = (1 + monthlyRate) ** months;

  return (loanAmount * monthlyRate * factor) / (factor - 1);
}

function getValidationMessages(values: PlannerValues) {
  const messages: string[] = [];
  const purchasePrice = parsePlannerNumber(values.purchasePrice);
  const downPayment = parsePlannerNumber(values.downPayment);
  const interestRate = parsePlannerNumber(values.interestRate);

  if (purchasePrice !== null && purchasePrice <= 0) {
    messages.push('Purchase price must be greater than zero before arithmetic can appear.');
  }

  if (downPayment !== null && downPayment < 0) {
    messages.push('Down payment cannot be negative.');
  }

  if (interestRate !== null && interestRate < 0) {
    messages.push('Interest-rate assumption cannot be negative.');
  }

  if (purchasePrice !== null && downPayment !== null && downPayment > purchasePrice) {
    messages.push('Down payment cannot exceed the purchase price assumption.');
  }

  for (const field of optionalMonthlyFields) {
    const value = parsePlannerNumber(values[field.key]);
    if (value !== null && value < 0) {
      messages.push(`${field.label} cannot be negative.`);
    }
  }

  const closingCosts = parsePlannerNumber(values.closingCosts);
  if (closingCosts !== null && closingCosts < 0) {
    messages.push('Closing-cost assumption cannot be negative.');
  }

  return messages;
}

function buildMissingAssumptions(values: PlannerValues) {
  const missing: string[] = [];

  if (parsePlannerNumber(values.purchasePrice) === null) {
    missing.push('Purchase price assumption');
  }
  if (parsePlannerNumber(values.downPayment) === null) {
    missing.push('Down payment assumption');
  }
  if (parsePlannerNumber(values.interestRate) === null) {
    missing.push('Interest-rate assumption');
  }

  for (const field of optionalMonthlyFields) {
    if (parsePlannerNumber(values[field.key]) === null) {
      missing.push(field.label);
    }
  }

  if (parsePlannerNumber(values.closingCosts) === null) {
    missing.push('Closing costs and cash-to-close questions');
  }

  return missing;
}

function buildQuestions(values: PlannerValues, missingAssumptions: string[]) {
  const questions = new Set<string>();

  questions.add('Which loan types, terms, lender fees, and timing rules should I review with a qualified lender?');
  questions.add('Which assumptions are included or excluded from any lender estimate I receive?');
  questions.add('Which property-specific facts could affect financing, insurance, HOA, timing, or offer strategy?');

  if (missingAssumptions.some((item) => item.includes('Property taxes'))) {
    questions.add('What current tax information should be verified before relying on this property-cost assumption?');
  }

  if (missingAssumptions.some((item) => item.includes('insurance'))) {
    questions.add('What insurance assumptions should be confirmed before comparing monthly ownership costs?');
  }

  if (missingAssumptions.some((item) => item.includes('HOA'))) {
    questions.add('Which HOA dues, reserves, transfer fees, rules, and included services should be reviewed?');
  }

  if (
    missingAssumptions.some((item) => item.includes('mortgage-insurance')) ||
    parsePlannerNumber(values.mortgageInsurance) !== null
  ) {
    questions.add('Does mortgage insurance apply, and how should the amount be verified with a qualified lender?');
  }

  if (missingAssumptions.some((item) => item.includes('Closing costs'))) {
    questions.add('Which closing costs, prepaid expenses, reserves, and cash-to-close items should be verified?');
  }

  if (parsePlannerNumber(values.interestRate) !== null) {
    questions.add('How would this user-entered rate assumption change if the lender quote, lock timing, or loan terms differ?');
  }

  return Array.from(questions);
}

export default function BuyerFinancingDecisionPlanner() {
  const [values, setValues] = useState<PlannerValues>(initialValues);
  const [optionalOpen, setOptionalOpen] = useState(false);

  const result = useMemo(() => {
    const purchasePrice = parsePlannerNumber(values.purchasePrice);
    const downPayment = parsePlannerNumber(values.downPayment);
    const interestRate = parsePlannerNumber(values.interestRate);
    const loanTermYears = Number(values.loanTermYears);
    const validationMessages = getValidationMessages(values);
    const requiredInputsComplete =
      purchasePrice !== null &&
      downPayment !== null &&
      interestRate !== null &&
      purchasePrice > 0 &&
      downPayment >= 0 &&
      downPayment <= purchasePrice &&
      interestRate >= 0 &&
      validationMessages.length === 0;

    const loanAmount = requiredInputsComplete ? purchasePrice - downPayment : null;
    const principalAndInterest =
      requiredInputsComplete && loanAmount !== null
        ? calculatePrincipalAndInterest(loanAmount, interestRate, loanTermYears)
        : null;

    const optionalEntries = optionalMonthlyFields
      .map((field) => ({
        label: field.label,
        value: parsePlannerNumber(values[field.key]),
        prompt: field.verifyPrompt,
      }))
      .filter((entry): entry is { label: string; value: number; prompt: string } => entry.value !== null && entry.value >= 0);

    const optionalMonthlySubtotal = optionalEntries.reduce((sum, entry) => sum + entry.value, 0);
    const combinedMonthlyEstimate =
      principalAndInterest !== null ? principalAndInterest + optionalMonthlySubtotal : null;
    const missingAssumptions = buildMissingAssumptions(values);
    const questions = buildQuestions(values, missingAssumptions);

    return {
      validationMessages,
      requiredInputsComplete,
      loanAmount,
      principalAndInterest,
      optionalEntries,
      optionalMonthlySubtotal,
      combinedMonthlyEstimate,
      missingAssumptions,
      questions,
      closingCosts: parsePlannerNumber(values.closingCosts),
    };
  }, [values]);

  function updateValue(key: keyof PlannerValues, value: string) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function resetPlanner() {
    setValues(initialValues);
    setOptionalOpen(false);
  }

  return (
    <section
      className="mt-6 rounded-[10px] bg-white/[0.04] p-5 ring-1 ring-cyan-100/14 md:p-6"
      data-testid="buyer-financing-decision-planner"
      data-buyer-financing-planner-surface="/buy#financing-readiness"
      data-buyer-financing-planner-provider="false"
      data-buyer-financing-planner-persistence="session-only-no-persistence"
      data-buyer-financing-planner-new-route="false"
      data-buyer-financing-planner-live-rates="false"
      data-buyer-financing-planner-approval="false"
      data-buyer-financing-planner-qualification="false"
      data-buyer-financing-planner-affordability="false"
      data-buyer-financing-planner-buying-power="false"
      data-buyer-financing-planner-score="false"
      data-buyer-financing-planner-crm="false"
      data-buyer-financing-planner-telemetry="false"
    >
      <div className="grid gap-5 lg:grid-cols-[0.78fr_1fr] lg:items-start">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-100/72">
            Buyer Financing Decision Planner
          </p>
          <h3 className="mt-3 max-w-2xl text-2xl font-black leading-tight tracking-normal text-white md:text-3xl">
            Organize the assumptions before the financing conversation.
          </h3>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/62">
            Use this planner to compare user-entered assumptions, identify missing items, and prepare questions for
            qualified lender and advisory conversations.
          </p>
          <p className="mt-4 max-w-2xl rounded-[8px] bg-amber-100/[0.06] p-4 text-xs font-bold leading-6 text-white/58 ring-1 ring-amber-100/16">
            Educational planning only. User-entered assumptions only. Not a loan quote, approval, qualification,
            affordability determination, rate guarantee, or financial, tax, legal, insurance, or lending advice.
            Rates, taxes, insurance, HOA dues, mortgage insurance, and other costs require professional verification.
          </p>
        </div>

        <div className="grid gap-3 rounded-[8px] bg-black/14 p-4 ring-1 ring-white/10">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/68">Interaction Flow</p>
          <ol className="grid gap-2 text-xs font-bold leading-5 text-white/58 sm:grid-cols-2">
            {[
              'Core assumptions',
              'Optional monthly assumptions',
              'Educational assumption summary',
              'Items to verify',
              'Questions for qualified professionals',
              'Advisory transition',
            ].map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[0.88fr_1.12fr] lg:items-start">
        <section className="grid gap-4" aria-labelledby="planner-core-assumptions">
          <div>
            <h4 id="planner-core-assumptions" className="text-xl font-black leading-tight text-white">
              Core assumptions
            </h4>
            <p className="mt-2 text-xs font-bold leading-6 text-white/56">
              Arithmetic appears only after these user-entered assumptions are complete and valid.
            </p>
          </div>

          <div className="grid gap-3">
            {coreFields.map((field) => (
              <label key={field.key} className="grid gap-2 rounded-[8px] bg-white/[0.035] p-4 ring-1 ring-white/10">
                <span className="text-xs font-black uppercase tracking-[0.14em] text-cyan-100/72">{field.label}</span>
                <span className="text-xs font-bold leading-5 text-white/50">{field.description}</span>
                <span className="flex min-h-12 items-center rounded-[8px] bg-black/18 px-3 ring-1 ring-white/12 focus-within:ring-cyan-100/70">
                  {field.prefix ? <span className="mr-2 text-sm font-black text-white/42">{field.prefix}</span> : null}
                  <input
                    type="number"
                    inputMode="decimal"
                    min={field.key === 'interestRate' ? '0' : undefined}
                    step={field.key === 'interestRate' ? '0.01' : '1000'}
                    value={values[field.key]}
                    onChange={(event) => updateValue(field.key, event.target.value)}
                    className="min-h-12 w-full bg-transparent text-base font-bold text-white outline-none placeholder:text-white/28"
                    style={{ minHeight: '48px' }}
                    aria-describedby={`${field.key}-description`}
                    placeholder={field.key === 'interestRate' ? 'User-entered rate' : 'User-entered amount'}
                  />
                  {field.suffix ? <span className="ml-2 text-sm font-black text-white/42">{field.suffix}</span> : null}
                </span>
              </label>
            ))}

            <label className="grid gap-2 rounded-[8px] bg-white/[0.035] p-4 ring-1 ring-white/10">
              <span className="text-xs font-black uppercase tracking-[0.14em] text-cyan-100/72">Loan term assumption</span>
              <span className="text-xs font-bold leading-5 text-white/50">
                Fixed terms only for Phase 1. No adjustable-rate, interest-only, balloon, or refinance scenarios.
              </span>
              <select
                value={values.loanTermYears}
                onChange={(event) => updateValue('loanTermYears', event.target.value as PlannerValues['loanTermYears'])}
                className="min-h-12 rounded-[8px] bg-[#101923] px-3 text-base font-bold text-white outline-none ring-1 ring-white/12 focus:ring-cyan-100/70"
                style={{ minHeight: '48px' }}
                aria-label="Loan term assumption"
              >
                <option value="15">15 years</option>
                <option value="20">20 years</option>
                <option value="30">30 years</option>
              </select>
            </label>
          </div>

          <section className="rounded-[8px] bg-white/[0.035] p-4 ring-1 ring-white/10" aria-labelledby="planner-optional-assumptions">
            <button
              type="button"
              onClick={() => setOptionalOpen((current) => !current)}
              className="flex min-h-12 w-full items-center justify-between gap-4 text-left text-xs font-black uppercase tracking-[0.14em] text-cyan-100/72 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200"
              style={{ minHeight: '48px' }}
              aria-expanded={optionalOpen}
              aria-controls="planner-optional-assumption-fields"
            >
              <span id="planner-optional-assumptions">Optional monthly assumptions</span>
              <span>{optionalOpen ? 'Hide' : 'Add'}</span>
            </button>
            <p className="mt-2 text-xs font-bold leading-5 text-white/50">
              Optional fields are user-entered. Missing fields become items to verify, not zero-cost assumptions.
            </p>

            {optionalOpen ? (
              <div id="planner-optional-assumption-fields" className="mt-4 grid gap-3">
                {optionalMonthlyFields.map((field) => (
                  <label key={field.key} className="grid gap-2 rounded-[8px] bg-black/14 p-3 ring-1 ring-white/10">
                    <span className="text-xs font-black uppercase tracking-[0.12em] text-white/70">{field.label}</span>
                    <span className="text-xs font-bold leading-5 text-white/45">{field.verifyPrompt}</span>
                    <span className="flex min-h-12 items-center rounded-[8px] bg-black/18 px-3 ring-1 ring-white/12 focus-within:ring-cyan-100/70">
                      <span className="mr-2 text-sm font-black text-white/42">$</span>
                      <input
                        type="number"
                        inputMode="decimal"
                        min="0"
                        step="25"
                        value={values[field.key]}
                        onChange={(event) => updateValue(field.key, event.target.value)}
                        className="min-h-12 w-full bg-transparent text-base font-bold text-white outline-none placeholder:text-white/28"
                        style={{ minHeight: '48px' }}
                        placeholder="Monthly assumption"
                      />
                    </span>
                  </label>
                ))}

                <label className="grid gap-2 rounded-[8px] bg-black/14 p-3 ring-1 ring-white/10">
                  <span className="text-xs font-black uppercase tracking-[0.12em] text-white/70">
                    Closing-cost assumption
                  </span>
                  <span className="text-xs font-bold leading-5 text-white/45">
                    Non-monthly planning item only. It is excluded from the monthly subtotal.
                  </span>
                  <span className="flex min-h-12 items-center rounded-[8px] bg-black/18 px-3 ring-1 ring-white/12 focus-within:ring-cyan-100/70">
                    <span className="mr-2 text-sm font-black text-white/42">$</span>
                    <input
                      type="number"
                      inputMode="decimal"
                      min="0"
                      step="500"
                      value={values.closingCosts}
                      onChange={(event) => updateValue('closingCosts', event.target.value)}
                      className="min-h-12 w-full bg-transparent text-base font-bold text-white outline-none placeholder:text-white/28"
                      style={{ minHeight: '48px' }}
                      placeholder="One-time assumption"
                    />
                  </span>
                </label>
              </div>
            ) : null}
          </section>
        </section>

        <section className="grid gap-4" aria-labelledby="planner-summary">
          <div>
            <h4 id="planner-summary" className="text-xl font-black leading-tight text-white">
              Educational assumption summary
            </h4>
            <p className="mt-2 text-xs font-bold leading-6 text-white/56">
              Amounts shown are based entirely on entries in this page session and are rounded to whole dollars.
            </p>
          </div>

          {result.validationMessages.length > 0 ? (
            <div
              className="rounded-[8px] bg-rose-100/[0.08] p-4 text-xs font-bold leading-6 text-white/64 ring-1 ring-rose-100/20"
              role="status"
              aria-live="polite"
              data-testid="buyer-financing-planner-validation"
            >
              <p className="font-black uppercase tracking-[0.14em] text-rose-100/82">Review assumptions</p>
              <ul className="mt-3 grid gap-2">
                {result.validationMessages.map((message) => (
                  <li key={message}>{message}</li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="grid gap-3" data-testid="buyer-financing-planner-summary">
            <article className="rounded-[8px] bg-cyan-100/[0.045] p-4 ring-1 ring-cyan-100/14">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-100/72">
                Educational principal-and-interest estimate
              </p>
              {result.principalAndInterest !== null && result.loanAmount !== null ? (
                <div className="mt-3 grid gap-3">
                  <p className="text-3xl font-black leading-none text-white">
                    {formatCurrency(result.principalAndInterest)}
                  </p>
                  <p className="text-xs font-bold leading-5 text-white/52">
                    Estimated loan amount: {formatCurrency(result.loanAmount)} from user-entered assumptions.
                  </p>
                </div>
              ) : (
                <p className="mt-3 text-sm font-bold leading-6 text-white/56">
                  Enter valid purchase price, down payment, interest rate, and loan term assumptions before this estimate appears.
                </p>
              )}
            </article>

            <article className="rounded-[8px] bg-white/[0.035] p-4 ring-1 ring-white/10">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/68">
                User-entered monthly assumptions
              </p>
              {result.optionalEntries.length > 0 ? (
                <div className="mt-3 grid gap-2">
                  {result.optionalEntries.map((entry) => (
                    <div key={entry.label} className="flex items-start justify-between gap-4 text-xs font-bold leading-5 text-white/58">
                      <span>{entry.label}</span>
                      <span>{formatCurrency(entry.value)}</span>
                    </div>
                  ))}
                  <div className="mt-2 flex items-start justify-between gap-4 border-t border-white/10 pt-3 text-sm font-black text-white">
                    <span>Optional monthly subtotal</span>
                    <span>{formatCurrency(result.optionalMonthlySubtotal)}</span>
                  </div>
                </div>
              ) : (
                <p className="mt-3 text-sm font-bold leading-6 text-white/56">
                  No optional monthly assumptions entered. Missing costs remain items to verify.
                </p>
              )}
            </article>

            <article className="rounded-[8px] bg-white/[0.045] p-4 ring-1 ring-white/10">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/68">
                Combined monthly assumption estimate
              </p>
              {result.combinedMonthlyEstimate !== null ? (
                <p className="mt-3 text-3xl font-black leading-none text-white">
                  {formatCurrency(result.combinedMonthlyEstimate)}
                </p>
              ) : (
                <p className="mt-3 text-sm font-bold leading-6 text-white/56">
                  Combined estimate appears only after the required assumptions are complete and valid.
                </p>
              )}
              <p className="mt-3 text-xs font-bold leading-5 text-white/46">
                This combines the educational principal-and-interest estimate with optional monthly assumptions you entered. It does not include missing or unverified costs.
              </p>
            </article>

            <p className="rounded-[8px] bg-amber-100/[0.06] p-3 text-xs font-bold leading-5 text-white/58 ring-1 ring-amber-100/16">
              Reminder: any estimate shown is based only on user-entered assumptions. Taxes, insurance, HOA dues,
              mortgage insurance, maintenance, utilities, closing costs, rates, terms, and property-specific costs
              may vary and should be verified with qualified professionals.
            </p>
          </div>

          <section className="rounded-[8px] bg-white/[0.035] p-4 ring-1 ring-white/10" data-testid="buyer-financing-planner-missing-assumptions">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/68">Items to verify</p>
            <ul className="mt-3 grid gap-2 text-xs font-bold leading-5 text-white/56 sm:grid-cols-2">
              {result.missingAssumptions.slice(0, 10).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          {result.closingCosts !== null && result.closingCosts >= 0 ? (
            <section className="rounded-[8px] bg-white/[0.035] p-4 ring-1 ring-white/10">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/68">
                Non-monthly assumption
              </p>
              <p className="mt-3 text-sm font-bold leading-6 text-white/58">
                Closing-cost assumption entered: {formatCurrency(result.closingCosts)}. This is excluded from monthly estimates and should be verified separately.
              </p>
            </section>
          ) : null}
        </section>
      </div>

      <section className="mt-5 grid gap-4 lg:grid-cols-[1fr_0.78fr]" data-testid="buyer-financing-planner-questions">
        <div className="rounded-[8px] bg-cyan-100/[0.045] p-4 ring-1 ring-cyan-100/14">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-100/72">
            Questions to verify
          </p>
          <ul className="mt-4 grid gap-3 text-xs font-bold leading-6 text-white/60">
            {result.questions.map((question) => (
              <li key={question}>{question}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-[8px] bg-white/[0.035] p-4 ring-1 ring-white/10" data-testid="buyer-financing-planner-advisory-transition">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/68">
            Professional conversation transition
          </p>
          <p className="mt-3 text-xs font-bold leading-6 text-white/58">
            Use these assumptions to prepare questions for qualified lending, tax, legal, insurance, and real-estate
            professionals where appropriate. Do not submit confidential financial details through this planner.
          </p>
          <div className="mt-4 grid gap-2">
            <Link
              href="/contact#advisory-readiness"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-cyan-100 px-5 py-3 text-center text-[11px] font-black uppercase tracking-[0.14em] text-[#101820] transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200"
              style={{ minHeight: '48px' }}
            >
              Prepare advisory questions
            </Link>
            <Link
              href="/buy#financing-confidence"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/14 px-5 py-3 text-center text-[11px] font-black uppercase tracking-[0.14em] text-white transition hover:bg-white/8 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200"
              style={{ minHeight: '48px' }}
            >
              Review financing education
            </Link>
            <button
              type="button"
              onClick={resetPlanner}
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/14 px-5 py-3 text-center text-[11px] font-black uppercase tracking-[0.14em] text-white/78 transition hover:bg-white/8 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200"
              style={{ minHeight: '48px' }}
              data-testid="buyer-financing-planner-reset"
            >
              Reset assumptions
            </button>
          </div>
        </div>
      </section>
    </section>
  );
}
