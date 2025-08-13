# Space Engineer Farcaster Frame

This project includes a Farcaster Frame that showcases a Space Engineer portfolio with an interactive Space Invaders game.

## Frame Features

- **Interactive Space Invaders Game**: Play the classic game directly in the frame
- **Portfolio Integration**: Link back to the main portfolio website
- **Dynamic Frame Image**: Custom SVG image with Space Engineer branding
- **Responsive Design**: Works on both desktop and mobile

## Frame URLs

- **Frame Page**: `http://localhost:3000/frame`
- **Frame Image API**: `http://localhost:3000/api/frame-image`
- **Frame API**: `http://localhost:3000/api/frame`

## Frame Metadata

The frame includes the following metadata:

```html
<meta name="fc:frame" content='{"version":"vNext","image":"http://localhost:3000/api/frame-image","buttons":[{"label":"Play Space Invaders","action":"post"},{"label":"Visit Portfolio","action":"link","target":"http://localhost:3000"}],"postUrl":"http://localhost:3000/api/frame"}' />
<meta name="fc:frame:image" content="http://localhost:3000/api/frame-image" />
<meta name="fc:frame:button:1" content="Play Space Invaders" />
<meta name="fc:frame:button:2" content="Visit Portfolio" />
<meta name="fc:frame:post_url" content="http://localhost:3000/api/frame" />
```

## Frame Buttons

1. **Play Space Invaders**: Opens the interactive game page
2. **Visit Portfolio**: Links to the main portfolio website

## Game Controls

- **Arrow Keys**: Move left/right
- **Spacebar**: Shoot
- **Restart Button**: Reset the game

## Deployment

To deploy this frame for production:

1. Set the `NEXT_PUBLIC_URL` environment variable to your production domain
2. Deploy to your hosting platform (Vercel, Netlify, etc.)
3. Update the frame metadata with your production URLs

## Frame Testing

You can test the frame using:
- Farcaster's frame validator
- Local development server at `http://localhost:3000/frame`
- Frame debugging tools

## Customization

To customize the frame:

1. **Frame Image**: Modify `/src/app/api/frame-image/route.ts`
2. **Frame Logic**: Update `/src/app/api/frame/route.ts`
3. **Game**: Edit `/src/app/frame/page.tsx`
4. **Metadata**: Adjust `/src/app/frame/layout.tsx`

## Technologies Used

- Next.js 15
- React 19
- TypeScript
- Canvas API for game rendering
- Farcaster Frame specification
- Tailwind CSS for styling