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
      emoji: "📈",
      name: "Market Predictor",
      tagline: "Up or Down?",
      description: "Predict stock market trends and master the art of timing",
      gradientStart: "10b981",
      gradientEnd: "14b8a6"
    },
    {
      emoji: "🛍️",
      name: "Needs vs Wants",
      tagline: "Budget Master",
      description: "Learn to distinguish essential expenses from impulse buys",
      gradientStart: "a855f7",
      gradientEnd: "ec4899"
    },
    {
      emoji: "⏳",
      name: "Compound Goal",
      tagline: "Time Traveler",
      description: "Harness the power of compound interest over time",
      gradientStart: "f59e0b",
      gradientEnd: "f97316"
    },
    {
      emoji: "💳",
      name: "Debt Destroyer",
      tagline: "Freedom Fighter",
      description: "Master debt payoff strategies and break free",
      gradientStart: "ef4444",
      gradientEnd: "f43f5e"
    },
    {
      emoji: "🐷",
      name: "Savings Sprint",
      tagline: "Goal Crusher",
      description: "Build emergency funds and achieve savings milestones",
      gradientStart: "3b82f6",
      gradientEnd: "6366f1"
    },
    {
      emoji: "💡",
      name: "Smart Spender",
      tagline: "Decision Maker",
      description: "Make informed purchasing decisions every time",
      gradientStart: "eab308",
      gradientEnd: "d97706"
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

        {/* Game Preview Section with TiltedCard */}
        <section className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Game Collection</span>
              </h2>
              <p className="text-xl text-gray-400">Six powerful simulations. One financial genius. You.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 justify-items-center">
              {games.map((game, index) => (
                <TiltedCard
                  key={index}
                  imageSrc={`data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='420' viewBox='0 0 320 420'%3E%3Cdefs%3E%3ClinearGradient id='grad${index}' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23${game.gradientStart};stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23${game.gradientEnd};stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='320' height='420' rx='24' fill='url(%23grad${index})'/%3E%3Ctext x='160' y='180' font-size='100' text-anchor='middle' fill='white' opacity='0.95'%3E${game.emoji}%3C/text%3E%3Ctext x='160' y='290' font-size='32' font-weight='bold' text-anchor='middle' fill='white'%3E${game.name}%3C/text%3E%3Ctext x='160' y='330' font-size='20' text-anchor='middle' fill='rgba(255,255,255,0.85)'%3E${game.tagline}%3C/text%3E%3C/svg%3E`}
                  altText={game.name}
                  captionText={game.name}
                  containerHeight="420px"
                  containerWidth="320px"
                  imageHeight="420px"
                  imageWidth="320px"
                  rotateAmplitude={12}
                  scaleOnHover={1.08}
                  showMobileWarning={false}
                  showTooltip={true}
                  displayOverlayContent={true}
                  overlayContent={
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col items-center justify-end p-8 rounded-3xl">
                      <div className="text-7xl mb-4 animate-bounce">{game.emoji}</div>
                      <h3 className="text-3xl font-black mb-2 text-white drop-shadow-lg">{game.name}</h3>
                      <p className="text-lg text-cyan-300 font-semibold mb-3">{game.tagline}</p>
                      <p className="text-sm text-white/90 mb-5 text-center max-w-[280px]">{game.description}</p>
                      <button className="px-6 py-3 bg-white/20 backdrop-blur-md border-2 border-white/40 rounded-full text-white font-bold text-sm hover:bg-white/30 hover:scale-105 transition-all duration-300 shadow-lg">
                        Play Now →
                      </button>
                    </div>
                  }
                />
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