import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Timer, Award } from 'lucide-react';

const sarcasticFeedback = {
  correct: [
    'Correct. You actually noticed something. Miracles exist.',
    'Accurate. Your pattern recognition… barely passes.',
    'Correct identification. Efficiency is the bare minimum, but okay.',
    'Precise. Against all odds, logic prevailed.',
    'Correct. Logic finally showed up to the party.'
  ],
  wrong: [
    'Incorrect. Did you even look at the pattern or just blinked?',
    'Error. Your “logic” seems to be on vacation.',
    'Wrong selection. Analysis? More like random guesswork.',
    'Incorrect. Pattern recognition failure. Shocking, I know.',
    'Wrong. Deduction skills: 0. Effort: questionable.'
  ],
  partial: [
    'Partially correct. Some anomalies remain… like your attention span.',
    'Incomplete analysis. You skipped some parts, didn’t you?',
    'Some errors found, but not all. Close… but not really.',
    'Partial identification. Insufficient. Try harder, if you can.'
  ]
};


function generateSequence(difficulty) {
  const sequences = [
    // Arithmetic sequence with one wrong number
    () => {
      const start = Math.floor(Math.random() * 10) + 5;
      const diff = Math.floor(Math.random() * 4) + 2;
      const length = difficulty === 'easy' ? 6 : difficulty === 'medium' ? 7 : 8;
      const numbers = Array.from({ length }, (_, i) => start + i * diff);
      const errorIndex = Math.floor(Math.random() * (length - 1)) + 1;
      numbers[errorIndex] += Math.floor(Math.random() * 5) + 1;
      return {
        numbers,
        correctIndices: [errorIndex],
        explanation: `Arithmetic sequence with difference ${diff}. Position ${errorIndex + 1} was incorrect.`
      };
    },
    // Geometric sequence with error
    () => {
      const start = Math.floor(Math.random() * 3) + 2;
      const ratio = 2;
      const length = difficulty === 'easy' ? 5 : difficulty === 'medium' ? 6 : 7;
      const numbers = Array.from({ length }, (_, i) => start * Math.pow(ratio, i));
      const errorIndex = Math.floor(Math.random() * (length - 2)) + 1;
      numbers[errorIndex] += Math.floor(Math.random() * 3) + 2;
      return {
        numbers,
        correctIndices: [errorIndex],
        explanation: `Geometric sequence multiplying by ${ratio}. Position ${errorIndex + 1} was incorrect.`
      };
    },
    // Square sequence with error
    () => {
      const start = Math.floor(Math.random() * 3) + 2;
      const length = difficulty === 'easy' ? 5 : difficulty === 'medium' ? 6 : 6;
      const numbers = Array.from({ length }, (_, i) => Math.pow(start + i, 2));
      const errorIndex = Math.floor(Math.random() * (length - 1)) + 1;
      numbers[errorIndex] += Math.floor(Math.random() * 7) + 3;
      return {
        numbers,
        correctIndices: [errorIndex],
        explanation: `Perfect squares starting from ${start}². Position ${errorIndex + 1} was incorrect.`
      };
    },
    // Prime sequence with error
    () => {
      const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37];
      const length = difficulty === 'easy' ? 5 : difficulty === 'medium' ? 6 : 7;
      const startIndex = Math.floor(Math.random() * (primes.length - length));
      const numbers = primes.slice(startIndex, startIndex + length);
      const errorIndex = Math.floor(Math.random() * (length - 1)) + 1;
      numbers[errorIndex] += 1;
      return {
        numbers,
        correctIndices: [errorIndex],
        explanation: `Prime number sequence. Position ${errorIndex + 1} was not prime.`
      };
    },
    // Fibonacci-like with error
    () => {
      const a = Math.floor(Math.random() * 3) + 1;
      const b = Math.floor(Math.random() * 3) + 2;
      const length = difficulty === 'easy' ? 6 : difficulty === 'medium' ? 7 : 8;
      const numbers = [a, b];
      for (let i = 2; i < length; i++) {
        numbers.push(numbers[i - 1] + numbers[i - 2]);
      }
      const errorIndex = Math.floor(Math.random() * (length - 3)) + 2;
      numbers[errorIndex] += Math.floor(Math.random() * 5) + 2;
      return {
        numbers,
        correctIndices: [errorIndex],
        explanation: `Fibonacci-like sequence. Position ${errorIndex + 1} was incorrect.`
      };
    }
  ];

  // Hard mode: sometimes add multiple errors
  if (difficulty === 'hard' && Math.random() > 0.6) {
    const start = Math.floor(Math.random() * 10) + 5;
    const diff = Math.floor(Math.random() * 4) + 2;
    const length = 8;
    const numbers = Array.from({ length }, (_, i) => start + i * diff);
    const error1 = Math.floor(Math.random() * (length - 3)) + 1;
    let error2 = Math.floor(Math.random() * (length - 3)) + 1;
    while (error2 === error1) {
      error2 = Math.floor(Math.random() * (length - 3)) + 1;
    }
    numbers[error1] += Math.floor(Math.random() * 4) + 2;
    numbers[error2] -= Math.floor(Math.random() * 4) + 2;
    return {
      numbers,
      correctIndices: [error1, error2].sort((a, b) => a - b),
      explanation: `Arithmetic sequence with difference ${diff}. Positions ${error1 + 1} and ${error2 + 1} were incorrect.`
    };
  }

  return sequences[Math.floor(Math.random() * sequences.length)]();
}

