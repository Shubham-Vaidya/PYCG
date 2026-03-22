'use client';

import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { GDPDataPoint } from '@/lib/types';
import { formatGDP } from '@/lib/utils';

interface GDPChartProps {
  data: GDPDataPoint[];
}

const GDPChart = React.memo(function GDPChart({ data }: GDPChartProps) {
  const chartData = data.map((d) => ({
    year: d.year,
    gdp: d.value,
  }));

  return (
    <div className="mt-4">
      <p className="text-[var(--text-muted)] text-xs font-mono tracking-widest mb-3 uppercase">
        GDP Trend (1995–2023)
      </p>

      {/* SVG filter for neon glow */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
          <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
          <XAxis
            dataKey="year"
            stroke="rgba(255,255,255,0.15)"
            tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontFamily: 'monospace' }}
            tickLine={false}
            interval={4}
          />
          <YAxis
            stroke="rgba(255,255,255,0.15)"
            tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontFamily: 'monospace' }}
            tickLine={false}
            tickFormatter={(v: number) => formatGDP(v)}
            width={55}
          />
          <Tooltip
            contentStyle={{
              background: '#0a0f1a',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '8px',
              fontSize: '11px',
              fontFamily: 'monospace',
            }}
            labelStyle={{ color: 'rgba(255,255,255,0.6)' }}
            itemStyle={{ color: '#00ffcc' }}
            formatter={(value: number) => [formatGDP(value), 'GDP']}
          />
          <Line
            type="monotone"
            dataKey="gdp"
            stroke="#00ffcc"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: '#00ffcc', stroke: '#020408', strokeWidth: 2 }}
            filter="url(#glow)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
});

export default GDPChart;
