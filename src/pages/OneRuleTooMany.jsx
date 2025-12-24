import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Timer, Award, X } from 'lucide-react';

const sarcasticFeedback = {
  correctRule: [
    "Finally. That rule was just here for decoration.",
    "Good. You filtered the noise. Took you long enough.",
    "Yes. That rule was doing absolutely nothing.",
    "Correct. One useless thought eliminated.",
    "Congrats. You ignored the obvious distraction."
  ],

  wrongRule: [
    "Impressive. You removed the only useful rule.",
    "Bold move. Wrong one.",
    "Congrats, you trusted the useless logic.",
    "That rule mattered. Your confidence didn’t.",
    "You eliminated logic. Amazing judgment."
  ],

  correctAnswer: [
    "Correct. Logic survived. Barely.",
    "Yes. That actually worked.",
    "Right answer. Don’t get comfortable.",
    "Correct. You didn’t mess it up this time.",
    "Well done. Suspiciously well done."
  ],

  wrongAnswer: [
    "Wrong. Even with the right rules.",
    "Math was simple. Thinking wasn’t.",
    "You had everything you needed. Still failed.",
    "Incorrect. This only made sense in your head.",
    "No. Try again, but maybe think first."
  ]
};


function generateProblem(difficulty) {
  const problems = [
    // Arithmetic sequence with useless rule
    () => {
      const start = Math.floor(Math.random() * 10) + 5;
      const diff = Math.floor(Math.random() * 4) + 2;
      const sequence = Array.from({ length: 4 }, (_, i) => start + i * diff);
      const answer = sequence[3] + diff;
      
      return {
        expression: `${sequence.join(', ')}, ?`,
        rules: [
          `Each number increases by ${diff}`,
          `All numbers must be positive`,
          `The sequence continues the same pattern`
        ],
        uselessRuleIndex: 1,
        answer,
        explanation: `The sequence increases by ${diff}. "All numbers must be positive" was irrelevant.`
      };
    },
    // Simple equation with useless rule
    () => {
      const a = Math.floor(Math.random() * 10) + 5;
      const b = Math.floor(Math.random() * 10) + 5;
      const answer = a + b;
      
      return {
        expression: `x + ${b} = ${answer}`,
        rules: [
          `Solve for x`,
          `x must be a whole number`,
          `Subtract ${b} from both sides`
        ],
        uselessRuleIndex: 1,
        answer: a,
        explanation: `x = ${a}. The rule "x must be a whole number" was redundant.`
      };
    },
    // Multiplication pattern
    () => {
      const base = Math.floor(Math.random() * 3) + 2;
      const mult = 2;
      const sequence = Array.from({ length: 4 }, (_, i) => base * Math.pow(mult, i));
      const answer = sequence[3] * mult;
      
      return {
        expression: `${sequence.join(', ')}, ?`,
        rules: [
          `Each number is double the previous`,
          `Numbers are in ascending order`,
          `Continue the pattern`
        ],
        uselessRuleIndex: 1,
        answer,
        explanation: `The sequence doubles each time. "Numbers are in ascending order" was unnecessary.`
      };
    },
    // Division problem
    () => {
      const divisor = Math.floor(Math.random() * 5) + 3;
      const result = Math.floor(Math.random() * 10) + 5;
      const dividend = divisor * result;
      
      return {
        expression: `${dividend} ÷ ? = ${result}`,
        rules: [
          `Find the missing divisor`,
          `The answer must be an integer`,
          `Divide ${dividend} by ${result} to check`
        ],
        uselessRuleIndex: 1,
        answer: divisor,
        explanation: `The divisor is ${divisor}. "The answer must be an integer" was obvious.`
      };
    },
    // Square sequence
    () => {
      const start = Math.floor(Math.random() * 3) + 2;
      const sequence = Array.from({ length: 3 }, (_, i) => Math.pow(start + i, 2));
      const answer = Math.pow(start + 3, 2);
      
      return {
        expression: `${sequence.join(', ')}, ?`,
        rules: [
          `Each number is a perfect square`,
          `Numbers increase from left to right`,
          `The pattern is consecutive squares`
        ],
        uselessRuleIndex: 1,
        answer,
        explanation: `The sequence is consecutive perfect squares. "Numbers increase" was redundant.`
      };
    }
  ];

  // Hard mode: more complex problems
  if (difficulty === 'hard') {
    const hardProblems = [
      ...problems,
      () => {
        const a = Math.floor(Math.random() * 8) + 3;
        const b = Math.floor(Math.random() * 8) + 3;
        const answer = a * b;
        
        return {
          expression: `x × ${b} = ${answer}`,
          rules: [
            `Solve for x by dividing both sides by ${b}`,
            `x is less than ${answer}`,
            `The equation must balance`
          ],
          uselessRuleIndex: 2,
          answer: a,
          explanation: `x = ${a}. "The equation must balance" is always true and thus useless.`
        };
      },
      () => {
        const start = Math.floor(Math.random() * 5) + 10;
        const diff = Math.floor(Math.random() * 6) + 4;
        const sequence = [start, start + diff, start + diff * 2];
        const answer = start + diff * 3;
        
        return {
          expression: `${sequence.join(', ')}, ?`,
          rules: [
            `The difference between consecutive terms is ${diff}`,
            `All terms are greater than 0`,
            `Add ${diff} to the last term`
          ],
          uselessRuleIndex: 1,
          answer,
          explanation: `The arithmetic sequence adds ${diff} each time. "Greater than 0" was unnecessary.`
        };
      }
    ];
    return hardProblems[Math.floor(Math.random() * hardProblems.length)]();
  }

  return problems[Math.floor(Math.random() * problems.length)]();
}

