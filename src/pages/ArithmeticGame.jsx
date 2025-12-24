import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Timer, Award, Lightbulb } from 'lucide-react';

const sarcasticFeedback = {
  correct: [
    'Oh wow, you got it right. Stop the presses!',
    'Correct! I’m shaking with excitement over your math skills.',
    'You nailed it! I guess miracles do happen.',
    'Right answer! Should I alert the Nobel committee?',
    'Correct! Someone call the history books.'
  ],
  wrong: [
    'Wrong. Did you even try, or was that interpretive math?',
    'Incorrect. Don’t worry, math hates you too.',
    'Nope. You might have better luck guessing lottery numbers.',
    'Wrong answer. It’s okay, the numbers forgive you.',
    'Incorrect. Maybe stick to counting sheep instead.'
  ],
  hint: [
    'Hint: Try using your brain… if it’s charged.',
    'Hint: The answer is hiding somewhere in plain sight. Good luck!',
    'Hint: Think. Not too hard, don’t strain yourself.',
    'Hint: You could guess. Or actually think. Your call.',
    'Hint: Math rules apply. Sadly, life rules might not.'
  ]
};


function generateQuestion() {
  const operations = ['+', '-', '×', '÷'];
  const op = operations[Math.floor(Math.random() * operations.length)];
  
  let num1, num2, correct;
  
  switch (op) {
    case '+':
      num1 = Math.floor(Math.random() * 50) + 1;
      num2 = Math.floor(Math.random() * 50) + 1;
      correct = num1 + num2;
      break;
    case '-':
      num1 = Math.floor(Math.random() * 50) + 20;
      num2 = Math.floor(Math.random() * (num1 - 1)) + 1;
      correct = num1 - num2;
      break;
    case '×':
      num1 = Math.floor(Math.random() * 12) + 1;
      num2 = Math.floor(Math.random() * 12) + 1;
      correct = num1 * num2;
      break;
    case '÷':
      num2 = Math.floor(Math.random() * 10) + 2;
      correct = Math.floor(Math.random() * 12) + 1;
      num1 = num2 * correct;
      break;
    default:
      num1 = 0;
      num2 = 0;
      correct = 0;
  }
  
  const options = [correct];
  while (options.length < 4) {
    const offset = Math.floor(Math.random() * 20) - 10;
    const option = correct + offset;
    if (option > 0 && !options.includes(option)) {
      options.push(option);
    }
  }
  
  options.sort(() => Math.random() - 0.5);
  
  return {
    question: `${num1} ${op} ${num2} = ?`,
    options,
    correct
  };
}

function generateQuestionWithDifficulty(difficulty) {
  const operations = ['+', '-', '×', '÷'];
  const op = operations[Math.floor(Math.random() * operations.length)];
  
  let num1, num2, correct;
  let maxRange;
  let minRange;
  
  switch (difficulty) {
    case 'easy':
      minRange = 1;
      maxRange = 100;
      break;
    case 'medium':
      minRange = 50;
      maxRange = 200;
      break;
    case 'hard':
      minRange = 200;
      maxRange = 1000;
      break;
  }
  
  switch (op) {
    case '+':
      num1 = Math.floor(Math.random() * (maxRange - minRange +1)) + minRange ;
      num2 = Math.floor(Math.random() * (maxRange - minRange +1)) + minRange ;
      correct = num1 + num2;
      break;
    case '-':
      num1 = Math.floor(Math.random() * (maxRange - minRange +1)) + minRange + difficulty === 'easy' ? 10 : 20;
      num2 = Math.floor(Math.random() * (num1 - 1)) + 1;
      correct = num1 - num2;
      break;
    case '×':
const multMax =
  difficulty === 'easy' ? 20 :
  difficulty === 'medium' ? 50 :
  100;
      num1 = Math.floor(Math.random() * multMax) + 1;
      num2 = Math.floor(Math.random() * multMax) + 1;
      correct = num1 * num2;
      break;
    case '÷':
      const divMax = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 50 : 100;
      num2 = Math.floor(Math.random() * divMax) + 2;
      correct = Math.floor(Math.random() * (difficulty === 'easy' ? 10 : 12)) + 1;
      num1 = num2 * correct;
      break;
    default:
      num1 = 0;
      num2 = 0;
      correct = 0;
  }
  
  const options = [correct];
  const offsetRange = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 20 : 30;
  while (options.length < 4) {
    const offset = Math.floor(Math.random() * offsetRange) - Math.floor(offsetRange / 2);
    const option = correct + offset;
    if (option > 0 && !options.includes(option)) {
      options.push(option);
    }
  }
  
  options.sort(() => Math.random() - 0.5);
  
  return {
    question: `${num1} ${op} ${num2} = ?`,
    options,
    correct
  };
}

export function ArithmeticGame({ difficulty, onBack, onComplete }) {
  const [question, setQuestion] = useState(generateQuestionWithDifficulty(difficulty));
  const [score, setScore] = useState(0);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [timeLeft, setTimeLeft] = useState(difficulty === 'easy' ? 90 : difficulty === 'medium' ? 60 : 45);
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
      onComplete('Arithmetic Game', score);
    }
  }, [timeLeft, gameOver, score, onComplete]);

  const handleAnswer = (answer) => {
    const correct = answer === question.correct;
    setIsCorrect(correct);
    
    if (correct) {
      const points = difficulty === 'easy' ? 5 : difficulty === 'medium' ? 10 : 15;
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
      setShowHint(false);
    }, 1500);
  };

  const handleHint = () => {
    setShowHint(true);
    setFeedback(sarcasticFeedback.hint[Math.floor(Math.random() * sarcasticFeedback.hint.length)]);
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
          <h2 className="text-4xl text-white mb-4">Time's Up!</h2>
          <p className="text-2xl text-purple-200 mb-2">Final Score: {score}</p>
          <p className="text-lg text-purple-300 mb-6">
            {score > 100 ? 'Not terrible. You might actually know some math.' : 'Well... at least you showed up.'}
          </p>
          <button
            onClick={onBack}
            className="px-6 py-3 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-colors"
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
          <div className="flex items-center gap-2 text-yellow-400">
            <Award className="w-5 h-5" />
            <span className="text-xl">{score}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-2xl w-full">
          <motion.div
            key={questionNumber}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/10 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-white/20"
          >
            <div className="text-center mb-8">
              <p className="text-purple-300 mb-4">Question {questionNumber}</p>
              <h2 className="text-4xl md:text-6xl text-white">{question.question}</h2>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              {question.options.map((option, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAnswer(option)}
                  disabled={isCorrect !== null}
                  className={`p-6 rounded-2xl text-2xl transition-all ${
                    isCorrect === null
                      ? 'bg-white/20 hover:bg-white/30 text-white'
                      : option === question.correct
                      ? 'bg-green-500 text-white'
                      : 'bg-white/10 text-white/50'
                  }`}
                >
                  {option}
                </motion.button>
              ))}
            </div>

            <button
              onClick={handleHint}
              disabled={showHint || isCorrect !== null}
              className="flex items-center gap-2 mx-auto px-4 py-2 bg-white/10 text-purple-300 rounded-full hover:bg-white/20 transition-colors disabled:opacity-50"
            >
              <Lightbulb className="w-4 h-4" />
              Need a hint? (Of course you do)
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
