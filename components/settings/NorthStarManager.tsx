'use client';

import {
  Briefcase,
  Clock,
  Dumbbell,
  GraduationCap,
  MapPin,
  Mountain,
  Navigation,
  Plane,
  Plus,
  Search,
  Trash2,
  X,
  Zap,
} from 'lucide-react';
import { useState } from 'react';

export type AnchorType = 'work' | 'school' | 'ritual' | 'lifestyle' | 'fbo';

export type NorthStarAnchor = {
  id: string;
  name: string;
  address: string;
  lat?: number;
  lng?: number;
  type: AnchorType;
  frequency: number;
};

type NorthStarManagerProps = {
  isOpen: boolean;
  onClose: () => void;
  initialAnchors?: NorthStarAnchor[];
  onSave?: (anchors: NorthStarAnchor[]) => void;
};

type GeocodeStatus = {
  anchorId: string;
  state: 'loading' | 'ready' | 'error';
  message: string;
};

type GeocodeResponse = {
  result?: {
    label?: string;
    address?: string;
    lat?: number;
    lng?: number;
    source?: string;
    confidence?: string;
  };
  message?: string;
  error?: string;
};

const anchorTypes: AnchorType[] = ['work', 'fbo', 'school', 'ritual', 'lifestyle'];
export const NORTH_STAR_STORAGE_KEY = 'reie:north-stars';

export const defaultNorthStarAnchors: NorthStarAnchor[] = [
  {
    id: 'dqg-hq',
    name: 'DQG HQ',
    address: 'Boulder Authority Center',
    lat: 40.0174,
    lng: -105.276,
    type: 'work',
    frequency: 5,
  },
  {
    id: 'downtown-boulder',
    name: 'Downtown Boulder',
    address: 'Pearl Street, Boulder, CO',
    lat: 40.0191,
    lng: -105.2817,
    type: 'lifestyle',
    frequency: 3,
  },
  {
    id: 'denver-core',
    name: 'Denver Core',
    address: 'Downtown Denver, CO',
    lat: 39.7392,
    lng: -104.9903,
    type: 'work',
    frequency: 2,
  },
];

function createAnchor(): NorthStarAnchor {
  return {
    id: Math.random().toString(36).slice(2, 11),
    name: 'New Lifestyle Hub',
    address: '',
    type: 'lifestyle',
    frequency: 3,
  };
}

function isAnchorType(value: string): value is AnchorType {
  return anchorTypes.includes(value as AnchorType);
}

function parseAnchorType(value: string): AnchorType {
  return isAnchorType(value) ? value : 'lifestyle';
}

function parseCoordinate(value: string) {
  const coordinate = Number(value);
  return Number.isFinite(coordinate) ? coordinate : undefined;
}

export function getSavedNorthStarAnchors(): NorthStarAnchor[] {
  if (typeof window === 'undefined') return defaultNorthStarAnchors;

  try {
    const rawAnchors = window.localStorage.getItem(NORTH_STAR_STORAGE_KEY);
    if (!rawAnchors) return defaultNorthStarAnchors;

    const parsed = JSON.parse(rawAnchors) as unknown;
    if (!Array.isArray(parsed)) return defaultNorthStarAnchors;

    const anchors = parsed
      .map((anchor): NorthStarAnchor | null => {
        if (typeof anchor !== 'object' || anchor === null) return null;
        const candidate = anchor as Partial<NorthStarAnchor>;
        const id = typeof candidate.id === 'string' && candidate.id.trim() ? candidate.id : Math.random().toString(36).slice(2, 11);
        const name = typeof candidate.name === 'string' && candidate.name.trim() ? candidate.name.trim() : 'North Star';
        const address = typeof candidate.address === 'string' ? candidate.address : '';
        const frequency = typeof candidate.frequency === 'number' && Number.isFinite(candidate.frequency) ? candidate.frequency : 3;

        return {
          id,
          name,
          address,
          lat: typeof candidate.lat === 'number' && Number.isFinite(candidate.lat) ? candidate.lat : undefined,
          lng: typeof candidate.lng === 'number' && Number.isFinite(candidate.lng) ? candidate.lng : undefined,
          type: parseAnchorType(typeof candidate.type === 'string' ? candidate.type : ''),
          frequency: Math.max(1, Math.min(7, Math.round(frequency))),
        };
      })
      .filter((anchor): anchor is NorthStarAnchor => anchor !== null);

    return anchors.length > 0 ? anchors : defaultNorthStarAnchors;
  } catch {
    return defaultNorthStarAnchors;
  }
}

