'use client';

export type MapShellMarker = {
  id: string;
  lat?: number | null;
  lng?: number | null;
  price?: number | null;
  label?: string | null;
};

export type MapShellSearchMeta = {
  source?: 'typesense' | 'database' | string;
  returned?: number;
  mapped?: number;
  coordinateFiltered?: number;
};

type MapShellProps = {
  markers?: MapShellMarker[];
  meta?: MapShellSearchMeta | null;
};

function formatCount(value: number | undefined, fallback: number) {
  return Number.isFinite(value) ? Number(value) : fallback;
}

export default function MapShell({ markers = [], meta = null }: MapShellProps) {
  const mapped = formatCount(meta?.mapped, markers.length);
  const returned = formatCount(meta?.returned, markers.length);
  const filtered = formatCount(meta?.coordinateFiltered, Math.max(0, returned - mapped));
  const source = meta?.source || 'local';

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_28%_22%,rgba(207,250,254,0.12),transparent_28%),linear-gradient(135deg,#071017,#101820_46%,#05080c)]">
      <div className="max-w-[320px] px-6 text-center">
        <p className="mb-4 text-[10px] font-black uppercase tracking-[0.28em] text-cyan-100/76">Colorado Map Guide</p>
        <p className="font-serif text-2xl font-black leading-tight text-white">Finding the areas that deserve a closer look.</p>
        <p className="mt-4 text-xs font-bold uppercase leading-5 tracking-[0.14em] text-white/42">{mapped} mapped homes ready for comparison</p>
        <p className="mt-3 text-[10px] font-black uppercase tracking-[0.18em] text-white/24">
          {source} / {returned} returned / {filtered} filtered
        </p>
      </div>
    </div>
  );
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/components/search/MapShell.tsx
