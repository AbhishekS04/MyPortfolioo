"use client"

import Image, { ImageProps } from "next/image"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

// List of domains supported by next/image optimization as defined in next.config.ts
const OPTIMIZED_DOMAINS = [
    "images.unsplash.com",
    "plus.unsplash.com",
    "github.com",
    "raw.githubusercontent.com",
    "avatars.githubusercontent.com",
    "res.cloudinary.com",
    "media.licdn.com",
    "wallpapers.com",
    "rdxqqgntmtzvqsmepmls.supabase.co"
];

interface UniversalImageProps extends Omit<ImageProps, "src"> {
    src: string | null | undefined;
    fallbackSrc?: string;
    containerClassName?: string;
}

export function UniversalImage({
    src,
    alt,
    className,
    containerClassName,
    fill,
    width,
    height,
    priority,
    quality,
    sizes = fill ? "100vw" : undefined,
    fallbackSrc = "/placeholder.svg",
    ...props
}: UniversalImageProps) {
    const [imgSrc, setImgSrc] = useState<string>(src || fallbackSrc);
    // Determine if the URL is optimizable by next/image
    const isOptimizable = (url: string) => {
        if (!url || typeof url !== 'string') return false;
        if (url.startsWith("/")) return true; // Local images are optimizable
        try {
            const hostname = new URL(url).hostname;
            return OPTIMIZED_DOMAINS.includes(hostname);
        } catch (e) {
            return false;
        }
    };

    useEffect(() => {
        setImgSrc(src || fallbackSrc);
    }, [src, fallbackSrc]);

    const shouldUseNextImage = isOptimizable(imgSrc);

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
                onError={() => {
                    if (imgSrc !== fallbackSrc) setImgSrc(fallbackSrc);
                }}
                {...props}
            />
        );
    }

    // Fallback for generic URLs (standard img tag)
    // We need to simulate some 'fill' behavior if fill prop is true
    const style: React.CSSProperties = fill ? {
        position: 'absolute',
        height: '100%',
        width: '100%',
        inset: 0,
        objectFit: 'cover',
        ...props.style
    } : { ...props.style };

    // eslint-disable-next-line @next/next/no-img-element
    return (
        <img
            src={imgSrc}
            alt={alt}
            className={className}
            style={style}
            width={!fill ? width : undefined}
            height={!fill ? height : undefined}
            onError={() => {
                if (imgSrc !== fallbackSrc) setImgSrc(fallbackSrc);
            }}
        />
    );
}
