import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Timer, Award, Lightbulb } from 'lucide-react';

const sarcasticFeedback = {
  correct: [
    'Correct! You found the pattern. Everyone give a slow clap.',
    'Right! Looks like that one brain cell is working today.',
    'You got it! Who knew the impossible was possible?',
    'Correct! I’m actually shocked. Take a minute to bask in it.',
    'Right answer! Even a toddler could’ve done it, but sure, you.'
  ],
  wrong: [
    'Wrong. The pattern was waving at you. Literally.',
    'Nope. Maybe patterns and you are sworn enemies?',
    'Incorrect. Need me to hold your hand through it?',
    'Wrong. Just guessing? Bold strategy.',
    'Nope. I almost believed in you… almost.'
  ],
  hint: [
    'Hint: Look at the numbers. They’re trying, but you might not be.',
    'Hint: There’s a pattern. Not that it’s obvious to everyone.',
    'Hint: Try basic arithmetic. No, not just looking at them.',
    'Hint: The numbers are related. Shocking concept, I know.',
    'Hint: Focus. Or don’t. The suspense is real either way.'
  ]
};


function generatePattern() {
  const patterns = [
    // Arithmetic sequence
    () => {
      const start = Math.floor(Math.random() * 10) + 1;
      const diff = Math.floor(Math.random() * 5) + 2;
      const sequence = Array.from({ length: 4 }, (_, i) => start + i * diff);
      return {
        sequence,
        answer: sequence[3] + diff,
        type: 'Add ' + diff
      };
    },
    // Multiply sequence
    () => {
      const start = Math.floor(Math.random() * 5) + 2;
      const mult = 2;
      const sequence = Array.from({ length: 4 }, (_, i) => start * Math.pow(mult, i));
      return {
        sequence,
        answer: sequence[3] * mult,
        type: 'Multiply by 2'
      };
    },
    // Square sequence
    () => {
      const start = Math.floor(Math.random() * 3) + 2;
      const sequence = Array.from({ length: 4 }, (_, i) => Math.pow(start + i, 2));
      return {
        sequence,
        answer: Math.pow(start + 4, 2),
        type: 'Squares'
      };
    },
    // Fibonacci-like
    () => {
      const a = Math.floor(Math.random() * 5) + 1;
      const b = Math.floor(Math.random() * 5) + 1;
      const sequence = [a, b];
      for (let i = 2; i < 4; i++) {
        sequence.push(sequence[i - 1] + sequence[i - 2]);
      }
      const answer = sequence[2] + sequence[3];
      return { sequence, answer, type: 'Add previous two' };
    },
    // Alternating add/subtract
    () => {
      const start = Math.floor(Math.random() * 20) + 10;
      const add = Math.floor(Math.random() * 5) + 3;
      const sub = Math.floor(Math.random() * 3) + 1;
      const sequence = [start, start + add, start + add - sub, start + add - sub + add];
      return {
        sequence,
        answer: sequence[3] - sub,
        type: 'Alternating'
      };
    }
  ];

  return patterns[Math.floor(Math.random() * patterns.length)]();
}

function generatePatternWithDifficulty(difficulty) {
  const easyPatterns = [
    // Simple arithmetic sequence
    () => {
      const start = Math.floor(Math.random() * 10) + 1;
      const diff = Math.floor(Math.random() * 3) + 2;
      const sequence = Array.from({ length: 4 }, (_, i) => start + i * diff);
      return {
        sequence,
        answer: sequence[3] + diff,
        type: `Add ${diff}`
      };
    },
    // Simple multiply by 2
    () => {
      const start = Math.floor(Math.random() * 3) + 2;
      const mult = 2;
      const sequence = Array.from({ length: 4 }, (_, i) => start * Math.pow(mult, i));
      return {
        sequence,
        answer: sequence[3] * mult,
        type: 'Multiply by 2'
      };
    }
  ];

  const mediumPatterns = [
    // Arithmetic sequence
    () => {
      const start = Math.floor(Math.random() * 10) + 1;
      const diff = Math.floor(Math.random() * 5) + 2;
      const sequence = Array.from({ length: 4 }, (_, i) => start + i * diff);
      return {
        sequence,
        answer: sequence[3] + diff,
        type: `Add ${diff}`
      };
    },
    // Square sequence
    () => {
      const start = Math.floor(Math.random() * 3) + 2;
      const sequence = Array.from({ length: 4 }, (_, i) => Math.pow(start + i, 2));
      return {
        sequence,
        answer: Math.pow(start + 4, 2),
        type: 'Squares'
      };
    },
    // Fibonacci-like
    () => {
      const a = Math.floor(Math.random() * 5) + 1;
      const b = Math.floor(Math.random() * 5) + 1;
      const sequence = [a, b];
      for (let i = 2; i < 4; i++) {
        sequence.push(sequence[i - 1] + sequence[i - 2]);
      }
      const answer = sequence[2] + sequence[3];
      return { sequence, answer, type: 'Add previous two' };
    }
  ];

  const hardPatterns = [
    ...mediumPatterns,
    // Alternating add/subtract
    () => {
      const start = Math.floor(Math.random() * 20) + 10;
      const add = Math.floor(Math.random() * 8) + 5;
      const sub = Math.floor(Math.random() * 5) + 2;
      const sequence = [start, start + add, start + add - sub, start + add - sub + add];
      return {
        sequence,
        answer: sequence[3] - sub,
        type: 'Alternating'
      };
    },
    // Multiply by 3
    () => {
      const start = Math.floor(Math.random() * 3) + 2;
      const mult = 3;
      const sequence = Array.from({ length: 4 }, (_, i) => start * Math.pow(mult, i));
      return {
        sequence,
        answer: sequence[3] * mult,
        type: 'Multiply by 3'
      };
    },
    // Cubic sequence
    () => {
      const start = Math.floor(Math.random() * 2) + 2;
      const sequence = Array.from({ length: 4 }, (_, i) => Math.pow(start + i, 3));
      return {
        sequence,
        answer: Math.pow(start + 4, 3),
        type: 'Cubes'
      };
    }
  ];

  const patterns = difficulty === 'easy' ? easyPatterns : difficulty === 'medium' ? mediumPatterns : hardPatterns;
  return patterns[Math.floor(Math.random() * patterns.length)]();
}

