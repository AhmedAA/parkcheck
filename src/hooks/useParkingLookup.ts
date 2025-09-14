"use client";

import { useState, useCallback } from 'react';
import { loadGeoJSON, GeoJSONFeature } from '../lib/storage';

import { point, lineString } from '@turf/helpers';
import distance from '@turf/distance';
import pointToLineDistance from '@turf/point-to-line-distance';
import { Point, LineString } from 'geojson';

interface Position { lat: number; lng: number; }
interface LookupResult { status: 'allowed' | 'disallowed'; data?: any; }

export function useParkingLookup() {
  const [isLoading, setIsLoading] = useState(false);

  const lookup = useCallback(async (position: Position, onComplete: (result: LookupResult) => void) => {
    if (!position) return;
    
    setIsLoading(true);
    try {
      const geoJsonData = await loadGeoJSON();
      const userPoint = point([position.lng, position.lat]);
      let closestSpot: GeoJSONFeature | null = null;
      let minDistance = Infinity;
      const searchRadius = 0.005; // 5 meters

      for (const feature of geoJsonData.features) {
        try {
          if (!feature.geometry) continue;
          let dist = Infinity;

          if (feature.geometry.type === 'Point') {
            dist = distance(userPoint, feature.geometry as Point, { units: 'kilometers' });
          } else if (feature.geometry.type === 'LineString') {
            dist = pointToLineDistance(userPoint, feature.geometry as LineString, { units: 'kilometers' });
          } else if (feature.geometry.type === 'MultiLineString') {
            let multiLineMinDist = Infinity;
            for (const line of feature.geometry.coordinates) {
              if (line && line.length > 1) {
                const tempLine = lineString(line);
                const lineDist = pointToLineDistance(userPoint, tempLine, { units: 'kilometers' });
                if (lineDist < multiLineMinDist) multiLineMinDist = lineDist;
              }
            }
            dist = multiLineMinDist;
          }

          if (dist < searchRadius && dist < minDistance) {
            minDistance = dist;
            closestSpot = feature;
          }
        } catch (e) {
          console.warn(`Skipping a malformed feature`, e);
          continue;
        }
      }

      if (closestSpot && closestSpot.properties?.p_pladstype) {
        onComplete({ status: 'allowed', data: closestSpot.properties });
      } else {
        onComplete({ status: 'disallowed' });
      }
    } finally {
      setIsLoading(false);
    }
  });

  return { isLoading, lookup };
}