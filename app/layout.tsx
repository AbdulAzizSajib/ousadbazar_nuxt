import { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { QueryProviders } from '@/components/QueryProviders';
import { ClientLayout } from '@/components/ClientLayout';
import './globals.css';
import ScrollToTop from '@/components/ScrollToTop';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'OusadBazar - Pharma Ecommerce',
    template: '%s',
  },
  description: 'Buy medicines online',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/ousadbazar/fav.png" />
      </head>
      <body className={`${plusJakartaSans.className} bg-[#f9fafb]`}>
        <QueryProviders>
          <ClientLayout>
            {children}
            <ScrollToTop />
          </ClientLayout>
        </QueryProviders>
      </body>
    </html>
  );
}
