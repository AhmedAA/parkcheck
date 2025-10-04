"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './UnifiedHeader.module.css';
import ParkcheckLogo from '../../../public/icons/Parkcheck_Logo.svg';

interface SearchResult { x: number; y: number; label: string; }
interface GeosearchProvider {
  search(options: { query: string }): Promise<SearchResult[]>;
}

interface HeaderProps {
  isLoading: boolean;
  onLookupClick: () => void;
  onSearchResult: (result: SearchResult) => void;
}

const UnifiedHeader: React.FC<HeaderProps> = ({ isLoading, onLookupClick, onSearchResult }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [provider, setProvider] = useState<GeosearchProvider | null>(null);

  useEffect(() => {
    const initializeProvider = async () => {
      const { OpenStreetMapProvider } = await import('leaflet-geosearch');
      setProvider(new OpenStreetMapProvider());
    };

    initializeProvider();
  }, []); // Empty array ensures this runs only once on mount

  useEffect(() => {
    // Add a guard to ensure the provider is loaded before searching
    if (!searchTerm || !provider) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      const searchResults = await provider.search({ query: searchTerm });
      setResults(searchResults as SearchResult[]);
    }, 500);

    // Add provider to the dependency array
    return () => clearTimeout(timer);
  }, [searchTerm, provider]);

  const handleSelectResult = (result: SearchResult) => {
    onSearchResult(result);
    setSearchTerm('');
    setResults([]);
  };

  return (
    <header className={styles.header}>
      <div className={styles.logoArea}>
        <Image src={ParkcheckLogo} alt="Parkcheck Logo" width={28} height={28} />
        <span>Parkcheck</span>
      </div>

      <div className={styles.controlsArea}>
        <input
          type="text"
          placeholder="Søg på en vej..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
        <button
          onClick={onLookupClick}
          disabled={isLoading}
          className={styles.checkButton}
        >
          {isLoading ? "Søger..." : "Tjek"}
        </button>
        {results.length > 0 && (
          <ul className={styles.searchResults}>
            {results.map((result, index) => (
              <li
                key={index}
                onClick={() => handleSelectResult(result)}
                className={styles.searchItem}
              >
                {result.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    </header>
  );
};

export default UnifiedHeader;