export function OneRuleTooMany({ difficulty, onBack, onComplete }) {
  const [problem, setProblem] = useState(generateProblem(difficulty));
  const [removedRuleIndex, setRemovedRuleIndex] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [timeLeft, setTimeLeft] = useState(difficulty === 'easy' ? 180 : difficulty === 'medium' ? 150 : 120);
  const [feedback, setFeedback] = useState('');
  const [step, setStep] = useState('removeRule');
  const [ruleCorrect, setRuleCorrect] = useState(null);
  const [answerCorrect, setAnswerCorrect] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (timeLeft > 0 && !gameOver) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !gameOver) {
      setGameOver(true);
      onComplete('One Rule Too Many', score);
    }
  }, [timeLeft, gameOver, score, onComplete]);

  const handleRuleRemove = (index) => {
    if (removedRuleIndex !== null || step !== 'removeRule') return;
    
    setRemovedRuleIndex(index);
    const correct = index === problem.uselessRuleIndex;
    setRuleCorrect(correct);
    
    if (correct) {
      setFeedback(sarcasticFeedback.correctRule[Math.floor(Math.random() * sarcasticFeedback.correctRule.length)]);
      setTimeout(() => {
        setStep('solveAnswer');
        setFeedback('');
      }, 1500);
    } else {
      setFeedback(sarcasticFeedback.wrongRule[Math.floor(Math.random() * sarcasticFeedback.wrongRule.length)]);
      setTimeout(() => {
        nextProblem();
      }, 2500);
    }
  };

  const handleAnswerSubmit = (e) => {
    e.preventDefault();
    const answer = parseInt(userAnswer);
    
    if (isNaN(answer) || step !== 'solveAnswer') return;

    const correct = answer === problem.answer;
    setAnswerCorrect(correct);
    
    if (correct) {
      const points = difficulty === 'easy' ? 20 : difficulty === 'medium' ? 25 : 35;
      setScore(score + points);
      setFeedback(sarcasticFeedback.correctAnswer[Math.floor(Math.random() * sarcasticFeedback.correctAnswer.length)]);
    } else {
      setFeedback(sarcasticFeedback.wrongAnswer[Math.floor(Math.random() * sarcasticFeedback.wrongAnswer.length)]);
    }

    setTimeout(() => {
      nextProblem();
    }, 2500);
  };

  const nextProblem = () => {
    setProblem(generateProblem(difficulty));
    setQuestionNumber(questionNumber + 1);
    setRemovedRuleIndex(null);
    setUserAnswer('');
    setFeedback('');
    setStep('removeRule');
    setRuleCorrect(null);
    setAnswerCorrect(null);
  };

  if (gameOver) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/10 backdrop-blur-md rounded-3xl p-8 max-w-md w-full text-center border border-white/20"
        >
          <Award className="w-20 h-20 text-teal-400 mx-auto mb-4" />
          <h2 className="text-4xl text-white mb-4">Session Terminated</h2>
          <p className="text-2xl text-purple-200 mb-2">Final Score: {score}</p>
          <p className="text-lg text-purple-300 mb-6">
            {score > 100 ? 'You can filter noise from signal. Acceptable performance.' : 'Too many rules confused you. Predictable.'}
          </p>
          <button
            onClick={onBack}
            className="px-6 py-3 bg-grey-500 text-white rounded-full hover:bg-teal-600 transition-colors"
          >
            Exit Protocol
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
            <span className="text-xl ">{score}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-3xl w-full">
          <motion.div
            key={questionNumber}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/10 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-white/20"
          >
            <div className="text-center mb-8">
              <p className="text-purple-300 mb-4">Problem {questionNumber}</p>
              <h3 className="text-2xl text-purple-200 mb-2">
                {step === 'removeRule' ? 'Remove the useless rule' : 'Solve the problem'}
              </h3>
            </div>

            <div className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-teal-500/20 to-cyan-500/20 border border-teal-400/30">
              <p className="text-3xl text-white text-center">{problem.expression}</p>
            </div>

            {step === 'removeRule' && (
              <div className="space-y-4 mb-6">
                {problem.rules.map((rule, index) => {
                  const isRemoved = removedRuleIndex === index;
                  const isUseless = index === problem.uselessRuleIndex;
                  const showResult = removedRuleIndex !== null;
                  
                  return (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ 
                        opacity: isRemoved && !ruleCorrect ? 0.3 : 1,
                        x: 0 
                      }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => handleRuleRemove(index)}
                      disabled={removedRuleIndex !== null}
                      className={`
                        w-full p-4 rounded-xl text-left transition-all
                        ${isRemoved && ruleCorrect
                          ? 'bg-green-500/20 text-green-200 border-2 border-green-400'
                          : isRemoved && !ruleCorrect
                          ? 'bg-red-500/20 text-red-200 border-2 border-red-400'
                          : 'bg-white/10 text-white border border-white/30 hover:border-teal-400 hover:bg-white/20'
                        }
                        disabled:cursor-default
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <span>{rule}</span>
                        {isRemoved && (
                          <X className="w-5 h-5 flex-shrink-0 ml-2" />
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            )}

            {step === 'solveAnswer' && (
              <form onSubmit={handleAnswerSubmit} className="space-y-6">
                <div className="space-y-4 mb-6">
                  {problem.rules.map((rule, index) => {
                    const isRemoved = removedRuleIndex === index;
                    
                    return (
                      <div
                        key={index}
                        className={`
                          p-4 rounded-xl text-left transition-all
                          ${isRemoved
                            ? 'bg-white/5 text-purple-400 opacity-40 line-through'
                            : 'bg-teal-500/20 text-teal-200 border border-teal-400/30'
                          }
                        `}
                      >
                        {rule}
                      </div>
                    );
                  })}
                </div>

                <input
                  type="number"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  disabled={answerCorrect !== null}
                  placeholder="Enter your answer"
                  className="w-full p-4 rounded-xl bg-white/20 text-white text-center text-2xl placeholder-white/50 border border-white/30 focus:border-teal-400 focus:outline-none disabled:opacity-50"
                  autoFocus
                />

                <button
                  type="submit"
                  disabled={!userAnswer || answerCorrect !== null}
                  className="w-full py-4 bg-teal-500 text-white rounded-xl hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Answer
                </button>
              </form>
            )}

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
                      (ruleCorrect === true || answerCorrect === true)
                        ? 'bg-green-500/20 text-green-200'
                        : 'bg-red-500/20 text-red-200'
                    }`}
                  >
                    {feedback}
                  </div>
                  {(ruleCorrect === false || answerCorrect === false) && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="p-4 rounded-xl bg-blue-500/20 text-blue-200 text-sm text-center"
                    >
                      {problem.explanation}
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