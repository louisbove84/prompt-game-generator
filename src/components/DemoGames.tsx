'use client';

interface DemoGamesProps {
  onPlayGame: (gameType: 'runner' | 'spaceinvaders') => void;
}

export function DemoGames({ onPlayGame }: DemoGamesProps) {
  const demoGames = [
    {
      id: 'runner' as const,
      title: 'This Is Fine Runner',
      description: 'Dodge obstacles in this classic endless runner game',
      image: 'https://www.beuxbunk.com/images/gameForge.jpg',
      difficulty: 'Easy'
    },
    {
      id: 'spaceinvaders' as const,
      title: 'Space Invaders',
      description: 'Defend Earth from alien invaders in this retro shooter',
      image: 'https://www.beuxbunk.com/images/gameForgeLoading.jpg',
      difficulty: 'Medium'
    }
  ];

  return (
    <div className="bg-gray-800 rounded-lg p-6 mb-6">
      <div className="flex items-center mb-4">
        <div className="text-2xl mr-3">🎮</div>
        <div>
          <h3 className="text-xl font-bold text-white">Free Demo Games</h3>
          <p className="text-gray-400 text-sm">Try these games without payment</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {demoGames.map((game) => (
          <div
            key={game.id}
            className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors cursor-pointer"
            onClick={() => onPlayGame(game.id)}
          >
            <div className="flex items-center mb-3">
              <img
                src={game.image}
                alt={game.title}
                className="w-12 h-12 rounded-lg object-cover mr-3"
              />
              <div>
                <h4 className="text-white font-semibold">{game.title}</h4>
                <span className={`text-xs px-2 py-1 rounded ${
                  game.difficulty === 'Easy' ? 'bg-green-600 text-green-100' : 'bg-yellow-600 text-yellow-100'
                }`}>
                  {game.difficulty}
                </span>
              </div>
            </div>
            <p className="text-gray-300 text-sm mb-3">{game.description}</p>
            <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              Play Free Demo
            </button>
          </div>
        ))}
      </div>
      
      <div className="mt-4 p-3 bg-blue-900 bg-opacity-30 rounded-lg">
        <p className="text-blue-300 text-sm text-center">
          💡 Want a custom game? Create your own with AI for just $0.20 USDC!
        </p>
      </div>
    </div>
  );
}
