import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Timer, Award, AlertTriangle } from 'lucide-react';

const sarcasticFeedback = {
  correct: [
    'Oh wow, you got one right. Don\'t let it go to your head.',
    'Correct! Apparently you CAN read. Revolutionary.',
    'Right! Even a broken clock is right twice a day.',
    'You got it! Did you... actually think about it this time?',
    'Correct! Quick, buy a lottery ticket before your luck runs out.',
    'Right answer! Was it skill or just random clicking? We may never know.',
    'You spotted the lie! Too bad real life doesn\'t have answer choices.',
    'Correct! Give yourself a participation trophy.',
    'Right! Somewhere, a geometry teacher is mildly impressed.',
    'You got it! I almost had to say something nice to you there.'
  ],
  wrong: [
    'Wrong. Geometry isn\'t even the hard part. Basic observation is.',
    'Nope. The broken rule was RIGHT THERE. How did you miss it?',
    'Incorrect. Did you close your eyes and point at the screen?',
    'Wrong. This is embarrassing for both of us, honestly.',
    'Nope. Were you even trying or just vibing?',
    'Incorrect. The shape literally doesn\'t follow the rules. Come on.',
    'Wrong. I\'ve seen house plants make better decisions.',
    'Nope. At this point I\'m concerned about your critical thinking skills.',
    'Incorrect. Did you learn geometry from a fortune cookie?',
    'Wrong. Even random guessing should work 25% of the time.',
    'Nope. That was painful to watch. Truly painful.',
    'Incorrect. The answer was mathematically impossible. Yet here we are.'
  ],
  hint: [
    'Hint: One geometric rule is broken. Use your brain, it\'s free.',
    'Hint: Something here violates basic geometry. Try looking harder.',
    'Hint: What should be mathematically impossible? That\'s your clue.',
    'Hint: Trust nothing. Especially not your first answer, apparently.',
    'Hint: One of these numbers is lying to you. Find the liar.',
    'Hint: Math doesn\'t work like this in reality. That\'s the point.'
  ]
};

