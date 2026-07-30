'use client';

import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, BarChart3, ChevronLeft, Clock, Construction, Hammer, Lock, MapPin, ShieldCheck, X, Zap } from 'lucide-react';

import ResilientListingImage from '@/components/ResilientListingImage';
import NorthStarManager, {
  defaultNorthStarAnchors,
  getSavedNorthStarAnchors,
  type NorthStarAnchor,
} from '@/components/settings/NorthStarManager';
import { getListingFallbackPhotoUrl, getListingPhotoUrl } from '@/lib/listingVisuals';
import { formatLuxuryPrice } from '@/lib/utils/formatters';
import { calculateEfficiencyScore, getTravelNarrative } from '@/lib/utils/geo-logic';

type UserTier = 'Public' | 'Contracted';
type ActiveTab = 'intel' | 'strategy' | 'efficiency';

type DetailProperty = {
  id?: string;
  address?: string | null;
  city?: string | null;
  price?: number | null;
  beds?: number | null;
  baths?: number | null;
  sqft?: number | null;
  lat?: number | null;
  lng?: number | null;
  description?: string | null;
  mainPhoto?: string | null;
  image?: string | null;
  propertyType?: string | null;
  isPrivateExclusive?: boolean | null;
  efficiencyScore?: number | null;
  resilienceScore?: number | null;
  altitude?: number | null;
  soilType?: string | null;
  hasPolybutyleneRisk?: boolean | null;
};

type PropertyDetailProps = {
  property: DetailProperty;
  onClose: () => void;
  userTier?: UserTier;
};

type LogisticsTime = {
  label?: string;
  minutes: number | null;
  icon?: string;
  source?: 'mapbox' | 'estimated';
};

type LogisticsState = {
  status: 'idle' | 'loading' | 'ready' | 'error';
  times: LogisticsTime[];
  source?: 'mapbox' | 'estimated';
  message?: string;
};

const TABS: Array<{
  id: ActiveTab;
  label: string;
  icon: ReactNode;
}> = [
  { id: 'intel', label: 'Property Brief', icon: <BarChart3 size={14} /> },
  { id: 'efficiency', label: 'Life ROI', icon: <Clock size={14} /> },
  { id: 'strategy', label: 'Advisor Review', icon: <Hammer size={14} /> },
];

