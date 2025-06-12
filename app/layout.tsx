import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import AdminLayout from '@/components/layout/AdminLayout';
import Providers from '@/components/providers/Providers';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NextPhase IT Admin Portal',
  description: 'Internal administration portal for NextPhase IT',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <AdminLayout>{children}</AdminLayout>
          <Toaster position="top-right" />
        </Providers>
      </body>
    </html>
  );
}
