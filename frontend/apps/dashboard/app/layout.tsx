import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@shared/providers';

export const metadata: Metadata = {
  title: 'Premier Green Innovations — Live Operations Dashboard',
  description: 'Real-time operations executive dashboard for Entry/Exit, Truck Logs, and Incoming Reports.',
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <head>
        <link rel="icon" href="/logo.png" sizes="any" />
      </head>
      <body className="min-h-screen bg-[#f8faf9] text-[#1a2522] antialiased selection:bg-[#234D42]/20 selection:text-[#1a2522]">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
