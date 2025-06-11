import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import AdminLayout from '@/components/layout/AdminLayout';
import { ThemeProvider } from '@/components/theme/ThemeProvider';

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
        <ThemeProvider>
          <AdminLayout>{children}</AdminLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