export function PatternWhisperer({ difficulty, onBack, onComplete }) {
  const [pattern, setPattern] = useState(generatePatternWithDifficulty(difficulty));
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [timeLeft, setTimeLeft] = useState(difficulty === 'easy' ? 120 : difficulty === 'medium' ? 90 : 60);
  const [feedback, setFeedback] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (timeLeft > 0 && !gameOver) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !gameOver) {
      setGameOver(true);
      onComplete('Pattern Whisperer', score);
    }
  }, [timeLeft, gameOver, score, onComplete]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const answer = parseInt(userAnswer);
    
    if (isNaN(answer)) return;

    const correct = answer === pattern.answer;
    setIsCorrect(correct);
    
    if (correct) {
      const points = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 15 : 20;
      setScore(score + points);
      setFeedback(sarcasticFeedback.correct[Math.floor(Math.random() * sarcasticFeedback.correct.length)]);
    } else {
      setFeedback(sarcasticFeedback.wrong[Math.floor(Math.random() * sarcasticFeedback.wrong.length)]);
    }

    setTimeout(() => {
      setPattern(generatePatternWithDifficulty(difficulty));
      setQuestionNumber(questionNumber + 1);
      setFeedback('');
      setIsCorrect(null);
      setUserAnswer('');
      setShowHint(false);
    }, 2000);
  };

  const handleHint = () => {
    setShowHint(true);
    setFeedback(`${sarcasticFeedback.hint[Math.floor(Math.random() * sarcasticFeedback.hint.length)]} Pattern type: ${pattern.type}`);
  };

  if (gameOver) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/10 backdrop-blur-md rounded-3xl p-8 max-w-md w-full text-center border border-white/20"
        >
          <Award className="w-20 h-20 text-cyan-400 mx-auto mb-4" />
          <h2 className="text-4xl text-white mb-4">Time's Up!</h2>
          <p className="text-2xl text-purple-200 mb-2">Final Score: {score}</p>
          <p className="text-lg text-purple-300 mb-6">
            {score > 60 ? 'You can spot patterns! Congrats on having eyes.' : 'Patterns really aren\'t your forte, are they?'}
          </p>
          <button
            onClick={onBack}
            className="px-6 py-3 bg-cyan-500 text-white rounded-full hover:bg-cyan-600 transition-colors"
          >
            Back to Home
          </button>
        </motion.div>
      </div>
    );
  }

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
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-white">
            <Timer className="w-5 h-5" />
            <span className="text-xl">{timeLeft}s</span>
          </div>
          <div className="flex items-center gap-2 text-cyan-400">
            <Award className="w-5 h-5" />
            <span className="text-xl">{score}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-2xl w-full">
          <motion.div
            key={questionNumber}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/10 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-white/20"
          >
            <div className="text-center mb-8">
              <p className="text-purple-300 mb-4">Pattern {questionNumber}</p>
              <h3 className="text-2xl text-purple-200 mb-6">What comes next?</h3>
              
              <div className="flex items-center justify-center gap-4 mb-8 flex-wrap">
                {pattern.sequence.map((num, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-2xl text-white"
                  >
                    {num}
                  </motion.div>
                ))}
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl border-2 border-dashed border-cyan-400 flex items-center justify-center text-3xl text-cyan-400">
                  ?
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <input
                type="number"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                disabled={isCorrect !== null}
                placeholder="Enter your answer"
                className="w-full p-4 rounded-xl bg-white/20 text-white text-center text-2xl placeholder-white/50 border border-white/30 focus:border-cyan-400 focus:outline-none disabled:opacity-50"
                autoFocus
              />

              <button
                type="submit"
                disabled={!userAnswer || isCorrect !== null}
                className="w-full py-4 bg-cyan-500 text-white rounded-xl hover:bg-cyan-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Answer
              </button>
            </form>

            <button
              onClick={handleHint}
              disabled={showHint || isCorrect !== null}
              className="flex items-center gap-2 mx-auto mt-4 px-4 py-2 bg-white/10 text-purple-300 rounded-full hover:bg-white/20 transition-colors disabled:opacity-50"
            >
              <Lightbulb className="w-4 h-4" />
              I give up, show me a hint
            </button>

            <AnimatePresence>
              {feedback && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`mt-6 p-4 rounded-xl text-center ${
                    isCorrect === true
                      ? 'bg-green-500/20 text-green-200'
                      : isCorrect === false
                      ? 'bg-red-500/20 text-red-200'
                      : 'bg-blue-500/20 text-blue-200'
                  }`}
                >
                  {feedback}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}