import { useState } from 'react';
import { Home } from './pages/Home';
import { ArithmeticGame } from './pages/ArithmeticGame';
import { PatternWhisperer } from './pages/PatternWhisperer';
import { BrainMeltdown } from './pages/BrainMeltdown';
import { TrustIssue } from './pages/TrustIssue';
import { SymbolSwap } from './pages/SymbolSwap';
import { NumberDetective } from './pages/NumberDetective';
import { OneRuleTooMany } from './pages/OneRuleTooMany';
import { Leaderboard } from './pages/Leaderboard';
import { GameEntry } from './pages/GameEntry';
import { Zap, Eye, Brain, Lock, Shuffle, Search, Filter } from 'lucide-react';


export default function App() {
  const [currentGame, setCurrentGame] = useState('home');
  const [difficulty, setDifficulty] = useState('medium');
  const [scores, setScores] = useState(() => {
    const saved = localStorage.getItem('equitia-scores');
    return saved ? JSON.parse(saved) : [];
  });

  const addScore = (game, score) => {
    const newScore = {
      game,
      score,
      timestamp: Date.now()
    };
    const updatedScores = [...scores, newScore];
    setScores(updatedScores);
    localStorage.setItem('equitia-scores', JSON.stringify(updatedScores));
  };

  const handleGameStart = (game, selectedDifficulty) => {
    setDifficulty(selectedDifficulty);
    setCurrentGame(game);
  };

  const renderGame = () => {
    switch (currentGame) {
      case 'home':
        return <Home onSelectGame={setCurrentGame} />;
      
      case 'arithmetic-entry':
        return (
          <GameEntry
            title="Arithmetic Game"
            description="Because apparently, you need practice with basic math"
            icon={Zap}
            color="from-pink-500 to-rose-500"
            howToPlay={[
              'You\'ll see a math problem with four possible answers',
              'Click the correct answer before time runs out',
              'Each correct answer gives you 10 points',
              'You have 60 seconds to answer as many as you can',
              'Hints are available if you\'re struggling (which you probably are)'
            ]}
            onBack={() => setCurrentGame('home')}
            onStart={(diff) => handleGameStart('arithmetic', diff)}
          />
        );
      
      case 'pattern-entry':
        return (
          <GameEntry
            title="The Pattern Whisperer"
            description="Find patterns that are totally obvious... to some people"
            icon={Eye}
            color="from-cyan-500 to-blue-500"
            howToPlay={[
              'Look at the sequence of numbers presented',
              'Figure out the pattern (arithmetic, geometric, etc.)',
              'Type in the number that comes next',
              'Each correct answer gives you 15 points',
              'You have 90 seconds total',
              'Use hints if the pattern is too hard for you to see'
            ]}
            onBack={() => setCurrentGame('home')}
            onStart={(diff) => handleGameStart('pattern', diff)}
          />
        );
      
      case 'brain-entry':
        return (
          <GameEntry
            title="Brain Meltdown"
            description="Rules? Where we're going, we don't need consistent rules"
            icon={Brain}
            color="from-orange-500 to-red-500"
            howToPlay={[
              'Read the current rule carefully (it\'s the orange box)',
              'Select the answer that matches the rule',
              'The rules will change randomly mid-game',
              'Pay attention or you\'ll pick the wrong answer',
              'Each correct answer gives you 12 points',
              'You have 75 seconds to survive the chaos'
            ]}
            onBack={() => setCurrentGame('home')}
            onStart={(diff) => handleGameStart('brain', diff)}
          />
        );
      
      case 'trust-entry':
        return (
          <GameEntry
            title="Trust Issue"
            description="Can you spot a lie? Let's find out how gullible you are"
            icon={Lock}
            color="from-green-500 to-emerald-500"
            howToPlay={[
              'Read the mathematical statement carefully',
              'Decide if it\'s TRUE or FALSE',
              'You\'ll get an explanation after each answer',
              'Each correct answer gives you 10 points',
              'You have 60 seconds to test your logic skills',
              'Trust your instincts... or don\'t'
            ]}
            onBack={() => setCurrentGame('home')}
            onStart={(diff) => handleGameStart('trust', diff)}
          />
        );
      
      case 'symbol-entry':
        return (
          <GameEntry
            title="Symbol Swap"
            description="Drag things around until math happens"
            icon={Shuffle}
            color="from-purple-500 to-violet-500"
            howToPlay={[
              'Look at the equation with the missing operator',
              'Drag the correct operator (+, -, ×, ÷) to the question mark',
              'Click "Check Answer" to submit',
              'Each correct answer gives you 15 points',
              'You have 90 seconds total',
              'On mobile, tap and drag. On desktop, click and drag'
            ]}
            onBack={() => setCurrentGame('home')}
            onStart={(diff) => handleGameStart('symbol', diff)}
          />
        );
      
      case 'detective-entry':
        return (
          <GameEntry
            title="Number Detective"
            description="Patterns lie. Numbers deceive. Can you find the truth?"
            icon={Search}
            color="from-yellow-500 to-orange-500"
            howToPlay={[
              'Analyze the sequence of numbers carefully',
              'Identify which number(s) break the pattern',
              'Click suspicious numbers to select them',
              'Submit your analysis when ready',
              'Patterns can be arithmetic, geometric, primes, or more complex',
              'Hard mode may contain multiple errors or conflicting patterns'
            ]}
            onBack={() => setCurrentGame('home')}
            onStart={(diff) => handleGameStart('detective', diff)}
          />
        );

        case 'onerule-entry':
        return (
          <GameEntry
            title="One Rule Too Many"
            description="Three rules. One is useless. Remove it, then solve."
            icon={Filter}
            color="from-teal-500 to-cyan-600"
            howToPlay={[
              'You will see a math problem and three rules',
              'One rule is unnecessary or misleading',
              'Remove the useless rule first',
              'Then solve the problem using the remaining rules',
              'Each complete success gives you points',
              'Think carefully - removing the wrong rule costs you time'
            ]}
            onBack={() => setCurrentGame('home')}
            onStart={(diff) => handleGameStart('onerule', diff)}
          />
        );
      
      case 'arithmetic':
        return <ArithmeticGame difficulty={difficulty} onBack={() => setCurrentGame('arithmetic-entry')} onComplete={addScore} />;
      case 'pattern':
        return <PatternWhisperer difficulty={difficulty} onBack={() => setCurrentGame('pattern-entry')} onComplete={addScore} />;
      case 'brain':
        return <BrainMeltdown difficulty={difficulty} onBack={() => setCurrentGame('brain-entry')} onComplete={addScore} />;
      case 'trust':
        return <TrustIssue difficulty={difficulty} onBack={() => setCurrentGame('trust-entry')} onComplete={addScore} />;
      case 'symbol':
        return <SymbolSwap difficulty={difficulty} onBack={() => setCurrentGame('symbol-entry')} onComplete={addScore} />;
      case 'detective':
        return <NumberDetective difficulty={difficulty} onBack={() => setCurrentGame('detective-entry')} onComplete={addScore} />;
        case 'onerule':
        return <OneRuleTooMany difficulty={difficulty} onBack={() => setCurrentGame('onerule-entry')} onComplete={addScore} />;
      case 'leaderboard':
        return <Leaderboard scores={scores} onBack={() => setCurrentGame('home')} />;
      default:
        return <Home onSelectGame={setCurrentGame} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {renderGame()}
    </div>
  );
}