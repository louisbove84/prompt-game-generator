import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'GameForge Hub - Create Your Games',
  description: 'AI-powered game generator that creates custom games from your imagination. Build unique gaming experiences!',
}

export default function FrameLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}