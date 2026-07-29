import {
  REIE_VISUAL_INTELLIGENCE_SYSTEM_STATUS,
  VIS_COMPONENT_CONTRACTS,
  VIS_DEI_REVIEW,
  VIS_STATE_HANDLING,
  getVisualIntelligencePrototypeFixture,
} from "@/lib/visual-intelligence/visualIntelligenceSystem";

function confidenceTone(state: "available" | "limited" | "needs-review") {
  if (state === "available") {
    return "bg-[#6fa889]/15 text-[#b8dec9]";
  }

  if (state === "limited") {
    return "bg-[#d8a84f]/15 text-[#f0d696]";
  }

  return "bg-[#b9785d]/15 text-[#efb49d]";
}

function radialPoint(index: number, total: number, value: number) {
  const angle = -90 + (360 / total) * index;
  const radius = 36 + value * 0.36;
  const radians = (Math.PI / 180) * angle;

  return {
    x: 100 + Math.cos(radians) * radius,
    y: 100 + Math.sin(radians) * radius,
  };
}

export default function VisualIntelligencePrototype() {
  const fixture = getVisualIntelligencePrototypeFixture();
  const profilePoints = fixture.property.dimensions
    .map((dimension, index) => radialPoint(index, fixture.property.dimensions.length, dimension.value))
    .map((point) => `${point.x.toFixed(1)},${point.y.toFixed(1)}`)
    .join(" ");

  return (
    <main
      data-testid="vis-prototype"
      data-vis-status={REIE_VISUAL_INTELLIGENCE_SYSTEM_STATUS}
      data-vis-public-activation="false"
      data-provider-activation="false"
      data-prisma-schema-change="false"
      data-hover-only="false"
      className="min-h-screen bg-[#0b0b0b] text-[#f5f1e8]"
    >
      <section className="mx-auto flex max-w-7xl flex-col gap-10 px-5 py-12 sm:px-8 lg:px-10 lg:py-16">
        <header className="grid gap-8 border-b border-white/10 pb-10 lg:grid-cols-[1fr_0.72fr] lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase text-[#d8a84f]">
              PROJECT ATLAS / Internal Preview
            </p>
            <h1 className="mt-5 max-w-5xl text-4xl font-semibold leading-none sm:text-6xl lg:text-7xl">
              REIE Visual Intelligence System
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-[#c9c0b0]">
              A governed, fixture-only prototype for turning market and property data
              into decision clarity, visible confidence, and plain-language next steps.
            </p>
          </div>

          <div className="grid gap-3 rounded-[28px] bg-[#15130f] p-6">
            <span className="text-xs font-semibold uppercase text-[#8f8577]">
              Prototype boundaries
            </span>
            <div className="grid gap-2 text-sm text-[#f5f1e8]">
              <span>No public route</span>
              <span>No provider execution</span>
              <span>No schema or Prisma change</span>
              <span>No prediction, ranking, or recommendation engine</span>
            </div>
          </div>
        </header>

        <section
          data-testid="vis-market-report-composition"
          className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]"
        >
          <article className="flex flex-col justify-between gap-10 rounded-[28px] bg-[#f6f3ec] p-6 text-[#1b1710] sm:p-8 lg:p-10">
            <div>
              <p className="text-xs font-semibold uppercase text-[#9a6247]">
                Market story
              </p>
              <h2 className="mt-5 text-3xl font-semibold leading-tight sm:text-5xl">
                {fixture.market.primaryCondition}
              </h2>
              <p className="mt-5 text-base leading-8 text-[#4b4236]">
                {fixture.market.summary}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {fixture.market.metricBands.map((metric) => (
                <div key={metric.label} className="rounded-2xl bg-white/70 p-4">
                  <p className="text-sm font-medium text-[#4b4236]">{metric.label}</p>
                  <p className="mt-3 text-4xl font-semibold">{metric.value}</p>
                  <p className="mt-2 text-xs text-[#7a6e60]">{metric.benchmark}</p>
                </div>
              ))}
            </div>
          </article>

          <MarketPulse />
        </section>

        <section className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
          <PropertyDna profilePoints={profilePoints} />
          <ConfidenceLayer />
        </section>

        <section className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <DecisionGuidance />
          <VisualContracts />
        </section>
      </section>
    </main>
  );
}

