import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, ArrowLeft, DollarSign } from 'lucide-react';

const MarketPredictor = () => {
  const navigate = useNavigate();
  const [gameStarted, setGameStarted] = useState(false);
  const [round, setRound] = useState(1);
  const [balance, setBalance] = useState(100000);
  const [betAmount, setBetAmount] = useState(5000);
  const [prediction, setPrediction] = useState(null);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [gameOver, setGameOver] = useState(false);

  const maxRounds = 10;
  const stockPrice = 1000;

  const startGame = () => {
    setGameStarted(true);
  };

  const placeBet = (direction) => {
    setPrediction(direction);
    
    // Simulate random market movement (50/50 chance)
    const actualMovement = Math.random() > 0.5 ? 'up' : 'down';
    const won = direction === actualMovement;
    
    const newBalance = won ? balance + betAmount : balance - betAmount;
    
    setResult({ won, actualMovement });
    setHistory([...history, { round, direction, actualMovement, won, betAmount }]);
    
    setTimeout(() => {
      setBalance(newBalance);
      
      if (newBalance <= 0) {
        // Lost all money
        setGameOver(true);
        saveResults(newBalance, history.length + 1);
      } else if (round >= maxRounds) {
        // Completed all rounds
        setGameOver(true);
        saveResults(newBalance, history.length + 1);
      } else {
        setRound(round + 1);
        setResult(null);
        setPrediction(null);
        setBetAmount(Math.min(5000, newBalance));
      }
    }, 2000);
  };

  const saveResults = (finalBalance, totalRounds) => {
    const progress = JSON.parse(localStorage.getItem('gameProgress') || '{}');
    const wins = history.filter(h => h.won).length + (result?.won ? 1 : 0);
    const accuracy = Math.round((wins / totalRounds) * 100);
    
    progress.balance = finalBalance;
    progress.completed = [...(progress.completed || []), 'market-predictor'];
    localStorage.setItem('gameProgress', JSON.stringify(progress));

    // Save to leaderboard
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard') || '[]');
    leaderboard.push({
      name: user.name || user.email || 'Player',
      game: 'Market Predictor',
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
    setRound(1);
    setBalance(100000);
    setBetAmount(5000);
    setPrediction(null);
    setResult(null);
    setHistory([]);
    setGameOver(false);
  };

  // Pre-game screen
  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 text-white flex items-center justify-center p-6">
        <div className="max-w-2xl w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-12 text-center">
          <div className="text-7xl mb-6">📈</div>
          <h1 className="text-4xl font-bold mb-4">Market Predictor</h1>
          <p className="text-xl text-gray-300 mb-8">Can you beat random chance?</p>
          
          <div className="bg-black/30 rounded-2xl p-6 mb-8 text-left space-y-3">
            <h3 className="text-xl font-bold mb-3">📚 What You'll Learn:</h3>
            <p className="text-gray-300">✓ Short-term trading is mostly luck</p>
            <p className="text-gray-300">✓ Risk management is crucial</p>
            <p className="text-gray-300">✓ Never bet more than you can afford to lose</p>
          </div>

          <div className="flex gap-4 justify-center mb-4">
            <div className="bg-white/5 px-6 py-3 rounded-full border border-white/20">
              <span className="text-yellow-400">⭐⭐</span> Difficulty
            </div>
            <div className="bg-white/5 px-6 py-3 rounded-full border border-white/20">
              ⏱️ ~7 minutes
            </div>
          </div>

          <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-4 mb-8">
            <p className="text-lg">Starting Balance: <span className="font-bold text-green-400">₹1,00,000</span></p>
          </div>

          <button
            onClick={startGame}
            className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full text-xl font-bold hover:scale-105 transition-transform"
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
    const wins = history.filter(h => h.won).length;
    const accuracy = Math.round((wins / history.length) * 100);
    const profit = balance - 100000;

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 text-white flex items-center justify-center p-6">
        <div className="max-w-2xl w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-12 text-center">
          <div className="text-7xl mb-6">{balance > 100000 ? '🎉' : balance > 0 ? '😅' : '😢'}</div>
          <h1 className="text-4xl font-bold mb-4">Game Over!</h1>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-black/30 rounded-xl p-6">
              <div className="text-3xl font-bold text-green-400">₹{balance.toLocaleString()}</div>
              <div className="text-gray-400">Final Balance</div>
            </div>
            <div className="bg-black/30 rounded-xl p-6">
              <div className={`text-3xl font-bold ${profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {profit >= 0 ? '+' : ''}₹{profit.toLocaleString()}
              </div>
              <div className="text-gray-400">Profit/Loss</div>
            </div>
            <div className="bg-black/30 rounded-xl p-6">
              <div className="text-3xl font-bold text-cyan-400">{wins}/{history.length}</div>
              <div className="text-gray-400">Correct Predictions</div>
            </div>
            <div className="bg-black/30 rounded-xl p-6">
              <div className="text-3xl font-bold text-purple-400">{accuracy}%</div>
              <div className="text-gray-400">Accuracy</div>
            </div>
          </div>

          <div className="bg-purple-500/20 border border-purple-500/30 rounded-xl p-6 mb-8 text-left">
            <h3 className="text-xl font-bold mb-3">💡 Key Lesson:</h3>
            <p className="text-gray-300">
              {accuracy > 60 
                ? "You got lucky! But remember: short-term trading success is mostly chance, not skill."
                : "This proves the point: predicting short-term market moves is near impossible. Risk management matters more than prediction."}
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={playAgain}
              className="flex-1 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full text-xl font-bold hover:scale-105 transition-transform"
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
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 text-white p-6">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Market Predictor</h2>
            <p className="text-gray-400">Round {round} of {maxRounds}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-green-400">₹{balance.toLocaleString()}</div>
            <div className="text-sm text-gray-400">Current Balance</div>
          </div>
        </div>
      </div>

      {/* Game Area */}
      <div className="max-w-4xl mx-auto">
        {!result ? (
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-12">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold mb-4">Stock Z is at ₹{stockPrice}</h3>
              <p className="text-xl text-gray-300">Will it go up or down?</p>
            </div>

            {/* Bet Amount Slider */}
            <div className="mb-12">
              <label className="block text-lg mb-4">Bet Amount: <span className="font-bold text-cyan-400">₹{betAmount.toLocaleString()}</span></label>
              <input
                type="range"
                min="1000"
                max={balance}
                step="1000"
                value={betAmount}
                onChange={(e) => setBetAmount(Number(e.target.value))}
                className="w-full h-3 bg-white/20 rounded-full appearance-none cursor-pointer"
                disabled={prediction !== null}
              />
              <div className="flex justify-between text-sm text-gray-400 mt-2">
                <span>₹1,000</span>
                <span>₹{balance.toLocaleString()}</span>
              </div>
            </div>

            {/* Prediction Buttons */}
            <div className="grid grid-cols-2 gap-6">
              <button
                onClick={() => placeBet('up')}
                disabled={prediction !== null}
                className="group relative py-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl font-bold text-2xl hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <TrendingUp className="w-16 h-16 mx-auto mb-4" />
                <div>UP ⬆️</div>
                <div className="text-sm font-normal mt-2">Stock will rise</div>
              </button>
              <button
                onClick={() => placeBet('down')}
                disabled={prediction !== null}
                className="group relative py-12 bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl font-bold text-2xl hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <TrendingDown className="w-16 h-16 mx-auto mb-4" />
                <div>DOWN ⬇️</div>
                <div className="text-sm font-normal mt-2">Stock will fall</div>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-12 text-center">
            <div className="text-8xl mb-6">{result.won ? '✅' : '❌'}</div>
            <h3 className="text-4xl font-bold mb-4">{result.won ? 'Correct!' : 'Wrong!'}</h3>
            <p className="text-xl text-gray-300 mb-6">
              You predicted: <span className="font-bold">{prediction?.toUpperCase()}</span>
              <br />
              Market went: <span className="font-bold">{result.actualMovement.toUpperCase()}</span>
            </p>
            <div className={`text-3xl font-bold ${result.won ? 'text-green-400' : 'text-red-400'}`}>
              {result.won ? '+' : '-'}₹{betAmount.toLocaleString()}
            </div>
            <div className="mt-6 text-gray-400">Calculating next round...</div>
          </div>
        )}
      </div>

      {/* Win/Loss History */}
      {history.length > 0 && (
        <div className="max-w-4xl mx-auto mt-8">
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
            <h4 className="font-bold mb-4">History</h4>
            <div className="flex gap-2 flex-wrap">
              {history.map((h, i) => (
                <div
                  key={i}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                    h.won ? 'bg-green-500/30 border-green-500' : 'bg-red-500/30 border-red-500'
                  } border`}
                >
                  {h.won ? '✓' : '✗'}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Exit button */}
      <div className="max-w-4xl mx-auto mt-6 text-center">
        <button
          onClick={handleExit}
          className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 mx-auto"
        >
          <ArrowLeft className="w-4 h-4" /> Exit Game
        </button>
      </div>
    </div>
  );
};

export default MarketPredictor;