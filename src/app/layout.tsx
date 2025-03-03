import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const interSans = Inter({
  variable: '--font-inter-sans',
  subsets: ['latin']
});

export const metadata: Metadata = {
  title: 'Apogee RSS Feeds',
  description: 'RSS feeds from Apogee Spaceflight'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${interSans.variable} antialiased`}>{children}</body>
    </html>
  );
}
