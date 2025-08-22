import { openDB, DBSchema } from 'idb';

// --- TypeScript Interfaces ---
interface GeoJSONPoint {
  type: "Point";
  coordinates: [number, number]; // [longitude, latitude]
}

interface GeoJSONFeature {
  type: "Feature";
  properties: object;
  geometry: GeoJSONPoint;
}

export interface GeoJSONFeatureCollection {
  type: "FeatureCollection";
  features: GeoJSONFeature[];
}

interface MyPwaDB extends DBSchema {
  'geojson-store': {
    key: string;
    value: GeoJSONFeatureCollection;
  };
}

// --- Database Logic ---
const DB_NAME = 'MyPWA-DB';
const STORE_NAME = 'geojson-store';
const GEOJSON_KEY = 'main-geojson';

const defaultGeoJSON: GeoJSONFeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {},
      geometry: {
        type: "Point",
        coordinates: [12.3546, 55.6722] // Defaults to Albertslund, Denmark
      }
    }
  ]
};

async function initDB() {
  const db = await openDB<MyPwaDB>(DB_NAME, 1, {
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
  return storedData || defaultGeoJSON;
};

export const saveGeoJSON = async (geoJsonData: GeoJSONFeatureCollection): Promise<void> => {
  const db = await initDB();
  await db.put(STORE_NAME, geoJsonData, GEOJSON_KEY);
};