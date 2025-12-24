import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Timer, Award, Lightbulb } from 'lucide-react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';

const operators = ['+', '-', '×', '÷'];

const sarcasticFeedback = {
  correct: [
    'Correct! You can drag stuff. Revolutionary, really.',
    'Right! Your mouse skills have finally earned a medal.',
    'You got it! Drag and drop: a skill most adults still struggle with.',
    'Correct! Who knew moving symbols could feel like a victory?',
    'Right answer! Your hand-eye coordination is… passable, I guess.'
  ],
  wrong: [
    'Wrong. Ever thought about actually trying?',
    'Nope. Dragging not your thing, huh?',
    'Incorrect. The right operators were practically begging for attention.',
    'Wrong. Random dragging, bold strategy, I’ll give you that.',
    'Nope. Reading the equation first could be a revolutionary idea.'
  ],
  hint: [
    'Hint: Do the math in your head first. Groundbreaking concept, I know.',
    'Hint: Try working backwards. You know, like a normal human.',
    'Hint: Test each operator mentally. It’s called thinking.',
    'Hint: Order of operations matters. PEMDAS called, it’s disappointed in you.'
  ]
};


function calculateResult(num1, op1, num2, op2, num3) {
  // Follow order of operations: × and ÷ before + and -
  let result;
  
  // Handle multiplication and division first
  if (op1 === '×') {
    const temp = num1 * num2;
    if (op2 === '+') result = temp + num3;
    else if (op2 === '-') result = temp - num3;
    else if (op2 === '×') result = temp * num3;
    else if (op2 === '÷' && num3 !== 0) result = temp / num3;
  } else if (op1 === '÷' && num2 !== 0) {
    const temp = num1 / num2;
    if (op2 === '+') result = temp + num3;
    else if (op2 === '-') result = temp - num3;
    else if (op2 === '×') result = temp * num3;
    else if (op2 === '÷' && num3 !== 0) result = temp / num3;
  } else if (op2 === '×') {
    const temp = num2 * num3;
    if (op1 === '+') result = num1 + temp;
    else if (op1 === '-') result = num1 - temp;
  } else if (op2 === '÷' && num3 !== 0) {
    const temp = num2 / num3;
    if (op1 === '+') result = num1 + temp;
    else if (op1 === '-') result = num1 - temp;
  } else {
    // Only addition and subtraction
    if (op1 === '+') {
      const temp = num1 + num2;
      if (op2 === '+') result = temp + num3;
      else if (op2 === '-') result = temp - num3;
    } else if (op1 === '-') {
      const temp = num1 - num2;
      if (op2 === '+') result = temp + num3;
      else if (op2 === '-') result = temp - num3;
    }
  }
  
  return result;
}

function generateEquationWithDifficulty(difficulty) {
  if (difficulty === 'easy') {
    // Easy: Single operator
    const op = operators[Math.floor(Math.random() * operators.length)];
    let num1, num2, result;
    
    switch (op) {
      case '+':
        num1 = Math.floor(Math.random() * 40) + 10;
        num2 = Math.floor(Math.random() * 40) + 10;
        result = num1 + num2;
        break;
      case '-':
        num1 = Math.floor(Math.random() * 50) + 30;
        num2 = Math.floor(Math.random() * (num1 - 10)) + 5;
        result = num1 - num2;
        break;
      case '×':
        num1 = Math.floor(Math.random() * 13) + 3;
        num2 = Math.floor(Math.random() * 13) + 3;
        result = num1 * num2;
        break;
      case '÷':
        num2 = Math.floor(Math.random() * 10) + 3;
        result = Math.floor(Math.random() * 10) + 3;
        num1 = num2 * result;
        break;
    }
    
    return { 
      num1, 
      num2, 
      result, 
      correctOps: [op],
      numOperators: 1
    };
  } else {
    // Medium and Hard: Two operators
    const op1 = operators[Math.floor(Math.random() * operators.length)];
    const op2 = operators[Math.floor(Math.random() * operators.length)];
    
    let num1, num2, num3, result;
    const maxRange = difficulty === 'medium' ? 20 : 30;
    const minRange = difficulty === 'medium' ? 5 : 10;
    
    // Generate numbers that work well together
    let attempts = 0;
    do {
      num1 = Math.floor(Math.random() * maxRange) + minRange;
      num2 = Math.floor(Math.random() * maxRange) + minRange;
      num3 = Math.floor(Math.random() * maxRange) + minRange;
      
      // Adjust for division to avoid decimals
      if (op1 === '÷') {
        num1 = num2 * (Math.floor(Math.random() * 10) + 2);
      }
      if (op2 === '÷') {
        num2 = num3 * (Math.floor(Math.random() * 10) + 2);
      }
      
      result = calculateResult(num1, op1, num2, op2, num3);
      attempts++;
    } while ((result < 0 || result % 1 !== 0 || result > 1000) && attempts < 50);
    
    // If we couldn't find good numbers, use a simpler equation
    if (attempts >= 50) {
      num1 = 10;
      num2 = 5;
      num3 = 3;
      result = calculateResult(num1, op1, num2, op2, num3);
    }
    
    return {
      num1,
      num2,
      num3,
      result: Math.round(result),
      correctOps: [op1, op2],
      numOperators: 2
    };
  }
}

