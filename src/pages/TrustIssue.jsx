import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Timer, Award, ShieldAlert } from 'lucide-react';

const sarcasticFeedback = {
  correct: [
    "Correct. You didn’t fall for it. Miracles happen.",
    "Right. Skepticism finally decided to clock in.",
    "Correct. You questioned it. Congrats on adulting for a second.",
    "Yes. Trust issues: actually useful for once.",
    "Right answer. Math didn’t trick you this time… lucky you."
  ],
  wrong: [
    "Wrong. You actually believed that? Wow.",
    "Nope. That was the lie. Hard to miss, really.",
    "Incorrect. Blind trust—bold choice, bold mistake.",
    "Wrong. Your inner skeptic clearly went on vacation.",
    "No. Start questioning everything… starting with yourself."
  ]
};



function generateQuestion() {
  const questions = [
    {
      statement: 'All prime numbers are odd',
      isTrue: false,
      explanation: '2 is prime and even. Nice try though.'
    },
    {
      statement: 'The sum of any two even numbers is always even',
      isTrue: true,
      explanation: 'Even + Even = Even. Basic stuff.'
    },
    {
      statement: 'Zero is neither positive nor negative',
      isTrue: true,
      explanation: 'Zero is special like that.'
    },
    {
      statement: 'A square is always a rectangle',
      isTrue: true,
      explanation: 'All squares are rectangles, but not all rectangles are squares.'
    },
    {
      statement: 'Pi equals exactly 22/7',
      isTrue: false,
      explanation: '22/7 is just an approximation. Pi is irrational.'
    },
    {
      statement: 'The product of any number and zero is zero',
      isTrue: true,
      explanation: 'Anything times zero equals zero. Math 101.'
    },
    {
      statement: 'All triangles have at least two acute angles',
      isTrue: true,
      explanation: 'The angles in a triangle sum to 180°, so at least two must be acute.'
    },
    {
      statement: 'A negative number multiplied by a negative number gives a negative result',
      isTrue: false,
      explanation: 'Negative × Negative = Positive. Two wrongs DO make a right in math.'
    },
    {
      statement: 'Every integer is a rational number',
      isTrue: true,
      explanation: 'Integers can be expressed as fractions (n/1), making them rational.'
    },
    {
      statement: 'The square root of 16 is always 4',
      isTrue: false,
      explanation: 'It could be -4 too. Both work when squared.'
    },
    {
      statement: 'A parallelogram always has four right angles',
      isTrue: false,
      explanation: 'That would be a rectangle. Not all parallelograms are rectangles.'
    },
    {
      statement: 'The number 1 is considered a prime number',
      isTrue: false,
      explanation: '1 is not prime. Prime numbers must have exactly two distinct divisors.'
    },
    {
      statement: 'An obtuse angle is greater than 90 degrees',
      isTrue: true,
      explanation: 'Obtuse angles are between 90° and 180°.'
    },
    {
      statement: 'All rhombuses are squares',
      isTrue: false,
      explanation: 'All squares are rhombuses, but rhombuses don\'t need right angles.'
    },
    {
      statement: 'The sum of angles in any quadrilateral is 360 degrees',
      isTrue: true,
      explanation: 'Any four-sided shape has angles that sum to 360°.'
    }
  ];

  return questions[Math.floor(Math.random() * questions.length)];
}

function generateQuestionWithDifficulty(difficulty) {
  const easyQuestions = [
    {
      statement: 'The sum of any two even numbers is always even',
      isTrue: true,
      explanation: 'Even + Even = Even. Basic stuff.'
    },
    {
      statement: 'Zero is neither positive nor negative',
      isTrue: true,
      explanation: 'Zero is special like that.'
    },
    {
      statement: 'A square is always a rectangle',
      isTrue: true,
      explanation: 'All squares are rectangles, but not all rectangles are squares.'
    },
    {
      statement: 'The product of any number and zero is zero',
      isTrue: true,
      explanation: 'Anything times zero equals zero. Math 101.'
    },
    {
      statement: 'An obtuse angle is greater than 90 degrees',
      isTrue: true,
      explanation: 'Obtuse angles are between 90° and 180°.'
    }
  ];

  const mediumQuestions = [
    ...easyQuestions,
    {
      statement: 'All prime numbers are odd',
      isTrue: false,
      explanation: '2 is prime and even. Nice try though.'
    },
    {
      statement: 'Pi equals exactly 22/7',
      isTrue: false,
      explanation: '22/7 is just an approximation. Pi is irrational.'
    },
    {
      statement: 'A negative number multiplied by a negative number gives a negative result',
      isTrue: false,
      explanation: 'Negative × Negative = Positive. Two wrongs DO make a right in math.'
    },
    {
      statement: 'All rhombuses are squares',
      isTrue: false,
      explanation: 'All squares are rhombuses, but rhombuses don\'t need right angles.'
    }
  ];

  const hardQuestions = [
    ...mediumQuestions,
    {
      statement: 'All triangles have at least two acute angles',
      isTrue: true,
      explanation: 'The angles in a triangle sum to 180°, so at least two must be acute.'
    },
    {
      statement: 'Every integer is a rational number',
      isTrue: true,
      explanation: 'Integers can be expressed as fractions (n/1), making them rational.'
    },
    {
      statement: 'The square root of 16 is always 4',
      isTrue: false,
      explanation: 'It could be -4 too. Both work when squared.'
    },
    {
      statement: 'A parallelogram always has four right angles',
      isTrue: false,
      explanation: 'That would be a rectangle. Not all parallelograms are rectangles.'
    },
    {
      statement: 'The number 1 is considered a prime number',
      isTrue: false,
      explanation: '1 is not prime. Prime numbers must have exactly two distinct divisors.'
    },
    {
      statement: 'The sum of angles in any quadrilateral is 360 degrees',
      isTrue: true,
      explanation: 'Any four-sided shape has angles that sum to 360°.'
    }
  ];

  const questions = difficulty === 'easy' ? easyQuestions : difficulty === 'medium' ? mediumQuestions : hardQuestions;
  return questions[Math.floor(Math.random() * questions.length)];
}

