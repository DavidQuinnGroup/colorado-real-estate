import { SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA } from '@/lib/sourceQualityOperationalManifestData';
import {
  sourceQualityOperationalManifestToAssemblyRequest,
  validateSourceQualityOperationalManifest,
} from '@/lib/sourceQualityOperationalManifest';
import { composeSourceQualityReport } from '@/lib/sourceQualityReport';
import type {
  SourceQualityConflictQueueEntry,
  SourceQualityReportQueueEntry,
} from '@/lib/sourceQualityReport';
import { assembleSourceQualitySummaries } from '@/lib/sourceQualitySummaryAssembly';

export const dynamic = 'force-dynamic';

export default function SourceQualityAdminPreviewPage() {
  const manifestResult = validateSourceQualityOperationalManifest(SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA);
  if (!manifestResult.manifest) return <FailClosed classification={manifestResult.classification} reasons={manifestResult.reasons} />;
  const manifest = manifestResult.manifest;
  const assemblyRequest = sourceQualityOperationalManifestToAssemblyRequest(manifest);
  const assemblyResult = assembleSourceQualitySummaries(assemblyRequest);
  if (assemblyResult.classification === 'FAIL_CLOSED') return <FailClosed classification={assemblyResult.classification} reasons={assemblyResult.reasons} />;
  const assembly = assemblyResult.assembly;
  const reportResult = composeSourceQualityReport(assembly.summaries);
  if (reportResult.classification === 'FAIL_CLOSED') return <FailClosed classification={reportResult.classification} reasons={reportResult.reasons} />;
  const report = reportResult.report;

  return (
    <main className="min-h-screen bg-[#0b0b0b] px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <header className="border-b border-white/10 pb-8">
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-white/45">PROJECT ATLAS™</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">Source Quality Internal Review</h1>
          <div className="mt-5 grid gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-amber-100 sm:grid-cols-2">
            <Disclosure value="OPERATIONAL REVIEWED MANIFEST" />
            <Disclosure value={manifest.coverageClass} />
            <Disclosure value={manifest.suppliedDatasetScope} />
            <Disclosure value={manifest.operationalPosture} />
            <Disclosure value="NO COMPLETENESS CLAIM" />
            <Disclosure value="NOT A COMPLETE SOURCE INVENTORY" />
          </div>
        </header>

        <section className="mt-8 grid gap-4 md:grid-cols-3" aria-label="Source quality review posture">
          <Metric label="Source Quality Review Posture" value={report.classification} />
          <Metric label="Current Manifest Source Count" value={String(report.sourceCount)} />
          <Metric label="Assembly Coverage" value={assembly.coverageClass} />
        </section>

        <section className="mt-8 grid gap-4 lg:grid-cols-2">
          <Panel title="Classification Counts"><Counts values={report.classificationCounts} /></Panel>
          <Panel title="Coverage Disclosure">
            <List values={[manifest.suppliedDatasetScope, manifest.operationalPosture, manifest.completenessClaim, assembly.suppliedDatasetScope, assembly.completenessClaim, report.suppliedDatasetScope]} />
          </Panel>
        </section>

        <section className="mt-8"><Panel title="Human Review Queue">
          {report.reviewRequiredSources.length === 0 ? <Empty /> : <div className="space-y-3">{report.reviewRequiredSources.map((entry: SourceQualityReportQueueEntry) => (
            <article key={entry.sourceId} className="border border-white/10 bg-black/20 p-4">
              <p className="font-mono text-sm text-white">{entry.sourceId}</p>
              <p className="mt-2 text-sm text-white/70">{entry.classification}</p>
              <Metadata label="Review reasons" values={entry.humanReviewReasons} />
              <Metadata label="Limitations" values={entry.limitationCodes} />
              <Metadata label="Evidence references" values={entry.evidenceReferenceIds} />
              <Metadata label="Certification references" values={entry.certificationReferenceIds} />
            </article>
          ))}</div>}
        </Panel></section>

        <section className="mt-8 grid gap-4 lg:grid-cols-2">
          <Panel title="Conflicts">{report.conflictSources.length === 0 ? <Empty /> : <List values={report.conflictSources.map((entry: SourceQualityConflictQueueEntry) => entry.sourceId + ': ' + entry.conflictReferences.map((reference: SourceQualityConflictQueueEntry['conflictReferences'][number]) => reference.relationshipType + ' [' + reference.evidenceReferenceIds.join(', ') + ']').join('; '))} />}</Panel>
          <Panel title="Insufficient / Invalid Evidence"><List values={[...report.insufficientEvidenceSources.map((sourceId: string) => 'INSUFFICIENT_EVIDENCE: ' + sourceId), ...report.invalidSourceEvidenceSources.map((sourceId: string) => 'INVALID_SOURCE_EVIDENCE: ' + sourceId)]} /></Panel>
        </section>

        <section className="mt-8"><Panel title="Dimension Posture Counts">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{Object.entries(report.dimensionPostureCounts).map(([dimension, counts]: [string, Readonly<Record<string, number>>]) => <div key={dimension} className="border border-white/10 bg-black/20 p-4"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/45">{dimension}</p><Counts values={counts} /></div>)}</div>
        </Panel></section>

        <section className="mt-8 grid gap-4 lg:grid-cols-2">
          <Panel title="Limitation Counts"><Counts values={report.limitationCodeCounts} /></Panel>
          <Panel title="Review-Reason Counts"><Counts values={report.humanReviewReasonCounts} /></Panel>
        </section>

        <section className="mt-8 grid gap-4 lg:grid-cols-2">
          <Panel title="Evidence References"><ReferenceIndex values={report.evidenceReferenceIndex} /></Panel>
          <Panel title="Certification References"><ReferenceIndex values={report.certificationReferenceIndex} /></Panel>
        </section>

        <section className="mt-8 border border-amber-300/30 bg-amber-300/10 p-5" aria-label="Activation and customer-display firewall">
          <h2 className="text-lg font-semibold">Activation / Customer-Display Firewall</h2>
          <List values={[
            manifest.authorityFirewall.sourceActivation,
            manifest.authorityFirewall.customerDisplayAuthority,
            manifest.authorityFirewall.legalUse,
            manifest.authorityFirewall.qualityScore,
            manifest.authorityFirewall.providerRanking,
            manifest.authorityFirewall.completeness,
            report.activationFirewall.sourceActivation,
            report.activationFirewall.executiveReview,
            report.activationFirewall.customerDisplayAuthority,
          ]} />
        </section>
      </div>
    </main>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="border border-white/10 bg-white/[0.03] p-5"><h2 className="text-lg font-semibold">{title}</h2><div className="mt-4">{children}</div></section>;
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="border border-white/10 bg-white/[0.03] p-4"><p className="text-xs uppercase tracking-[0.16em] text-white/40">{label}</p><p className="mt-3 break-words text-lg font-semibold text-white/85">{value}</p></div>;
}

function Disclosure({ value }: { value: string }) {
  return <span className="border border-amber-300/30 bg-amber-300/10 px-3 py-2">{value}</span>;
}

function Counts({ values }: { values: Readonly<Record<string, number>> }) {
  const entries: [string, number][] = Object.entries(values);
  return entries.length === 0 ? <Empty /> : <dl className="mt-3 space-y-2 text-sm">{entries.map(([label, value]) => <div key={label} className="flex gap-3"><dt className="break-words text-white/55">{label}</dt><dd className="ml-auto font-mono text-white/85">{value}</dd></div>)}</dl>;
}

function List({ values }: { values: readonly string[] }) {
  return values.length === 0 ? <Empty /> : <ul className="mt-3 space-y-2 text-sm text-white/70">{values.map((value: string) => <li key={value} className="break-words border-l border-white/15 pl-3">{value}</li>)}</ul>;
}

function Metadata({ label, values }: { label: string; values: readonly string[] }) {
  return <div className="mt-3"><p className="text-xs uppercase tracking-[0.14em] text-white/40">{label}</p><List values={values} /></div>;
}

function ReferenceIndex({ values }: { values: Readonly<Record<string, readonly string[]>> }) {
  const entries: [string, readonly string[]][] = Object.entries(values);
  return entries.length === 0 ? <Empty /> : <dl className="space-y-3 text-sm">{entries.map(([reference, sourceIds]) => <div key={reference}><dt className="font-mono text-white/85">{reference}</dt><dd className="mt-1 text-white/55">{sourceIds.join(', ')}</dd></div>)}</dl>;
}

function Empty() {
  return <p className="text-sm text-white/50">None supplied by the canonical source quality report.</p>;
}

function FailClosed({ classification, reasons }: { classification: string; reasons: readonly string[] }) {
  return (
    <main className="min-h-screen bg-[#0b0b0b] px-6 py-10 text-white">
      <div className="mx-auto max-w-3xl">
        <header className="border-b border-white/10 pb-8">
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-white/45">PROJECT ATLAS™</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">Source Quality Internal Review</h1>
          <div className="mt-5 grid gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-amber-100 sm:grid-cols-2">
            <Disclosure value="OPERATIONAL REVIEWED MANIFEST" />
            <Disclosure value="FAIL CLOSED" />
            <Disclosure value="NO FIXTURE FALLBACK" />
            <Disclosure value="NO COMPLETENESS CLAIM" />
          </div>
        </header>
        <section className="mt-8 border border-amber-300/30 bg-amber-300/10 p-5" aria-label="Source quality manifest review required">
          <h2 className="text-lg font-semibold">Operational Manifest Review Required</h2>
          <p className="mt-3 text-sm text-white/70">{classification}</p>
          <List values={reasons.length > 0 ? reasons : ['SOURCE_QUALITY_OPERATIONAL_MANIFEST_REVIEW_REQUIRED']} />
        </section>
      </div>
    </main>
  );
}
