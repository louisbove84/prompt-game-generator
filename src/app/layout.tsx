import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { CONTACT_INFO } from '../constants/site'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: `${CONTACT_INFO.name} - ${CONTACT_INFO.title}`,
  description: `${CONTACT_INFO.bio.short} ${CONTACT_INFO.bio.skills} Explore my portfolio of ML models and applications.`,
  keywords: `${CONTACT_INFO.name}, Data Scientist, Machine Learning, Python, TensorFlow, Full-Stack Developer, React, Next.js, ${CONTACT_INFO.location}, Portfolio`,
  authors: [{ name: CONTACT_INFO.name }],
  openGraph: {
    title: `${CONTACT_INFO.name} - ${CONTACT_INFO.title}`,
    description: `${CONTACT_INFO.bio.short} ${CONTACT_INFO.bio.skills}`,
    url: CONTACT_INFO.website,
    siteName: `${CONTACT_INFO.name} Portfolio`,
    images: [
      {
        url: '/headShot.jpeg',
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
    images: ['/headShot.jpeg'],
  },
  other: {
    'fc:miniapp': JSON.stringify({
      version: '1',
      imageUrl: 'https://www.beuxbunk.com/itsFine-3x2.jpg',
      button: {
        title: '🎮 Play Meme Games',
        action: {
          type: 'launch_miniapp',
          url: 'https://www.beuxbunk.com/frame',
          name: 'Meme Games Hub',
          splashImageUrl: 'https://www.beuxbunk.com/itsFine-200x200.jpg',
          splashBackgroundColor: '#FF6B6B',
        },
      },
    }),
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