import type { Metadata } from 'next';
import './globals.scss';
import AppNav from '@/app/_components/appNav';

export const metadata: Metadata = {
  title: 'Batch Clip',
  description: 'Batch Clip',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body>
        <nav>
          <AppNav />
        </nav>
        {children}
      </body>
    </html>
  );
}
