import * as React from 'react';
import { createMap } from 'svg-dotted-map';

import { cn } from '@/lib/utils';

interface Marker {
  lat: number;
  lng: number;
  size?: number;
}

export interface DottedMapProps extends React.SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  mapSamples?: number;
  markers?: Marker[];
  dotColor?: string;
  markerColor?: string;
  dotRadius?: number;
  stagger?: boolean;
}

export function DottedMap({
  width = 150,
  height = 75,
  mapSamples = 5000,
  markers = [],
  markerColor = '#FF6900',
  dotRadius = 0.2,
  stagger = true,
  className,
  style,
}: DottedMapProps) {
  const mapData = React.useMemo(
    () => createMap({ width, height, mapSamples }),
    [width, height, mapSamples],
  );
  const { points, addMarkers } = mapData;

  const markersKey = JSON.stringify(markers);
  const processedMarkers = React.useMemo(
    () => addMarkers(markers),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [addMarkers, markersKey],
  );

  // Compute stagger helpers in a single, simple pass
  const { xStep, yToRowIndex } = React.useMemo(() => {
    const sorted = [...points].sort((a, b) => a.y - b.y || a.x - b.x);
    const rowMap = new Map<number, number>();
    let step = 0;
    let prevY = Number.NaN;
    let prevXInRow = Number.NaN;

    for (const p of sorted) {
      if (p.y !== prevY) {
        // new row
        prevY = p.y;
        prevXInRow = Number.NaN;
        if (!rowMap.has(p.y)) rowMap.set(p.y, rowMap.size);
      }
      if (!Number.isNaN(prevXInRow)) {
        const delta = p.x - prevXInRow;
        if (delta > 0) step = step === 0 ? delta : Math.min(step, delta);
      }
      prevXInRow = p.x;
    }

    return { xStep: step || 1, yToRowIndex: rowMap };
  }, [points]);

  const [isEggActive, setIsEggActive] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const purged = localStorage.getItem('mapEgg');
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (purged !== 'purged') setIsEggActive(true);
    }
  }, []);

  const handleEggClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsEggActive(false);
    localStorage.setItem('mapEgg', 'purged');
  };

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={cn('text-gray-500 dark:text-gray-500', className)}
      style={{ width: '100%', height: '100%', ...style }}
    >
      {points.map((point, index) => {
        const rowIndex = yToRowIndex.get(point.y) ?? 0;
        const offsetX = stagger && rowIndex % 2 === 1 ? xStep / 2 : 0;
        return (
          <circle
            cx={point.x + offsetX}
            cy={point.y}
            r={dotRadius}
            fill="currentColor"
            key={`${point.x}-${point.y}-${index}`}
          />
        );
      })}
      {processedMarkers.map((marker, index) => {
        const rowIndex = yToRowIndex.get(marker.y) ?? 0;
        const offsetX = stagger && rowIndex % 2 === 1 ? xStep / 2 : 0;
        return (
          <g key={`${marker.x}-${marker.y}-${index}`}>
            <circle
              cx={marker.x + offsetX}
              cy={marker.y}
              r={marker.size ?? dotRadius}
              fill={markerColor}
              className="animate-ping opacity-75"
              style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
            />
            <circle
              cx={marker.x + offsetX}
              cy={marker.y}
              r={marker.size ?? dotRadius}
              fill={markerColor}
            />
            {isEggActive && (
              <circle
                cx={marker.x + offsetX}
                cy={marker.y}
                r={(marker.size ?? dotRadius) * 4} // ~4x radius for comfortable click area
                fill="transparent"
                className="cursor-default pointer-events-auto"
                onClick={handleEggClick}
              />
            )}
          </g>
        );
      })}
    </svg>
  );
}
