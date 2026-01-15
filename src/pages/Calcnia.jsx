import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Timer, Award, Zap, TrendingUp, TrendingDown } from 'lucide-react';

const sarcasticFeedback = {
  correct: [
    'Correct! Newton would be... moderately impressed.',
    'Right! You can differentiate. The bar is so low.',
    'You got it! Calculus isn\'t your mortal enemy after all.',
    'Correct! Even a stopped derivative is right twice a... wait.',
    'Right answer! Maybe you did stay awake in calc class.'
  ],
  wrong: [
    'Wrong. The derivative of your confidence just went negative.',
    'Nope. Maybe try the power rule? Or... any rule?',
    'Incorrect. Calculus is hard, we get it.',
    'Wrong. Did you forget to carry the... everything?',
    'Nope. Your integral understanding needs work.'
  ]
};

// Generate derivative questions
function generateDerivativeQuestion(difficulty) {
  const easyDerivatives = [
    // Power rule basics
    () => {
      const n = Math.floor(Math.random() * 5) + 2;
      return {
        question: `d/dx(x^${n})`,
        answer: `${n}x^${n-1}`,
        options: [`${n}x^${n-1}`, `x^${n-1}`, `${n}x^${n}`, `${n-1}x^${n-2}`],
        hint: 'Power rule: d/dx(x^n) = nx^(n-1)'
      };
    },
    // Constant rule
    () => {
      const c = Math.floor(Math.random() * 20) + 1;
      return {
        question: `d/dx(${c})`,
        answer: '0',
        options: ['0', '1', `${c}`, `${c}x`],
        hint: 'The derivative of a constant is always 0'
      };
    },
    // Simple coefficient
    () => {
      const a = Math.floor(Math.random() * 10) + 2;
      return {
        question: `d/dx(${a}x)`,
        answer: `${a}`,
        options: [`${a}`, `${a}x`, '1', 'x'],
        hint: 'The derivative of ax is just a'
      };
    },
    // x squared
    () => {
      return {
        question: 'd/dx(x²)',
        answer: '2x',
        options: ['2x', 'x', 'x²', '2'],
        hint: 'Power rule: bring down the exponent and reduce it by 1'
      };
    }
  ];

  const mediumDerivatives = [
    // Sum rule with powers
    () => {
      const a = Math.floor(Math.random() * 5) + 2;
      const b = Math.floor(Math.random() * 10) + 1;
      return {
        question: `d/dx(x^${a} + ${b}x)`,
        answer: `${a}x^${a-1} + ${b}`,
        options: [`${a}x^${a-1} + ${b}`, `x^${a-1} + ${b}`, `${a}x^${a} + ${b}x`, `${a}x^${a-1} + ${b}x`],
        hint: 'Take the derivative of each term separately'
      };
    },
    // Product with constant
    () => {
      const a = Math.floor(Math.random() * 5) + 2;
      const n = Math.floor(Math.random() * 4) + 2;
      return {
        question: `d/dx(${a}x^${n})`,
        answer: `${a*n}x^${n-1}`,
        options: [`${a*n}x^${n-1}`, `${a}x^${n-1}`, `${n}x^${n-1}`, `${a*n}x^${n}`],
        hint: 'Multiply the coefficient by the exponent, then reduce exponent by 1'
      };
    },
    // Sine function
    () => {
      return {
        question: 'd/dx(sin(x))',
        answer: 'cos(x)',
        options: ['cos(x)', '-cos(x)', 'sin(x)', '-sin(x)'],
        hint: 'The derivative of sin(x) is cos(x)'
      };
    },
    // Exponential
    () => {
      return {
        question: 'd/dx(e^x)',
        answer: 'e^x',
        options: ['e^x', 'xe^(x-1)', 'e', 'ln(x)'],
        hint: 'e^x is special - it\'s its own derivative!'
      };
    }
  ];

  const hardDerivatives = [
    // Chain rule
    () => {
      const n = Math.floor(Math.random() * 4) + 2;
      const a = Math.floor(Math.random() * 5) + 2;
      return {
        question: `d/dx((${a}x)^${n})`,
        answer: `${n*a}(${a}x)^${n-1}`,
        options: [`${n*a}(${a}x)^${n-1}`, `${n}(${a}x)^${n-1}`, `${a*n}x^${n-1}`, `${a}x^${n-1}`],
        hint: 'Chain rule: derivative of outer × derivative of inner'
      };
    },
    // Product rule
    () => {
      const a = Math.floor(Math.random() * 3) + 2;
      const b = Math.floor(Math.random() * 3) + 2;
      return {
        question: `d/dx(x^${a} · x^${b})`,
        answer: `${a+b}x^${a+b-1}`,
        options: [`${a+b}x^${a+b-1}`, `${a*b}x^${a+b-1}`, `x^${a+b-1}`, `${a+b}x^${a*b-1}`],
        hint: 'Simplify first: x^a · x^b = x^(a+b), then differentiate'
      };
    },
    // Cosine
    () => {
      return {
        question: 'd/dx(cos(x))',
        answer: '-sin(x)',
        options: ['-sin(x)', 'sin(x)', '-cos(x)', 'cos(x)'],
        hint: 'The derivative of cos(x) is -sin(x)'
      };
    },
    // Natural log
    () => {
      return {
        question: 'd/dx(ln(x))',
        answer: '1/x',
        options: ['1/x', 'x', '1', 'ln(x)'],
        hint: 'The derivative of ln(x) is 1/x'
      };
    },
    // Sum with trig
    () => {
      const a = Math.floor(Math.random() * 5) + 2;
      return {
        question: `d/dx(x^${a} + sin(x))`,
        answer: `${a}x^${a-1} + cos(x)`,
        options: [`${a}x^${a-1} + cos(x)`, `${a}x^${a-1} + sin(x)`, `x^${a-1} + cos(x)`, `${a}x^${a} + cos(x)`],
        hint: 'Take derivative of each term separately'
      };
    }
  ];

  const questions = difficulty === 'easy' ? easyDerivatives : difficulty === 'medium' ? mediumDerivatives : hardDerivatives;
  return questions[Math.floor(Math.random() * questions.length)]();
}

