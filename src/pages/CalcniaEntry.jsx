import { useState } from "react";
import {motion, AnimatePresence} from "motion/react";
import {ArrowLeft, Play, BookOpen, X, TrendingUp, TrendingDown} from 'lucide-react'

function CalcniaEntry({ onBack, onStart }) {
    const [showModeSelection, setShowModeSelection] = useState(false);
    const [showHowToPlay, setShowHowToPlay] = useState(false);
    const [selectedMode, setSelectedMode] = useState(null);
    const [showDifficultySelection, setShowDifficultySelection] = useState(false);

    const modes = [
        {
            type: 'derivative',
            label: 'Derivative',
            icon: TrendingDown,
            description: 'Find rates of change. The slope is real',
            color:'from-pink-500 to-rose-500'
        },
        {
            type: 'integral',
            label: 'Integral',
            icon: TrendingUp,
            description: 'Calculate areas under curves. It adds up',
            color:'from-purple-500 to-indigo-500'
        }
    ]

    const difficulties = [
        {
            level:'easy',
            label:'Easy',
            description: 'Baby steps. We believe in you.... kind of'
        },
        {
            level:'medium',
            label:'Medium',
            description: 'Standard calc class difficulty'
        },
        {
            level:'hard',
            label:'Hard',
            description: 'Hope you remember those trig integrals'
        }
    ]

    const handleModeSelect = (mode) => {
        setSelectedMode(mode);
        setShowModeSelection(false);
        setShowDifficultySelection(true);
    }

    const handleDifficultySelect = (difficulty) => {
        onStart(selectedMode, difficulty);
    } 
    
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
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center">
            <span className="text-4xl">∫</span>
          </div>

          <h1 className="text-4xl md:text-5xl text-white text-center mb-4">
            Calcnia
          </h1>
          
          <p className="text-xl text-purple-200 text-center mb-12">
            Fast-paced arcade calculus fun with Derivatives, Integrals, and witty challenges!
          </p>

          <div className="space-y-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowModeSelection(true)}
              className="w-full flex items-center justify-center gap-3 py-5 px-6 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-2xl text-xl transition-all shadow-lg hover:shadow-xl"
            >
              <Play className="w-6 h-6" />
              Start Game
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
            Warning: May cause sudden understanding of calculus. Side effects include confidence.
          </p>
        </motion.div>
      </div>

      {/* Mode Selection Modal */}
      <AnimatePresence>
        {showModeSelection && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowModeSelection(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-lg w-full bg-gradient-to-br from-purple-900/95 to-blue-900/95 backdrop-blur-md rounded-3xl p-8 border border-white/20"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl text-white">Select Mode</h2>
                <button
                  onClick={() => setShowModeSelection(false)}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <p className="text-purple-200 mb-6">
                Choose your mathematical adventure
              </p>

              <div className="space-y-4">
                {modes.map((mode) => (
                  <motion.button
                    key={mode.type}
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleModeSelect(mode.type)}
                    className="w-full p-6 bg-white/10 hover:bg-white/20 rounded-xl text-left transition-all border border-white/20 hover:border-white/40 group"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${mode.color} flex items-center justify-center`}>
                        <mode.icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl text-white mb-1">{mode.label}</h3>
                        <p className="text-purple-300 text-sm">{mode.description}</p>
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

      {/* Difficulty Selection Modal */}
      <AnimatePresence>
        {showDifficultySelection && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowDifficultySelection(false)}
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
                  onClick={() => {
                    setShowDifficultySelection(false);
                    setShowModeSelection(true);
                  }}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <p className="text-purple-200 mb-6">
                How much calculus can you handle?
              </p>

              <div className="space-y-3">
                {difficulties.map(({ level, label, description }) => (
                  <motion.button
                    key={level}
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleDifficultySelect(level)}
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
              className="max-w-2xl w-full bg-gradient-to-br from-purple-900/95 to-blue-900/95 backdrop-blur-md rounded-3xl p-8 border border-white/20 max-h-[80vh] overflow-y-auto"
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
                {[
                  'Choose between Derivatives or Integrals mode',
                  'Select your difficulty level (Easy, Medium, or Hard)',
                  'Answer 10 calculus questions as fast as you can',
                  'Each question is timed - faster answers earn more points',
                  'Choose from 4 multiple-choice options',
                  'Correct answers give you points based on speed and difficulty',
                  'Wrong answers give you sarcastic feedback (and maybe a hint)',
                  'Complete all 10 questions to see your final score and stats'
                ].map((instruction, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-4"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-white">
                      {index + 1}
                    </div>
                    <p className="text-purple-100 text-lg flex-1 pt-1">
                      {instruction}
                    </p>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 p-4 bg-pink-500/20 rounded-xl border border-pink-500/30">
                <p className="text-pink-200 text-center">
                  Pro tip: The faster you answer correctly, the higher your score. No pressure!
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    )
}

export default CalcniaEntry;