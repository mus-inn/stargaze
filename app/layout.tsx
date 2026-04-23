import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'stargate Memory',
  description: 'A tiny space-themed memory match game. Flip pairs, match all eight constellations, beat your best time.',
  openGraph: {
    title: 'stargate Memory',
    description: 'A tiny space-themed memory match game.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans text-white antialiased">{children}</body>
    </html>
  );
}