function generateProblem(difficulty) {
  const problems = [
    // Triangle with angles that don't sum to 180°
    () => {
      const angle1 = Math.floor(Math.random() * 40) + 30;
      const angle2 = Math.floor(Math.random() * 40) + 40;
      const brokenAngle3 = Math.floor(Math.random() * 50) + 70;
      const correctAngle3 = 180 - angle1 - angle2;
      
      return {
        type: 'triangle-angles',
        shape: 'Triangle',
        given: `Angles: ${angle1}°, ${angle2}°, ?`,
        brokenRule: 'Triangle angles don\'t sum to 180°',
        question: 'What is the third angle?',
        correctAnswer: correctAngle3,
        options: [correctAngle3, brokenAngle3, angle1 + 10, angle2 + 15],
        explanation: `In a normal triangle, angles sum to 180°. The correct angle is ${correctAngle3}°, not ${brokenAngle3}°.`,
        svgShape: (
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <polygon points="100,40 40,160 160,160" fill="none" stroke="white" strokeWidth="2" />
            <text x="100" y="30" fill="white" fontSize="14" textAnchor="middle">{angle1}°</text>
            <text x="30" y="175" fill="white" fontSize="14" textAnchor="middle">{angle2}°</text>
            <text x="170" y="175" fill="white" fontSize="14" textAnchor="middle">?</text>
          </svg>
        )
      };
    },
    
    // Square with sides that don't match
    () => {
      const side1 = Math.floor(Math.random() * 10) + 5;
      const brokenSide = side1 + Math.floor(Math.random() * 3) + 1;
      
      return {
        type: 'square-sides',
        shape: 'Square',
        given: `Three sides: ${side1}, ${side1}, ${side1}`,
        brokenRule: 'Not all sides are equal',
        question: 'What is the fourth side?',
        correctAnswer: side1,
        options: [side1, brokenSide, side1 * 2, side1 - 1],
        explanation: `A square must have all equal sides. The fourth side should be ${side1}, even though the shape might suggest otherwise.`,
        svgShape: (
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <rect x="50" y="50" width="100" height="100" fill="none" stroke="white" strokeWidth="2" />
            <text x="100" y="45" fill="white" fontSize="14" textAnchor="middle">{side1}</text>
            <text x="155" y="100" fill="white" fontSize="14" textAnchor="start">{side1}</text>
            <text x="100" y="170" fill="white" fontSize="14" textAnchor="middle">{side1}</text>
            <text x="40" y="100" fill="white" fontSize="14" textAnchor="end">?</text>
          </svg>
        )
      };
    },
    
    // Circle with wrong area formula
    () => {
      const radius = Math.floor(Math.random() * 5) + 3;
      const correctArea = Math.round(Math.PI * radius * radius);
      const brokenArea = Math.round(2 * Math.PI * radius);
      
      return {
        type: 'circle-area',
        shape: 'Circle',
        given: `Radius: ${radius}`,
        brokenRule: 'Area formula is actually circumference',
        question: 'What is the area?',
        correctAnswer: correctArea,
        options: [correctArea, brokenArea, radius * radius, Math.round(Math.PI * radius)],
        explanation: `The correct area formula is πr². Area = ${correctArea}, not ${brokenArea} (which is circumference).`,
        svgShape: (
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="100" cy="100" r="60" fill="none" stroke="white" strokeWidth="2" />
            <line x1="100" y1="100" x2="160" y2="100" stroke="white" strokeWidth="1" strokeDasharray="4" />
            <text x="130" y="95" fill="white" fontSize="14" textAnchor="middle">r={radius}</text>
            <text x="100" y="180" fill="white" fontSize="14" textAnchor="middle">Area = ?</text>
          </svg>
        )
      };
    },
    
    // Rectangle with wrong perimeter
    () => {
      const length = Math.floor(Math.random() * 8) + 6;
      const width = Math.floor(Math.random() * 5) + 3;
      const correctPerimeter = 2 * (length + width);
      const brokenPerimeter = length + width;
      
      return {
        type: 'rectangle-perimeter',
        shape: 'Rectangle',
        given: `Length: ${length}, Width: ${width}`,
        brokenRule: 'Perimeter formula is missing multiplication',
        question: 'What is the perimeter?',
        correctAnswer: correctPerimeter,
        options: [correctPerimeter, brokenPerimeter, length * width, length + width + 10],
        explanation: `Perimeter = 2(l + w) = ${correctPerimeter}, not just ${brokenPerimeter}.`,
        svgShape: (
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <rect x="40" y="70" width="120" height="60" fill="none" stroke="white" strokeWidth="2" />
            <text x="100" y="65" fill="white" fontSize="14" textAnchor="middle">{length}</text>
            <text x="165" y="100" fill="white" fontSize="14" textAnchor="start">{width}</text>
            <text x="100" y="150" fill="white" fontSize="14" textAnchor="middle">Perimeter = ?</text>
          </svg>
        )
      };
    },
    
    // Parallel lines that aren't actually parallel
    () => {
      const angle1 = Math.floor(Math.random() * 30) + 50;
      const brokenAngle2 = angle1 + Math.floor(Math.random() * 15) + 5;
      
      return {
        type: 'parallel-lines',
        shape: 'Parallel Lines',
        given: `Angle 1: ${angle1}°`,
        brokenRule: 'Corresponding angles are not equal',
        question: 'What should Angle 2 be if lines are parallel?',
        correctAnswer: angle1,
        options: [angle1, brokenAngle2, 180 - angle1, 90],
        explanation: `If lines are truly parallel, corresponding angles must be equal: ${angle1}°.`,
        svgShape: (
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <line x1="20" y1="60" x2="180" y2="60" stroke="white" strokeWidth="2" />
            <line x1="20" y1="120" x2="180" y2="120" stroke="white" strokeWidth="2" />
            <line x1="70" y1="20" x2="130" y2="180" stroke="white" strokeWidth="2" />
            <text x="90" y="50" fill="white" fontSize="14">{angle1}°</text>
            <text x="110" y="135" fill="white" fontSize="14">?</text>
          </svg>
        )
      };
    },
    
    // Pentagon with wrong angle sum
    () => {
      const knownAngles = [108, 110, 105, 112];
      const correctAngle = 540 - knownAngles.reduce((a, b) => a + b, 0);
      const brokenAngle = 360 - knownAngles.reduce((a, b) => a + b, 0);
      
      return {
        type: 'pentagon-angles',
        shape: 'Pentagon',
        given: `Four angles: ${knownAngles.join('°, ')}°`,
        brokenRule: 'Using wrong angle sum (360° instead of 540°)',
        question: 'What is the fifth angle?',
        correctAnswer: correctAngle,
        options: [correctAngle, brokenAngle, 108, 72],
        explanation: `Pentagon angles sum to 540°. The fifth angle is ${correctAngle}°, not ${brokenAngle}°.`,
        svgShape: (
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <polygon points="100,40 170,80 150,150 50,150 30,80" fill="none" stroke="white" strokeWidth="2" />
            <text x="100" y="35" fill="white" fontSize="12" textAnchor="middle">{knownAngles[0]}°</text>
            <text x="175" y="85" fill="white" fontSize="12">{knownAngles[1]}°</text>
            <text x="155" y="155" fill="white" fontSize="12">{knownAngles[2]}°</text>
            <text x="45" y="155" fill="white" fontSize="12">{knownAngles[3]}°</text>
            <text x="20" y="85" fill="white" fontSize="12">?</text>
          </svg>
        )
      };
    }
  ];

  if (difficulty === 'hard') {
    const hardProblems = [
      ...problems,
      () => {
        const rectW = 10, rectH = 6;
        const triBase = 10, triHeight = 4;
        const correctArea = rectW * rectH + (triBase * triHeight) / 2;
        const brokenArea = rectW * rectH;
        
        return {
          type: 'composite-area',
          shape: 'Composite Shape',
          given: `Rectangle: ${rectW}×${rectH}, Triangle: base ${triBase}, height ${triHeight}`,
          brokenRule: 'Missing triangle area in composite',
          question: 'What is the total area?',
          correctAnswer: correctArea,
          options: [correctArea, brokenArea, rectW * rectH + triBase * triHeight, 100],
          explanation: `Total area = rectangle + triangle = ${rectW * rectH} + ${(triBase * triHeight) / 2} = ${correctArea}.`,
          svgShape: (
            <svg viewBox="0 0 200 200" className="w-full h-full">
              <rect x="50" y="80" width="100" height="60" fill="none" stroke="white" strokeWidth="2" />
              <polygon points="50,80 100,40 150,80" fill="none" stroke="white" strokeWidth="2" />
              <text x="100" y="170" fill="white" fontSize="14" textAnchor="middle">Total Area = ?</text>
            </svg>
          )
        };
      }
    ];
    return hardProblems[Math.floor(Math.random() * hardProblems.length)]();
  }

  return problems[Math.floor(Math.random() * problems.length)]();
}

