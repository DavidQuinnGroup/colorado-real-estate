import Link from 'next/link';
import { ArrowUpRight, BarChart3, CheckCircle2, ShieldCheck } from 'lucide-react';

import DisclosureStateIndicator from '@/components/DisclosureStateIndicator';
import type { MarketProduct3Experience } from '@/lib/marketProduct3';

type MarketProduct3VisualIntelligenceProps = {
  experience: MarketProduct3Experience;
};

export default function MarketProduct3VisualIntelligence({ experience }: MarketProduct3VisualIntelligenceProps) {
  const rich = experience.authorizedRichInterpretation;
  const inventoryFactor = experience.pulseFactors.find((factor) => factor.label === 'Inventory');
  const paceFactor = experience.pulseFactors.find((factor) => factor.label === 'Pace');
  const priceFactor = experience.pulseFactors.find((factor) => factor.label === 'Price Context' || factor.label === 'Pricing Context');
  const confidenceSummary = [
    { label: 'Evidence state', value: rich ? 'Complete evidence' : 'Limited evidence' },
    { label: 'Freshness', value: experience.confidenceLayer.freshness },
    { label: 'Completeness', value: experience.confidenceLayer.completeness },
  ];

  return (
    <section
      className="market-product-3"
      aria-labelledby={`market-product-3-${experience.scope}-heading`}
      data-testid="market-product-3-visual-intelligence"
      data-market-product-3="true"
      data-market-product-3-public-vis="true"
      data-market-product-3-scope={experience.scope}
      data-market-product-3-subject={experience.subject}
      data-market-product-3-evidence-state={experience.evidenceState}
      data-market-product-3-authorized-rich-interpretation={String(rich)}
      data-market-product-3-fixture="false"
      data-market-product-3-ai="false"
      data-market-product-3-gis="false"
      data-market-product-3-telemetry="false"
      data-market-product-3-forecasting="false"
      data-market-product-3-provider-activation="false"
    >
      <div className="market-product-3__header">
        <div>
          <p className="market-product-3__eyebrow">Market interpretation</p>
          <h2 id={`market-product-3-${experience.scope}-heading`}>{experience.oneSentence}</h2>
          <p>{experience.whyItMatters}</p>
        </div>
        <div className="market-product-3__summary" data-testid="market-product-3-report-composition">
          <span>{experience.period}</span>
          <strong>{experience.condition}</strong>
          <p>{experience.observedDirection}</p>
        </div>
      </div>

      <div className="market-product-3__confidence-strip" data-testid="market-product-3-confidence-summary">
        {confidenceSummary.map((item) => (
          <div key={item.label}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </div>
        ))}
      </div>

      <div className="market-product-3__grid">
        <article className="market-product-3__pulse" data-testid="market-product-3-market-pulse">
          <div className="market-product-3__section-title">
            <BarChart3 aria-hidden="true" />
            <div>
              <p>Market Pulse</p>
              <h3>Current facts shape the interpretation.</h3>
            </div>
          </div>
          <div className="market-product-3__factor-list">
            {experience.pulseFactors.map((factor) => (
              <div key={factor.label}>
                <span>{factor.label}</span>
                <strong>{factor.exactValue}</strong>
                <p>{factor.interpretation}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="market-product-3__inventory" data-testid="market-product-3-inventory-horizon">
          <div className="market-product-3__section-title">
            <BarChart3 aria-hidden="true" />
            <div>
              <p>Inventory Horizon</p>
              <h3>Use current selection as context, not a forecast.</h3>
            </div>
          </div>
          <div className="market-product-3__inventory-grid">
            <div>
              <span>Current selection</span>
              <strong>{inventoryFactor?.exactValue ?? 'Current inventory signal'}</strong>
              <p>{inventoryFactor?.interpretation ?? 'Current inventory should be verified through Search before relying on availability.'}</p>
            </div>
            <div>
              <span>Pace context</span>
              <strong>{paceFactor?.exactValue ?? experience.condition}</strong>
              <p>{paceFactor?.interpretation ?? 'Pace is used for preparation, not prediction.'}</p>
            </div>
            <div>
              <span>Price context</span>
              <strong>{priceFactor?.exactValue ?? experience.condition}</strong>
              <p>{priceFactor?.interpretation ?? 'Price context requires property-level verification.'}</p>
            </div>
          </div>
        </article>

        <article className="market-product-3__report" data-testid="market-product-3-interpretation">
          <div>
            <p className="market-product-3__label">What changed</p>
            <p>{experience.whatChanged}</p>
          </div>
          <div data-testid="market-product-3-buyer-interpretation">
            <p className="market-product-3__label">Buyer interpretation</p>
            <p>{experience.buyerInterpretation}</p>
          </div>
          <div data-testid="market-product-3-seller-interpretation">
            <p className="market-product-3__label">Seller interpretation</p>
            <p>{experience.sellerInterpretation}</p>
          </div>
          <div>
            <p className="market-product-3__label">Local variation</p>
            <p>{experience.localVariation}</p>
          </div>
        </article>
      </div>

      <div className="market-product-3__footer">
        <div className="market-product-3__verify">
          <CheckCircle2 aria-hidden="true" />
          <p>{experience.verificationPrompt}</p>
        </div>
        <Link href={experience.nextExploration.href} className="market-product-3__cta">
          {experience.nextExploration.label}
          <ArrowUpRight aria-hidden="true" />
        </Link>
      </div>

      <details className="market-product-3__confidence" data-testid="market-product-3-confidence-layer">
        <summary>
          <ShieldCheck aria-hidden="true" />
          Confidence layer
          <DisclosureStateIndicator className="h-4 w-4" />
        </summary>
        <dl>
          {Object.entries(experience.confidenceLayer).map(([label, value]) => (
            <div key={label}>
              <dt>{label.replace(/([A-Z])/g, ' $1')}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </details>

      <div className="market-product-3__table" data-testid="market-product-3-accessible-data">
        <table>
          <caption>Market interpretation evidence</caption>
          <thead>
            <tr>
              <th scope="col">Signal</th>
              <th scope="col">Exact value</th>
              <th scope="col">Interpretation</th>
            </tr>
          </thead>
          <tbody>
            {experience.pulseFactors.map((factor) => (
              <tr key={factor.label}>
                <th scope="row">{factor.label}</th>
                <td>{factor.exactValue}</td>
                <td>{factor.interpretation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
