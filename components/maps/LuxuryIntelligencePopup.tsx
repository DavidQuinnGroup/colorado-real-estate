'use client';

import Image from 'next/image';

import { getListingPhotoUrl } from '@/lib/listingVisuals';
import { formatLuxuryPrice } from '@/lib/utils/formatters';

type LuxuryPopupProperty = {
  id?: string | null;
  address?: string | null;
  city?: string | null;
  price?: number | string | null;
  propertyType?: string | null;
  images?: string[] | null;
  photos?: Array<string | { url?: string | null }> | null;
  mainPhoto?: string | null;
  image?: string | null;
  efficiencyScore?: number | null;
  resilienceScore?: number | null;
  altitude?: number | null;
  soilType?: string | null;
  hasPolybutyleneRisk?: boolean | null;
};

type LuxuryIntelligencePopupProps = {
  property: LuxuryPopupProperty;
};

function getNumber(value: number | string | null | undefined, fallback = 0) {
  if (value === null || value === undefined || value === '') return fallback;

  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function getPhotos(property: LuxuryPopupProperty) {
  if (property.photos?.length) return property.photos;
  return property.images || [];
}

export default function LuxuryIntelligencePopup({ property }: LuxuryIntelligencePopupProps) {
  const price = getNumber(property.price);
  const efficiencyScore = getNumber(property.efficiencyScore, 88);
  const resilienceScore = getNumber(property.resilienceScore, 85);
  const altitude = getNumber(property.altitude);
  const address = property.address || 'Address Available by Request';
  const riskLabel = property.hasPolybutyleneRisk ? 'PLUMBING REVIEW' : property.soilType || (altitude ? `${altitude.toLocaleString()} FT` : 'REIE VERIFIED');
  const photoUrl = getListingPhotoUrl({
    id: property.id,
    address,
    city: property.city,
    propertyType: property.propertyType,
    photos: getPhotos(property),
    mainPhoto: property.mainPhoto,
    image: property.image,
  });

  return (
    <div className="w-64 animate-in overflow-hidden border border-[#00ff80]/40 bg-black p-0 shadow-[0_0_40px_rgba(0,255,128,0.2)] duration-200 zoom-in">
      <div className="relative h-24 overflow-hidden bg-zinc-900">
        <Image src={photoUrl} alt={address} fill sizes="256px" className="object-cover" />
      </div>
      <div className="p-4">
        <div className="mb-2 flex items-start justify-between gap-3">
          <div className="w-2/3 truncate text-sm font-black uppercase italic tracking-tight text-white">{address}</div>
          <div className="text-xs font-black italic text-[#00ff80]">{formatLuxuryPrice(price)}</div>
        </div>
        <div className="grid grid-cols-2 gap-2 border-t border-white/10 pt-3">
          <div className="bg-[#00ff80] px-2 py-0.5 text-[8px] font-black uppercase italic tracking-widest text-black">
            Efficiency {efficiencyScore}
          </div>
          <div className="bg-white px-2 py-0.5 text-[8px] font-black uppercase italic tracking-widest text-black">
            Resilience {resilienceScore}
          </div>
          <div className="col-span-2 truncate text-[8px] font-black uppercase italic tracking-widest text-white/50">
            {riskLabel}
          </div>
        </div>
      </div>
    </div>
  );
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/components/maps/LuxuryIntelligencePopup.tsx
