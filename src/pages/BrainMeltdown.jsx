import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Timer, Award, AlertTriangle } from 'lucide-react';

const sarcasticFeedback = {
  correct: [
    'Correct! You survived the chaos. Miracles happen.',
    'Right! Look at you, adapting like an actual adult. Shocking.',
    'You got it! Who knew unpredictability could suit you?',
    'Correct! Against all odds, you didn’t panic. Color me impressed.',
    'Right answer! The rules flipped, and somehow, you’re still standing.'
  ],
  wrong: [
    'Wrong. Can’t keep up? Shocking. Truly shocking.',
    'Nope. Change scares you? Don’t worry, you’re consistent at that.',
    'Incorrect. Reading instructions is apparently optional for you.',
    'Wrong. The rule was literally waving at you, but hey…',
    'Nope. Maybe next time, skim the text instead of skipping it entirely.'
  ],
  ruleChange: [
    'Plot twist! Rules changed mid-game. Shocker.',
    'Surprise! New rule. Because who needs predictability anyway?',
    'Rule change! Mid-game chaos is fun… if you like existential dread.',
    'New rule alert! Try not to cry, okay?',
    'The rules have changed. Life lesson: nothing is fair, ever.'
  ]
};


function generateQuestionWithDifficulty(currentRule, difficulty) {
  const easyRules = [
    {
      id: 'even',
      name: 'Pick the EVEN number',
      generator: () => {
        const correct = (Math.floor(Math.random() * 15) + 1) * 2;
        const options = [
          correct.toString(),
          (Math.floor(Math.random() * 15) * 2 + 1).toString(),
          (Math.floor(Math.random() * 15) * 2 + 1).toString(),
          (Math.floor(Math.random() * 15) * 2 + 1).toString()
        ];
        return { options: options.sort(() => Math.random() - 0.5), correct: options.indexOf(correct.toString()) };
      }
    },
    {
      id: 'odd',
      name: 'Pick the ODD number',
      generator: () => {
        const correct = (Math.floor(Math.random() * 15) * 2 + 1);
        const options = [
          correct.toString(),
          (Math.floor(Math.random() * 15) + 1) * 2,
          (Math.floor(Math.random() * 15) + 1) * 2,
          (Math.floor(Math.random() * 15) + 1) * 2
        ].map(n => n.toString());
        return { options: options.sort(() => Math.random() - 0.5), correct: options.indexOf(correct.toString()) };
      }
    },
    {
      id: 'largest',
      name: 'Pick the LARGEST number',
      generator: () => {
        const nums = Array.from({ length: 4 }, () => Math.floor(Math.random() * 50) + 1);
        const correct = Math.max(...nums);
        const options = nums.map(n => n.toString());
        return { options, correct: options.indexOf(correct.toString()) };
      }
    },
    {
      id: 'smallest',
      name: 'Pick the SMALLEST number',
      generator: () => {
        const nums = Array.from({ length: 4 }, () => Math.floor(Math.random() * 50) + 1);
        const correct = Math.min(...nums);
        const options = nums.map(n => n.toString());
        return { options, correct: options.indexOf(correct.toString()) };
      }
    },
    {
      id: 'endswith',
      name: 'Pick number ending with 5',
      generator: () => {
        const correct = Math.floor(Math.random() * 9) * 10 + 5;
        const options = [correct.toString()];
        while (options.length < 4) {
          const num = Math.floor(Math.random() * 90) + 1;
          if (num % 10 !== 5 && !options.includes(num.toString())) {
            options.push(num.toString());
          }
        }
        return { options: options.sort(() => Math.random() - 0.5), correct: options.indexOf(correct.toString()) };
      }
    }
  ];

  const mediumRules = [
    ...easyRules,
    {
      id: 'divisible',
      name: 'Pick a number divisible by 3',
      generator: () => {
        const correct = (Math.floor(Math.random() * 20) + 1) * 3;
        const options = [correct.toString()];
        while (options.length < 4) {
          const num = Math.floor(Math.random() * 60) + 1;
          if (num % 3 !== 0 && !options.includes(num.toString())) {
            options.push(num.toString());
          }
        }
        return { options: options.sort(() => Math.random() - 0.5), correct: options.indexOf(correct.toString()) };
      }
    },
    {
      id: 'divisible4',
      name: 'Pick a number divisible by 4',
      generator: () => {
        const correct = (Math.floor(Math.random() * 15) + 1) * 4;
        const options = [correct.toString()];
        while (options.length < 4) {
          const num = Math.floor(Math.random() * 60) + 1;
          if (num % 4 !== 0 && !options.includes(num.toString())) {
            options.push(num.toString());
          }
        }
        return { options: options.sort(() => Math.random() - 0.5), correct: options.indexOf(correct.toString()) };
      }
    },
    {
      id: 'twodigit',
      name: 'Pick the TWO-DIGIT number',
      generator: () => {
        const correct = Math.floor(Math.random() * 90) + 10;
        const options = [
          correct.toString(),
          (Math.floor(Math.random() * 9) + 1).toString(),
          (Math.floor(Math.random() * 900) + 100).toString(),
          (Math.floor(Math.random() * 9) + 1).toString()
        ];
        return { options: options.sort(() => Math.random() - 0.5), correct: options.indexOf(correct.toString()) };
      }
    },
    {
      id: 'sumdigits',
      name: 'Pick number with digit sum > 10',
      generator: () => {
        const correct = Math.floor(Math.random() * 40) + 29; // ensures sum > 10
        const options = [correct.toString()];
        while (options.length < 4) {
          const num = Math.floor(Math.random() * 50) + 1;
          const digitSum = num.toString().split('').reduce((a, b) => a + parseInt(b), 0);
          if (digitSum <= 10 && !options.includes(num.toString())) {
            options.push(num.toString());
          }
        }
        return { options: options.sort(() => Math.random() - 0.5), correct: options.indexOf(correct.toString()) };
      }
    }
  ];

  const hardRules = [
    ...mediumRules,
    {
      id: 'prime',
      name: 'Pick the PRIME number',
      generator: () => {
        const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71];
        const correct = primes[Math.floor(Math.random() * primes.length)];
        const nonPrimes = [4, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20, 21, 22, 24, 25, 26, 27, 28, 30, 32, 33, 34, 35, 36];
        const options = [
          correct.toString(),
          nonPrimes[Math.floor(Math.random() * nonPrimes.length)].toString(),
          nonPrimes[Math.floor(Math.random() * nonPrimes.length)].toString(),
          nonPrimes[Math.floor(Math.random() * nonPrimes.length)].toString()
        ];
        return { options: options.sort(() => Math.random() - 0.5), correct: options.indexOf(correct.toString()) };
      }
    },
    {
      id: 'divisible5',
      name: 'Pick a number divisible by 5',
      generator: () => {
        const correct = (Math.floor(Math.random() * 15) + 1) * 5;
        const options = [correct.toString()];
        while (options.length < 4) {
          const num = Math.floor(Math.random() * 80) + 1;
          if (num % 5 !== 0 && !options.includes(num.toString())) {
            options.push(num.toString());
          }
        }
        return { options: options.sort(() => Math.random() - 0.5), correct: options.indexOf(correct.toString()) };
      }
    },
    {
      id: 'perfect_square',
      name: 'Pick the PERFECT SQUARE',
      generator: () => {
        const squares = [4, 9, 16, 25, 36, 49, 64, 81, 100];
        const correct = squares[Math.floor(Math.random() * squares.length)];
        const options = [correct.toString()];
        while (options.length < 4) {
          const num = Math.floor(Math.random() * 100) + 1;
          if (!squares.includes(num) && !options.includes(num.toString())) {
            options.push(num.toString());
          }
        }
        return { options: options.sort(() => Math.random() - 0.5), correct: options.indexOf(correct.toString()) };
      }
    },
    {
      id: 'palindrome',
      name: 'Pick the PALINDROME number',
      generator: () => {
        const palindromes = [11, 22, 33, 44, 55, 66, 77, 88, 99, 101, 111, 121, 131, 141, 151];
        const correct = palindromes[Math.floor(Math.random() * palindromes.length)];
        const options = [correct.toString()];
        while (options.length < 4) {
          const num = Math.floor(Math.random() * 150) + 10;
          const str = num.toString();
          const isPalindrome = str === str.split('').reverse().join('');
          if (!isPalindrome && !options.includes(num.toString())) {
            options.push(num.toString());
          }
        }
        return { options: options.sort(() => Math.random() - 0.5), correct: options.indexOf(correct.toString()) };
      }
    },
    {
      id: 'fibonacci',
      name: 'Pick the FIBONACCI number',
      generator: () => {
        const fibs = [1, 2, 3, 5, 8, 13, 21, 34, 55, 89];
        const correct = fibs[Math.floor(Math.random() * fibs.length)];
        const options = [correct.toString()];
        while (options.length < 4) {
          const num = Math.floor(Math.random() * 90) + 1;
          if (!fibs.includes(num) && !options.includes(num.toString())) {
            options.push(num.toString());
          }
        }
        return { options: options.sort(() => Math.random() - 0.5), correct: options.indexOf(correct.toString()) };
      }
    },
    {
      id: 'multiple_of_7',
      name: 'Pick a MULTIPLE of 7',
      generator: () => {
        const correct = (Math.floor(Math.random() * 12) + 1) * 7;
        const options = [correct.toString()];
        while (options.length < 4) {
          const num = Math.floor(Math.random() * 85) + 1;
          if (num % 7 !== 0 && !options.includes(num.toString())) {
            options.push(num.toString());
          }
        }
        return { options: options.sort(() => Math.random() - 0.5), correct: options.indexOf(correct.toString()) };
      }
    }
  ];

  const rules = difficulty === 'easy' ? easyRules : difficulty === 'medium' ? mediumRules : hardRules;
  const availableRules = rules.filter(r => r.id !== currentRule);
  const rule = availableRules[Math.floor(Math.random() * availableRules.length)];
  const { options, correct } = rule.generator();

  return {
    question: rule.name,
    options,
    correct,
    rule: rule.id
  };
}

