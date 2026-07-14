'use client';

import Image, { ImageProps } from 'next/image';
import { useState, useMemo } from 'react';

// List of domains supported by next/image optimization as defined in next.config.ts
const OPTIMIZED_DOMAINS = [
  'images.unsplash.com',
  'plus.unsplash.com',
  'github.com',
  'raw.githubusercontent.com',
  'avatars.githubusercontent.com',
  'media.licdn.com',
  'wallpapers.com',
  'rdxqqgntmtzvqsmepmls.supabase.co',
  'cumdfaxqugcqgcfusaye.supabase.co',
  'ik.imagekit.io',
  'cloud-snapp.vercel.app',
  'cloudsnap.vercel.app',
  'snapp.vercel.app',
  'cdn.shadcnstudio.com',
];

interface UniversalImageProps extends Omit<ImageProps, 'src'> {
  src: string | null | undefined;
  fallbackSrc?: string;
  containerClassName?: string;
}

export function UniversalImage({
  src,
  alt,
  className,
  fill,
  width,
  height,
  priority,
  quality,
  sizes = fill ? '100vw' : undefined,
  fallbackSrc = '/placeholder.svg',
  ...props
}: UniversalImageProps) {
  // errorSrc is only set when the image fails to load
  const [errorSrc, setErrorSrc] = useState<string | null>(null);
  // Derive current src: error fallback > prop src > fallbackSrc
  const imgSrc = useMemo(
    () => errorSrc ?? src ?? fallbackSrc,
    [errorSrc, src, fallbackSrc],
  );
  const isOptimizable = (url: string) => {
    if (!url || typeof url !== 'string') return false;
    if (url.startsWith('/')) return true; // Local images are optimizable
    try {
      const hostname = new URL(url).hostname;
      return OPTIMIZED_DOMAINS.includes(hostname);
    } catch (e) {
      return false;
    }
  };

  const isCustomCDN = useMemo(() => {
    if (!imgSrc || typeof imgSrc !== 'string') return false;
    return (
      imgSrc.includes('cloud-snapp.vercel.app') ||
      imgSrc.includes('cloudsnap.vercel.app') ||
      imgSrc.includes('snapp.vercel.app')
    );
  }, [imgSrc]);

  const shouldUseNextImage = isOptimizable(imgSrc);

  const handleError = () => {
    if (imgSrc !== fallbackSrc) setErrorSrc(fallbackSrc);
  };

  if (shouldUseNextImage) {
    return (
      <Image
        src={imgSrc}
        alt={alt}
        className={className}
        fill={fill}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        priority={priority}
        quality={quality}
        sizes={sizes}
        unoptimized={isCustomCDN}
        onError={handleError}
        {...props}
      />
    );
  }

  // Fallback for generic URLs (standard img tag)
  // We need to simulate some 'fill' behavior if fill prop is true
  const style: React.CSSProperties = fill
    ? {
        position: 'absolute',
        height: '100%',
        width: '100%',
        inset: 0,
        objectFit: 'cover',
        ...props.style,
      }
    : { ...props.style };

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      style={style}
      width={!fill ? width : undefined}
      height={!fill ? height : undefined}
      onError={handleError}
    />
  );
}
