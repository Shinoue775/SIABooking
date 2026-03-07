import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CHTM-RRS Backend API',
  description: 'Backend API for the CHTM Room Reservation System',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}