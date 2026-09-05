import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0F2042",
};

export const metadata: Metadata = {
  title: "MAIDES — Kerala Medical Tourism & International Patient Assistance Platform",
  description: "Your Health Deserves the Right Journey. Coordinated healthcare discovery, hospital matching, specialist appointments, and complete travel support in Kerala, India.",
  keywords: [
    "Medical Tourism Kerala",
    "Kerala Hospitals",
    "Ayurveda Panchakarma Kerala",
    "Aster Medcity",
    "Amrita Institute",
    "Medical Visa India",
    "Robotic Surgery India",
    "International Patient Assistance"
  ],
  authors: [{ name: "MAIDES Healthcare Platform" }],
  creator: "MAIDES",
  publisher: "MAIDES Healthcare Concierge",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://maides.kerala.gov.in",
    siteName: "MAIDES Medical Tourism",
    title: "MAIDES — Kerala Medical Tourism & International Patient Assistance Platform",
    description: "Your Health Deserves the Right Journey. Coordinated healthcare discovery, hospital matching, specialist appointments, and complete travel support in Kerala, India.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "MAIDES Kerala Medical Tourism Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MAIDES — Kerala Medical Tourism",
    description: "Quaternary healthcare, robotic surgery, and authentic Ayurveda in Kerala, India.",
    images: ["https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1200&q=80"],
  },
};

import { ThemeProvider } from '@/components/ThemeProvider';
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalOrganization",
    "name": "MAIDES Kerala Medical Tourism & Healthcare Travel Assistance",
    "url": "https://maides.kerala.gov.in",
    "logo": "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=200&q=80",
    "description": "Connecting domestic and international patients with NABH/JCI accredited hospitals, chief surgeons, and authentic Ayurveda sanatoriums across Kerala.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Kochi",
      "addressRegion": "Kerala",
      "addressCountry": "IN"
    },
    "medicalSpecialty": [
      "Cardiovascular",
      "Oncology",
      "Orthopedics",
      "Ayurveda",
      "Organ Transplant",
      "Neurosurgery"
    ]
  };

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={{...} dark:bg-slate-900 dark:text-white} className="min-h-full flex flex-col"><ThemeProvider>{children}</ThemeProvider></body>
    </html>
  );
}