export function NumberDetective({ difficulty, onBack, onComplete }) {
  const [sequence, setSequence] = useState(generateSequence(difficulty));
  const [selectedIndices, setSelectedIndices] = useState([]);
  const [score, setScore] = useState(0);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [timeLeft, setTimeLeft] = useState(difficulty === 'easy' ? 150 : difficulty === 'medium' ? 120 : 90);
  const [feedback, setFeedback] = useState('');
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (timeLeft > 0 && !gameOver) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !gameOver) {
      setGameOver(true);
      onComplete('Number Detective', score);
    }
  }, [timeLeft, gameOver, score, onComplete]);

  const handleNumberClick = (index) => {
    if (showExplanation) return;
    
    if (selectedIndices.includes(index)) {
      setSelectedIndices(selectedIndices.filter(i => i !== index));
    } else {
      setSelectedIndices([...selectedIndices, index]);
    }
  };

  const handleSubmit = () => {
    if (selectedIndices.length === 0 || showExplanation) return;

    const correct = selectedIndices.length === sequence.correctIndices.length &&
      selectedIndices.every(i => sequence.correctIndices.includes(i));
    
    const partial = selectedIndices.some(i => sequence.correctIndices.includes(i)) &&
      !correct;

    setIsCorrect(correct);
    setShowExplanation(true);
    
    if (correct) {
      const points = difficulty === 'easy' ? 15 : difficulty === 'medium' ? 20 : 30;
      setScore(score + points);
      setFeedback(sarcasticFeedback.correct[Math.floor(Math.random() * sarcasticFeedback.correct.length)]);
    } else if (partial) {
      setFeedback(sarcasticFeedback.partial[Math.floor(Math.random() * sarcasticFeedback.partial.length)]);
    } else {
      setFeedback(sarcasticFeedback.wrong[Math.floor(Math.random() * sarcasticFeedback.wrong.length)]);
    }

    setTimeout(() => {
      setSequence(generateSequence(difficulty));
      setQuestionNumber(questionNumber + 1);
      setSelectedIndices([]);
      setFeedback('');
      setIsCorrect(null);
      setShowExplanation(false);
    }, 3500);
  };

  if (gameOver) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/10 backdrop-blur-md rounded-3xl p-8 max-w-md w-full text-center border border-white/20"
        >
          <Award className="w-20 h-20 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-4xl text-white mb-4">Analysis Complete</h2>
          <p className="text-2xl text-purple-200 mb-2">Final Score: {score}</p>
          <p className="text-lg text-purple-300 mb-6">
            {score > 80 ? 'Your pattern recognition is adequate.' : 'Your analytical skills require refinement.'}
          </p>
          <button
            onClick={onBack}
            className="px-6 py-3 bg-yellow-500 text-black rounded-full hover:bg-yellow-600 transition-colors"
          >
            Exit Analysis
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
          <div className="flex items-center gap-2 text-yellow-400">
            <Award className="w-5 h-5" />
            <span className="text-xl">{score}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-4xl w-full">
          <motion.div
            key={questionNumber}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/10 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-white/20"
          >
            <div className="text-center mb-8">
              <p className="text-purple-300 mb-4">Sequence {questionNumber}</p>
              <h3 className="text-2xl text-purple-200 mb-2">Identify the incorrect number(s)</h3>
              <p className="text-sm text-purple-400">Click to select, click again to deselect</p>
            </div>

            <div className="flex items-center justify-center gap-3 md:gap-4 mb-8 flex-wrap">
              {sequence.numbers.map((num, index) => {
                const isSelected = selectedIndices.includes(index);
                const isCorrectAnswer = sequence.correctIndices.includes(index);
                const showAnswer = showExplanation;
                
                return (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.08 }}
                    onClick={() => handleNumberClick(index)}
                    disabled={showExplanation}
                    className={`
                      w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center text-xl md:text-2xl
                      transition-all duration-200
                      ${showAnswer && isCorrectAnswer
                        ? 'bg-gradient-to-br from-orange-500 to-red-500 text-white border-2 border-orange-300'
                        : isSelected
                        ? 'bg-gradient-to-br from-yellow-500 to-amber-500 text-black border-2 border-yellow-300 scale-105'
                        : 'bg-gradient-to-br from-yellow-500/20 to-amber-500/20 text-white border border-white/30 hover:border-yellow-400 hover:scale-105'
                      }
                      disabled:cursor-default
                    `}
                  >
                    {num}
                  </motion.button>
                );
              })}
            </div>

            <button
              onClick={handleSubmit}
              disabled={selectedIndices.length === 0 || showExplanation}
              className="w-full py-4 bg-yellow-500 text-black rounded-xl hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Analysis
            </button>

            <AnimatePresence>
              {feedback && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mt-6 space-y-3"
                >
                  <div
                    className={`p-4 rounded-xl text-center ${
                      isCorrect === true
                        ? 'bg-green-500/20 text-green-200'
                        : 'bg-red-500/20 text-red-200'
                    }`}
                  >
                    {feedback}
                  </div>
                  {showExplanation && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="p-4 rounded-xl bg-blue-500/20 text-blue-200 text-sm text-center"
                    >
                      {sequence.explanation}
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}