// Generate integral questions
function generateIntegralQuestion(difficulty) {
  const easyIntegrals = [
    // Power rule for integrals
    () => {
      const n = Math.floor(Math.random() * 5) + 1;
      return {
        question: `∫ x^${n} dx`,
        answer: `x^${n+1}/${n+1} + C`,
        options: [`x^${n+1}/${n+1} + C`, `x^${n+1} + C`, `${n}x^${n-1} + C`, `x^${n}/${n} + C`],
        hint: 'Power rule for integrals: ∫ x^n dx = x^(n+1)/(n+1) + C'
      };
    },
    // Constant
    () => {
      const c = Math.floor(Math.random() * 10) + 1;
      return {
        question: `∫ ${c} dx`,
        answer: `${c}x + C`,
        options: [`${c}x + C`, `${c} + C`, `x + C`, '0'],
        hint: '∫ c dx = cx + C (don\'t forget +C!)'
      };
    },
    // Simple x
    () => {
      return {
        question: '∫ x dx',
        answer: 'x²/2 + C',
        options: ['x²/2 + C', 'x² + C', 'x/2 + C', '2x + C'],
        hint: '∫ x dx = x²/2 + C'
      };
    },
    // Basic coefficient
    () => {
      const a = Math.floor(Math.random() * 8) + 2;
      return {
        question: `∫ ${a}x dx`,
        answer: `${a}x²/2 + C`,
        options: [`${a}x²/2 + C`, `${a}x + C`, `x²/2 + C`, `${a}x² + C`],
        hint: 'Pull the constant out, then integrate x'
      };
    }
  ];

  const mediumIntegrals = [
    // Sum of powers
    () => {
      const n = Math.floor(Math.random() * 3) + 2;
      return {
        question: `∫ (x^${n} + x) dx`,
        answer: `x^${n+1}/${n+1} + x²/2 + C`,
        options: [`x^${n+1}/${n+1} + x²/2 + C`, `x^${n+1} + x² + C`, `${n}x^${n-1} + x + C`, `x^${n} + x²/2 + C`],
        hint: 'Integrate each term separately'
      };
    },
    // Coefficient with power
    () => {
      const a = Math.floor(Math.random() * 5) + 2;
      const n = Math.floor(Math.random() * 4) + 2;
      return {
        question: `∫ ${a}x^${n} dx`,
        answer: `${a}x^${n+1}/${n+1} + C`,
        options: [`${a}x^${n+1}/${n+1} + C`, `${a}x^${n+1} + C`, `x^${n+1}/${n+1} + C`, `${a*n}x^${n} + C`],
        hint: 'Pull constant out, use power rule for integrals'
      };
    },
    // Cosine
    () => {
      return {
        question: '∫ cos(x) dx',
        answer: 'sin(x) + C',
        options: ['sin(x) + C', '-sin(x) + C', 'cos(x) + C', '-cos(x) + C'],
        hint: '∫ cos(x) dx = sin(x) + C'
      };
    },
    // Exponential
    () => {
      return {
        question: '∫ e^x dx',
        answer: 'e^x + C',
        options: ['e^x + C', 'xe^x + C', 'e^x/x + C', 'ln(x) + C'],
        hint: 'e^x integrates to itself!'
      };
    }
  ];

  const hardIntegrals = [
    // Sine
    () => {
      return {
        question: '∫ sin(x) dx',
        answer: '-cos(x) + C',
        options: ['-cos(x) + C', 'cos(x) + C', '-sin(x) + C', 'sin(x) + C'],
        hint: '∫ sin(x) dx = -cos(x) + C'
      };
    },
    // 1/x
    () => {
      return {
        question: '∫ (1/x) dx',
        answer: 'ln|x| + C',
        options: ['ln|x| + C', '1/x² + C', 'x + C', '-1/x² + C'],
        hint: '∫ (1/x) dx = ln|x| + C'
      };
    },
    // Multiple terms
    () => {
      const a = Math.floor(Math.random() * 4) + 2;
      const b = Math.floor(Math.random() * 6) + 1;
      return {
        question: `∫ (x^${a} + ${b}) dx`,
        answer: `x^${a+1}/${a+1} + ${b}x + C`,
        options: [`x^${a+1}/${a+1} + ${b}x + C`, `x^${a+1} + ${b}x + C`, `${a}x^${a-1} + ${b}x + C`, `x^${a} + ${b}x + C`],
        hint: 'Integrate each term separately'
      };
    },
    // Trig + polynomial
    () => {
      const n = Math.floor(Math.random() * 3) + 2;
      return {
        question: `∫ (x^${n} + cos(x)) dx`,
        answer: `x^${n+1}/${n+1} + sin(x) + C`,
        options: [`x^${n+1}/${n+1} + sin(x) + C`, `x^${n+1} + sin(x) + C`, `${n}x^${n-1} + sin(x) + C`, `x^${n+1}/${n+1} + cos(x) + C`],
        hint: 'Integrate polynomial and trig separately'
      };
    },
    // sec²(x)
    () => {
      return {
        question: '∫ sec²(x) dx',
        answer: 'tan(x) + C',
        options: ['tan(x) + C', 'sec(x) + C', '-tan(x) + C', 'cot(x) + C'],
        hint: 'This is a trig integral: ∫ sec²(x) dx = tan(x) + C'
      };
    }
  ];

  const questions = difficulty === 'easy' ? easyIntegrals : difficulty === 'medium' ? mediumIntegrals : hardIntegrals;
  return questions[Math.floor(Math.random() * questions.length)]();
}

