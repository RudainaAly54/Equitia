import { motion } from 'motion/react';
import { Brain, Zap, Eye, Lock, Shuffle, Trophy, Search, Filter } from 'lucide-react';

const games = [
  {
    id: 'arithmetic-entry',
    title: 'Arithmetic Game',
    description: "Because numbers won't add themselves… unfortunately for you.",
    icon: Zap,
    color: 'from-pink-500 to-rose-500'
  },
  {
    id: 'pattern-entry',
    title: 'The Pattern Whisperer',
    description: 'Some patterns whisper… most just laugh at you.',
    icon: Eye,
    color: 'from-cyan-500 to-blue-500'
  },
  {
    id: 'brain-entry',
    title: 'Brain Meltdown',
    description: "Chaos loves company. Rules? Just a suggestion.",
    icon: Brain,
    color: 'from-orange-500 to-red-500'
  },
  {
    id: 'trust-entry',
    title: 'Trust Issue',
    description: "Lies are everywhere. Can you tell the difference? Spoiler: probably not.",
    icon: Lock,
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'symbol-entry',
    title: 'Symbol Swap',
    description: 'Drag, drop, pray. Math might happen.',
    icon: Shuffle,
    color: 'from-purple-500 to-violet-500'
  },
  {
    id: 'detective-entry',
    title: 'Number Detective',
    description: 'Numbers lie. Patterns cheat. Can you catch them?',
    icon: Search,
    color: 'from-red-500 to-blue-600'
  },
  {
    id: 'onerule-entry',
    title: 'One Rule Too Many',
    description: 'Three rules, one useless. Can you figure out which without losing your mind?',
    icon: Filter,
    color: 'from-indigo-500 to-purple-600'
  }
];


export function Home({ onSelectGame }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="text-6xl md:text-8xl text-white mb-4">
          Equitia
        </h1>
        <p className="text-xl md:text-2xl text-purple-200">
          Where Math Meets Your Crushing Self-Doubt
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full mb-8">
        {games.map((game, index) => (
          <motion.button
            key={game.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{ 
              scale: 1.05, 
              y: -5,
              transition: { duration: 0.3, ease: "easeOut" }
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelectGame(game.id)}
            className="relative overflow-hidden rounded-2xl p-6 bg-white/10 backdrop-blur-md border border-white/20 hover:border-white/40 transition-all duration-300 group"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${game.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />
            <div className="relative z-10">
              <game.icon className="w-12 h-12 text-white mb-4 mx-auto" />
              <h3 className="text-xl text-white mb-2">{game.title}</h3>
              <p className="text-sm text-purple-200">{game.description}</p>
            </div>
          </motion.button>
        ))}
      </div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.6 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onSelectGame('leaderboard')}
        className="flex items-center gap-2 px-6 py-3 bg-yellow-500 text-black rounded-full hover:bg-yellow-400 transition-colors"
      >
        <Trophy className="w-5 h-5" />
        View Leaderboard
      </motion.button>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.8 }}
        className="text-purple-300 text-sm mt-8 text-center max-w-md"
      >
        Pro tip: If you're not having fun, you're probably learning something
      </motion.p>
    </div>
  );
}