export function BrainMeltdown({ difficulty, onBack, onComplete }) {
  const [currentRule, setCurrentRule] = useState('');
  const [question, setQuestion] = useState(() => {
    const q = generateQuestionWithDifficulty('', difficulty);
    return q;
  });
  const [score, setScore] = useState(0);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [timeLeft, setTimeLeft] = useState(difficulty === 'easy' ? 90 : difficulty === 'medium' ? 75 : 60);
  const [feedback, setFeedback] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [showRuleChange, setShowRuleChange] = useState(false);

  useEffect(() => {
    if (timeLeft > 0 && !gameOver) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !gameOver) {
      setGameOver(true);
      onComplete('Brain Meltdown', score);
    }
  }, [timeLeft, gameOver, score, onComplete]);

  const handleAnswer = (index) => {
    const correct = index === question.correct;
    setIsCorrect(correct);
    
    if (correct) {
      const points = difficulty === 'easy' ? 8 : difficulty === 'medium' ? 12 : 16;
      setScore(score + points);
      setFeedback(sarcasticFeedback.correct[Math.floor(Math.random() * sarcasticFeedback.correct.length)]);
    } else {
      setFeedback(sarcasticFeedback.wrong[Math.floor(Math.random() * sarcasticFeedback.wrong.length)]);
    }

    setTimeout(() => {
      // Rule change frequency based on difficulty
      const changeThreshold = difficulty === 'easy' ? 0.4 : difficulty === 'medium' ? 0.6 : 0.75;
      const shouldChangeRule = Math.random() > changeThreshold;
      const newQuestion = generateQuestionWithDifficulty(shouldChangeRule ? '' : currentRule, difficulty);
      
      if (shouldChangeRule && newQuestion.rule !== currentRule) {
        setShowRuleChange(true);
        setFeedback(sarcasticFeedback.ruleChange[Math.floor(Math.random() * sarcasticFeedback.ruleChange.length)]);
        setCurrentRule(newQuestion.rule);
        
        setTimeout(() => {
          setShowRuleChange(false);
          setQuestion(newQuestion);
          setQuestionNumber(questionNumber + 1);
          setFeedback('');
          setIsCorrect(null);
        }, 2000);
      } else {
        setQuestion(newQuestion);
        setQuestionNumber(questionNumber + 1);
        setFeedback('');
        setIsCorrect(null);
      }
    }, 1500);
  };

  if (gameOver) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/10 backdrop-blur-md rounded-3xl p-8 max-w-md w-full text-center border border-white/20"
        >
          <Award className="w-20 h-20 text-orange-400 mx-auto mb-4" />
          <h2 className="text-4xl text-white mb-4">Brain Status: Melted</h2>
          <p className="text-2xl text-purple-200 mb-2">Final Score: {score}</p>
          <p className="text-lg text-purple-300 mb-6">
            {score > 120 ? 'You survived the chaos. Barely.' : score > 60 ? 'Not terrible. Your brain is only slightly fried.' : 'The rules defeated you. As expected.'}
          </p>
          <button
            onClick={onBack}
            className="px-6 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors"
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
          <div className={`flex items-center gap-2 ${timeLeft < 10 ? 'text-red-400 animate-pulse' : 'text-white'}`}>
            <Timer className="w-5 h-5" />
            <span className="text-xl font-bold">{timeLeft}s</span>
          </div>
          <div className="flex items-center gap-2 text-orange-400">
            <Award className="w-5 h-5" />
            <span className="text-xl font-bold">{score}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-2xl w-full">
          <AnimatePresence mode="wait">
            {showRuleChange ? (
              <motion.div
                key="rule-change"
                initial={{ opacity: 0, scale: 1.2, rotate: -5 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="bg-orange-500/20 backdrop-blur-md rounded-3xl p-12 border-4 border-orange-500"
              >
                <AlertTriangle className="w-20 h-20 text-orange-400 mx-auto mb-4 animate-pulse" />
                <h2 className="text-4xl text-white text-center mb-4">RULE CHANGE!</h2>
                <p className="text-xl text-orange-200 text-center">{feedback}</p>
              </motion.div>
            ) : (
              <motion.div
                key={questionNumber}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white/10 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-white/20"
              >
                <div className="text-center mb-8">
                  <p className="text-purple-300 mb-2">Question {questionNumber}</p>
                  <div className="inline-flex items-center gap-2 bg-orange-500/30 px-4 py-2 rounded-full mb-6">
                    <AlertTriangle className="w-4 h-4 text-orange-400" />
                    <h3 className="text-xl text-orange-200 font-semibold">{question.question}</h3>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  {question.options.map((option, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleAnswer(index)}
                      disabled={isCorrect !== null}
                      className={`p-6 rounded-2xl text-2xl font-bold transition-all ${
                        isCorrect === null
                          ? 'bg-white/20 hover:bg-white/30 text-white'
                          : index === question.correct
                          ? 'bg-green-500 text-white'
                          : 'bg-white/10 text-white/50'
                      }`}
                    >
                      {option}
                    </motion.button>
                  ))}
                </div>

                <AnimatePresence>
                  {feedback && !showRuleChange && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className={`mt-6 p-4 rounded-xl text-center font-medium ${
                        isCorrect === true
                          ? 'bg-green-500/20 text-green-200'
                          : 'bg-red-500/20 text-red-200'
                      }`}
                    >
                      {feedback}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}