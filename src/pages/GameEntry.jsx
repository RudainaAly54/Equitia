import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Play, BookOpen, X } from 'lucide-react';

export function GameEntry({ 
  title, 
  description, 
  icon: Icon, 
  color, 
  howToPlay,
  onBack, 
  onStart 
}) {
  const [showDifficulty, setShowDifficulty] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  const difficulties = [
    { 
      level: 'easy', 
      label: 'Easy', 
      description: 'For people who need training wheels' 
    },
    { 
      level: 'medium', 
      label: 'Medium', 
      description: 'Average intelligence required' 
    },
    { 
      level: 'hard', 
      label: 'Hard', 
      description: 'Try not to cry' 
    }
  ];

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white hover:text-purple-300 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full bg-white/10 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-white/20"
        >
          <div className={`w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br ${color} flex items-center justify-center`}>
            <Icon className="w-12 h-12 text-white" />
          </div>

          <h1 className="text-4xl md:text-5xl text-white text-center mb-4">
            {title}
          </h1>
          
          <p className="text-xl text-purple-200 text-center mb-12">
            {description}
          </p>

          <div className="space-y-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowDifficulty(true)}
              className={`w-full flex items-center justify-center gap-3 py-5 px-6 bg-gradient-to-r ${color} text-white rounded-2xl text-xl transition-all shadow-lg hover:shadow-xl`}
            >
              <Play className="w-6 h-6" />
              Play Game
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowHowToPlay(true)}
              className="w-full flex items-center justify-center gap-3 py-5 px-6 bg-white/20 text-white rounded-2xl text-xl hover:bg-white/30 transition-all border border-white/30"
            >
              <BookOpen className="w-6 h-6" />
              How to Play
            </motion.button>
          </div>

          <p className="text-purple-300 text-center mt-8 text-sm">
            Choose wisely. Or don't. It probably won't matter.
          </p>
        </motion.div>
      </div>

      {/* Difficulty Selection Modal */}
      <AnimatePresence>
        {showDifficulty && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowDifficulty(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-lg w-full bg-gradient-to-br from-purple-900/95 to-blue-900/95 backdrop-blur-md rounded-3xl p-8 border border-white/20"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl text-white">Select Difficulty</h2>
                <button
                  onClick={() => setShowDifficulty(false)}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <p className="text-purple-200 mb-6">
                How much do you want to embarrass yourself today?
              </p>

              <div className="space-y-3">
                {difficulties.map(({ level, label, description }) => (
                  <motion.button
                    key={level}
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onStart(level)}
                    className="w-full p-5 bg-white/10 hover:bg-white/20 rounded-xl text-left transition-all border border-white/20 hover:border-white/40 group"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-2xl text-white mb-1">{label}</h3>
                        <p className="text-purple-300 text-sm">{description}</p>
                      </div>
                      <Play className="w-6 h-6 text-white/60 group-hover:text-white transition-colors" />
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* How to Play Modal */}
      <AnimatePresence>
        {showHowToPlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowHowToPlay(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-2xl w-full bg-gradient-to-br from-purple-900/95 to-blue-900/95 backdrop-blur-md rounded-3xl p-8 border border-white/20 max-h-[80vh] overflow-y-auto scrollbar-hide"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl text-white">How to Play</h2>
                <button
                  onClick={() => setShowHowToPlay(false)}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                {howToPlay.map((instruction, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-4"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white">
                      {index + 1}
                    </div>
                    <p className="text-purple-100 text-lg flex-1 pt-1">
                      {instruction}
                    </p>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 p-4 bg-yellow-500/20 rounded-xl border border-yellow-500/30">
                <p className="text-yellow-200 text-center">
                  Pro tip: Actually reading these instructions might help. Just saying.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}