export function BrokenGeometry({ difficulty, onBack, onComplete }) {
  const [problem, setProblem] = useState(generateProblem(difficulty));
  const [score, setScore] = useState(0);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [timeLeft, setTimeLeft] = useState(60);
  const [questionsCorrect, setQuestionsCorrect] = useState(0);
  const totalQuestions = 10;
  const [feedback, setFeedback] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  useEffect(() => {
    if (timeLeft > 0 && !gameOver && questionNumber <= totalQuestions) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if ((timeLeft === 0 || questionNumber > totalQuestions) && !gameOver) {
      setGameOver(true);
      onComplete('Broken Geometry', score);
    }
  }, [timeLeft, gameOver, score, onComplete, questionNumber, totalQuestions]);

  const handleAnswer = (answer) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answer);
    const correct = answer === problem.correctAnswer;
    setIsCorrect(correct);
    
    if (correct) {
      const points = difficulty === 'easy' ? 15 : difficulty === 'medium' ? 20 : 30;
      setScore(score + points);
      setQuestionsCorrect(questionsCorrect + 1);
      setFeedback(sarcasticFeedback.correct[Math.floor(Math.random() * sarcasticFeedback.correct.length)]);
    } else {
      setFeedback(sarcasticFeedback.wrong[Math.floor(Math.random() * sarcasticFeedback.wrong.length)]);
    }

    setTimeout(() => {
      if (questionNumber >= totalQuestions) {
        setGameOver(true);
        onComplete('Broken Geometry', score);
      } else {
        setProblem(generateProblem(difficulty));
        setQuestionNumber(questionNumber + 1);
        setFeedback('');
        setIsCorrect(null);
        setShowHint(false);
        setSelectedAnswer(null);
        setTimeLeft(60);
      }
    }, 2500);
  };

  const handleHint = () => {
    setShowHint(true);
    setFeedback(`${sarcasticFeedback.hint[Math.floor(Math.random() * sarcasticFeedback.hint.length)]} ${problem.brokenRule}`);
  };

  if (gameOver) {
    const percentage = (questionsCorrect / totalQuestions) * 100;
    let roast = '';
    let roastColor = 'text-red-400';
    
    if (percentage === 100) {
      roast = 'Perfect score? Either you\'re a geometry god or you got REALLY lucky. I\'m betting on luck.';
      roastColor = 'text-green-400';
    } else if (percentage >= 80) {
      roast = 'Not bad! You actually paid attention in school. What a concept.';
      roastColor = 'text-green-300';
    } else if (percentage >= 60) {
      roast = 'Mediocre. You passed, but just barely. Like a C-minus of geometry detection.';
      roastColor = 'text-yellow-400';
    } else if (percentage >= 40) {
      roast = 'Yikes. Less than half right? Geometry isn\'t your thing. Maybe try something easier. Like breathing.';
      roastColor = 'text-orange-400';
    } else if (percentage >= 20) {
      roast = 'This is genuinely concerning. Did you even READ the questions or just click randomly?';
      roastColor = 'text-red-400';
    } else {
      roast = 'Wow. Just... wow. I don\'t even know what to say. This is worse than random guessing. Impressive, honestly.';
      roastColor = 'text-red-500';
    }
    
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/10 backdrop-blur-md rounded-3xl p-8 max-w-md w-full text-center border border-white/20"
        >
          <Award className="w-20 h-20 text-purple-400 mx-auto mb-4" />
          <h2 className="text-4xl text-white mb-4">Game Over!</h2>
          <div className="bg-white/10 rounded-2xl p-6 mb-6">
            <p className="text-6xl text-white mb-2">{questionsCorrect}/{totalQuestions}</p>
            <p className="text-xl text-purple-200 mb-4">Final Score: {score} points</p>
            <div className="h-3 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`h-full ${
                  percentage >= 80 ? 'bg-green-500' : 
                  percentage >= 60 ? 'bg-yellow-500' : 
                  'bg-red-500'
                }`}
              />
            </div>
          </div>
          <p className={`text-lg ${roastColor} mb-6 font-medium leading-relaxed`}>
            {roast}
          </p>
          <button
            onClick={onBack}
            className="px-6 py-3 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-colors"
          >
            Back to Home (if you dare)
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
          <div className="text-purple-300 text-lg">
            Question {questionNumber}/{totalQuestions}
          </div>
          <div className={`flex items-center gap-2 ${timeLeft <= 10 ? 'text-red-400 animate-pulse' : 'text-white'}`}>
            <Timer className="w-5 h-5" />
            <span className="text-2xl font-bold">{timeLeft}s</span>
          </div>
          <div className="flex items-center gap-2 text-purple-400">
            <Award className="w-5 h-5" />
            <span className="text-xl">{score}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-3xl w-full">
          <motion.div
            key={questionNumber}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/10 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-white/20"
          >
            <div className="text-center mb-6">
              <p className="text-purple-300 mb-2">Problem {questionNumber}</p>
              <div className="flex items-center justify-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                <p className="text-lg text-[#FFFF00] italic">One rule is broken.</p>
              </div>
              <h3 className="text-2xl text-white">{problem.shape}</h3>
            </div>

            <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 rounded-2xl p-8 mb-6 border border-white/10">
              <div className="max-w-xs mx-auto">
                {problem.svgShape}
              </div>
              <p className="text-center text-purple-200 mt-4">{problem.given}</p>
            </div>

            <h4 className="text-xl text-center text-white mb-6">{problem.question}</h4>

            <div className="grid grid-cols-2 gap-4 mb-6">
              {problem.options.map((option, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: selectedAnswer === null ? 1.03 : 1 }}
                  whileTap={{ scale: selectedAnswer === null ? 0.97 : 1 }}
                  onClick={() => handleAnswer(option)}
                  disabled={selectedAnswer !== null}
                  className={`p-5 rounded-2xl text-2xl transition-all ${
                    selectedAnswer === null
                      ? 'bg-white/20 hover:bg-white/30 text-white border border-white/30'
                      : option === problem.correctAnswer
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

            <button
              onClick={handleHint}
              disabled={showHint || selectedAnswer !== null}
              className="flex items-center gap-2 mx-auto px-4 py-2 bg-white/10 text-purple-300 rounded-full hover:bg-white/20 transition-colors disabled:opacity-50"
            >
              <AlertTriangle className="w-4 h-4" />
              Reveal the broken rule
            </button>

            <AnimatePresence>
              {feedback && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`mt-6 p-4 rounded-xl ${
                    isCorrect === true
                      ? 'bg-green-500/20 text-green-200 border border-green-500/30'
                      : isCorrect === false
                      ? 'bg-red-500/20 text-red-200 border border-red-500/30'
                      : 'bg-yellow-500/20 text-yellow-200 border border-yellow-500/30'
                  }`}
                >
                  <p className="text-center mb-2">{feedback}</p>
                  {isCorrect === false && (
                    <p className="text-center text-sm opacity-80">{problem.explanation}</p>
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