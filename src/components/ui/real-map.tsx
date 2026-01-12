"use client";

import { useEffect, useRef } from "react"
import { Map, MapMarker, MarkerContent, MapRef, MarkerLabel } from "@/components/ui/map"

export default function RealMap() {
    const mapRef = useRef<MapRef>(null)

    // Target: Adamas University (Exact location)
    const targetLng = 88.4566127
    const targetLat = 22.7383026

    useEffect(() => {
        // Fly to location after a short delay to let the user see the globe
        const timer = setTimeout(() => {
            if (mapRef.current) {
                mapRef.current.flyTo({
                    center: [targetLng, targetLat],
                    zoom: 16,
                    pitch: 0, // Flat view (2D)
                    bearing: 0, // North facing
                    duration: 4000,
                    essential: true
                })
            }
        }, 1500) // Wait 1.5s so Globe is clearly visible

        return () => clearTimeout(timer)
    }, [])

    const handleMarkerClick = () => {
        window.open(`https://www.google.com/maps/search/?api=1&query=${targetLat},${targetLng}`, "_blank");
    };

    return (
        <div className="w-full h-full bg-[#111]">
            <Map
                ref={mapRef}
                center={[0, 20]} // Longitude, Latitude
                zoom={1.2}
                projection={{ type: "globe" }}
                styles={{
                    // Force dark style for consistency with the card design
                    light: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
                    dark: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
                }}
                attributionControl={false}
                scrollZoom={true}
                dragPan={true}
                dragRotate={true}
                doubleClickZoom={true}
            >
                <MapMarker longitude={targetLng} latitude={targetLat}>
                    <MarkerContent className="flex items-center justify-center w-12 h-12 z-[50]">
                        <div
                            onClick={handleMarkerClick}
                            className="relative flex items-center justify-center group/marker w-full h-full cursor-pointer pointer-events-auto"
                        >
                            <div className="absolute w-12 h-12 bg-orange-500/20 rounded-full animate-ping" />
                            <div className="absolute w-6 h-6 bg-orange-500/30 rounded-full animate-pulse" />
                            <div className="relative w-3.5 h-3.5 bg-[#F97316] rounded-full border-2 border-white shadow-[0_0_15px_rgba(249,115,22,0.8)] z-10" />
                        </div>
                    </MarkerContent>
                    <MarkerLabel position="bottom">
                        <div className="px-3 py-1.5 rounded-lg bg-black/80 border border-white/10 text-white font-medium text-xs shadow-xl backdrop-blur-md">
                            Adamas University
                        </div>
                    </MarkerLabel>
                </MapMarker>
            </Map>
        </div>
    );
}
