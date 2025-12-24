import { motion } from 'motion/react';
import { ArrowLeft, Trophy, Medal, Award } from 'lucide-react';

export function Leaderboard({ scores, onBack }) {
  const gameColors = {
    'Arithmetic Game': 'text-pink-400',
    'Pattern Whisperer': 'text-cyan-400',
    'Brain Meltdown': 'text-orange-400',
    'Trust Issue': 'text-green-400',
    'Symbol Swap': 'text-purple-400',
    'Number Detective': 'text-yellow-400',
    'One Rule Too Many': 'text-teal-400'
  };

  const topScores = [...scores]
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRankIcon = (index) => {
    switch (index) {
      case 0:
        return <Trophy className="w-6 h-6 text-yellow-400" />;
      case 1:
        return <Medal className="w-6 h-6 text-gray-300" />;
      case 2:
        return <Medal className="w-6 h-6 text-amber-600" />;
      default:
        return <Award className="w-6 h-6 text-purple-400" />;
    }
  };

  const getSarcasticMessage = () => {
    if (scores.length === 0) {
      return 'No scores yet. Too scared to play?';
    }
    const totalScore = scores.reduce((sum, s) => sum + s.score, 0);
    const avgScore = totalScore / scores.length;
    
    if (avgScore > 100) {
      return 'Not terrible. You might actually be learning something.';
    } else if (avgScore > 50) {
      return 'Mediocrity looks good on you.';
    } else {
      return 'These scores are... well, they exist.';
    }
  };

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white hover:text-purple-300 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-4xl w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-white/20"
          >
            <div className="text-center mb-8">
              <Trophy className="w-20 h-20 text-yellow-400 mx-auto mb-4" />
              <h1 className="text-5xl text-white mb-4">Leaderboard</h1>
              <p className="text-xl text-purple-200">{getSarcasticMessage()}</p>
            </div>

            {topScores.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-2xl text-purple-300">
                  No scores to display yet.
                </p>
                <p className="text-lg text-purple-400 mt-2">
                  Go play some games and prove you're not completely hopeless.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {topScores.map((score, index) => (
                  <motion.div
                    key={score.timestamp}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                      index < 3
                        ? 'bg-gradient-to-r from-white/20 to-white/10 border border-white/30'
                        : 'bg-white/10 hover:bg-white/15'
                    }`}
                  >
                    <div className="flex items-center justify-center w-12">
                      {getRankIcon(index)}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className={`text-lg md:text-xl ${gameColors[score.game] || 'text-white'}`}>
                        {score.game}
                      </h3>
                      <p className="text-sm text-purple-300">
                        {formatDate(score.timestamp)}
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-3xl text-white">{score.score}</p>
                      <p className="text-sm text-purple-300">points</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            <div className="mt-8 pt-8 border-t border-white/20">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-white/10 rounded-xl">
                  <p className="text-3xl text-white">{scores.length}</p>
                  <p className="text-sm text-purple-300">Total Games</p>
                </div>
                <div className="p-4 bg-white/10 rounded-xl">
                  <p className="text-3xl text-white">
                    {topScores[0]?.score || 0}
                  </p>
                  <p className="text-sm text-purple-300">High Score</p>
                </div>
                <div className="p-4 bg-white/10 rounded-xl col-span-2 md:col-span-1">
                  <p className="text-3xl text-white">
                    {scores.length > 0 
                      ? Math.round(scores.reduce((sum, s) => sum + s.score, 0) / scores.length)
                      : 0
                    }
                  </p>
                  <p className="text-sm text-purple-300">Average Score</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