function DraggableOperator({ operator, isUsed }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'operator',
    item: { operator },
    canDrag: true,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  }), []);

  return (
    <motion.div
      ref={drag}
      whileHover={{ scale: 1.1 }}
      className={`w-16 h-16 md:w-20 md:h-20 rounded-xl flex items-center justify-center text-3xl cursor-move transition-all ${
        isDragging
          ? 'bg-purple-500 text-white scale-110 shadow-lg'
          : 'bg-white/20 text-white hover:bg-purple-500/50'
      }`}
    >
      {operator}
    </motion.div>
  );
}

function DropZone({ onDrop, currentOperator, index }) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'operator',
    drop: (item) => onDrop(item.operator, index),
    collect: (monitor) => ({
      isOver: !!monitor.isOver()
    })
  }));

  return (
    <div
      ref={drop}
      className={`w-20 h-20 md:w-24 md:h-24 rounded-xl border-4 border-dashed flex items-center justify-center text-4xl transition-all ${
        currentOperator
          ? 'border-green-400 bg-green-500/30 text-white'
          : isOver
          ? 'border-purple-400 bg-purple-500/30 scale-110'
          : 'border-white/40 bg-white/10 text-white/40'
      }`}
    >
      {currentOperator || '?'}
    </div>
  );
}

function SymbolSwapContent({ difficulty, onBack, onComplete }) {
  const [equation, setEquation] = useState(generateEquationWithDifficulty(difficulty));
  const [selectedOps, setSelectedOps] = useState([]);
  const [score, setScore] = useState(0);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [timeLeft, setTimeLeft] = useState(difficulty === 'easy' ? 90 : difficulty === 'medium' ? 75 : 60);
  const [feedback, setFeedback] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [penalties, setPenalties] = useState(0);

  useEffect(() => {
    if (timeLeft > 0 && !gameOver) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !gameOver) {
      setGameOver(true);
      onComplete('Symbol Swap', score);
    }
  }, [timeLeft, gameOver, score, onComplete]);

  const handleDrop = (operator, index) => {
    setSelectedOps(prevOps => {
      const newSelectedOps = [...prevOps];
      newSelectedOps[index] = operator;
      return newSelectedOps;
    });
  };

  const handleSubmit = () => {
    const allFilled = selectedOps.length === equation.numOperators && 
                      selectedOps.every(op => op !== undefined);
    
    if (!allFilled) return;

    const correct = selectedOps.every((op, i) => op === equation.correctOps[i]);
    setIsCorrect(correct);
    
    if (correct) {
      const basePoints = difficulty === 'easy' ? 15 : difficulty === 'medium' ? 30 : 50;
      const timeBonus = timeLeft > 5 ? Math.floor(timeLeft / 5) : 0;
      const hintPenalty = showHint ? Math.floor(basePoints * 0.5) : 0;
      const points = basePoints + timeBonus - hintPenalty;
      setScore(score + Math.max(points, 5));
      setFeedback(sarcasticFeedback.correct[Math.floor(Math.random() * sarcasticFeedback.correct.length)]);
    } else {
      const penalty = difficulty === 'easy' ? 5 : difficulty === 'medium' ? 12 : 18;
      setScore(Math.max(0, score - penalty));
      setPenalties(penalties + 1);
      setFeedback(sarcasticFeedback.wrong[Math.floor(Math.random() * sarcasticFeedback.wrong.length)]);
    }

    setTimeout(() => {
      setEquation(generateEquationWithDifficulty(difficulty));
      setQuestionNumber(questionNumber + 1);
      setSelectedOps([]);
      setFeedback('');
      setIsCorrect(null);
      setShowHint(false);
    }, 1800);
  };

  const handleHint = () => {
    setShowHint(true);
    const hintPenalty = difficulty === 'easy' ? 3 : difficulty === 'medium' ? 7 : 12;
    setScore(Math.max(0, score - hintPenalty));
    setFeedback(sarcasticFeedback.hint[Math.floor(Math.random() * sarcasticFeedback.hint.length)]);
  };

  if (gameOver) {
    const accuracy = questionNumber > 1 ? Math.round(((questionNumber - 1 - penalties) / (questionNumber - 1)) * 100) : 0;
    
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/10 backdrop-blur-md rounded-3xl p-8 max-w-md w-full text-center border border-white/20"
        >
          <Award className="w-20 h-20 text-purple-400 mx-auto mb-4" />
          <h2 className="text-4xl text-white mb-4">Swap Complete!</h2>
          <div className="space-y-2 mb-6">
            <p className="text-2xl text-purple-200">Final Score: {score}</p>
            <p className="text-lg text-purple-300">Questions: {questionNumber - 1}</p>
            <p className="text-lg text-purple-300">Accuracy: {accuracy}%</p>
          </div>
          <p className="text-lg text-purple-300 mb-6">
            {score > 200 ? 'You can drag AND think. Impressive multitasking.' : 
             score > 100 ? 'Not bad. Basic math still exists in your brain.' :
             'Dragging is hard. So is math, apparently.'}
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

  // No longer track used operators - all operators are always available

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
          <div className="flex items-center gap-2 text-purple-400">
            <Award className="w-5 h-5" />
            <span className="text-xl font-bold">{score}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-4xl w-full">
          <motion.div
            key={questionNumber}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-white/20"
          >
            <div className="text-center mb-8">
              <p className="text-purple-300 mb-4">
                Equation {questionNumber} 
                <span className="text-sm ml-2">
                  ({difficulty === 'easy' ? 'Easy' : difficulty === 'medium' ? 'Medium' : 'Hard'})
                </span>
              </p>
              <p className="text-purple-200 mb-6">
                {equation.numOperators === 1 ? 'Drag the correct operator' : 'Drag the correct operators in order'}
              </p>
              
              <div className="flex items-center justify-center gap-3 md:gap-4 mb-12 flex-wrap">
                <div className="text-5xl md:text-6xl text-white font-bold">{equation.num1}</div>
                <DropZone onDrop={handleDrop} currentOperator={selectedOps[0]} index={0} />
                <div className="text-5xl md:text-6xl text-white font-bold">{equation.num2}</div>
                
                {equation.numOperators === 2 && (
                  <>
                    <DropZone onDrop={handleDrop} currentOperator={selectedOps[1]} index={1} />
                    <div className="text-5xl md:text-6xl text-white font-bold">{equation.num3}</div>
                  </>
                )}
                
                <div className="text-5xl md:text-6xl text-white font-bold">=</div>
                <div className="text-5xl md:text-6xl text-white font-bold">{equation.result}</div>
              </div>

              <div className="flex items-center justify-center gap-4 mb-8 flex-wrap">
                {operators.map((op) => (
                  <DraggableOperator
                    key={op}
                    operator={op}
                    isUsed={false}
                  />
                ))}
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={selectedOps.length !== equation.numOperators || isCorrect !== null}
              className="w-full py-4 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-4 font-semibold"
            >
              Check Answer
            </button>

            <button
              onClick={handleHint}
              disabled={showHint || isCorrect !== null}
              className="flex items-center gap-2 mx-auto px-4 py-2 bg-white/10 text-purple-300 rounded-full hover:bg-white/20 transition-colors disabled:opacity-50"
            >
              <Lightbulb className="w-4 h-4" />
              Hint (costs points)
            </button>

            <AnimatePresence>
              {feedback && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`mt-6 p-4 rounded-xl text-center font-medium ${
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

// Detect if touch device
const isTouchDevice = () => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

export function SymbolSwap(props) {
  const backend = isTouchDevice() ? TouchBackend : HTML5Backend;
  
  return (
    <DndProvider backend={backend}>
      <SymbolSwapContent {...props} />
    </DndProvider>
  );
}