export function Calcnia({ questionType, difficulty, onBack, onComplete }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [questionTimes, setQuestionTimes] = useState([]);
  const [showPointsPopup, setShowPointsPopup] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState(0);

  // Generate 10 questions at start
  useEffect(() => {
    const generatedQuestions = [];
    for (let i = 0; i < 10; i++) {
      const question = questionType === 'derivative' 
        ? generateDerivativeQuestion(difficulty)
        : generateIntegralQuestion(difficulty);
      generatedQuestions.push(question);
    }
    setQuestions(generatedQuestions);
  }, [questionType, difficulty]);

  const currentQuestion = questions[currentQuestionIndex];
  const elapsedTime = Math.floor((Date.now() - questionStartTime) / 1000);

  const calculatePoints = (timeInSeconds) => {
    const basePoints = difficulty === 'easy' ? 100 : difficulty === 'medium' ? 200 : 300;
    const timeBonus = Math.max(0, 50 - timeInSeconds * 2);
    return Math.floor(basePoints + timeBonus);
  };

  const handleAnswer = (answer) => {
    if (selectedAnswer !== null) return;
    
    const timeTaken = (Date.now() - questionStartTime) / 1000;
    setQuestionTimes([...questionTimes, timeTaken]);
    setSelectedAnswer(answer);
    
    const correct = answer === currentQuestion.answer;
    setIsCorrect(correct);
    
    if (correct) {
      const points = calculatePoints(timeTaken);
      setScore(score + points);
      setCorrectCount(correctCount + 1);
      setEarnedPoints(points);
      setShowPointsPopup(true);
      setFeedback(sarcasticFeedback.correct[Math.floor(Math.random() * sarcasticFeedback.correct.length)]);
      
      setTimeout(() => setShowPointsPopup(false), 1500);
    } else {
      setIncorrectCount(incorrectCount + 1);
      setFeedback(sarcasticFeedback.wrong[Math.floor(Math.random() * sarcasticFeedback.wrong.length)] + ' ' + currentQuestion.hint);
    }

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setQuestionStartTime(Date.now());
        setFeedback('');
        setIsCorrect(null);
        setSelectedAnswer(null);
      } else {
        setGameOver(true);
        const gameName = `Calcnia (${questionType === 'derivative' ? 'Derivatives' : 'Integrals'})`;
        onComplete(gameName, score);
      }
    }, 2000);
  };

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-2xl">Loading questions...</div>
      </div>
    );
  }

  if (gameOver) {
    const avgTime = questionTimes.length > 0 
      ? (questionTimes.reduce((a, b) => a + b, 0) / questionTimes.length).toFixed(1)
      : 0;

    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/10 backdrop-blur-md rounded-3xl p-8 max-w-lg w-full border border-white/20"
        >
          <div className="text-center">
            <Award className="w-24 h-24 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-4xl text-white mb-2">Game Complete!</h2>
            <p className="text-purple-200 mb-6">
              {questionType === 'derivative' ? 'Derivatives' : 'Integrals'} - {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </p>
            
            <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl p-6 mb-6 border border-yellow-500/30">
              <p className="text-5xl text-yellow-400 mb-2">{score}</p>
              <p className="text-xl text-white">Total Points</p>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-white/10 rounded-xl p-4">
                <p className="text-3xl text-green-400">{correctCount}</p>
                <p className="text-sm text-purple-200">Correct</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4">
                <p className="text-3xl text-red-400">{incorrectCount}</p>
                <p className="text-sm text-purple-200">Wrong</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4">
                <p className="text-3xl text-cyan-400">{avgTime}s</p>
                <p className="text-sm text-purple-200">Avg Time</p>
              </div>
            </div>

            <p className="text-purple-300 mb-6">
              {correctCount >= 8 ? 'Calculus master! You actually know this stuff.' : 
               correctCount >= 5 ? 'Not bad. You remembered some things.' :
               'Well... at least you finished?'}
            </p>

            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl hover:from-pink-600 hover:to-purple-600 transition-all"
              >
                Play Again
              </button>
              <button
                onClick={onBack}
                className="w-full py-3 bg-white/20 text-white rounded-xl hover:bg-white/30 transition-all"
              >
                Back to Menu
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-8">
      {/* Header */}
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
            {questionType === 'derivative' ? <TrendingDown className="w-5 h-5" /> : <TrendingUp className="w-5 h-5" />}
            <span className="text-lg">{questionType === 'derivative' ? 'Derivatives' : 'Integrals'}</span>
          </div>
          <div className="flex items-center gap-2 text-pink-400">
            <Award className="w-5 h-5" />
            <span className="text-xl">{score}</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-purple-200 text-sm mb-2">
          <span>Question {currentQuestionIndex + 1} of 10</span>
          <span className="flex items-center gap-1">
            <Timer className="w-4 h-4" />
            {elapsedTime}s
          </span>
        </div>
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-pink-500 to-purple-500"
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestionIndex + 1) / 10) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Main Question */}
      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-2xl w-full">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/10 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-white/20"
          >
            {/* Question Display */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full border border-pink-500/30 mb-6">
                <Zap className="w-4 h-4 text-pink-400" />
                <span className="text-pink-200 text-sm uppercase tracking-wide">
                  {difficulty} Mode
                </span>
              </div>
              
              <h2 className="text-4xl md:text-5xl text-white mb-4 font-mono">
                {currentQuestion.question}
              </h2>
            </div>

            {/* Answer Options */}
            <div className="grid grid-cols-1 gap-3 mb-6">
              {currentQuestion.options.map((option, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: selectedAnswer === null ? 1.02 : 1 }}
                  whileTap={{ scale: selectedAnswer === null ? 0.98 : 1 }}
                  onClick={() => handleAnswer(option)}
                  disabled={selectedAnswer !== null}
                  className={`p-4 rounded-xl text-xl font-mono transition-all ${
                    selectedAnswer === null
                      ? 'bg-white/20 hover:bg-white/30 text-white border border-white/30'
                      : option === currentQuestion.answer
                      ? 'bg-green-500/30 text-green-100 border-2 border-green-400'
                      : option === selectedAnswer
                      ? 'bg-red-500/30 text-red-100 border-2 border-red-400'
                      : 'bg-white/10 text-white/50 border border-white/10'
                  }`}
                >
                  {option}
                </motion.button>
              ))}
            </div>

            {/* Feedback */}
            <AnimatePresence>
              {feedback && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`p-4 rounded-xl ${
                    isCorrect === true
                      ? 'bg-green-500/20 text-green-200 border border-green-500/30'
                      : 'bg-red-500/20 text-red-200 border border-red-500/30'
                  }`}
                >
                  <p className="text-center">{feedback}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Points Popup */}
      <AnimatePresence>
        {showPointsPopup && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.5 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
          >
            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-8 py-6 rounded-2xl shadow-2xl border-4 border-yellow-300">
              <p className="text-5xl font-bold">+{earnedPoints}</p>
              <p className="text-xl">Points!</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
