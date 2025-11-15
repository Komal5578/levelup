import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, ShoppingBag, Target, CreditCard, Trophy, User, LogOut, Clock, Zap } from 'lucide-react';
import gamehubVideo from '../assets/gamehub-background.mp4';


const GameHub = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [balance, setBalance] = useState(100000);
  const [sessionTime, setSessionTime] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    // Get user data from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setUserName(user.name || user.email || 'Player');
    
    // Get game progress
    const progress = JSON.parse(localStorage.getItem('gameProgress') || '{}');
    setBalance(progress.balance || 100000);

    // Function to update leaderboard
    const updateLeaderboard = () => {
      setIsUpdating(true);
      const dummyLeaderboard = [
        { name: 'Sakshi Patel', game: 'Market Predictor', score: 95, totalXP: 950, gamesCompleted: 6, avgScore: 92 },
        { name: 'Minal More', game: 'Debt Destroyer', score: 88, totalXP: 880, gamesCompleted: 6, avgScore: 85 },
        { name: 'Rohan Singh', game: 'Credit Quest', score: 91, totalXP: 910, gamesCompleted: 6, avgScore: 88 },
        { name: 'Sonal Mehta', game: 'Savings Sprint', score: 86, totalXP: 860, gamesCompleted: 5, avgScore: 83 },
        { name: ' Kristina Mathew ', game: 'Needs vs Wants', score: 89, totalXP: 890, gamesCompleted: 6, avgScore: 87 }
      ];
      const storageData = JSON.parse(localStorage.getItem('leaderboard') || '[]');
      // Combine real data with dummy data, then sort and take top 5
      const combinedData = [...storageData, ...dummyLeaderboard]
        .sort((a, b) => b.totalXP - a.totalXP)
        .slice(0, 5);
      setLeaderboard(combinedData);
      setTimeout(() => setIsUpdating(false), 500);
    };

    // Update leaderboard immediately
    updateLeaderboard();

    // Start session timer
    const timer = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);

    // Update leaderboard every 30 seconds
    const leaderboardTimer = setInterval(updateLeaderboard, 30000);

    return () => {
      clearInterval(timer);
      clearInterval(leaderboardTimer);
    };
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const games = [
    {
      id: 'market-predictor',
      emoji: "📈",
      icon: <TrendingUp className="w-12 h-12" />,
      name: "Market Predictor",
      tagline: "Beat the market odds",
      difficulty: "⭐⭐",
      time: "7 min",
      color: "from-emerald-500 to-teal-600",
      route: '/game/market-predictor'
    },
    {
      id: 'needs-vs-wants',
      emoji: "🛍",
      icon: <ShoppingBag className="w-12 h-12" />,
      name: "Needs vs Wants",
      tagline: "Budget like a pro",
      difficulty: "⭐",
      time: "5 min",
      color: "from-purple-500 to-pink-600",
      route: '/game/needs-vs-wants'
    },
    {
      id: 'time-traveler',
      emoji: "⏳",
      icon: <Target className="w-12 h-12" />,
      name: "Time Traveler",
      tagline: "See compound magic",
      difficulty: "⭐⭐",
      time: "6 min",
      color: "from-amber-500 to-orange-600",
      route: '/game/time-traveler'
    },
    {
      id: 'debt-destroyer',
      emoji: "💳",
      icon: <CreditCard className="w-12 h-12" />,
      name: "Debt Destroyer",
      tagline: "Escape interest traps",
      difficulty: "⭐⭐⭐",
      time: "8 min",
      color: "from-red-500 to-rose-600",
      route: '/game/debt-destroyer'
    },
    {
    id: 'credit-quest',
    emoji: "💳",
    icon: <CreditCard className="w-12 h-12" />,
    name: "Credit Quest",
    tagline: "Master credit decisions",
    difficulty: "⭐⭐",
    time: "7 min",
    color: "from-indigo-500 to-purple-600",
    route: '/game/credit-quest'
  },
  {
    id: 'savings-sprint',
    emoji: "💰",
    icon: <TrendingUp className="w-12 h-12" />,
    name: "Savings Sprint",
    tagline: "Compound interest magic",
    difficulty: "⭐",
    time: "5 min",
    color: "from-purple-500 to-pink-600",
    route: '/game/savings-sprint'
  },
    
  ];

  const handleGameClick = (game) => {
    navigate(game.route);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const handleLevelUpFiClick = () => {
    navigate('/landing');
  };

  // Get leaderboard with dummy data

  return (
    <div className="min-h-screen relative text-white overflow-hidden">
      {/* Background Video */}
      <div className="fixed inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src={gamehubVideo} type="video/mp4" />
        </video>
        {/* Reduced overlay for better video visibility */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/60 via-purple-900/50 to-slate-900/60"></div>
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10">
        {/* Header */}
        <header className="bg-black/20 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <h1 
              className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent cursor-pointer drop-shadow-lg"
              onClick={handleLevelUpFiClick}
            >
              LevelUpFi
            </h1>

            <div className="flex items-center gap-4">
              {/* Balance */}
              <div className="bg-white/10 backdrop-blur-xl px-6 py-3 rounded-full border border-green-500/30 shadow-lg shadow-green-500/10">
                <span className="text-sm text-gray-300">Balance: </span>
                <span className="text-xl font-bold text-green-400">₹{balance.toLocaleString()}</span>
              </div>

              {/* Session Time */}
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xl px-4 py-3 rounded-full border border-white/20 shadow-lg">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-mono text-white">{formatTime(sessionTime)}</span>
              </div>

              {/* User */}
              <div className="flex items-center gap-3">
                <div className="bg-white/10 backdrop-blur-xl px-4 py-3 rounded-full border border-white/20 flex items-center gap-2 shadow-lg">
                  <User className="w-4 h-4 text-purple-400" />
                  <span className="font-medium text-white">{userName}</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="p-3 bg-red-500/20 hover:bg-red-500/30 backdrop-blur-xl rounded-full border border-red-500/30 transition-all hover:scale-110 shadow-lg"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content - Games */}
            <div className="lg:col-span-2 space-y-8">
              {/* Welcome Section */}
              <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 shadow-2xl">
                <h2 className="text-3xl font-bold mb-2 text-white drop-shadow-lg">Welcome back, {userName}! 👋</h2>
                <p className="text-gray-200 text-lg">Ready to level up your financial skills?</p>
              </div>

              {/* Games Grid */}
              <div>
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white drop-shadow-lg">
                  <Zap className="w-6 h-6 text-yellow-400" />
                  Choose Your Challenge
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {games.map((game, index) => {
                    const isCompleted = JSON.parse(localStorage.getItem('gameProgress') || '{}').completed?.includes(game.id);
                    
                    return (
                      <div
                        key={index}
                        onClick={() => handleGameClick(game)}
                        className="group relative bg-white/10 backdrop-blur-2xl border border-white/30 rounded-3xl p-8 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 cursor-pointer overflow-hidden"
                      >
                        {/* Gradient overlay */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${game.color} opacity-0 group-hover:opacity-30 transition-opacity duration-300 rounded-3xl`}></div>
                        
                        <div className="relative z-10">
                          {/* Status Badge */}
                          {isCompleted && (
                            <div className="absolute top-0 right-0 bg-green-500/30 backdrop-blur-xl border border-green-500/50 rounded-full px-3 py-1 text-xs text-green-300 font-semibold flex items-center gap-1 shadow-lg">
                              ✅ Completed
                            </div>
                          )}

                          <div className="text-6xl mb-4 drop-shadow-lg">{game.emoji}</div>
                          <div className="text-white mb-4 drop-shadow-lg">{game.icon}</div>
                          <h3 className="text-2xl font-bold mb-2 text-white drop-shadow-lg">{game.name}</h3>
                          <p className="text-gray-200 mb-4">{game.tagline}</p>
                          
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-yellow-400 font-semibold">{game.difficulty}</span>
                            <span className="text-gray-200">⏱️ {game.time}</span>
                          </div>

                          <button className="mt-4 w-full py-3 bg-white/20 hover:bg-white/30 backdrop-blur-xl border border-white/40 rounded-full font-semibold transition-all group-hover:border-white/60 text-white shadow-lg">
                            {isCompleted ? 'Play Again →' : 'Start Game →'}
                          </button>
                        </div>

                        {/* Shine effect */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Sidebar - Leaderboard */}
            <div className="space-y-6">
              {/* Leaderboard */}
              <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-6 sticky top-24 shadow-2xl">
                <div className="flex items-center gap-2 mb-6">
                  <Trophy className="w-6 h-6 text-yellow-400" />
                  <h3 className="text-xl font-bold text-white drop-shadow-lg">Top Players Today</h3>
                </div>

                {leaderboard.length > 0 ? (
                  <div className="space-y-3">
                    {leaderboard.map((player, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-xl p-3 rounded-xl transition-colors border border-white/10 shadow-lg"
                      >
                        <div className="text-2xl drop-shadow-lg">
                          {index === 0 && '🥇'}
                          {index === 1 && '🥈'}
                          {index === 2 && '🥉'}
                          {index > 2 && `#${index + 1}`}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-white">{player.name}</div>
                          <div className="text-xs text-gray-300">
                            {player.gamesCompleted}/4 games • {player.avgScore}% avg
                          </div>
                        </div>
                        <div className="text-yellow-400 font-bold drop-shadow-lg">{player.totalXP} XP</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-300">
                    <Trophy className="w-12 h-12 mx-auto mb-3 opacity-40 drop-shadow-lg" />
                    <p>Be the first on the leaderboard!</p>
                  </div>
                )}

                <div className="mt-6 pt-6 border-t border-white/20">
                  <style>{`
                    @keyframes pulse-dot {
                      0%, 100% { opacity: 1; }
                      50% { opacity: 0.3; }
                    }
                    .pulse-indicator {
                      animation: pulse-dot 1s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                    }
                  `}</style>
                  <div className="text-sm text-gray-300 text-center">
                    <span className={`inline-block ${isUpdating ? 'pulse-indicator' : ''}`}>🔴</span> <span className="text-green-400 font-semibold drop-shadow-lg">LIVE</span> • Updates every 30s
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-6 shadow-2xl">
                <h3 className="text-lg font-bold mb-4 text-white drop-shadow-lg">Your Progress</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-200">Games Completed</span>
                    <span className="font-bold text-cyan-400 drop-shadow-lg">
                      {JSON.parse(localStorage.getItem('gameProgress') || '{}').completed?.length || 0}/6
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-200">Session Time</span>
                    <span className="font-bold text-purple-400 drop-shadow-lg">{formatTime(sessionTime)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-200">Current Streak</span>
                    <span className="font-bold text-orange-400 drop-shadow-lg">🔥 1 day</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameHub;