import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, ArrowLeft, AlertCircle } from 'lucide-react';

const DebtDestroyer = () => {
  const navigate = useNavigate();
  const [gameStarted, setGameStarted] = useState(false);
  const [monthlyPayment, setMonthlyPayment] = useState(10000);
  const [gameOver, setGameOver] = useState(false);
  const [results, setResults] = useState(null);

  const debtAmount = 500000;
  const interestRate = 18; // 18% annual
  const minimumPayment = 10000;

  const calculateDebtPayoff = (payment) => {
    let balance = debtAmount;
    let months = 0;
    let totalInterest = 0;
    const monthlyRate = interestRate / 100 / 12;
    const paymentSchedule = [];

    while (balance > 0 && months < 600) { // Max 50 years
      const interestThisMonth = balance * monthlyRate;
      const principalPayment = payment - interestThisMonth;
      
      totalInterest += interestThisMonth;
      balance -= principalPayment;
      months++;

      if (months <= 6) {
        paymentSchedule.push({
          month: months,
          payment: Math.min(payment, balance + interestThisMonth),
          principal: Math.max(0, principalPayment),
          interest: interestThisMonth,
          remainingBalance: Math.max(0, balance)
        });
      }

      if (balance < 0) balance = 0;
    }

    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;

    return {
      months,
      years,
      remainingMonths,
      totalPaid: debtAmount + totalInterest,
      totalInterest: Math.round(totalInterest),
      paymentSchedule
    };
  };

  const currentCalc = calculateDebtPayoff(monthlyPayment);
  const minimumCalc = calculateDebtPayoff(minimumPayment);

  const startGame = () => {
    setGameStarted(true);
  };

  const completeChallenge = () => {
    setResults(currentCalc);
    setGameOver(true);
    saveResults();
  };

  const saveResults = () => {
    // Calculate score based on time to payoff (lower is better)
    // 3 years or less = 100%, 10+ years = 0%
    const targetMonths = 36; // 3 years
    const maxMonths = 120; // 10 years
    const score = Math.max(0, Math.min(100, 
      100 - ((currentCalc.months - targetMonths) / (maxMonths - targetMonths)) * 100
    ));
    
    const progress = JSON.parse(localStorage.getItem('gameProgress') || '{}');
    progress.completed = [...(progress.completed || []), 'debt-destroyer'];
    localStorage.setItem('gameProgress', JSON.stringify(progress));

    // Save to leaderboard
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard') || '[]');
    leaderboard.push({
      name: user.name || user.email || 'Player',
      game: 'Debt Destroyer',
      score: Math.round(score),
      totalXP: Math.round(score) * 10,
      gamesCompleted: 1,
      avgScore: Math.round(score),
      timestamp: Date.now()
    });
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
  };

  const handleExit = () => {
    navigate('/dashboard');
  };

  const playAgain = () => {
    setGameStarted(false);
    setMonthlyPayment(10000);
    setGameOver(false);
    setResults(null);
  };

  // Pre-game screen
  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 text-white flex items-center justify-center p-6">
        <div className="max-w-2xl w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-12 text-center">
          <div className="text-7xl mb-6">💳</div>
          <h1 className="text-4xl font-bold mb-4">Debt Destroyer</h1>
          <p className="text-xl text-gray-300 mb-8">Escape the interest trap</p>
          
          <div className="bg-black/30 rounded-2xl p-6 mb-8 text-left space-y-3">
            <h3 className="text-xl font-bold mb-3">📚 What You'll Learn:</h3>
            <p className="text-gray-300">✓ How interest keeps you in debt</p>
            <p className="text-gray-300">✓ Power of attacking the principal</p>
            <p className="text-gray-300">✓ Why minimum payments are a trap</p>
          </div>

          <div className="flex gap-4 justify-center mb-4">
            <div className="bg-white/5 px-6 py-3 rounded-full border border-white/20">
              <span className="text-yellow-400">⭐⭐⭐</span> Difficulty
            </div>
            <div className="bg-white/5 px-6 py-3 rounded-full border border-white/20">
              ⏱️ ~8 minutes
            </div>
          </div>

          <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 mb-8">
            <p className="text-lg mb-2">Starting Debt: <span className="font-bold text-red-400">₹5,00,000</span></p>
            <p className="text-sm text-gray-400">Credit Card Interest: 18% per year</p>
            <p className="text-sm text-gray-400 mt-2">💡 Challenge: Can you be debt-free in under 3 years?</p>
          </div>

          <button
            onClick={startGame}
            className="w-full py-4 bg-gradient-to-r from-red-500 to-rose-600 rounded-full text-xl font-bold hover:scale-105 transition-transform"
          >
            Start Challenge →
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
    const savedMoney = minimumCalc.totalInterest - results.totalInterest;
    const savedTime = minimumCalc.months - results.months;
    const under3Years = results.months <= 36;

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 text-white flex items-center justify-center p-6">
        <div className="max-w-4xl w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-12">
          <div className="text-center mb-8">
            <div className="text-7xl mb-6">{under3Years ? '🏆' : '💪'}</div>
            <h1 className="text-4xl font-bold mb-4">
              {under3Years ? 'Debt Destroyed!' : 'Debt Defeated!'}
            </h1>
            <p className="text-xl text-gray-300">
              {under3Years 
                ? 'You crushed the 3-year challenge!' 
                : 'Great work! Try increasing payments to beat 3 years.'}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-black/30 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-cyan-400">
                {results.years}y {results.remainingMonths}m
              </div>
              <div className="text-gray-400">Time to Freedom</div>
            </div>
            <div className="bg-black/30 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-red-400">
                ₹{(results.totalInterest / 100000).toFixed(2)}L
              </div>
              <div className="text-gray-400">Total Interest Paid</div>
            </div>
          </div>

          {/* Comparison with minimum payment */}
          <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-6 mb-6">
            <h3 className="text-xl font-bold mb-4">💰 You Saved vs. Minimum Payments:</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-300 mb-1">Money Saved</div>
                <div className="text-3xl font-bold text-green-400">
                  ₹{(savedMoney / 100000).toFixed(2)}L
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-300 mb-1">Time Saved</div>
                <div className="text-3xl font-bold text-cyan-400">
                  {Math.floor(savedTime / 12)}y {savedTime % 12}m
                </div>
              </div>
            </div>
          </div>

          {/* Payment breakdown */}
          <div className="bg-white/5 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-bold mb-4">📊 Your Payment Strategy:</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Monthly Payment</span>
                <span className="font-bold text-purple-400">₹{monthlyPayment.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Total Paid</span>
                <span className="font-bold">₹{(results.totalPaid / 100000).toFixed(2)}L</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Original Debt</span>
                <span className="font-bold text-gray-400">₹{(debtAmount / 100000).toFixed(2)}L</span>
              </div>
            </div>
          </div>

          {/* First 6 months schedule */}
          <div className="bg-black/30 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-bold mb-4">📅 First 6 Months Breakdown:</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {results.paymentSchedule.map((month) => (
                <div key={month.month} className="bg-white/5 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">Month {month.month}</span>
                    <span className="text-sm text-gray-400">Balance: ₹{(month.remainingBalance / 1000).toFixed(0)}k</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-400">Principal: </span>
                      <span className="text-green-400">₹{(month.principal / 1000).toFixed(1)}k</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Interest: </span>
                      <span className="text-red-400">₹{(month.interest / 1000).toFixed(1)}k</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-cyan-500/20 border border-cyan-500/30 rounded-xl p-6 mb-8">
            <h3 className="text-xl font-bold mb-3">💡 Key Lesson:</h3>
            <p className="text-gray-300">
              Most of your minimum payment goes to <strong className="text-red-400">interest</strong>, not the actual debt! 
              Paying just a little extra attacks the <strong className="text-green-400">principal</strong> directly, 
              saving you thousands and years of payments.
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={playAgain}
              className="flex-1 py-4 bg-gradient-to-r from-red-500 to-rose-600 rounded-full text-xl font-bold hover:scale-105 transition-transform"
            >
              Try Different Strategy
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 text-white p-6">
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-8">
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
          <h2 className="text-3xl font-bold mb-2">Debt Destroyer: Amortization Challenge</h2>
          <p className="text-gray-400">Adjust your monthly payment to see how quickly you can escape debt</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-8">
        {/* Left: Debt Info & Control */}
        <div className="space-y-6">
          {/* Debt Summary */}
          <div className="bg-red-500/20 border border-red-500/30 backdrop-blur-lg rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-8 h-8 text-red-400" />
              <h3 className="text-2xl font-bold">Your Debt</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Outstanding Balance</span>
                <span className="text-3xl font-bold text-red-400">₹{(debtAmount / 100000).toFixed(1)}L</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Interest Rate</span>
                <span className="text-xl font-bold text-orange-400">{interestRate}% APR</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Minimum Payment</span>
                <span className="text-lg text-gray-400">₹{minimumPayment.toLocaleString()}/month</span>
              </div>
            </div>
          </div>

          {/* Payment Slider */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8">
            <h3 className="text-xl font-bold mb-6">Choose Your Monthly Payment</h3>
            
            <div className="mb-8">
              <label className="block text-2xl mb-4 text-center">
                <span className="font-bold text-purple-400">₹{monthlyPayment.toLocaleString()}</span>
                <span className="text-sm text-gray-400 block mt-1">/month</span>
              </label>
              <input
                type="range"
                min={minimumPayment}
                max="50000"
                step="1000"
                value={monthlyPayment}
                onChange={(e) => setMonthlyPayment(Number(e.target.value))}
                className="w-full h-4 bg-white/20 rounded-full appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-sm text-gray-400 mt-2">
                <span>₹{minimumPayment.toLocaleString()}</span>
                <span>₹50,000</span>
              </div>
            </div>

            <button
              onClick={completeChallenge}
              className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full text-xl font-bold hover:scale-105 transition-transform"
            >
              Lock In Strategy →
            </button>
          </div>
        </div>

        {/* Right: Results */}
        <div className="space-y-6">
          {/* Payoff Timeline */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8">
            <h3 className="text-xl font-bold mb-6">🗓️ Debt-Free Timeline</h3>
            
            <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-xl p-6 mb-6 text-center">
              <div className="text-5xl font-bold text-cyan-400 mb-2">
                {currentCalc.years}y {currentCalc.remainingMonths}m
              </div>
              <div className="text-gray-400">Time to Freedom</div>
              <div className="text-sm text-gray-500 mt-2">
                ({currentCalc.months} months)
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-black/30 rounded-xl p-4">
                <div className="text-sm text-gray-400 mb-1">Total Amount Paid</div>
                <div className="text-2xl font-bold">₹{(currentCalc.totalPaid / 100000).toFixed(2)}L</div>
              </div>

              <div className="bg-black/30 rounded-xl p-4">
                <div className="text-sm text-gray-400 mb-1">Total Interest</div>
                <div className="text-2xl font-bold text-red-400">₹{(currentCalc.totalInterest / 100000).toFixed(2)}L</div>
              </div>
            </div>
          </div>

          {/* Comparison */}
          <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4">⚠️ Minimum Payment Trap:</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-300">If you pay minimum:</span>
                <span className="font-bold text-orange-400">
                  {minimumCalc.years}y {minimumCalc.remainingMonths}m
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Interest paid:</span>
                <span className="font-bold text-red-400">₹{(minimumCalc.totalInterest / 100000).toFixed(2)}L</span>
              </div>
              <div className="h-px bg-white/20 my-2"></div>
              <div className="flex justify-between">
                <span className="text-gray-300">You save:</span>
                <span className="font-bold text-green-400">
                  ₹{((minimumCalc.totalInterest - currentCalc.totalInterest) / 100000).toFixed(2)}L
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Time saved:</span>
                <span className="font-bold text-cyan-400">
                  {Math.floor((minimumCalc.months - currentCalc.months) / 12)}y {(minimumCalc.months - currentCalc.months) % 12}m
                </span>
              </div>
            </div>
          </div>

          {/* Challenge Status */}
          {currentCalc.months <= 36 && (
            <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-6 text-center">
              <div className="text-4xl mb-2">🎯</div>
              <div className="font-bold text-green-400">3-Year Challenge: ON TRACK!</div>
            </div>
          )}
        </div>
      </div>

      {/* Exit button */}
      <div className="max-w-5xl mx-auto mt-8 text-center">
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

export default DebtDestroyer;