"use client";

import React, { useState, useEffect } from 'react';
import NextImage from 'next/image'; 
import MapLoader from './components/MapLoader';
import ResultModal from './components/ResultModal';
import { syncDataIfNeeded } from '../lib/dataSync';
import UnifiedHeader from './components/UnifiedHeader';
import { useParkingLookup } from '../hooks/useParkingLookup';
import styles from './Page.module.css';
import ParkcheckLogo from '../../public/icons/Parkcheck_Logo.svg';

interface Position { lat: number; lng: number; }
interface SearchResult { x: number; y: number; label: string; }

const COPENHAGEN_CENTER: Position = { lat: 55.6761, lng: 12.5683 };

export default function Home() {
  const [isSyncing, setIsSyncing] = useState(true);
  const [result, setResult] = useState<any | null>(null);
  const [position, setPosition] = useState<Position>(COPENHAGEN_CENTER);
  const { isLoading, lookup } = useParkingLookup();

  useEffect(() => {
    const runSync = async () => {
      const minimumDisplayTime = new Promise(resolve => setTimeout(resolve, 2000));
      await Promise.all([syncDataIfNeeded(), minimumDisplayTime]);
      setIsSyncing(false);
    };
    runSync();

    navigator.geolocation.getCurrentPosition(
      (location) => {
        setPosition({ 
          lat: location.coords.latitude, 
          lng: location.coords.longitude 
        });
      },

      (error) => {
        console.warn(`Geolocation error: ${error.message}`);
      }
    );

  }, []);

  const handleSearchResult = (searchResult: SearchResult) => {
    setPosition({ lat: searchResult.y, lng: searchResult.x });
  };
  
  const handleCloseModal = () => {
    setResult(null);
  };

  if (isSyncing) {
    return (
      <div className={styles.splashScreen}>
        <div className={styles.splashContent}>
          <div className={styles.pulseCircle}></div>
          <div className={styles.splashForeground}>
            <NextImage src={ParkcheckLogo} alt="Parkcheck Logo" width={128} height={128} />
            <p className={styles.splashText}>Parkcheck</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.appContainer}>
      <UnifiedHeader 
        isLoading={isLoading}
        onLookupClick={() => lookup(position, setResult)}
        onSearchResult={handleSearchResult}
      />
      
      <main className={styles.mainContent}>
        <MapLoader 
          position={position}
          setPosition={setPosition}
          isInteractive={!result}
        />
      </main>

      {result && (
        <ResultModal 
          status={result.status}
          data={result.data}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}