function MarketPulse() {
  const fixture = getVisualIntelligencePrototypeFixture();

  return (
    <article
      data-testid="vis-market-pulse"
      data-vis-signature="market-pulse"
      data-visual-kind="market-level"
      className="rounded-[28px] bg-[#15130f] p-6 sm:p-8 lg:p-10"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase text-[#d8a84f]">Market Pulse</p>
          <h2 className="mt-4 text-3xl font-semibold leading-tight">
            What this market asks customers to compare
          </h2>
        </div>
        <span className="rounded-full bg-[#2f5d50]/35 px-4 py-2 text-sm text-[#b8dec9]">
          Fixture only
        </span>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div className="mx-auto w-full max-w-[360px]">
          <svg
            role="img"
            aria-labelledby="market-pulse-title market-pulse-desc"
            viewBox="0 0 220 220"
            className="h-auto w-full"
          >
            <title id="market-pulse-title">Market Pulse visual</title>
            <desc id="market-pulse-desc">
              Three fixture bands show choice depth, pricing signal clarity, and
              pace pressure without making a forecast.
            </desc>
            <circle cx="110" cy="110" r="88" fill="#191713" stroke="#302a21" strokeWidth="2" />
            {fixture.market.metricBands.map((metric, index) => {
              const radius = 48 + index * 24;
              const dash = Math.max(10, Math.min(100, metric.value));
              return (
                <circle
                  key={metric.label}
                  cx="110"
                  cy="110"
                  r={radius}
                  fill="none"
                  stroke={["#d8a84f", "#5d7f95", "#9a6247"][index]}
                  strokeDasharray={`${dash} ${100 - dash}`}
                  strokeLinecap="round"
                  strokeWidth="12"
                  pathLength="100"
                  transform="rotate(-90 110 110)"
                />
              );
            })}
            <circle cx="110" cy="110" r="30" fill="#f6f3ec" />
            <text x="110" y="105" textAnchor="middle" className="fill-[#1b1710] text-[13px] font-semibold">
              Market
            </text>
            <text x="110" y="124" textAnchor="middle" className="fill-[#7a6e60] text-[10px]">
              context
            </text>
          </svg>
        </div>

        <div className="grid gap-4">
          {fixture.market.metricBands.map((metric) => (
            <div key={metric.label} className="rounded-2xl bg-white/[0.05] p-5">
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="text-base font-semibold">{metric.label}</h3>
                <span className="text-2xl font-semibold text-[#d8a84f]">{metric.value}</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-[#c9c0b0]">
                {metric.interpretation}
              </p>
            </div>
          ))}
        </div>
      </div>

      <AccessibleMarketTable />
    </article>
  );
}

function AccessibleMarketTable() {
  const fixture = getVisualIntelligencePrototypeFixture();

  return (
    <div data-testid="vis-accessible-data-alternative" className="mt-8 overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <caption className="sr-only">
          Accessible data alternative for the Market Pulse fixture.
        </caption>
        <thead className="text-[#8f8577]">
          <tr>
            <th className="py-3 pr-4 font-medium" scope="col">Signal</th>
            <th className="py-3 pr-4 font-medium" scope="col">Fixture value</th>
            <th className="py-3 pr-4 font-medium" scope="col">Interpretation</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {fixture.market.metricBands.map((metric) => (
            <tr key={metric.label}>
              <th className="py-4 pr-4 font-medium" scope="row">{metric.label}</th>
              <td className="py-4 pr-4 text-[#d8a84f]">{metric.value}</td>
              <td className="py-4 pr-4 text-[#c9c0b0]">{metric.interpretation}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PropertyDna({ profilePoints }: { profilePoints: string }) {
  const fixture = getVisualIntelligencePrototypeFixture();

  return (
    <article
      data-testid="vis-property-dna"
      data-visual-kind="property-level"
      className="rounded-[28px] bg-[#15130f] p-6 sm:p-8 lg:p-10"
    >
      <p className="text-xs font-semibold uppercase text-[#d8a84f]">Property DNA</p>
      <h2 className="mt-4 text-3xl font-semibold leading-tight">
        A property profile built for verification, not scoring
      </h2>
      <p className="mt-5 text-base leading-8 text-[#c9c0b0]">{fixture.property.summary}</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[280px_1fr] lg:items-center">
        <svg
          role="img"
          aria-labelledby="property-dna-title property-dna-desc"
          viewBox="0 0 200 200"
          className="mx-auto h-auto w-full max-w-[280px]"
        >
          <title id="property-dna-title">Property DNA profile</title>
          <desc id="property-dna-desc">
            Four fixture dimensions form a balanced polygon. Every dimension has
            a visible verification prompt.
          </desc>
          <circle cx="100" cy="100" r="78" fill="#191713" stroke="#302a21" strokeWidth="1" />
          <circle cx="100" cy="100" r="52" fill="none" stroke="#302a21" strokeWidth="1" />
          <circle cx="100" cy="100" r="28" fill="none" stroke="#302a21" strokeWidth="1" />
          {[0, 1, 2, 3].map((index) => {
            const end = radialPoint(index, 4, 100);
            return (
              <line
                key={index}
                x1="100"
                y1="100"
                x2={end.x}
                y2={end.y}
                stroke="#302a21"
                strokeWidth="1"
              />
            );
          })}
          <polygon points={profilePoints} fill="#5d7f95" fillOpacity="0.32" stroke="#d8a84f" strokeWidth="3" />
          {fixture.property.dimensions.map((dimension, index) => {
            const point = radialPoint(index, fixture.property.dimensions.length, dimension.value);
            return (
              <circle key={dimension.label} cx={point.x} cy={point.y} r="5" fill="#f6f3ec" />
            );
          })}
        </svg>

        <dl className="grid gap-4">
          {fixture.property.dimensions.map((dimension) => (
            <div key={dimension.label} className="rounded-2xl bg-white/[0.05] p-5">
              <dt className="flex items-baseline justify-between gap-4">
                <span className="font-semibold">{dimension.label}</span>
                <span className="text-xl font-semibold text-[#d8a84f]">{dimension.value}</span>
              </dt>
              <dd className="mt-3 text-sm leading-6 text-[#c9c0b0]">
                {dimension.interpretation}
              </dd>
              <dd className="mt-3 text-xs leading-5 text-[#8f8577]">
                Verify: {dimension.verify}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </article>
  );
}

function ConfidenceLayer() {
  const fixture = getVisualIntelligencePrototypeFixture();

  return (
    <article
      data-testid="vis-confidence-layer"
      className="rounded-[28px] bg-[#f6f3ec] p-6 text-[#1b1710] sm:p-8 lg:p-10"
    >
      <p className="text-xs font-semibold uppercase text-[#9a6247]">Confidence Layer</p>
      <h2 className="mt-4 text-3xl font-semibold leading-tight">
        Confidence is shown before a customer relies on the visual
      </h2>
      <p className="mt-5 text-base leading-8 text-[#4b4236]">
        Every interpretive visualization must expose source authority, freshness,
        completeness, conflicts, permitted use, and verification needs.
      </p>

      <div className="mt-8 grid gap-3">
        {fixture.evidenceFacets.map((facet) => (
          <details key={facet.label} className="rounded-2xl bg-white/75 p-5">
            <summary className="cursor-pointer list-none">
              <span className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <span className="font-semibold">{facet.label}</span>
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${confidenceTone(facet.state)}`}>
                  {facet.state}
                </span>
              </span>
            </summary>
            <p className="mt-4 text-sm leading-6 text-[#4b4236]">{facet.explanation}</p>
          </details>
        ))}
      </div>
    </article>
  );
}

function DecisionGuidance() {
  const fixture = getVisualIntelligencePrototypeFixture();

  return (
    <article className="rounded-[28px] bg-[#15130f] p-6 sm:p-8 lg:p-10">
      <p className="text-xs font-semibold uppercase text-[#d8a84f]">Responsive report standard</p>
      <h2 className="mt-4 text-3xl font-semibold leading-tight">
        The report answers what it means before showing everything it knows
      </h2>
      <div className="mt-8 grid gap-5">
        <section>
          <h3 className="text-lg font-semibold">Buyer interpretation</h3>
          <p className="mt-2 text-sm leading-7 text-[#c9c0b0]">
            {fixture.market.buyerInterpretation}
          </p>
        </section>
        <section>
          <h3 className="text-lg font-semibold">Seller interpretation</h3>
          <p className="mt-2 text-sm leading-7 text-[#c9c0b0]">
            {fixture.market.sellerInterpretation}
          </p>
        </section>
        <section>
          <h3 className="text-lg font-semibold">Next decision step</h3>
          <p className="mt-2 text-sm leading-7 text-[#c9c0b0]">
            {fixture.market.nextStep}
          </p>
        </section>
      </div>
    </article>
  );
}

function VisualContracts() {
  return (
    <article className="rounded-[28px] bg-[#15130f] p-6 sm:p-8 lg:p-10">
      <p className="text-xs font-semibold uppercase text-[#d8a84f]">Governance contracts</p>
      <h2 className="mt-4 text-3xl font-semibold leading-tight">
        Reusable components inherit states, trust, and accessibility requirements
      </h2>

      <div className="mt-8 grid gap-4">
        {VIS_COMPONENT_CONTRACTS.map((contract) => (
          <section key={contract.id} className="rounded-2xl bg-white/[0.05] p-5">
            <h3 className="font-semibold">{contract.name}</h3>
            <p className="mt-2 text-sm leading-6 text-[#c9c0b0]">{contract.purpose}</p>
            <p className="mt-3 text-xs text-[#8f8577]">
              States: {contract.requiredStates.join(", ")}
            </p>
          </section>
        ))}
      </div>

      <div className="mt-8 rounded-2xl bg-[#2f5d50]/20 p-5">
        <h3 className="font-semibold">Decision Experience Index preview</h3>
        <p className="mt-3 text-sm leading-6 text-[#c9c0b0]">
          {VIS_DEI_REVIEW.total}/30, normalized {VIS_DEI_REVIEW.normalized}/5.
          {` ${VIS_DEI_REVIEW.rationale}`}
        </p>
      </div>

      <details className="mt-5 rounded-2xl bg-white/[0.05] p-5">
        <summary className="cursor-pointer list-none font-semibold">
          Required state handling
        </summary>
        <dl className="mt-4 grid gap-3 text-sm text-[#c9c0b0]">
          {Object.entries(VIS_STATE_HANDLING).map(([state, handling]) => (
            <div key={state}>
              <dt className="font-semibold text-[#f5f1e8]">{state}</dt>
              <dd className="mt-1 leading-6">{handling}</dd>
            </div>
          ))}
        </dl>
      </details>
    </article>
  );
}
