import type { Metadata } from 'next';
import { DM_Sans, Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { Toaster } from 'sonner';

const dmSans = DM_Sans({ 
  subsets: ['latin'], 
  variable: '--font-dm-sans',
  weight: ['400', '500', '700'],
  display: 'swap',
});

const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-inter',
  weight: ['400', '500', '600'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  weight: ['400', '500'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Nexum — Redemption City Safety Platform',
  description: 'Real-time emergency dispatch and coordination for Redemption City',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${dmSans.variable} ${inter.variable} ${jetbrainsMono.variable} font-body antialiased`}>
        <Providers>
          {children}
          <Toaster richColors position="top-right" />
        </Providers>
      </body>
    </html>
  );
}
