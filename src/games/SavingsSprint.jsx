import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, TrendingUp } from 'lucide-react';

export default function SavingsSprint() {
  const navigate = useNavigate();
  
  const [initialAmount, setInitialAmount] = useState(1000);
  const [monthlyContribution, setMonthlyContribution] = useState(200);
  const [interestRate, setInterestRate] = useState(5);
  const [years, setYears] = useState(10);
  const [calculated, setCalculated] = useState(false);
  const [result, setResult] = useState(null);

  const calculateCompoundInterest = () => {
    const P = parseFloat(initialAmount);
    const PMT = parseFloat(monthlyContribution);
    const r = parseFloat(interestRate) / 100 / 12; // Monthly rate
    const n = parseFloat(years) * 12; // Total months
    
    // Future value of initial amount
    const FV1 = P * Math.pow(1 + r, n);
    
    // Future value of monthly contributions (annuity)
    const FV2 = PMT * ((Math.pow(1 + r, n) - 1) / r);
    
    const totalValue = FV1 + FV2;
    const totalContributed = P + (PMT * n);
    const interestEarned = totalValue - totalContributed;
    
    // Generate year-by-year breakdown
    const breakdown = [];
    for (let year = 1; year <= years; year++) {
      const months = year * 12;
      const fv1 = P * Math.pow(1 + r, months);
      const fv2 = PMT * ((Math.pow(1 + r, months) - 1) / r);
      const value = fv1 + fv2;
      breakdown.push({
        year,
        value: value.toFixed(2),
        contributed: (P + (PMT * months)).toFixed(2)
      });
    }
    
    setResult({
      totalValue: totalValue.toFixed(2),
      totalContributed: totalContributed.toFixed(2),
      interestEarned: interestEarned.toFixed(2),
      breakdown
    });
    
    setCalculated(true);
  };

  const calculateScore = () => {
    // Score based on good financial decisions
    let score = 50; // Base score
    
    // Higher monthly contribution = better
    if (monthlyContribution >= 500) score += 30;
    else if (monthlyContribution >= 300) score += 20;
    else if (monthlyContribution >= 100) score += 10;
    
    // Longer time horizon = better
    if (years >= 20) score += 30;
    else if (years >= 10) score += 20;
    else if (years >= 5) score += 10;
    
    // Initial amount bonus
    if (initialAmount >= 5000) score += 20;
    else if (initialAmount >= 1000) score += 10;
    
    return Math.min(100, score);
  };

  const handleFinish = async () => {
    const score = calculateScore();
    
    // Save to localStorage
    const progress = JSON.parse(localStorage.getItem('gameProgress') || '{}');
    progress.completed = [...(progress.completed || []), 'savings-sprint'];
    progress.lastScore = score;
    localStorage.setItem('gameProgress', JSON.stringify(progress));

    // Save to leaderboard
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard') || '[]');
    leaderboard.push({
      name: user.name || user.email || 'Player',
      game: 'Savings Sprint',
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center p-6">
      <div className="max-w-5xl w-full">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <Link to="/dashboard">
            <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </button>
          </Link>
          <div className="flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-purple-400" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Savings Sprint</h1>
          </div>
          <div></div>
        </div>

        {/* Instructions Card */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-6 mb-8">
          <h3 className="text-xl font-bold mb-2">💰 Your Mission</h3>
          <p className="text-gray-300">
            Learn how compound interest can help your money grow over time. Adjust your savings strategy and see how small, consistent contributions can lead to significant wealth accumulation.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Input Card */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8">
            <h3 className="text-2xl font-bold mb-6">Your Savings Plan</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Initial Deposit</label>
                <input
                  type="number"
                  value={initialAmount}
                  onChange={(e) => setInitialAmount(e.target.value)}
                  min="0"
                  step="100"
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Monthly Contribution</label>
                <input
                  type="number"
                  value={monthlyContribution}
                  onChange={(e) => setMonthlyContribution(e.target.value)}
                  min="0"
                  step="50"
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Annual Interest Rate (%)</label>
                <input
                  type="number"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  min="0"
                  max="20"
                  step="0.5"
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                />
                <p className="text-xs text-gray-500 mt-2">Typical savings accounts: 0.5-2%, Index funds: 7-10%</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Time Period (Years)</label>
                <input
                  type="number"
                  value={years}
                  onChange={(e) => setYears(e.target.value)}
                  min="1"
                  max="50"
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <button
                onClick={calculateCompoundInterest}
                className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-semibold transition-transform hover:scale-105"
              >
                Calculate Growth
              </button>
            </div>
          </div>

          {/* Results Card */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8">
            <h3 className="text-2xl font-bold mb-6">Your Results</h3>
            
            {!calculated ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-purple-500/20 border border-purple-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-12 h-12 text-purple-400" />
                </div>
                <p className="text-gray-400">Enter your savings plan and calculate to see results</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Summary Cards */}
                <div className="space-y-3">
                  <div className="bg-black/30 rounded-xl p-4">
                    <div className="text-sm text-gray-400 mb-1">Future Value</div>
                    <div className="text-3xl font-bold text-green-400">
                      {parseFloat(result.totalValue).toLocaleString()}
                    </div>
                  </div>
                  
                  <div className="bg-black/30 rounded-xl p-4">
                    <div className="text-sm text-gray-400 mb-1">Total Contributed</div>
                    <div className="text-2xl font-bold text-blue-400">
                      {parseFloat(result.totalContributed).toLocaleString()}
                    </div>
                  </div>
                  
                  <div className="bg-black/30 rounded-xl p-4">
                    <div className="text-sm text-gray-400 mb-1">Interest Earned</div>
                    <div className="text-2xl font-bold text-purple-400">
                      {parseFloat(result.interestEarned).toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Growth Chart */}
                <div className="bg-black/30 rounded-xl p-4">
                  <h4 className="font-bold mb-3">Year-by-Year Growth</h4>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {result.breakdown.map((item) => (
                      <div key={item.year} className="flex items-center gap-2">
                        <div className="text-sm font-medium w-16 text-gray-400">Year {item.year}</div>
                        <div className="flex-1">
                          <div className="h-6 bg-white/10 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-end pr-2 transition-all"
                              style={{ width: `${(item.value / result.totalValue) * 100}%` }}
                            >
                              <span className="text-xs text-white font-medium">
                                {parseFloat(item.value).toLocaleString(undefined, {maximumFractionDigits: 0})}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleFinish}
                  className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl font-semibold transition-transform hover:scale-105"
                >
                  Complete Game
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Educational Tips */}
        {calculated && (
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-6 mt-8">
            <h3 className="text-xl font-bold mb-4">💡 Key Lessons</h3>
            <ul className="space-y-2 text-gray-300">
              <li>• <strong>Time is your friend:</strong> The longer you save, the more your money compounds</li>
              <li>• <strong>Consistency matters:</strong> Regular contributions add up significantly over time</li>
              <li>• <strong>Start early:</strong> Even small amounts grow substantially with compound interest</li>
              <li>• <strong>Interest rates matter:</strong> A few percentage points can mean thousands in difference</li>
            </ul>
          </div>
        )}

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
}