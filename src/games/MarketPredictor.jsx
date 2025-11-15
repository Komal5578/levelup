import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, ArrowLeft } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

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
  const [priceHistory, setPriceHistory] = useState([]);
  const [currentPrice, setCurrentPrice] = useState(1000);

  const maxRounds = 10;

  // Generate realistic price history
  const generatePriceHistory = (basePrice, length = 20) => {
    const prices = [];
    let price = basePrice;
    
    for (let i = 0; i < length; i++) {
      const change = (Math.random() - 0.5) * 40; // Random walk
      price = Math.max(price + change, basePrice * 0.7); // Don't go too low
      prices.push({
        time: `${i + 1}`,
        price: Math.round(price),
        label: i === length - 1 ? 'Now' : ''
      });
    }
    
    return prices;
  };

  const startGame = () => {
    const initialHistory = generatePriceHistory(1000);
    setPriceHistory(initialHistory);
    setCurrentPrice(initialHistory[initialHistory.length - 1].price);
    setGameStarted(true);
  };

  const placeBet = (direction) => {
    setPrediction(direction);

    // Simulate random market movement (50/50 chance)
    const actualMovement = Math.random() > 0.5 ? 'up' : 'down';
    const won = direction === actualMovement;
    
    // Calculate new price
    const priceChange = (Math.random() * 60 + 20) * (actualMovement === 'up' ? 1 : -1);
    const newPrice = Math.round(currentPrice + priceChange);
    
    const newBalance = won ? balance + betAmount : balance - betAmount;

    setResult({
      won,
      actualMovement,
      newPrice,
      priceChange: Math.abs(priceChange)
    });
    
    setHistory([...history, {
      round,
      direction,
      actualMovement,
      won,
      betAmount,
      oldPrice: currentPrice,
      newPrice
    }]);

    setTimeout(() => {
      // Update price history with new price
      const newPriceHistory = [
        ...priceHistory.slice(1),
        {
          time: `${priceHistory.length + 1}`,
          price: newPrice,
          label: 'Now'
        }
      ];
      setPriceHistory(newPriceHistory);
      setCurrentPrice(newPrice);
      
      setBalance(newBalance);

      if (newBalance <= 0) {
        setGameOver(true);
        saveResults(newBalance, history.length + 1);
      } else if (round >= maxRounds) {
        setGameOver(true);
        saveResults(newBalance, history.length + 1);
      } else {
        setRound(round + 1);
        setResult(null);
        setPrediction(null);
        setBetAmount(Math.min(5000, newBalance));
      }
    }, 2500);
  };

  const saveResults = (finalBalance, totalRounds) => {
    const wins = history.filter(h => h.won).length + (result?.won ? 1 : 0);
    const accuracy = Math.round((wins / totalRounds) * 100);

    // Save to game progress
    const progress = JSON.parse(localStorage.getItem('gameProgress') || '{}');
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
    setPriceHistory([]);
    setCurrentPrice(1000);
  };

  // Pre-game screen
  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white p-8">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={handleExit}
            className="mb-6 flex items-center gap-2 text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>

          <div className="text-center mb-12">
            <div className="text-6xl mb-4">📈</div>
            <h1 className="text-5xl font-bold mb-4">Market Predictor</h1>
            <p className="text-xl text-white/80">Can you beat random chance?</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4">📚 What You'll Learn:</h2>
            <ul className="space-y-3 text-lg">
              <li className="flex items-start gap-3">
                <span className="text-green-400">✓</span>
                <span>Short-term trading is mostly luck</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400">✓</span>
                <span>Risk management is crucial</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400">✓</span>
                <span>Never bet more than you can afford to lose</span>
              </li>
            </ul>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="text-3xl mb-2">⭐⭐</div>
              <div className="text-white/60">Difficulty</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="text-3xl mb-2">⏱️</div>
              <div className="text-white/60">~7 minutes</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="text-2xl font-bold text-green-400 mb-2">₹1,00,000</div>
              <div className="text-white/60">Starting Balance</div>
            </div>
          </div>

          <button
            onClick={startGame}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold text-xl py-6 rounded-xl transition-all transform hover:scale-105 shadow-lg"
          >
            Start Game →
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
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="text-8xl mb-4">
              {balance > 100000 ? '🎉' : balance > 0 ? '😅' : '😢'}
            </div>
            <h1 className="text-5xl font-bold mb-8">Game Over!</h1>

            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="text-3xl font-bold text-blue-400 mb-2">
                  ₹{balance.toLocaleString()}
                </div>
                <div className="text-white/60">Final Balance</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className={`text-3xl font-bold mb-2 ${profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {profit >= 0 ? '+' : ''}₹{profit.toLocaleString()}
                </div>
                <div className="text-white/60">Profit/Loss</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="text-3xl font-bold text-purple-400 mb-2">
                  {wins}/{history.length}
                </div>
                <div className="text-white/60">Correct Predictions</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="text-3xl font-bold text-yellow-400 mb-2">
                  {accuracy}%
                </div>
                <div className="text-white/60">Accuracy</div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8">
              <h2 className="text-2xl font-bold mb-4">💡 Key Lesson:</h2>
              <p className="text-lg text-white/90">
                {accuracy > 60
                  ? "You got lucky! But remember: short-term trading success is mostly chance, not skill."
                  : "This proves the point: predicting short-term market moves is near impossible. Risk management matters more than prediction."}
              </p>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={playAgain}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold text-lg px-8 py-4 rounded-xl transition-all transform hover:scale-105"
              >
                Play Again
              </button>
              <button
                onClick={handleExit}
                className="bg-white/10 hover:bg-white/20 text-white font-bold text-lg px-8 py-4 rounded-xl transition-all"
              >
                Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main game screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Market Predictor</h1>
            <p className="text-xl text-white/80">
              Round {round} of {maxRounds}
            </p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-green-400">₹{balance.toLocaleString()}</div>
            <div className="text-white/60">Current Balance</div>
          </div>
        </div>

        {/* Game Area */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
          {!result ? (
            <>
              {/* Stock Chart */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold">Stock Z Price Chart</h3>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-blue-400">₹{currentPrice.toLocaleString()}</div>
                    <div className="text-sm text-white/60">Current Price</div>
                  </div>
                </div>
                
                {/* Price Chart */}
                <div className="bg-gray-900/50 rounded-xl p-4 mb-6">
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={priceHistory}>
                      <XAxis 
                        dataKey="time" 
                        stroke="#fff"
                        opacity={0.5}
                        tick={{ fill: '#fff', fontSize: 12 }}
                      />
                      <YAxis 
                        stroke="#fff"
                        opacity={0.5}
                        tick={{ fill: '#fff', fontSize: 12 }}
                        domain={['auto', 'auto']}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1a1a2e', 
                          border: '1px solid #4a5568',
                          borderRadius: '8px',
                          color: '#fff'
                        }}
                        formatter={(value) => [`₹${value}`, 'Price']}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="price" 
                        stroke="#3b82f6" 
                        strokeWidth={3}
                        dot={{ fill: '#3b82f6', r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                  
                  {/* Technical indicators */}
                  <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
                    <div className="text-center p-2 bg-white/5 rounded">
                      <div className="text-white/60">20-Period Trend</div>
                      <div className="font-bold text-blue-400">
                        {priceHistory[priceHistory.length - 1]?.price > priceHistory[0]?.price ? '↗ Upward' : '↘ Downward'}
                      </div>
                    </div>
                    <div className="text-center p-2 bg-white/5 rounded">
                      <div className="text-white/60">Volatility</div>
                      <div className="font-bold text-yellow-400">Medium</div>
                    </div>
                    <div className="text-center p-2 bg-white/5 rounded">
                      <div className="text-white/60">Volume</div>
                      <div className="font-bold text-green-400">High</div>
                    </div>
                  </div>
                </div>
                
                <p className="text-center text-xl text-white/80 mb-2">
                  📊 Analyze the chart. Will the next candle be green or red?
                </p>
              </div>

              {/* Bet Amount Slider */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-3">
                  <label className="text-lg font-semibold">Bet Amount:</label>
                  <span className="text-2xl font-bold text-green-400">₹{betAmount.toLocaleString()}</span>
                </div>
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
                <div className="flex justify-between text-sm text-white/60 mt-2">
                  <span>₹1,000</span>
                  <span>₹{balance.toLocaleString()}</span>
                </div>
              </div>

              {/* Prediction Buttons */}
              <div className="grid md:grid-cols-2 gap-6">
                <button
                  onClick={() => placeBet('up')}
                  disabled={prediction !== null}
                  className="group relative py-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl font-bold text-2xl hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <TrendingUp size={48} className="mx-auto mb-2" />
                  <div>UP ⬆️</div>
                  <div className="text-sm font-normal text-white/80 mt-2">Stock will rise</div>
                </button>

                <button
                  onClick={() => placeBet('down')}
                  disabled={prediction !== null}
                  className="group relative py-12 bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl font-bold text-2xl hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <TrendingDown size={48} className="mx-auto mb-2" />
                  <div>DOWN ⬇️</div>
                  <div className="text-sm font-normal text-white/80 mt-2">Stock will fall</div>
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">{result.won ? '✅' : '❌'}</div>
              <h3 className="text-3xl font-bold mb-4">
                {result.won ? 'Correct Prediction!' : 'Wrong Prediction!'}
              </h3>
              
              {/* Price movement display */}
              <div className="bg-white/5 rounded-xl p-6 mb-4 max-w-md mx-auto">
                <div className="grid grid-cols-3 gap-4 items-center">
                  <div>
                    <div className="text-white/60 text-sm">Old Price</div>
                    <div className="text-xl font-bold">₹{history[history.length - 1]?.oldPrice}</div>
                  </div>
                  <div>
                    <div className={`text-4xl ${result.actualMovement === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                      {result.actualMovement === 'up' ? '↗' : '↘'}
                    </div>
                    <div className="text-sm text-white/60">
                      {result.actualMovement === 'up' ? '+' : '-'}₹{Math.round(result.priceChange)}
                    </div>
                  </div>
                  <div>
                    <div className="text-white/60 text-sm">New Price</div>
                    <div className="text-xl font-bold">₹{result.newPrice}</div>
                  </div>
                </div>
              </div>
              
              <p className="text-lg text-white/80 mb-2">
                You predicted: <span className="font-bold">{prediction?.toUpperCase()}</span>
              </p>
              <p className="text-lg text-white/80 mb-4">
                Market went: <span className="font-bold">{result.actualMovement.toUpperCase()}</span>
              </p>

              <div className={`text-3xl font-bold mb-4 ${result.won ? 'text-green-400' : 'text-red-400'}`}>
                {result.won ? '+' : '-'}₹{betAmount.toLocaleString()}
              </div>

              <p className="text-white/60 animate-pulse">Preparing next round...</p>
            </div>
          )}
        </div>

        {/* Win/Loss History */}
        {history.length > 0 && (
          <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4">History</h3>
            <div className="flex gap-2 flex-wrap">
              {history.map((h, i) => (
                <div
                  key={i}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold ${
                    h.won ? 'bg-green-500' : 'bg-red-500'
                  }`}
                >
                  {h.won ? '✓' : '✗'}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Exit button */}
        <div className="mt-8 text-center">
          <button
            onClick={handleExit}
            className="bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-3 rounded-xl transition-all flex items-center gap-2 mx-auto"
          >
            <ArrowLeft size={20} />
            Exit Game
          </button>
        </div>
      </div>
    </div>
  );
};

export default MarketPredictor;