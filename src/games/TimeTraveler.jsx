import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, ArrowLeft, TrendingUp } from 'lucide-react';

const TimeTraveler = () => {
  const navigate = useNavigate();
  const [gameStarted, setGameStarted] = useState(false);
  const [years, setYears] = useState(20);
  const [returnRate, setReturnRate] = useState(10);
  const [monthlyInvestment, setMonthlyInvestment] = useState(5000);
  const [retirementGoal] = useState(20000000); // 2 Crore
  const [gameOver, setGameOver] = useState(false);
  const [finalValues, setFinalValues] = useState({});

  // Calculate future value using compound interest formula
  const calculateFutureValue = (monthly, years, rate) => {
    const months = years * 12;
    const monthlyRate = rate / 100 / 12;
    
    // Future Value of Monthly Investments: FV = P × [(1 + r)^n - 1] / r
    const futureValue = monthly * (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate;
    const totalInvested = monthly * months;
    const interestEarned = futureValue - totalInvested;
    
    return {
      futureValue: Math.round(futureValue),
      totalInvested: Math.round(totalInvested),
      interestEarned: Math.round(interestEarned)
    };
  };

  const currentValues = calculateFutureValue(monthlyInvestment, years, returnRate);

  const startGame = () => {
    setGameStarted(true);
  };

  const completeChallenge = () => {
    setFinalValues(currentValues);
    setGameOver(true);
    saveResults();
  };

  const saveResults = () => {
    const achievedGoal = currentValues.futureValue >= retirementGoal;
    const score = Math.min(100, Math.round((currentValues.futureValue / retirementGoal) * 100));
    
    const progress = JSON.parse(localStorage.getItem('gameProgress') || '{}');
    progress.completed = [...(progress.completed || []), 'time-traveler'];
    localStorage.setItem('gameProgress', JSON.stringify(progress));

    // Save to leaderboard
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard') || '[]');
    leaderboard.push({
      name: user.name || user.email || 'Player',
      game: 'Time Traveler',
      score: score,
      totalXP: score * 10,
      gamesCompleted: 1,
      avgScore: score,
      timestamp: Date.now()
    });
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
  };

  const handleExit = () => {
    navigate('/dashboard');
  };

  const playAgain = () => {
    setGameStarted(false);
    setYears(20);
    setReturnRate(10);
    setMonthlyInvestment(5000);
    setGameOver(false);
    setFinalValues({});
  };

  // Pre-game screen
  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-orange-900 to-slate-900 text-white flex items-center justify-center p-6">
        <div className="max-w-2xl w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-12 text-center">
          <div className="text-7xl mb-6">⏳</div>
          <h1 className="text-4xl font-bold mb-4">Time Traveler</h1>
          <p className="text-xl text-gray-300 mb-8">Watch your money multiply through compound interest</p>
          
          <div className="bg-black/30 rounded-2xl p-6 mb-8 text-left space-y-3">
            <h3 className="text-xl font-bold mb-3">📚 What You'll Learn:</h3>
            <p className="text-gray-300">✓ The magic of compound interest</p>
            <p className="text-gray-300">✓ Why starting early matters</p>
            <p className="text-gray-300">✓ How time is your greatest asset</p>
          </div>

          <div className="flex gap-4 justify-center mb-4">
            <div className="bg-white/5 px-6 py-3 rounded-full border border-white/20">
              <span className="text-yellow-400">⭐⭐</span> Difficulty
            </div>
            <div className="bg-white/5 px-6 py-3 rounded-full border border-white/20">
              ⏱️ ~6 minutes
            </div>
          </div>

          <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-xl p-4 mb-8">
            <p className="text-lg">Retirement Goal: <span className="font-bold text-yellow-400">₹2 Crore</span></p>
            <p className="text-sm text-gray-400 mt-2">Adjust sliders to reach your goal!</p>
          </div>

          <button
            onClick={startGame}
            className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full text-xl font-bold hover:scale-105 transition-transform"
          >
            Start Journey →
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
    const achievedGoal = finalValues.futureValue >= retirementGoal;
    const percentageOfGoal = Math.round((finalValues.futureValue / retirementGoal) * 100);

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-orange-900 to-slate-900 text-white flex items-center justify-center p-6">
        <div className="max-w-3xl w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-12">
          <div className="text-center mb-8">
            <div className="text-7xl mb-6">{achievedGoal ? '🎯' : '📊'}</div>
            <h1 className="text-4xl font-bold mb-4">
              {achievedGoal ? 'Goal Achieved!' : 'Journey Complete!'}
            </h1>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-black/30 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-green-400">
                ₹{(finalValues.futureValue / 10000000).toFixed(2)}Cr
              </div>
              <div className="text-gray-400">Final Amount</div>
            </div>
            <div className="bg-black/30 rounded-xl p-6 text-center">
              <div className={`text-3xl font-bold ${achievedGoal ? 'text-green-400' : 'text-yellow-400'}`}>
                {percentageOfGoal}%
              </div>
              <div className="text-gray-400">Of Goal</div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-orange-500/30 rounded-xl p-6 mb-6">
            <h3 className="text-xl font-bold mb-4">📊 Your Journey:</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-300">Monthly Investment:</span>
                <span className="font-bold text-cyan-400">₹{monthlyInvestment.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Investment Period:</span>
                <span className="font-bold text-purple-400">{years} years</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Annual Return:</span>
                <span className="font-bold text-green-400">{returnRate}%</span>
              </div>
              <div className="h-px bg-white/20 my-2"></div>
              <div className="flex justify-between">
                <span className="text-gray-300">Total Invested:</span>
                <span className="font-bold">₹{(finalValues.totalInvested / 10000000).toFixed(2)}Cr</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Interest Earned:</span>
                <span className="font-bold text-yellow-400">₹{(finalValues.interestEarned / 10000000).toFixed(2)}Cr</span>
              </div>
            </div>
          </div>

          <div className="bg-cyan-500/20 border border-cyan-500/30 rounded-xl p-6 mb-8">
            <h3 className="text-xl font-bold mb-3">💡 Key Lesson:</h3>
            <p className="text-gray-300">
              Notice how <strong>interest earned (₹{(finalValues.interestEarned / 10000000).toFixed(2)}Cr)</strong> is often 
              larger than what you actually invested! That's the power of compound interest. 
              {years < 30 && " Starting 10 years earlier could double your final amount!"}
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={playAgain}
              className="flex-1 py-4 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full text-xl font-bold hover:scale-105 transition-transform"
            >
              Try Again
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
  const isGoalReached = currentValues.futureValue >= retirementGoal;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-orange-900 to-slate-900 text-white p-6">
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-8">
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
          <h2 className="text-3xl font-bold mb-2">Time Traveler: Compound Interest Simulator</h2>
          <p className="text-gray-400">Adjust the sliders to see how time and returns affect your wealth</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-8">
        {/* Left: Controls */}
        <div className="space-y-6">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8">
            <h3 className="text-2xl font-bold mb-6">Your Investment Plan</h3>

            {/* Monthly Investment Slider */}
            <div className="mb-8">
              <label className="block text-lg mb-3">
                Monthly Investment: <span className="font-bold text-cyan-400">₹{monthlyInvestment.toLocaleString()}</span>
              </label>
              <input
                type="range"
                min="1000"
                max="50000"
                step="1000"
                value={monthlyInvestment}
                onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                className="w-full h-3 bg-white/20 rounded-full appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-sm text-gray-400 mt-2">
                <span>₹1,000</span>
                <span>₹50,000</span>
              </div>
            </div>

            {/* Years Slider */}
            <div className="mb-8">
              <label className="block text-lg mb-3">
                Years to Invest: <span className="font-bold text-purple-400">{years} years</span>
              </label>
              <input
                type="range"
                min="5"
                max="40"
                step="1"
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="w-full h-3 bg-white/20 rounded-full appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-sm text-gray-400 mt-2">
                <span>5 years</span>
                <span>40 years</span>
              </div>
            </div>

            {/* Return Rate Slider */}
            <div className="mb-8">
              <label className="block text-lg mb-3">
                Expected Annual Return: <span className="font-bold text-green-400">{returnRate}%</span>
              </label>
              <input
                type="range"
                min="5"
                max="15"
                step="0.5"
                value={returnRate}
                onChange={(e) => setReturnRate(Number(e.target.value))}
                className="w-full h-3 bg-white/20 rounded-full appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-sm text-gray-400 mt-2">
                <span>5%</span>
                <span>15%</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                💡 Stock markets historically return 10-12% annually
              </p>
            </div>
          </div>

          <button
            onClick={completeChallenge}
            className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full text-xl font-bold hover:scale-105 transition-transform flex items-center justify-center gap-2"
          >
            Complete Challenge <TrendingUp className="w-5 h-5" />
          </button>
        </div>

        {/* Right: Results */}
        <div className="space-y-6">
          {/* Goal Progress */}
          <div className={`backdrop-blur-lg border rounded-3xl p-8 ${
            isGoalReached 
              ? 'bg-green-500/20 border-green-500/30' 
              : 'bg-white/10 border-white/20'
          }`}>
            <h3 className="text-xl font-bold mb-4">
              {isGoalReached ? '🎯 Goal Reached!' : '🎯 Retirement Goal'}
            </h3>
            <div className="text-5xl font-bold mb-2">
              <span className={isGoalReached ? 'text-green-400' : 'text-yellow-400'}>
                ₹{(currentValues.futureValue / 10000000).toFixed(2)} Cr
              </span>
            </div>
            <div className="text-gray-400 mb-4">Target: ₹2 Crore</div>
            
            {/* Progress bar */}
            <div className="h-4 bg-black/30 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${
                  isGoalReached ? 'bg-green-500' : 'bg-yellow-500'
                }`}
                style={{ width: `${Math.min(100, (currentValues.futureValue / retirementGoal) * 100)}%` }}
              />
            </div>
            <div className="text-right text-sm text-gray-400 mt-2">
              {Math.round((currentValues.futureValue / retirementGoal) * 100)}% of goal
            </div>
          </div>

          {/* Breakdown */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8">
            <h3 className="text-xl font-bold mb-6">💰 Wealth Breakdown</h3>
            
            <div className="space-y-4">
              <div className="bg-black/30 rounded-xl p-4">
                <div className="text-sm text-gray-400 mb-1">Total Invested (Principal)</div>
                <div className="text-2xl font-bold text-cyan-400">
                  ₹{(currentValues.totalInvested / 10000000).toFixed(2)} Cr
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  ₹{monthlyInvestment.toLocaleString()}/month × {years * 12} months
                </div>
              </div>

              <div className="bg-black/30 rounded-xl p-4">
                <div className="text-sm text-gray-400 mb-1">Interest Earned 🚀</div>
                <div className="text-2xl font-bold text-yellow-400">
                  ₹{(currentValues.interestEarned / 10000000).toFixed(2)} Cr
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {Math.round((currentValues.interestEarned / currentValues.totalInvested) * 100)}% more than invested!
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-4">
                <div className="text-sm text-gray-400 mb-1">Final Amount</div>
                <div className="text-3xl font-bold text-green-400">
                  ₹{(currentValues.futureValue / 10000000).toFixed(2)} Cr
                </div>
              </div>
            </div>
          </div>

          {/* Insight */}
          <div className="bg-purple-500/20 border border-purple-500/30 rounded-xl p-6">
            <h4 className="font-bold mb-2">💡 Quick Insight:</h4>
            <p className="text-sm text-gray-300">
              {years < 15 && "Try increasing investment years to see explosive growth!"}
              {years >= 15 && years < 25 && "Time is working its magic. See how doubling time affects results!"}
              {years >= 25 && "You're leveraging the full power of compound interest!"}
            </p>
          </div>
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

export default TimeTraveler;