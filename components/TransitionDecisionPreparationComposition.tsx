'use client';

import { useState } from 'react';

const preparationAreas = [
  {
    title: 'Goals and timing',
    questions: [
      'What would you like your next housing arrangement to support?',
      'What timing feels practical, and what needs to happen first?',
      'Is this a temporary arrangement, a longer-term plan, or still undecided?',
    ],
  },
  {
    title: 'Property and maintenance',
    questions: [
      'Which maintenance responsibilities or recurring costs need a closer look?',
      'Which observable property features need verification, such as stairs, entry configuration, bedroom and bathroom location, or layout?',
      'Which property details need a current source or professional review before you rely on them?',
    ],
  },
  {
    title: 'Conversation preparation',
    questions: [
      'What questions would you like to discuss with family or people you trust?',
      'Which questions belong with a lender, tax professional, attorney, insurer, inspector, contractor, or care or facility professional?',
      'What information or limitation should be clarified before the next conversation?',
    ],
  },
] as const;

export default function TransitionDecisionPreparationComposition() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section
      className="px-5 py-16 sm:px-8 lg:px-12"
      data-testid="transition-decision-preparation"
      data-transition-decision-preparation="guided-eligible"
      data-transition-ephemeral-state="true"
      data-transition-persistence="false"
      data-transition-hidden-transfer="false"
      data-transition-inference="false"
      data-transition-telemetry="false"
    >
      <div className="mx-auto w-full max-w-[1180px] border-y border-slate-200 py-10">
        <div className="max-w-3xl">
          <p className="gp-eyebrow">Optional preparation</p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-950">Planning a housing transition?</h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Open a private, on-page set of questions to organize a conversation. Nothing selected here is saved, shared, or used to personalize another part of the site.
          </p>
          <button
            type="button"
            className="gp-button gp-button-secondary mt-6"
            aria-expanded={isOpen}
            aria-controls="transition-decision-preparation-content"
            onClick={() => setIsOpen((open) => !open)}
          >
            {isOpen ? 'Close preparation questions' : 'Prepare for a housing transition'}
          </button>
        </div>

        {isOpen ? (
          <div id="transition-decision-preparation-content" className="mt-8 grid gap-5 lg:grid-cols-3">
            {preparationAreas.map((area) => (
              <article key={area.title} className="border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-950">{area.title}</h3>
                <ul className="mt-4 grid gap-3 text-sm leading-6 text-slate-600">
                  {area.questions.map((question) => (
                    <li key={question} className="flex gap-3">
                      <input aria-label={question} type="checkbox" className="mt-1 h-4 w-4 shrink-0" />
                      <span>{question}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
