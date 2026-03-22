import type { Metadata } from 'next';
import { Space_Mono, DM_Sans } from 'next/font/google';
import '../styles/globals.css';

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-display',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Global GDP Explorer',
  description:
    'An interactive 3D globe dashboard for exploring country-level GDP data from the World Bank and IMF.',
  keywords: ['GDP', 'global economy', 'data visualization', '3D globe', 'finance', 'economics'],
  openGraph: {
    title: 'Global GDP Explorer',
    description: 'Interactive 3D globe for exploring world GDP data.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spaceMono.variable} ${dmSans.variable}`}>
      <body style={{ background: 'var(--bg)', fontFamily: 'var(--font-body)' }}>
        {children}
      </body>
    </html>
  );
}
