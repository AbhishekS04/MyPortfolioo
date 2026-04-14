"use client";

import { useRef } from "react";
import {
  Map,
  MapMarker,
  MarkerContent,
  MapRef,
  MarkerLabel,
} from "@/components/ui/map";
import { Navigation } from "lucide-react";

export default function RealMap() {
  const mapRef = useRef<MapRef>(null);

  // Target: Adamas University (Exact location)
  const targetLng = 88.4566127;
  const targetLat = 22.7383026;

  const handleZoomToLocation = () => {
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [targetLng, targetLat],
        zoom: 16,
        pitch: 45, // Add a slight pitch for a cool 3D perspective
        bearing: 0,
        duration: 3500,
        essential: true,
      });
    }
  };

  const handleMarkerClick = () => {
    const mapWindow = window.open(
      `https://www.google.com/maps/search/?api=1&query=${targetLat},${targetLng}`,
      "_blank",
    );
    if (mapWindow) {
      mapWindow.opener = null;
    }
  };

  return (
    <div className="relative w-full h-full bg-[#111]">
      <Map
        ref={mapRef}
        center={[0, 20]} // World View
        zoom={1.2}
        projection={{ type: "globe" }}
        styles={{
          // Force dark style for consistency with the card design
          light:
            "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
          dark: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
        }}
        attributionControl={false}
        scrollZoom={true} // Enable gesture / scroll zoom
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

      {/* Manual Zoom Button */}
      <button
        onClick={handleZoomToLocation}
        className="absolute bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-full backdrop-blur-md border border-white/10 transition-colors shadow-2xl cursor-pointer"
      >
        <Navigation size={16} />
        <span>Find Me</span>
      </button>
    </div>
  );
}
