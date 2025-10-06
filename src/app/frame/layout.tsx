import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Meme Games Hub - Choose Your Chaos',
  description: 'Two iconic meme games: Space Invaders and This Is Fine Runner. Choose your chaos!',
}

export default function FrameLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}