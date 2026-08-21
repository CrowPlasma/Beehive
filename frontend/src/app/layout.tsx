import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Beehive",
  description: "Tu panel centralizado",
};

import I18nProvider from '@/components/I18nProvider';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="antialiased bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <I18nProvider>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
