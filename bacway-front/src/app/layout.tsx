import type { Metadata, Viewport } from "next";

import "./globals.css";

import Footer from "@/components/layout/Footer";
import NavbarPublic from "@/components/layout/NavbarPublic";
import TranslationProvider from '@/i18n/TranslationProvider';
import { cookies } from 'next/headers';

import AgentWidget from "@/components/AgentWidget";

import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "Bacway - Your BAC Exam Resource Hub",
  description:
    "Your ultimate resource hub for BAC exam preparation. Discover curated study materials, expert tips, and a supportive community to help you succeed.",
  icons: {
    icon: '/bacwayBadge.svg',
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Tells iOS Safari 16.4+ to resize the layout (not just overlay) when
  // the keyboard appears. This is what makes 100dvh actually shrink.
  interactiveWidget: "resizes-content",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const cookieVal = cookieStore.get('bacway_locale');
  const initialLocale = (cookieVal?.value as 'en' | 'ar') ?? undefined;

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Kufi+Arabic:wght@100;200;300;400;500;600;700;800;900&family=Outfit:wght@100;200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>
        <TranslationProvider initialLocale={initialLocale}>
          <NavbarPublic />
          {children}
          <Footer />
        </TranslationProvider>
        <AgentWidget />
        <Analytics />
      </body>
    </html>
  );
}