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
    <div className="absolute inset-0 flex items-center justify-center bg-[#0f0f0f]">
      <div className="text-center">
        <p className="mb-4 text-[10px] font-black uppercase tracking-[0.5em] text-[#00ff80]">Geospatial Sync Active</p>
        <p className="text-xs font-bold uppercase italic text-white/20">{mapped} Estates Indexed in Viewport</p>
        <p className="mt-3 text-[10px] font-black uppercase tracking-[0.24em] text-white/15">
          {source} / {returned} returned / {filtered} filtered
        </p>
      </div>
    </div>
  );
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/components/search/MapShell.tsx
