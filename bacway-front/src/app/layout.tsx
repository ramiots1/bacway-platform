import type { Metadata } from "next";
import "./globals.css";
import Footer from "@/components/layout/Footer";
import NavbarPublic from "@/components/layout/NavbarPublic";
import TranslationProvider from '@/i18n/TranslationProvider';
import { cookies } from 'next/headers';

export const metadata: Metadata = {
  title: "Bacway - Your BAC Exam Resource Hub",
  description: "Your ultimate resource hub for BAC exam preparation. Discover curated study materials, expert tips, and a supportive community to help you succeed.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // read locale cookie server-side so SSR can render in the chosen language
  const cookieStore = await cookies();
  const cookieVal = cookieStore.get('bacway_locale');
  const initialLocale = (cookieVal?.value as 'en' | 'ar') ?? undefined;
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Kufi+Arabic:wght@100;200;300;400;500;600;700;800;900&family=Outfit:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
  <body>
  <TranslationProvider initialLocale={initialLocale}>
        <NavbarPublic />
        {children} 
        <Footer />
  </TranslationProvider>
      </body>
    </html>
  );
}
