'use client';

import { useState, useCallback } from 'react';
import GlobeScene from '@/components/GlobeScene';
import Dashboard from '@/components/Dashboard';
import { Country } from '@/lib/types';

export default function GlobeExplorer() {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

  const handleCountrySelect = useCallback((country: Country) => {
    setSelectedCountry(country);
  }, []);

  const handleClose = useCallback(() => {
    setSelectedCountry(null);
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* Globe fills entire screen */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <GlobeScene
          selectedCountry={selectedCountry}
          onCountrySelect={handleCountrySelect}
        />
      </div>

      {/* HUD: top-left branding */}
      <div
        className="absolute top-0 left-0 p-6 z-10"
        style={{ pointerEvents: 'none' }}
      >
        <div className="flex flex-col gap-1">
          <h1
            className="text-xl tracking-[0.25em] uppercase font-light"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--accent)' }}
          >
            GDP Explorer
          </h1>
          <p className="text-[10px] tracking-[0.2em] uppercase" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-display)' }}>
            Global · Real-time · Interactive
          </p>
        </div>
      </div>

      {/* HUD: bottom-left hint */}
      <div
        className="absolute bottom-0 left-0 p-6 z-10"
        style={{ pointerEvents: 'none' }}
      >
        <p
          className="text-[10px] tracking-[0.2em] uppercase"
          style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-display)' }}
        >
          {selectedCountry
            ? `↗ Viewing ${selectedCountry.name}`
            : '● Click a marker to explore GDP data'}
        </p>
      </div>

      {/* Dashboard panel */}
      <Dashboard selectedCountry={selectedCountry} onClose={handleClose} />
    </div>
  );
}
