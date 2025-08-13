import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Meme Games Hub - Choose Your Chaos',
  description: 'Two iconic meme games: Space Invaders and This Is Fine Runner. Choose your chaos!',

  other: {
    // Mini App embed (new format)
    'fc:miniapp': JSON.stringify({
      version: "1",
      imageUrl: "https://www.beuxbunk.com/itsFine-3x2.jpg",
      button: {
        title: "🎮 Play Meme Games",
        action: {
          type: "launch_miniapp",
          url: "https://www.beuxbunk.com/frame",
          name: "Meme Games Hub",
          splashImageUrl: "https://www.beuxbunk.com/itsFine-200x200.jpg",
          splashBackgroundColor: "#FF6B6B"
        }
      }
    }),
  },
}

export default function FrameLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}