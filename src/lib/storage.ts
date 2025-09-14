import { openDB, DBSchema } from 'idb';

interface GeoJSONPoint {
  type: "Point";
  coordinates: [number, number];
}

interface GeoJSONLineString {
  type: "LineString";
  coordinates: [number, number][];
}

interface GeoJSONMultiLineString {
  type: "MultiLineString";
  coordinates: [number, number][][];
}

interface ParkingProperties {
  vejnavn?: string;
  p_pladstype?: string;
  p_antal?: number;
  betalingszone?: string;
}

export interface GeoJSONFeature {
  type: "Feature";
  properties: ParkingProperties;
  geometry: GeoJSONPoint | GeoJSONLineString | GeoJSONMultiLineString | null;
}

export interface GeoJSONFeatureCollection {
  type: "FeatureCollection",
  features: GeoJSONFeature[],
}

interface ParkcheckDB extends DBSchema {
  'geojson-store': {
    key: string;
    value: GeoJSONFeatureCollection;
  };
}

const DB_NAME = 'Parkcheck-DB';
const STORE_NAME = 'geojson-store';
const GEOJSON_KEY = 'main-geojson';

async function initDB() {
  const db = await openDB<ParkcheckDB>(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    },
  });
  return db;
}

export const loadGeoJSON = async (): Promise<GeoJSONFeatureCollection> => {
  const db = await initDB();
  const storedData = await db.get(STORE_NAME, GEOJSON_KEY);

  if (storedData) {
    return storedData;
  }
  
  return {
    type: "FeatureCollection",
    features: [],
  };
};

export const saveGeoJSON = async (geoJsonData: GeoJSONFeatureCollection): Promise<void> => {
  const db = await initDB();
  await db.put(STORE_NAME, geoJsonData, GEOJSON_KEY);
};