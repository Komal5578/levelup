import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, Check, X } from 'lucide-react';

const NeedsVsWants = () => {
  const navigate = useNavigate();
  const [gameStarted, setGameStarted] = useState(false);
  const [currentItem, setCurrentItem] = useState(0);
  const [selections, setSelections] = useState([]);
  const [gameOver, setGameOver] = useState(false);

  const wantsBudget = 8000;

  const expenses = [
    { name: "Monthly Rent", cost: 15000, correctAnswer: "need", icon: "🏠" },
    { name: "Netflix Subscription", cost: 500, correctAnswer: "want", icon: "📺" },
    { name: "Groceries", cost: 5000, correctAnswer: "need", icon: "🛒" },
    { name: "Dinner at Restaurant", cost: 2000, correctAnswer: "want", icon: "🍽️" },
    { name: "Electricity Bill", cost: 1500, correctAnswer: "need", icon: "⚡" },
    { name: "New Sneakers", cost: 4000, correctAnswer: "want", icon: "👟" },
    { name: "Health Insurance", cost: 3000, correctAnswer: "need", icon: "🏥" },
    { name: "Coffee Shop Visit", cost: 300, correctAnswer: "want", icon: "☕" },
    { name: "Mobile Recharge", cost: 599, correctAnswer: "need", icon: "📱" },
    { name: "Gaming Subscription", cost: 999, correctAnswer: "want", icon: "🎮" }
  ];

  const startGame = () => {
    setGameStarted(true);
  };

  const handleSelection = (choice) => {
    const expense = expenses[currentItem];
    const isCorrect = choice === expense.correctAnswer;
    
    const newSelections = [...selections, {
      ...expense,
      userChoice: choice,
      isCorrect
    }];
    
    setSelections(newSelections);

    if (currentItem < expenses.length - 1) {
      setTimeout(() => {
        setCurrentItem(currentItem + 1);
      }, 500);
    } else {
      setTimeout(() => {
        setGameOver(true);
        saveResults(newSelections);
      }, 500);
    }
  };

  const saveResults = (finalSelections) => {
    const correct = finalSelections.filter(s => s.isCorrect).length;
    const accuracy = Math.round((correct / expenses.length) * 100);
    const totalWants = finalSelections.filter(s => s.userChoice === 'want').reduce((sum, item) => sum + item.cost, 0);
    
    const progress = JSON.parse(localStorage.getItem('gameProgress') || '{}');
    progress.completed = [...(progress.completed || []), 'needs-vs-wants'];
    localStorage.setItem('gameProgress', JSON.stringify(progress));

    // Save to leaderboard
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard') || '[]');
    leaderboard.push({
      name: user.name || user.email || 'Player',
      game: 'Needs vs Wants',
      score: accuracy,
      totalXP: accuracy * 10,
      gamesCompleted: 1,
      avgScore: accuracy,
      timestamp: Date.now()
    });
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
  };

  const handleExit = () => {
    navigate('/dashboard');
  };

  const playAgain = () => {
    setGameStarted(false);
    setCurrentItem(0);
    setSelections([]);
    setGameOver(false);
  };

  // Pre-game screen
  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center p-6">
        <div className="max-w-2xl w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-12 text-center">
          <div className="text-7xl mb-6">🛍</div>
          <h1 className="text-4xl font-bold mb-4">Needs vs. Wants</h1>
          <p className="text-xl text-gray-300 mb-8">Where does your money really go?</p>
          
          <div className="bg-black/30 rounded-2xl p-6 mb-8 text-left space-y-3">
            <h3 className="text-xl font-bold mb-3">📚 What You'll Learn:</h3>
            <p className="text-gray-300">✓ Differentiate between needs and wants</p>
            <p className="text-gray-300">✓ Budget for discretionary spending</p>
            <p className="text-gray-300">✓ Prioritize essential expenses</p>
          </div>

          <div className="flex gap-4 justify-center mb-4">
            <div className="bg-white/5 px-6 py-3 rounded-full border border-white/20">
              <span className="text-yellow-400">⭐</span> Difficulty
            </div>
            <div className="bg-white/5 px-6 py-3 rounded-full border border-white/20">
              ⏱️ ~5 minutes
            </div>
          </div>

          <div className="bg-orange-500/20 border border-orange-500/30 rounded-xl p-4 mb-8">
            <p className="text-lg">Maximum "Wants" Budget: <span className="font-bold text-orange-400">₹{wantsBudget.toLocaleString()}</span></p>
            <p className="text-sm text-gray-400 mt-2">Classify 10 expenses correctly!</p>
          </div>

          <button
            onClick={startGame}
            className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full text-xl font-bold hover:scale-105 transition-transform"
          >
            Start Game →
          </button>
          
          <button
            onClick={handleExit}
            className="mt-4 text-gray-400 hover:text-white transition-colors flex items-center gap-2 mx-auto"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Game Over screen
  if (gameOver) {
    const correct = selections.filter(s => s.isCorrect).length;
    const accuracy = Math.round((correct / expenses.length) * 100);
    const totalWants = selections.filter(s => s.userChoice === 'want').reduce((sum, item) => sum + item.cost, 0);
    const passed = totalWants <= wantsBudget;

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center p-6">
        <div className="max-w-3xl w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-12">
          <div className="text-center mb-8">
            <div className="text-7xl mb-6">{passed ? '🎉' : '😅'}</div>
            <h1 className="text-4xl font-bold mb-4">{passed ? 'Budget Mastered!' : 'Over Budget!'}</h1>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-black/30 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-green-400">{correct}/10</div>
              <div className="text-gray-400">Correct Classifications</div>
            </div>
            <div className="bg-black/30 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-purple-400">{accuracy}%</div>
              <div className="text-gray-400">Accuracy</div>
            </div>
          </div>

          <div className={`rounded-xl p-6 mb-8 text-center ${
            passed ? 'bg-green-500/20 border border-green-500/30' : 'bg-red-500/20 border border-red-500/30'
          }`}>
            <div className="text-xl mb-2">Your "Wants" Spending</div>
            <div className={`text-4xl font-bold ${passed ? 'text-green-400' : 'text-red-400'}`}>
              ₹{totalWants.toLocaleString()}
            </div>
            <div className="text-sm text-gray-300 mt-2">
              Budget limit: ₹{wantsBudget.toLocaleString()}
              {passed ? ' ✓' : ` (Over by ₹${(totalWants - wantsBudget).toLocaleString()})`}
            </div>
          </div>

          <div className="bg-purple-500/20 border border-purple-500/30 rounded-xl p-6 mb-8">
            <h3 className="text-xl font-bold mb-4">📊 Your Choices:</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {selections.map((item, i) => (
                <div key={i} className={`flex items-center justify-between p-3 rounded-lg ${
                  item.isCorrect ? 'bg-green-500/10' : 'bg-red-500/10'
                }`}>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <div className="font-semibold">{item.name}</div>
                      <div className="text-sm text-gray-400">₹{item.cost.toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      item.userChoice === 'need' ? 'bg-blue-500/30' : 'bg-orange-500/30'
                    }`}>
                      {item.userChoice.toUpperCase()}
                    </span>
                    {item.isCorrect ? (
                      <Check className="w-5 h-5 text-green-400" />
                    ) : (
                      <X className="w-5 h-5 text-red-400" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-cyan-500/20 border border-cyan-500/30 rounded-xl p-6 mb-8 text-left">
            <h3 className="text-xl font-bold mb-3">💡 Key Lesson:</h3>
            <p className="text-gray-300">
              <strong>Needs</strong> are essential for survival (rent, food, utilities). 
              <strong> Wants</strong> are nice to have but not essential. 
              Always protect your "needs" budget first!
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={playAgain}
              className="flex-1 py-4 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full text-xl font-bold hover:scale-105 transition-transform"
            >
              Play Again
            </button>
            <button
              onClick={handleExit}
              className="flex-1 py-4 bg-white/10 border border-white/20 rounded-full text-xl font-bold hover:bg-white/20 transition-colors"
            >
              Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main game screen
  const expense = expenses[currentItem];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center p-6">
      <div className="max-w-3xl w-full">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Item {currentItem + 1} of {expenses.length}</span>
            <span className="text-sm text-gray-400">{Math.round(((currentItem) / expenses.length) * 100)}% Complete</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-pink-600 transition-all duration-300"
              style={{ width: `${((currentItem) / expenses.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Item Card */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-12 text-center">
          <div className="text-8xl mb-6 animate-bounce">{expense.icon}</div>
          <h2 className="text-4xl font-bold mb-4">{expense.name}</h2>
          <div className="text-3xl font-bold text-yellow-400 mb-12">₹{expense.cost.toLocaleString()}</div>

          <p className="text-xl text-gray-300 mb-8">Is this a Need or a Want?</p>

          {/* Choice Buttons */}
          <div className="grid grid-cols-2 gap-6">
            <button
              onClick={() => handleSelection('need')}
              className="group py-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl font-bold text-2xl hover:scale-105 transition-transform"
            >
              <div className="text-5xl mb-3">🔵</div>
              <div>NEED</div>
              <div className="text-sm font-normal text-blue-100 mt-2">Essential</div>
            </button>
            <button
              onClick={() => handleSelection('want')}
              className="group py-12 bg-gradient-to-br from-orange-500 to-pink-600 rounded-2xl font-bold text-2xl hover:scale-105 transition-transform"
            >
              <div className="text-5xl mb-3">🟠</div>
              <div>WANT</div>
              <div className="text-sm font-normal text-orange-100 mt-2">Nice to have</div>
            </button>
          </div>
        </div>

        {/* Selections indicator */}
        <div className="mt-6 flex justify-center gap-2">
          {expenses.map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full ${
                i < currentItem 
                  ? selections[i].isCorrect 
                    ? 'bg-green-500' 
                    : 'bg-red-500'
                  : i === currentItem
                  ? 'bg-yellow-500 animate-pulse'
                  : 'bg-white/20'
              }`}
            />
          ))}
        </div>

        {/* Exit button */}
        <div className="mt-6 text-center">
          <button
            onClick={handleExit}
            className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 mx-auto"
          >
            <ArrowLeft className="w-4 h-4" /> Exit Game
          </button>
        </div>
      </div>
    </div>
  );
};

export default NeedsVsWants;