export function TrustIssue({ difficulty, onBack, onComplete }) {
  const [question, setQuestion] = useState(generateQuestionWithDifficulty(difficulty));
  const [score, setScore] = useState(0);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [timeLeft, setTimeLeft] = useState(difficulty === 'easy' ? 90 : difficulty === 'medium' ? 60 : 45);
  const [feedback, setFeedback] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (timeLeft > 0 && !gameOver) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !gameOver) {
      setGameOver(true);
      onComplete('Trust Issue', score);
    }
  }, [timeLeft, gameOver, score, onComplete]);

  const handleAnswer = (answer) => {
    const correct = answer === question.isTrue;
    setIsCorrect(correct);
    setShowExplanation(true);
    
    if (correct) {
      const points = difficulty === 'easy' ? 8 : difficulty === 'medium' ? 10 : 15;
      setScore(score + points);
      setFeedback(sarcasticFeedback.correct[Math.floor(Math.random() * sarcasticFeedback.correct.length)]);
    } else {
      setFeedback(sarcasticFeedback.wrong[Math.floor(Math.random() * sarcasticFeedback.wrong.length)]);
    }

    setTimeout(() => {
      setQuestion(generateQuestionWithDifficulty(difficulty));
      setQuestionNumber(questionNumber + 1);
      setFeedback('');
      setIsCorrect(null);
      setShowExplanation(false);
    }, 3000);
  };

  if (gameOver) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/10 backdrop-blur-md rounded-3xl p-8 max-w-md w-full text-center border border-white/20"
        >
          <Award className="w-20 h-20 text-green-400 mx-auto mb-4" />
          <h2 className="text-4xl text-white mb-4">Trust Level: Depleted</h2>
          <p className="text-2xl text-purple-200 mb-2">Final Score: {score}</p>
          <p className="text-lg text-purple-300 mb-6">
            {score > 60 ? 'You can spot deception! Healthy skepticism at work.' : 'Maybe you\'re a bit too trusting?'}
          </p>
          <button
            onClick={onBack}
            className="px-6 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
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
          <div className="flex items-center gap-2 text-green-400">
            <Award className="w-5 h-5" />
            <span className="text-xl">{score}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-2xl w-full">
          <motion.div
            key={questionNumber}
            initial={{ opacity: 0, rotateY: 90 }}
            animate={{ opacity: 1, rotateY: 0 }}
            className="bg-white/10 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-white/20"
          >
            <div className="text-center mb-8">
              <p className="text-purple-300 mb-4">Statement {questionNumber}</p>
              <ShieldAlert className="w-16 h-16 text-green-400 mx-auto mb-6" />
              <h2 className="text-2xl md:text-3xl text-white mb-6 leading-relaxed">
                {question.statement}
              </h2>
              <p className="text-purple-200">Is this TRUE or FALSE?</p>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAnswer(true)}
                disabled={isCorrect !== null}
                className={`p-8 rounded-2xl text-2xl transition-all ${
                  isCorrect === null
                    ? 'bg-green-500/30 hover:bg-green-500/50 text-white border-2 border-green-500'
                    : question.isTrue
                    ? 'bg-green-500 text-white border-2 border-green-400'
                    : 'bg-white/10 text-white/50 border-2 border-white/20'
                }`}
              >
                TRUE
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAnswer(false)}
                disabled={isCorrect !== null}
                className={`p-8 rounded-2xl text-2xl transition-all ${
                  isCorrect === null
                    ? 'bg-red-500/30 hover:bg-red-500/50 text-white border-2 border-red-500'
                    : !question.isTrue
                    ? 'bg-red-500 text-white border-2 border-red-400'
                    : 'bg-white/10 text-white/50 border-2 border-white/20'
                }`}
              >
                FALSE
              </motion.button>
            </div>

            <AnimatePresence>
              {feedback && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-4"
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
                      transition={{ delay: 0.3 }}
                      className="p-4 rounded-xl bg-blue-500/20 text-blue-200 text-center"
                    >
                      {question.explanation}
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