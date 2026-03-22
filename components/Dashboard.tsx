'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GDPResponse, Country } from '@/lib/types';
import { formatGDP } from '@/lib/utils';
import GDPChart from './GDPChart';
import LoadingSpinner from './LoadingSpinner';

interface DashboardProps {
  selectedCountry: Country | null;
  onClose: () => void;
}

interface MetricCardProps {
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
  negative?: boolean;
}

const MetricCard = React.memo(function MetricCard({
  label,
  value,
  sub,
  accent,
  negative,
}: MetricCardProps) {
  return (
    <div
      className="rounded-xl p-3 flex flex-col gap-1"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      <p className="text-[10px] font-mono tracking-widest uppercase text-[var(--text-muted)]">
        {label}
      </p>
      <p
        className={`text-lg font-light leading-tight ${
          accent
            ? 'text-[var(--accent)]'
            : negative
            ? 'text-red-400'
            : 'text-[var(--text-primary)]'
        }`}
      >
        {value}
      </p>
      {sub && <p className="text-[10px] text-[var(--text-muted)]">{sub}</p>}
    </div>
  );
});

const Dashboard = React.memo(function Dashboard({
  selectedCountry,
  onClose,
}: DashboardProps) {
  const [data, setData] = useState<GDPResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGDP = useCallback(async (code: string) => {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const res = await fetch(`/api/gdp/${code}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json: GDPResponse = await res.json();
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load GDP data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      fetchGDP(selectedCountry.code);
    }
  }, [selectedCountry, fetchGDP]);

  const latestGDP = data?.gdp?.[data.gdp.length - 1]?.value ?? 0;
  const isGrowthPositive = (data?.growth ?? 0) >= 0;

  return (
    <AnimatePresence>
      {selectedCountry && (
        <motion.div
          key={selectedCountry.code}
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed right-0 top-0 h-full z-20 flex items-start justify-end"
          style={{ pointerEvents: 'none' }}
        >
          <div
            className="relative h-full overflow-y-auto"
            style={{
              width: 'min(420px, 90vw)',
              background: 'rgba(2, 6, 14, 0.85)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              borderLeft: '1px solid rgba(255,255,255,0.08)',
              pointerEvents: 'auto',
            }}
          >
            {/* Header strip */}
            <div
              className="sticky top-0 z-10 px-6 pt-6 pb-4"
              style={{
                background: 'rgba(2,6,14,0.9)',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-mono tracking-[0.3em] text-[var(--text-muted)] mb-1 uppercase">
                    GDP Dashboard
                  </p>
                  <h2 className="text-3xl font-light tracking-widest uppercase text-white leading-tight">
                    {selectedCountry.name}
                  </h2>
                  <span
                    className="inline-block mt-2 px-2 py-0.5 text-[10px] font-mono rounded"
                    style={{
                      background: 'rgba(0,255,204,0.12)',
                      border: '1px solid rgba(0,255,204,0.25)',
                      color: 'var(--accent)',
                      letterSpacing: '0.15em',
                    }}
                  >
                    {selectedCountry.code}
                  </span>
                </div>
                <button
                  onClick={onClose}
                  aria-label="Close dashboard"
                  className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-[var(--text-muted)] hover:text-white transition-colors"
                  style={{ background: 'rgba(255,255,255,0.06)' }}
                >
                  ×
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="px-6 pb-8 pt-4">
              {loading && <LoadingSpinner />}

              {error && (
                <div className="mt-4 rounded-xl p-4 text-center"
                  style={{ background: 'rgba(255,107,53,0.08)', border: '1px solid rgba(255,107,53,0.2)' }}
                >
                  <p className="text-[var(--accent-warm)] text-sm mb-3">{error}</p>
                  <button
                    onClick={() => selectedCountry && fetchGDP(selectedCountry.code)}
                    className="text-xs font-mono px-3 py-1.5 rounded-lg transition-colors"
                    style={{
                      background: 'rgba(255,107,53,0.15)',
                      border: '1px solid rgba(255,107,53,0.3)',
                      color: 'var(--accent-warm)',
                    }}
                  >
                    RETRY
                  </button>
                </div>
              )}

              {!loading && !error && data && (
                <>
                  {/* Nominal GDP hero */}
                  <div
                    className="rounded-2xl p-5 mb-4 mt-2"
                    style={{
                      background: 'linear-gradient(135deg, rgba(0,255,204,0.07) 0%, rgba(0,100,255,0.04) 100%)',
                      border: '1px solid rgba(0,255,204,0.15)',
                    }}
                  >
                    <p className="text-[10px] font-mono tracking-widest uppercase text-[var(--text-muted)] mb-1">
                      Nominal GDP ({data.data_year})
                    </p>
                    <p className="text-4xl font-light text-[var(--accent)]">
                      {formatGDP(latestGDP)}
                    </p>
                    <p className="text-xs text-[var(--text-muted)] mt-1">
                      {data.currency} · {data.data_year}
                    </p>
                  </div>

                  {/* Metric grid */}
                  <div className="grid grid-cols-2 gap-3 mb-2">
                    <MetricCard
                      label="GDP Growth"
                      value={`${data.growth > 0 ? '+' : ''}${data.growth.toFixed(1)}%`}
                      accent={isGrowthPositive}
                      negative={!isGrowthPositive}
                    />
                    <MetricCard
                      label="GDP per Capita"
                      value={`$${data.per_capita.toLocaleString()}`}
                    />
                    <MetricCard
                      label="Inflation Rate"
                      value={`${data.inflation.toFixed(1)}%`}
                      negative={data.inflation > 5}
                    />
                    <MetricCard
                      label="Unemployment"
                      value={`${data.unemployment.toFixed(1)}%`}
                      negative={data.unemployment > 10}
                    />
                  </div>

                  {/* Divider */}
                  <div
                    className="my-5 h-px"
                    style={{ background: 'rgba(255,255,255,0.06)' }}
                  />

                  {/* GDP Chart */}
                  <GDPChart data={data.gdp} />

                  {/* Footer note */}
                  <p className="text-[9px] font-mono text-[var(--text-muted)] mt-4 tracking-wider">
                    DATA SOURCE: WORLD BANK / IMF · {data.data_year}
                  </p>
                </>
              )}

              {/* Skeleton loading overlay */}
              {loading && (
                <div className="space-y-3 mt-4">
                  {[180, 80, 80, 200].map((h, i) => (
                    <div
                      key={i}
                      className="animate-pulse rounded-xl"
                      style={{
                        height: `${h}px`,
                        background: 'rgba(255,255,255,0.06)',
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

export default Dashboard;
