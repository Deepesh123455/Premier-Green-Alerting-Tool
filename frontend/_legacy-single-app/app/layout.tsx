import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import { Navbar } from '../components/ui/Navbar';

export const metadata: Metadata = {
  title: 'Premier Green Innovations — Operations Alerting',
  description: 'Real-time alerting and operations dashboard for Entry/Exit, Truck Logs, and Incoming Reports.',
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
      <body className="min-h-screen bg-[#f8faf9] text-[#1a2522] flex flex-col antialiased selection:bg-[#234D42]/20 selection:text-[#1a2522]">
        <Providers>
          <Navbar />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
