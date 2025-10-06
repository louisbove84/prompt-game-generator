import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { CONTACT_INFO, FARCSTER_CONFIG } from '../constants/site'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: `${CONTACT_INFO.name} - ${CONTACT_INFO.title}`,
  description: `${CONTACT_INFO.bio.short} ${CONTACT_INFO.bio.skills}`,
  keywords: `${CONTACT_INFO.name}, AI Game Generator, Interactive Games, Next.js, React, TypeScript, Farcaster`,
  authors: [{ name: CONTACT_INFO.name }],
  manifest: '/manifest.json',
  openGraph: {
    title: `${CONTACT_INFO.name} - ${CONTACT_INFO.title}`,
    description: `${CONTACT_INFO.bio.short} ${CONTACT_INFO.bio.skills}`,
    url: CONTACT_INFO.website,
    siteName: `${CONTACT_INFO.name} Portfolio`,
    images: [
      {
        url: CONTACT_INFO.images.hero,
        width: 1200,
        height: 630,
        alt: `${CONTACT_INFO.name} - ${CONTACT_INFO.title}`,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${CONTACT_INFO.name} - ${CONTACT_INFO.title}`,
    description: `${CONTACT_INFO.bio.short} ${CONTACT_INFO.bio.skills}`,
    images: [CONTACT_INFO.images.hero],
  },
  other: {
    'fc:miniapp': JSON.stringify(FARCSTER_CONFIG.embed),
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}