export function saveNorthStarAnchors(anchors: NorthStarAnchor[]) {
  if (typeof window === 'undefined') return;

  window.localStorage.setItem(NORTH_STAR_STORAGE_KEY, JSON.stringify(anchors));
  window.dispatchEvent(new CustomEvent('reie:north-stars-updated', { detail: { anchors } }));
}

export default function NorthStarManager({ isOpen, onClose, initialAnchors, onSave }: NorthStarManagerProps) {
  const [anchors, setAnchors] = useState<NorthStarAnchor[]>(() => initialAnchors || getSavedNorthStarAnchors());
  const [geocodeStatus, setGeocodeStatus] = useState<GeocodeStatus | null>(null);

  const addAnchor = () => {
    setAnchors((currentAnchors) => [...currentAnchors, createAnchor()]);
  };

  const removeAnchor = (id: string) => {
    setAnchors((currentAnchors) => currentAnchors.filter((anchor) => anchor.id !== id));
  };

  const updateAnchor = <Field extends keyof NorthStarAnchor>(id: string, field: Field, value: NorthStarAnchor[Field]) => {
    setAnchors((currentAnchors) =>
      currentAnchors.map((anchor) => (anchor.id === id ? { ...anchor, [field]: value } : anchor)),
    );
  };

  const syncAnchors = () => {
    saveNorthStarAnchors(anchors);
    onSave?.(anchors);
    onClose();
  };

  const geocodeAnchor = async (anchor: NorthStarAnchor) => {
    const query = anchor.address.trim() || anchor.name.trim();

    if (!query) {
      setGeocodeStatus({ anchorId: anchor.id, state: 'error', message: 'Enter an address or anchor name first.' });
      return;
    }

    try {
      setGeocodeStatus({ anchorId: anchor.id, state: 'loading', message: 'Locating anchor...' });

      const response = await fetch('/api/geocode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: query }),
      });
      const data = (await response.json()) as GeocodeResponse;

      if (!response.ok || !data.result || typeof data.result.lat !== 'number' || typeof data.result.lng !== 'number') {
        throw new Error(data.error || 'No coordinates found.');
      }

      setAnchors((currentAnchors) =>
        currentAnchors.map((currentAnchor) =>
          currentAnchor.id === anchor.id
            ? {
                ...currentAnchor,
                address: data.result?.address || currentAnchor.address,
                lat: data.result?.lat,
                lng: data.result?.lng,
              }
            : currentAnchor,
        ),
      );
      setGeocodeStatus({
        anchorId: anchor.id,
        state: 'ready',
        message: data.message || `${data.result.source === 'mapbox' ? 'Live' : 'Local'} geocode applied.`,
      });
    } catch (error) {
      setGeocodeStatus({
        anchorId: anchor.id,
        state: 'error',
        message: error instanceof Error ? error.message : 'Geocode failed.',
      });
    }
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-[2000] bg-black/80 backdrop-blur-[8px] transition-opacity duration-700 ${
          isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
      />

      <div
        className={`fixed right-0 top-0 z-[2100] h-full w-[650px] border-l border-white/10 bg-[#030303] transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col shadow-[-50px_0_100px_rgba(0,0,0,0.9)]">
          <div className="flex items-start justify-between border-b border-white/10 bg-gradient-to-b from-white/[0.02] to-transparent p-12">
            <div>
              <div className="mb-4 flex items-center gap-3">
                <div className="h-2 w-2 animate-pulse rounded-full bg-[#00ff80] shadow-[0_0_15px_#00ff80]" />
                <span className="text-[10px] font-black uppercase italic tracking-[0.5em] text-[#00ff80]">
                  North Star Efficiency
                </span>
              </div>
              <h2 className="text-6xl font-black uppercase italic leading-[0.85] tracking-tighter text-white">
                North Star
                <br />
                Planner
              </h2>
              <p className="mt-6 max-w-[300px] text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
                Clarify the places that shape daily life
              </p>
            </div>
            <button
              onClick={onClose}
              className="group border border-white/10 p-4 transition-all hover:bg-[#00ff80] hover:text-black"
              type="button"
            >
              <X className="h-6 w-6 transition-transform group-hover:rotate-90" />
            </button>
          </div>

          <div className="custom-scrollbar flex-1 space-y-16 overflow-y-auto p-12">
            <section>
              <div className="mb-8 flex items-center justify-between">
                <h3 className="text-[11px] font-black uppercase italic tracking-[0.4em] text-white/30">Primary Reference Point</h3>
                <span className="animate-pulse text-[9px] font-black uppercase tracking-widest text-[#00ff80]">Ready</span>
              </div>
              <div className="group relative overflow-hidden border border-[#00ff80]/30 bg-white/[0.03] p-8">
                <div className="absolute right-0 top-0 p-4 opacity-5 transition-opacity group-hover:opacity-20">
                  <Zap className="h-24 w-24 text-[#00ff80]" />
                </div>
                <div className="relative z-10 flex items-center gap-6">
                  <div className="flex h-20 w-20 items-center justify-center border border-white/10 bg-black">
                    <div className="h-3 w-3 animate-ping rounded-full bg-[#00ff80]" />
                  </div>
                  <div>
                    <div className="text-2xl font-black uppercase italic tracking-widest text-white">DQG HQ</div>
                    <div className="mt-2 text-[10px] font-bold uppercase tracking-[0.3em] text-[#00ff80]">
                      Boulder Authority Center
                    </div>
                    <div className="mt-1 font-mono text-[9px] uppercase text-white/30">40.0174 N, 105.2760 W</div>
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-10">
              <div className="flex items-center justify-between">
                <h3 className="text-[11px] font-black uppercase italic tracking-[0.4em] text-white/30">Lifestyle Anchors</h3>
                <button
                  onClick={addAnchor}
                  className="flex items-center gap-3 border border-[#00ff80]/30 px-6 py-3 text-[10px] font-black uppercase tracking-widest text-[#00ff80] transition-all hover:bg-[#00ff80] hover:text-black"
                  type="button"
                >
                  <Plus className="h-3 w-3" />
                  Add Anchor
                </button>
              </div>

              <div className="space-y-8">
                {anchors.map((anchor) => (
                  <div
                    key={anchor.id}
                    className="group relative border border-white/5 bg-white/[0.02] p-8 transition-all hover:border-white/20"
                  >
                    <button
                      onClick={() => removeAnchor(anchor.id)}
                      className="absolute right-6 top-6 text-white/20 opacity-0 transition-opacity hover:text-red-500 group-hover:opacity-100"
                      type="button"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>

                    <div className="grid grid-cols-[120px_1fr] gap-10">
                      <div className="flex flex-col items-center gap-4">
                        <div className="relative flex h-24 w-24 items-center justify-center border border-white/10 bg-black transition-colors group-hover:border-[#00ff80]/50">
                          <AnchorTypeIcon type={anchor.type} />
                          <div className="absolute -bottom-2 bg-[#00ff80] px-2 py-0.5 text-[8px] font-black uppercase text-black">
                            {anchor.type}
                          </div>
                        </div>
                        <div className="w-full text-center">
                          <div className="mb-2 flex items-center justify-center gap-2">
                            <Clock className="h-3 w-3 text-[#00ff80]" />
                            <span className="text-[8px] font-black uppercase tracking-tighter text-white/30">Frequency</span>
                          </div>
                          <select
                            value={anchor.frequency}
                            onChange={(event) => updateAnchor(anchor.id, 'frequency', Number(event.target.value))}
                            className="w-full cursor-pointer appearance-none border border-white/10 bg-black px-2 py-2 text-center text-xs font-black uppercase text-[#00ff80] outline-none focus:border-[#00ff80]"
                          >
                            {[1, 2, 3, 4, 5, 6, 7].map((days) => (
                              <option key={days} value={days}>
                                {days} Days / Wk
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="flex gap-4">
                          <select
                            value={anchor.type}
                            onChange={(event) => updateAnchor(anchor.id, 'type', parseAnchorType(event.target.value))}
                            className="cursor-pointer border-b border-white/10 bg-transparent pb-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#00ff80] outline-none"
                          >
                            <option value="work">Work / Office</option>
                            <option value="fbo">Private Aviation / FBO</option>
                            <option value="school">Education / Legacy</option>
                            <option value="ritual">Health / Ritual</option>
                            <option value="lifestyle">Lifestyle / Trailhead</option>
                          </select>
                        </div>
                        <input
                          type="text"
                          value={anchor.name}
                          onChange={(event) => updateAnchor(anchor.id, 'name', event.target.value)}
                          placeholder="ANCHOR NAME (e.g. Google HQ)"
                          className="w-full border-b border-white/10 bg-transparent pb-2 text-4xl font-black uppercase italic tracking-tighter text-white outline-none transition-colors placeholder:text-white/5 focus:border-[#00ff80]"
                        />
                        <div className="relative">
                          <Navigation className="absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-[#00ff80]" />
                          <input
                            type="text"
                            value={anchor.address}
                            onChange={(event) => updateAnchor(anchor.id, 'address', event.target.value)}
                            placeholder="ADDRESS OR PLACE..."
                            className="w-full border-b border-white/5 bg-transparent pb-2 pl-8 text-[11px] font-bold uppercase tracking-[0.2em] text-white/70 outline-none transition-colors placeholder:text-white/10 focus:border-[#00ff80]"
                          />
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                          <button
                            type="button"
                            onClick={() => void geocodeAnchor(anchor)}
                            className="inline-flex items-center gap-2 border border-[#00ff80]/30 px-4 py-2 text-[9px] font-black uppercase tracking-[0.2em] text-[#00ff80] transition-all hover:bg-[#00ff80] hover:text-black"
                          >
                            <Search className="h-3 w-3" />
                            Locate
                          </button>
                          {geocodeStatus?.anchorId === anchor.id ? (
                            <span
                              className={`text-[9px] font-black uppercase tracking-[0.2em] ${
                                geocodeStatus.state === 'error' ? 'text-red-300' : 'text-white/35'
                              }`}
                            >
                              {geocodeStatus.message}
                            </span>
                          ) : null}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <input
                            type="number"
                            value={anchor.lat ?? ''}
                            onChange={(event) => updateAnchor(anchor.id, 'lat', parseCoordinate(event.target.value))}
                            placeholder="LAT"
                            className="w-full border border-white/10 bg-black px-4 py-3 text-[10px] font-black uppercase tracking-[0.18em] text-white/70 outline-none placeholder:text-white/10 focus:border-[#00ff80]"
                          />
                          <input
                            type="number"
                            value={anchor.lng ?? ''}
                            onChange={(event) => updateAnchor(anchor.id, 'lng', parseCoordinate(event.target.value))}
                            placeholder="LNG"
                            className="w-full border border-white/10 bg-black px-4 py-3 text-[10px] font-black uppercase tracking-[0.18em] text-white/70 outline-none placeholder:text-white/10 focus:border-[#00ff80]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="border-t border-white/10 bg-[#050505] p-12">
            <button
              onClick={syncAnchors}
              className="group relative w-full overflow-hidden bg-[#00ff80] py-8 text-2xl font-black uppercase italic tracking-[0.4em] text-black shadow-[0_0_50px_rgba(0,255,128,0.2)] transition-all hover:bg-white"
              type="button"
            >
              <span className="relative z-10">Save Anchors</span>
              <div className="absolute inset-0 translate-y-full bg-white transition-transform duration-300 group-hover:translate-y-0" />
            </button>
            <div className="mt-8 flex justify-center gap-6 opacity-40">
              <p className="text-[9px] font-black uppercase italic tracking-[0.5em] text-white/50">
                Keeping planning context focused and useful
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function AnchorTypeIcon({ type }: { type: AnchorType }) {
  const iconProps = { className: 'h-10 w-10 text-[#00ff80]', strokeWidth: 1.2 };

  switch (type) {
    case 'work':
      return <Briefcase {...iconProps} />;
    case 'school':
      return <GraduationCap {...iconProps} />;
    case 'ritual':
      return <Dumbbell {...iconProps} />;
    case 'lifestyle':
      return <Mountain {...iconProps} />;
    case 'fbo':
      return <Plane {...iconProps} />;
    default:
      return <MapPin {...iconProps} />;
  }
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/components/settings/NorthStarManager.tsx
