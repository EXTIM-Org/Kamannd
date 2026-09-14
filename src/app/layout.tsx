import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'دیرک - جستجوی هوشمند کالا',
  description: 'موتور جستجوی هوشمند کالا و مقایسه قیمت با طراحی مدرن',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
