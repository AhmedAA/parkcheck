import { saveGeoJSON, GeoJSONFeatureCollection } from './storage';

const PARKING_DATA_URL = 'https://wfs-kbhkort.kk.dk/k101/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=k101:p_pladser&outputFormat=json&SRSNAME=EPSG:4326';
const SYNC_TIMESTAMP_KEY = 'parkingDataSyncTimestamp';
const SYNC_INTERVAL = 1000 * 60 * 60 * 24; // 24 hours in milliseconds

function optimizeGeoJSON(rawData: any): GeoJSONFeatureCollection {
  const optimizedFeatures = rawData.features.map((feature: any) => {
    return {
      type: "Feature",
      geometry: feature.geometry,
      properties: {
        vejnavn: feature.properties.vejnavn,
        p_pladstype: feature.properties.vejstatus,
        p_antal: feature.properties.antal_pladser,
        betalingszone: feature.properties.p_ordning,
      },
    };
  });

  return {
    type: "FeatureCollection",
    features: optimizedFeatures,
  };
}

/**
 * Fetches new data if the stored data is older than the sync interval.
 * @returns A promise that resolves to true if a sync was performed, false otherwise.
 */
export async function syncDataIfNeeded(): Promise<boolean> {
  const lastSyncTimestamp = localStorage.getItem(SYNC_TIMESTAMP_KEY);
  const now = Date.now();

  if (lastSyncTimestamp && (now - parseInt(lastSyncTimestamp, 10)) < SYNC_INTERVAL) {
    console.log("Parking data is up to date. No sync needed.");
    return false;
  }

  console.log("Syncing new parking data...");
  try {
    const response = await fetch(PARKING_DATA_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }
    const rawData = await response.json();
    
    // Optimize and save the data
    const optimizedData = optimizeGeoJSON(rawData);
    await saveGeoJSON(optimizedData);

    // Update the timestamp
    localStorage.setItem(SYNC_TIMESTAMP_KEY, now.toString());
    console.log("Sync complete.");
    return true;
  } catch (error) {
    console.error("Failed to sync parking data:", error);
    // Don't update timestamp on failure, so we can retry later
    return false;
  }
}