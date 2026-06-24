'use client';

import { ImageOff } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

type ResilientListingImageProps = {
  src?: string | null;
  fallbackSrc: string;
  alt: string;
  className?: string;
  loading?: 'eager' | 'lazy';
  fetchPriority?: 'high' | 'low' | 'auto';
  fallbackLabel?: string;
  timeoutMs?: number;
};

function getCleanSrc(value: string | null | undefined) {
  const trimmed = value?.trim();
  return trimmed || null;
}

export default function ResilientListingImage({
  src,
  fallbackSrc,
  alt,
  className,
  loading = 'lazy',
  fetchPriority = 'auto',
  fallbackLabel = 'Photo unavailable',
  timeoutMs = 6000,
}: ResilientListingImageProps) {
  const sourceSrc = useMemo(() => getCleanSrc(src) || fallbackSrc, [fallbackSrc, src]);
  const [failedSourceSrc, setFailedSourceSrc] = useState<string | null>(null);
  const [loadedSourceSrc, setLoadedSourceSrc] = useState<string | null>(null);
  const activeSrc = failedSourceSrc === sourceSrc ? fallbackSrc : sourceSrc;
  const isFallback = activeSrc === fallbackSrc;
  const hasLoadedActiveSrc = loadedSourceSrc === activeSrc;

  useEffect(() => {
    if (activeSrc === fallbackSrc || loadedSourceSrc === sourceSrc) return undefined;

    const timeout = setTimeout(() => {
      setFailedSourceSrc(sourceSrc);
    }, timeoutMs);

    return () => clearTimeout(timeout);
  }, [activeSrc, fallbackSrc, loadedSourceSrc, sourceSrc, timeoutMs]);

  function handleError() {
    if (activeSrc === fallbackSrc) return;
    setFailedSourceSrc(sourceSrc);
  }

  function handleLoad() {
    setLoadedSourceSrc(activeSrc);
  }

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={activeSrc}
        alt={alt}
        loading={loading}
        decoding="async"
        fetchPriority={fetchPriority}
        onError={handleError}
        onLoad={handleLoad}
        data-testid="reie-resilient-listing-image"
        data-image-source-src={sourceSrc}
        data-image-active-src={activeSrc}
        data-image-fallback-src={fallbackSrc}
        data-image-is-fallback={String(isFallback)}
        data-image-failed-source={failedSourceSrc || ''}
        data-image-loaded-source={loadedSourceSrc || ''}
        data-image-loaded={String(hasLoadedActiveSrc)}
        data-image-loading={loading}
        data-image-fetch-priority={fetchPriority}
        data-image-timeout-ms={timeoutMs}
        data-image-fallback-label={fallbackLabel}
        className={className}
      />
      {isFallback ? (
        <span
          className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-[5px] border border-white/18 bg-black/58 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-white/76 backdrop-blur"
          data-testid="reie-resilient-listing-image-fallback"
          data-image-fallback-src={fallbackSrc}
          data-image-failed-source={failedSourceSrc || sourceSrc}
          data-image-fallback-label={fallbackLabel}
        >
          <ImageOff size={12} aria-hidden="true" />
          {fallbackLabel}
        </span>
      ) : null}
    </>
  );
}
