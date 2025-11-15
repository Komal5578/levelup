import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import moneyTransfer from '../assets/Money Transfer.json';
import loadingBar from '../assets/Loading bar.json';
import loadingVideo from '../assets/loading-video.mp4';
import backgroundVideo from '../assets/background-landing.mp4';
import { TrendingUp, ShoppingBag, Target, CreditCard, Sparkles, Zap, Trophy, ArrowRight, Play, CheckCircle, PiggyBank, Lightbulb } from 'lucide-react';
import BlurText from '../components/BlurText';
import TiltedCard from '../components/TiltedCard';

const Landing = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [showFeatures, setShowFeatures] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setTimeout(() => setShowFeatures(true), 300);
    }, 5500);
    return () => clearTimeout(timer);
  }, []);

  const handleGetStarted = () => {
    navigate('/login');
  };

  const handleAnimationComplete = () => {
    console.log('BlurText animation completed!');
  };

  const games = [
    {
      name: "Market Predictor",
      tagline: "Up or Down?",
      description: "Predict stock market trends and master the art of timing",
      color: "from-emerald-400 to-teal-600",
      icon: "📈"
    },
    {
      name: "Needs vs Wants",
      tagline: "Budget Master",
      description: "Learn to distinguish essential expenses from impulse buys",
      color: "from-purple-400 to-pink-600",
      icon: "🛍️"
    },
    {
      name: "Compound Goal",
      tagline: "Time Traveler",
      description: "Harness the power of compound interest over time",
      color: "from-amber-400 to-orange-600",
      icon: "⏳"
    },
    {
      name: "Debt Destroyer",
      tagline: "Freedom Fighter",
      description: "Master debt payoff strategies and break free",
      color: "from-red-400 to-rose-600",
      icon: "💳"
    },
    {
      name: "Savings Sprint",
      tagline: "Goal Crusher",
      description: "Build emergency funds and achieve savings milestones",
      color: "from-blue-400 to-indigo-600",
      icon: "🐷"
    },
    {
      name: "Smart Spender",
      tagline: "Decision Maker",
      description: "Make informed purchasing decisions every time",
      color: "from-yellow-400 to-amber-600",
      icon: "💡"
    }
  ];

  const features = [
    {
      icon: <Play className="w-10 h-10" />,
      title: "6 Fun Games",
      description: "Real-world money scenarios disguised as addictive challenges"
    },
    {
      icon: <Zap className="w-10 h-10" />,
      title: "Learn By Playing",
      description: "No boring lectures—just hands-on financial wisdom"
    },
    {
      icon: <Trophy className="w-10 h-10" />,
      title: "Track Progress",
      description: "Watch yourself level up from novice to money master"
    }
  ];

  if (isLoading) {
    const letters = "LevelUpFi".split("");
    
    return (
      <div className="relative flex flex-col items-center justify-center h-screen overflow-hidden">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={loadingVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        <div className="absolute inset-0 bg-black/30"></div>
        
        <div className="relative z-10 flex flex-col items-center justify-center">
          <div className="mb-16">
            <h1 className="text-6xl md:text-7xl font-extrabold drop-shadow-2xl pb-4">
              {letters.map((letter, index) => (
                <span
                  key={index}
                  className="inline-block animate-bounce"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                    animationDuration: '0.8s',
                    color: index < 5 ? '#06b6d4' : '#22d3ee'
                  }}
                >
                  {letter}
                </span>
              ))}
            </h1>
          </div>
          
          <Lottie animationData={moneyTransfer} loop={true} className="w-72 h-72 -mb-8" />
          <Lottie animationData={loadingBar} loop={true} className="w-64 h-12" />
          
          <BlurText
            text="LEVEL UP YOUR FINANCIAL JOURNEY....."
            delay={100}
            animateBy="words"
            direction="top"
            onAnimationComplete={handleAnimationComplete}
            className="text-2xl font-medium text-white-400 mt-8 drop-shadow-lg"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      <div className="fixed inset-0 z-0">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="w-full h-full object-cover opacity-40"
        >
          <source src={backgroundVideo} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-slate-900/60 to-slate-900/80"></div>
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-20 pb-32">
          <div className="text-center max-w-5xl mx-auto space-y-8 animate-fade-in">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Sparkles className="w-8 h-8 text-yellow-400 animate-pulse" />
              <h2 className="text-2xl md:text-3xl font-semibold text-cyan-400">
                Welcome Back, Champion! 👋
              </h2>
              <Sparkles className="w-8 h-8 text-yellow-400 animate-pulse" />
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight">
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
                Master Money
              </span>
              <br />
              <span className="text-white">Through Games</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Level up your financial IQ with 6 addictive games that teach real-world money skills. No textbooks. Just play.
            </p>

            <button 
              onClick={handleGetStarted}
              className="group relative mt-8 px-12 py-5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full text-xl font-bold shadow-2xl hover:shadow-cyan-500/50 transform hover:scale-105 transition-all duration-300"
            >
              <span className="flex items-center gap-3">
                Start Learning
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </span>
              <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
            </button>

            <div className="flex items-center justify-center gap-8 mt-12 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>100% Free</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>No Ads</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>Instant Results</span>
              </div>
            </div>
          </div>

          <div className="absolute bottom-10 animate-bounce">
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
              <div className="w-1.5 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 px-6 bg-gradient-to-b from-transparent to-slate-900/80">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
              Why You'll <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Love This</span>
            </h2>

            <div className={`grid md:grid-cols-3 gap-8 transition-all duration-1000 ${showFeatures ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8 hover:bg-white/10 hover:border-purple-500/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/20"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="text-cyan-400 mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Game Preview Section */}
        <section className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Game Collection</span>
              </h2>
              <p className="text-xl text-gray-400">Six powerful simulations. One financial genius. You.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {games.map((game, index) => (
                <div 
                  key={index}
                  className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 rounded-3xl p-8 hover:scale-105 transition-all duration-300 cursor-pointer overflow-hidden"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br from-${game.gradientStart} to-${game.gradientEnd} opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-3xl`}></div>
                  
                  <div className="relative z-10">
                    <div className="text-6xl mb-4">{game.emoji}</div>
                    <h3 className="text-2xl font-bold mb-2">{game.name}</h3>
                    <p className="text-sm text-cyan-400 mb-3 font-semibold">{game.tagline}</p>
                    <p className="text-sm text-gray-400 mb-4">{game.description}</p>
                    
                    <div className="mt-4 inline-block px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full text-xs text-purple-300 font-semibold">
                      Click to Play →
                    </div>
                  </div>

                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA Section */}
        <section className="py-24 px-6 bg-gradient-to-t from-slate-900 to-transparent">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-4xl md:text-6xl font-bold">
              Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400">Level Up?</span>
            </h2>
            <p className="text-xl text-gray-400">
              Your financial transformation starts with a single click
            </p>
            <button 
              onClick={handleGetStarted}
              className="group relative px-16 py-6 bg-gradient-to-r from-green-500 via-cyan-500 to-purple-600 rounded-full text-2xl font-bold shadow-2xl hover:shadow-cyan-500/50 transform hover:scale-110 transition-all duration-300 animate-pulse hover:animate-none"
            >
              <span className="flex items-center gap-4">
                Get Started Now
                <Sparkles className="w-7 h-7 group-hover:rotate-180 transition-transform duration-500" />
              </span>
            </button>

            <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
              <span>✓ Trusted by learners</span>
              <span>✓ Real financial principles</span>
              <span>✓ Instant feedback</span>
              <span>✓ Zero risk practice</span>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-6 border-t border-white/10">
          <div className="max-w-7xl mx-auto text-center text-gray-500 text-sm">
            <p>© 2024 LevelUpFi. Learn. Play. Master Money.</p>
          </div>
        </footer>
      </div>

      <style>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Landing;