function getNumber(value: number | null | undefined, fallback = 0) {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function formatStat(value: number | null | undefined) {
  if (value === null || value === undefined || !Number.isFinite(value)) return '--';
  return value.toLocaleString();
}

function getReviewSignal(property: DetailProperty) {
  if (property.hasPolybutyleneRisk) return 'Plumbing Review';
  if (property.soilType?.trim()) return property.soilType.trim();
  if (typeof property.altitude === 'number' && Number.isFinite(property.altitude)) return `${Math.round(property.altitude).toLocaleString()} FT`;

  return 'REIE Verified';
}

function hasListingPhoto(property: DetailProperty) {
  return Boolean(property.mainPhoto?.trim() || property.image?.trim());
}

function hasCoordinates(property: DetailProperty) {
  return Number.isFinite(property.lat) && Number.isFinite(property.lng);
}

export default function PropertyDetail({ property, onClose, userTier = 'Public' }: PropertyDetailProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>('intel');
  const [showManager, setShowManager] = useState(false);
  const [northStarAnchors, setNorthStarAnchors] = useState<NorthStarAnchor[]>(() => getSavedNorthStarAnchors());
  const [logistics, setLogistics] = useState<LogisticsState>({ status: 'idle', times: [] });

  const fallbackImageSrc = getListingFallbackPhotoUrl({
    id: property.id,
    address: property.address,
    city: property.city,
    propertyType: property.propertyType,
    price: property.price,
    mainPhoto: property.mainPhoto,
    image: property.image,
  });
  const imageSrc = getListingPhotoUrl({
    id: property.id,
    address: property.address,
    city: property.city,
    propertyType: property.propertyType,
    price: property.price,
    mainPhoto: property.mainPhoto,
    image: property.image,
  });
  const address = property.address || 'Address Available by Request';
  const city = property.city || 'Colorado';
  const price = getNumber(property.price);
  const lat = getNumber(property.lat, 40.0174);
  const lng = getNumber(property.lng, -105.276);
  const propertyId = property.id || '';
  const propertyType = property.propertyType || 'Residential';
  const hasPhoto = hasListingPhoto(property);
  const hasCoordinatesFlag = hasCoordinates(property);
  const strategyLocked = userTier === 'Public';

  const logisticsAnchors = useMemo(
    () =>
      northStarAnchors
        .filter((anchor) => typeof anchor.lat === 'number' && typeof anchor.lng === 'number')
        .map((anchor) => ({
          label: anchor.name,
          icon: anchor.type,
          lat: anchor.lat as number,
          lng: anchor.lng as number,
        })),
    [northStarAnchors],
  );
  const activeLogisticsAnchors = useMemo(
    () =>
      logisticsAnchors.length > 0
        ? logisticsAnchors
        : defaultNorthStarAnchors.map((anchor) => ({
            label: anchor.name,
            icon: anchor.type,
            lat: anchor.lat || 40.0174,
            lng: anchor.lng || -105.276,
          })),
    [logisticsAnchors],
  );
  const weightedEfficiencyAnchors = useMemo(
    () =>
      northStarAnchors
        .filter((anchor) => typeof anchor.lat === 'number' && typeof anchor.lng === 'number')
        .map((anchor) => ({
          lat: anchor.lat as number,
          lng: anchor.lng as number,
          frequency: anchor.frequency,
          label: anchor.name,
        })),
    [northStarAnchors],
  );
  const calculatedEfficiencyScore = useMemo(
    () => calculateEfficiencyScore({ lat, lng }, weightedEfficiencyAnchors),
    [lat, lng, weightedEfficiencyAnchors],
  );
  const efficiencyScore = getNumber(property.efficiencyScore, calculatedEfficiencyScore);
  const resilienceScore = getNumber(property.resilienceScore, 85);
  const reviewSignal = getReviewSignal(property);
  const narrative = getTravelNarrative(efficiencyScore);

  useEffect(() => {
    function handleNorthStarUpdate(event: Event) {
      const detail = (event as CustomEvent<{ anchors?: NorthStarAnchor[] }>).detail;
      if (Array.isArray(detail?.anchors)) {
        setNorthStarAnchors(detail.anchors);
      }
    }

    window.addEventListener('reie:north-stars-updated', handleNorthStarUpdate);
    return () => window.removeEventListener('reie:north-stars-updated', handleNorthStarUpdate);
  }, []);

  useEffect(() => {
    if (activeTab !== 'efficiency') return;

    const controller = new AbortController();

    async function loadLogistics() {
      try {
        setLogistics((current) => ({ ...current, status: current.times.length > 0 ? 'ready' : 'loading' }));

        const response = await fetch('/api/logistics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            homeCoords: { lat, lng },
            northStars: activeLogisticsAnchors,
          }),
          signal: controller.signal,
        });
        const data = (await response.json()) as {
          times?: LogisticsTime[];
          source?: 'mapbox' | 'estimated';
          message?: string;
          error?: string;
        };

        if (!response.ok) {
          throw new Error(data.error || 'Logistics request failed.');
        }

        setLogistics({
          status: 'ready',
          times: Array.isArray(data.times) ? data.times : [],
          source: data.source,
          message: data.message,
        });
      } catch (error) {
        if (controller.signal.aborted) return;
        setLogistics({
          status: 'error',
          times: [],
          message: error instanceof Error ? error.message : 'Logistics request failed.',
        });
      }
    }

    void loadLogistics();

    return () => controller.abort();
  }, [activeTab, lat, lng, activeLogisticsAnchors]);

  return (
    <div
      className="relative flex h-full w-full flex-col overflow-hidden bg-[#050505] animate-in fade-in duration-500"
      data-testid="reie-property-detail"
      data-property-detail-id={propertyId}
      data-property-detail-address={address}
      data-property-detail-city={city}
      data-property-detail-price={price}
      data-property-detail-type={propertyType}
      data-property-detail-user-tier={userTier}
      data-property-detail-active-tab={activeTab}
      data-property-detail-private={String(Boolean(property.isPrivateExclusive))}
      data-property-detail-review={String(Boolean(property.hasPolybutyleneRisk))}
      data-property-detail-mapped={String(hasCoordinatesFlag)}
      data-property-detail-photo-available={String(hasPhoto)}
      data-property-detail-efficiency-score={efficiencyScore}
      data-property-detail-resilience-score={resilienceScore}
      data-property-detail-review-signal={reviewSignal}
      data-property-detail-logistics-status={logistics.status}
      data-property-detail-logistics-source={logistics.source || ''}
      data-property-detail-logistics-count={logistics.times.length}
      data-property-detail-strategy-locked={String(strategyLocked)}
    >
      <div
        className="z-10 flex shrink-0 items-center justify-between border-b border-white/5 bg-black/80 px-14 py-8 backdrop-blur-2xl"
        data-testid="reie-property-detail-header"
        data-property-detail-user-tier={userTier}
        data-property-detail-active-tab={activeTab}
      >
        <button
          type="button"
          onClick={onClose}
          data-testid="reie-property-detail-return"
          data-property-detail-id={propertyId}
          className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.5em] text-white/40 transition-all hover:text-[#00ff80]"
        >
          <ChevronLeft size={16} className="transition-transform group-hover:-translate-x-1" />
          <span className="mt-0.5">Return to Inventory</span>
        </button>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 border border-white/10 bg-white/5 px-4 py-2">
            <div className={`h-1.5 w-1.5 rounded-full ${userTier === 'Contracted' ? 'bg-[#00ff80] shadow-[0_0_10px_#00ff80]' : 'bg-white/20'}`} />
            <span className="text-[9px] font-black uppercase tracking-widest text-white/60">
              {userTier === 'Contracted' ? 'Advisor Review Available' : 'Public Property Preview'}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            data-testid="reie-property-detail-close"
            data-property-detail-id={propertyId}
            className="p-2 text-white/20 transition-colors hover:text-white"
          >
            <X size={22} />
          </button>
        </div>
      </div>

      <div className="custom-scrollbar flex-1 overflow-y-auto">
        <div
          className="relative aspect-[21/9] w-full overflow-hidden border-b border-white/5 bg-black"
          data-testid="reie-property-detail-hero"
          data-property-detail-photo-available={String(hasPhoto)}
          data-property-detail-image-src={imageSrc || ''}
          data-property-detail-fallback-src={fallbackImageSrc}
        >
          <ResilientListingImage
            src={imageSrc}
            fallbackSrc={fallbackImageSrc}
            alt={address}
            loading="eager"
            fetchPriority="high"
            fallbackLabel="REIE visual"
            className="absolute inset-0 h-full w-full object-cover opacity-60 grayscale-[0.3]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />

          <div className="absolute bottom-16 left-14">
            {property.isPrivateExclusive ? (
              <div className="mb-4 inline-block bg-amber-500 px-4 py-1 text-[10px] font-black uppercase italic tracking-[0.3em] text-black">
                Shadow Inventory: Private Exclusive
              </div>
            ) : null}
            <h2 className="mb-4 text-8xl font-black italic leading-none tracking-tight text-white">{formatLuxuryPrice(price)}</h2>
            <p className="text-[14px] font-bold uppercase leading-relaxed tracking-[0.6em] text-[#00ff80]">
              {address} - {city}, CO
            </p>
          </div>
        </div>

        <div
          className="sticky top-0 z-20 flex border-b border-white/5 bg-black/40 backdrop-blur-xl"
          data-testid="reie-property-detail-tabs"
          data-property-detail-active-tab={activeTab}
        >
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              data-testid="reie-property-detail-tab"
              data-property-detail-tab={tab.id}
              data-property-detail-tab-active={String(activeTab === tab.id)}
              className={`flex flex-1 items-center justify-center gap-3 py-8 text-[10px] font-black uppercase tracking-[0.4em] transition-all ${
                activeTab === tab.id ? 'border-b-2 border-[#00ff80] bg-[#00ff80]/5 text-[#00ff80]' : 'text-white/30 hover:text-white'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        <div className="mx-auto w-full max-w-7xl px-14 py-24">
          {activeTab === 'intel' ? (
            <div
              className="grid grid-cols-1 gap-24 animate-in fade-in slide-in-from-bottom-4 duration-700 lg:grid-cols-2"
              data-testid="reie-property-detail-intel"
              data-property-detail-efficiency-score={efficiencyScore}
              data-property-detail-resilience-score={resilienceScore}
              data-property-detail-review-signal={reviewSignal}
            >
              <div className="space-y-12">
                <div className="grid grid-cols-3 gap-12 border-b border-white/5 pb-16">
                  <StatItem label="Bedrooms" value={formatStat(property.beds)} />
                  <StatItem label="Bathrooms" value={formatStat(property.baths)} />
                  <StatItem label="Sq. Footage" value={formatStat(property.sqft)} />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <IntelTile label="Efficiency" value={formatStat(efficiencyScore)} />
                  <IntelTile label="Resilience" value={formatStat(resilienceScore)} />
                  <IntelTile label="Review" value={reviewSignal} />
                </div>
                <div className="space-y-6">
                  <h4 className="text-[11px] font-black uppercase tracking-[0.6em] text-[#00ff80]">Property Context</h4>
                  <p className="text-xl font-medium italic leading-[1.8] text-white/60">
                    {property.description ||
                      'A Colorado property preview with public listing facts, location context, and visible condition signals for initial buyer review.'}
                  </p>
                </div>
              </div>
              <div className="space-y-8 border border-white/5 bg-white/[0.02] p-12">
                <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-white/40">Market Context</h4>
                <div className="relative h-1 w-full bg-white/5">
                  <div className="glow-green absolute left-0 top-0 h-full w-[75%] bg-[#00ff80]" />
                </div>
                <p className="text-[10px] font-bold uppercase leading-relaxed tracking-widest text-white/40">
                  Compare this listing against active alternatives, condition diligence, and timing before deciding whether to tour or inquire.
                </p>
              </div>
            </div>
          ) : null}

          {activeTab === 'efficiency' ? (
            <div
              className="mx-auto max-w-4xl space-y-16 text-center animate-in zoom-in-95 duration-500"
              data-testid="reie-property-detail-efficiency"
              data-property-detail-efficiency-score={efficiencyScore}
              data-property-detail-logistics-status={logistics.status}
              data-property-detail-logistics-source={logistics.source || ''}
              data-property-detail-logistics-count={logistics.times.length}
            >
              <div className="space-y-4">
                <div className="text-[11px] font-black uppercase tracking-[0.6em] text-[#00ff80]">Location Context</div>
                <div className="text-9xl font-black italic leading-none tracking-tight text-white">{efficiencyScore}</div>
              </div>
              <p className="px-12 text-2xl font-light italic leading-relaxed text-white/70">{narrative}</p>
              <div
                className="border border-white/10 bg-white/[0.02] p-8 text-left"
                data-testid="reie-property-detail-logistics"
                data-property-detail-logistics-status={logistics.status}
                data-property-detail-logistics-source={logistics.source || ''}
                data-property-detail-logistics-count={logistics.times.length}
                data-property-detail-logistics-message={logistics.message || ''}
              >
                <div className="mb-8 flex flex-col gap-3 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.36em] text-white/35">Travel Preview</p>
                    <h4 className="mt-2 text-2xl font-black uppercase italic tracking-tight text-white">
                      {logisticsAnchors.length > 0 ? 'Saved North Stars' : 'Default North Stars'}
                    </h4>
                  </div>
                  <span className="w-fit border border-[#00ff80]/30 px-3 py-2 text-[9px] font-black uppercase tracking-[0.24em] text-[#00ff80]">
                    {logistics.source === 'mapbox' ? 'Travel Times' : 'Estimate'}
                  </span>
                </div>

                {logistics.status === 'loading' ? (
                  <p className="text-center text-[10px] font-black uppercase tracking-[0.3em] text-white/35">Calculating travel times...</p>
                ) : null}

                {logistics.status === 'error' ? (
                  <p className="text-center text-[10px] font-black uppercase tracking-[0.3em] text-red-300">{logistics.message}</p>
                ) : null}

                {logistics.status === 'ready' ? (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {logistics.times.map((time) => (
                      <div key={time.label} className="border border-white/10 bg-black/60 p-5">
                        <div className="mb-5 flex items-center gap-3 text-[#00ff80]">
                          <MapPin size={15} />
                          <span className="truncate text-[9px] font-black uppercase tracking-[0.24em] text-white/40">{time.label}</span>
                        </div>
                        <p className="text-4xl font-black italic tracking-tight text-white">
                          {typeof time.minutes === 'number' ? time.minutes : '--'}
                          <span className="ml-2 text-xs font-black uppercase tracking-widest text-white/30">Min</span>
                        </p>
                      </div>
                    ))}
                  </div>
                ) : null}

                {logistics.message ? (
                  <p className="mt-6 text-[9px] font-bold uppercase leading-relaxed tracking-[0.22em] text-white/25">{logistics.message}</p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => setShowManager(true)}
                className="inline-flex items-center gap-4 bg-white px-12 py-6 text-[11px] font-black uppercase tracking-[0.4em] text-black transition-all hover:bg-[#00ff80]"
              >
                Update Key Places <ArrowRight size={16} />
              </button>
            </div>
          ) : null}

          {activeTab === 'strategy' ? (
            <div
              className="relative animate-in fade-in duration-700"
              data-testid="reie-property-detail-strategy"
              data-property-detail-strategy-locked={String(strategyLocked)}
              data-property-detail-user-tier={userTier}
            >
              {userTier === 'Public' ? (
                <div
                  className="absolute inset-0 z-10 flex flex-col items-center justify-center border border-dashed border-white/10 bg-black/40 p-20 text-center backdrop-blur-md"
                  data-testid="reie-property-detail-strategy-lock"
                  data-property-detail-user-tier={userTier}
                >
                  <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-full border border-[#00ff80]/20 bg-[#00ff80]/10">
                    <Lock className="text-[#00ff80]" size={32} />
                  </div>
                  <h3 className="mb-6 text-3xl font-black italic uppercase tracking-tight text-white">Advisor Review Available</h3>
                  <p className="mb-10 max-w-md text-[12px] font-bold uppercase leading-loose tracking-[0.3em] text-white/40">
                    Detailed contractor review, negotiation planning, and private advisory context are discussed directly with David Quinn Group clients.
                  </p>
                  <button
                    type="button"
                    className="bg-[#00ff80] px-14 py-6 text-[11px] font-black uppercase tracking-[0.5em] text-black shadow-[0_0_50px_rgba(0,255,128,0.2)] transition-all hover:bg-white"
                  >
                    Request Advisor Review
                  </button>
                </div>
              ) : null}

              <div className={`grid grid-cols-1 gap-12 md:grid-cols-2 ${userTier === 'Public' ? 'pointer-events-none select-none blur-xl grayscale' : ''}`}>
                <StrategyCard
                  title="Condition Review"
                  icon={<Zap size={18} />}
                  list={['Electrical: 200A Service', 'Plumbing: PEX Verified', 'Envelope: R-49 Insulation']}
                />
                <StrategyCard
                  title="Improvement Potential"
                  icon={<BarChart3 size={18} />}
                  list={['Unfinished Potential: $140k', 'Deferred Maint: -$12.5k', 'Finish Grade: Designer']}
                />
                <StrategyCard
                  title="Offer Planning"
                  icon={<ShieldCheck size={18} />}
                  list={['Market Velocity: High', 'Concession Play: 2/1 Buydown', 'Risk: High Fire-Risk Zone']}
                />
                <StrategyCard
                  title="Interior Craftsmanship"
                  icon={<Hammer size={18} />}
                  list={['Cabinetry: Furniture-Grade', 'Millwork: 7" Custom', 'Acoustic Index: High ROI']}
                />
              </div>

              {userTier === 'Contracted' ? (
                <div className="mt-16 flex items-start gap-6 border border-[#00ff80]/30 bg-white/[0.02] p-10">
                  <Construction className="shrink-0 text-[#00ff80]" size={24} />
                  <div>
                    <h4 className="mb-4 text-[11px] font-black uppercase tracking-[0.4em] text-[#00ff80]">David Quinn Review Summary</h4>
                    <p className="text-lg italic leading-relaxed text-white/60">
                      The renovation gap analysis identifies a $50k path to move this home from public baseline to optimized value.
                      Negotiation priority: focus on the roofing reserve due to aging mechanicals.
                    </p>
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>

      {showManager ? (
        <NorthStarManager
          isOpen={showManager}
          initialAnchors={northStarAnchors}
          onSave={setNorthStarAnchors}
          onClose={() => setShowManager(false)}
        />
      ) : null}
    </div>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-left">
      <p className="mb-4 text-5xl font-black italic leading-none tracking-tight text-white">{value || '--'}</p>
      <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-white/30">{label}</p>
    </div>
  );
}

function IntelTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 border border-white/10 bg-white/[0.03] p-4">
      <p className="text-[8px] font-black uppercase tracking-[0.24em] text-white/28">{label}</p>
      <p className="mt-3 truncate text-sm font-black uppercase tracking-[0.08em] text-white">{value || '--'}</p>
    </div>
  );
}

function StrategyCard({ title, icon, list }: { title: string; icon: ReactNode; list: string[] }) {
  return (
    <div className="border border-white/10 bg-white/[0.02] p-10">
      <div className="mb-8 flex items-center gap-4 text-[#00ff80]">
        {icon}
        <h5 className="text-[11px] font-black uppercase tracking-[0.4em] text-white">{title}</h5>
      </div>
      <ul className="space-y-4">
        {list.map((item) => (
          <li key={item} className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-white/40">
            <div className="h-1 w-1 rounded-full bg-[#00ff80]" /> {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/components/search/PropertyDetail.tsx
