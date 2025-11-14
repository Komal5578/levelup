import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CreditCard, Check, X } from 'lucide-react';

export default function CreditQuest() {
  const navigate = useNavigate();
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [creditScore, setCreditScore] = useState(650);
  const [answers, setAnswers] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);

  const scenarios = [
    {
      question: "You just got your first credit card. What's the best practice?",
      options: [
        { 
          text: "Max it out immediately to build credit fast", 
          impact: -40, 
          feedback: "❌ High credit utilization hurts your score. Keep it under 30%.",
          correct: false
        },
        { 
          text: "Use it regularly and pay the full balance each month", 
          impact: 30, 
          feedback: "✅ Perfect! Regular use with full payments builds excellent credit.",
          correct: true
        },
        { 
          text: "Never use it to avoid debt", 
          impact: -10, 
          feedback: "⚠ Not using it won't build credit history. Use it wisely.",
          correct: false
        },
        { 
          text: "Pay only the minimum payment", 
          impact: -20, 
          feedback: "❌ Minimum payments lead to high interest charges.",
          correct: false
        }
      ]
    },
    {
      question: "You're 2 months behind on a credit card payment. What should you do?",
      options: [
        { 
          text: "Ignore it and hope it goes away", 
          impact: -50, 
          feedback: "❌ This will severely damage your credit and lead to collections.",
          correct: false
        },
        { 
          text: "Call the creditor to arrange a payment plan", 
          impact: 20, 
          feedback: "✅ Great choice! Creditors often work with you to avoid default.",
          correct: true
        },
        { 
          text: "Close the account", 
          impact: -30, 
          feedback: "❌ This doesn't eliminate debt and hurts your credit history.",
          correct: false
        },
        { 
          text: "Apply for another card to pay this one", 
          impact: -35, 
          feedback: "❌ This creates more debt and multiple hard inquiries.",
          correct: false
        }
      ]
    },
    {
      question: "How many credit cards should you ideally have?",
      options: [
        { 
          text: "None - cash only", 
          impact: -15, 
          feedback: "⚠ No cards means no credit history for future needs.",
          correct: false
        },
        { 
          text: "2-3 cards used responsibly", 
          impact: 25, 
          feedback: "✅ Perfect! Multiple cards show you can manage credit wisely.",
          correct: true
        },
        { 
          text: "As many as possible", 
          impact: -25, 
          feedback: "❌ Too many cards increase risk and temptation.",
          correct: false
        },
        { 
          text: "Just one", 
          impact: 10, 
          feedback: "⚠ Okay, but multiple cards can improve your credit mix.",
          correct: false
        }
      ]
    },
    {
      question: "Your credit card limit is 5,000. What's the ideal balance to maintain?",
      options: [
        { 
          text: "0 - never use it", 
          impact: 5, 
          feedback: "⚠ Some usage is better to show activity.",
          correct: false
        },
        { 
          text: "Under 1,500 (30% utilization)", 
          impact: 35, 
          feedback: "✅ Excellent! Under 30% utilization is ideal for your score.",
          correct: true
        },
        { 
          text: "4,000 (80% utilization)", 
          impact: -35, 
          feedback: "❌ High utilization signals financial stress to lenders.",
          correct: false
        },
        { 
          text: "5,000 (maxed out)", 
          impact: -45, 
          feedback: "❌ Maxing out cards severely hurts your credit score.",
          correct: false
        }
      ]
    },
    {
      question: "You're shopping for a car loan. How should you handle credit checks?",
      options: [
        { 
          text: "Apply to 10+ lenders over several months", 
          impact: -30, 
          feedback: "❌ Multiple hard inquiries over time hurt your score.",
          correct: false
        },
        { 
          text: "Apply to multiple lenders within 14-45 days", 
          impact: 25, 
          feedback: "✅ Smart! Multiple inquiries for the same loan count as one.",
          correct: true
        },
        { 
          text: "Avoid all credit checks", 
          impact: -10, 
          feedback: "⚠ You need to compare rates - do it strategically.",
          correct: false
        },
        { 
          text: "Use only your bank without comparing", 
          impact: 10, 
          feedback: "⚠ Comparing rates could save thousands, do it wisely.",
          correct: false
        }
      ]
    }
  ];

  const handleAnswer = (option) => {
    const newScore = Math.max(300, Math.min(850, creditScore + option.impact));
    setCreditScore(newScore);
    setAnswers([...answers, { option, score: newScore }]);
    setShowFeedback(true);
  };

  const handleNext = () => {
    setShowFeedback(false);
    if (currentQuestion < scenarios.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setGameComplete(true);
      handleGameComplete();
    }
  };

  const handleGameComplete = async () => {
    const correctAnswers = answers.filter(a => a.option.correct).length;
    const score = Math.round((correctAnswers / scenarios.length) * 100);
    
    // Save to localStorage
    const progress = JSON.parse(localStorage.getItem('gameProgress') || '{}');
    progress.completed = [...(progress.completed || []), 'credit-quest'];
    progress.lastScore = score;
    localStorage.setItem('gameProgress', JSON.stringify(progress));

    // Save to leaderboard
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard') || '[]');
    leaderboard.push({
      name: user.name || user.email || 'Player',
      game: 'Credit Quest',
      score: score,
      totalXP: score * 10,
      gamesCompleted: 1,
      avgScore: score,
      timestamp: Date.now()
    });
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
    
    setGameComplete(true);
  };

  const handleExit = () => {
    navigate('/dashboard');
  };

  const getScoreColor = (score) => {
    if (score >= 750) return 'text-green-600';
    if (score >= 700) return 'text-blue-600';
    if (score >= 650) return 'text-yellow-600';
    if (score >= 600) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score) => {
    if (score >= 750) return 'Excellent';
    if (score >= 700) return 'Good';
    if (score >= 650) return 'Fair';
    if (score >= 600) return 'Poor';
    return 'Very Poor';
  };

  const progress = ((currentQuestion + 1) / scenarios.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center p-6">
      <div className="max-w-3xl w-full">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <Link to="/dashboard">
              <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </button>
            </Link>
            <div className="flex items-center gap-3">
              <CreditCard className="w-6 h-6 text-indigo-400" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Credit Quest</h1>
            </div>
            <div></div>
          </div>

          {!gameComplete ? (
            <>
              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Question {currentQuestion + 1} of {scenarios.length}</span>
                  <span className="text-sm text-gray-400">{Math.round(progress)}% Complete</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
                    style={{ width: `{progress}%` }}
                  />
                </div>
              </div>

              {/* Credit Score Display */}
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 mb-8 text-center">
                <div className="text-sm text-gray-400 mb-2">Your Credit Score</div>
                <div className={`text-6xl font-bold ${getScoreColor(creditScore)} mb-2`}>
                  {creditScore}
                </div>
                <div className={`text-lg font-semibold ${getScoreColor(creditScore)}`}>
                  {getScoreLabel(creditScore)}
                </div>
                <div className="mt-4">
                  <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${
                        creditScore >= 750 ? 'bg-green-500' :
                        creditScore >= 700 ? 'bg-blue-500' :
                        creditScore >= 650 ? 'bg-yellow-500' :
                        creditScore >= 600 ? 'bg-orange-500' : 'bg-red-500'
                      }`}
                      style={{ width: `{((creditScore - 300) / 550) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>300</span>
                    <span>850</span>
                  </div>
                </div>
              </div>

              {/* Question Card */}
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-12 text-center mb-6">
                <h2 className="text-3xl font-bold mb-8">
                  {scenarios[currentQuestion].question}
                </h2>

                {!showFeedback ? (
                  <div className="space-y-4">
                    {scenarios[currentQuestion].options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswer(option)}
                        className="w-full text-left h-auto py-4 px-6 hover:bg-white/20 hover:border-indigo-300 transition-all border border-white/30 rounded-xl bg-white/5 text-white"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-500/30 flex items-center justify-center flex-shrink-0 font-bold text-indigo-300">
                            {String.fromCharCode(65 + index)}
                          </div>
                          <span className="flex-1">{option.text}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className={`p-6 rounded-xl ${
                      answers[answers.length - 1].option.correct 
                        ? 'bg-green-500/20 border-2 border-green-500/50' 
                        : 'bg-red-500/20 border-2 border-red-500/50'
                    }`}>
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          answers[answers.length - 1].option.correct 
                            ? 'bg-green-500' 
                            : 'bg-red-500'
                        }`}>
                          {answers[answers.length - 1].option.correct ? (
                            <Check className="w-6 h-6 text-white" />
                          ) : (
                            <X className="w-6 h-6 text-white" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className={`text-lg font-semibold mb-2 ${
                            answers[answers.length - 1].option.correct ? 'text-green-300' : 'text-red-300'
                          }`}>
                            {answers[answers.length - 1].option.feedback}
                          </p>
                          <p className={`text-sm ${
                            answers[answers.length - 1].option.correct ? 'text-green-300/80' : 'text-red-300/80'
                          }`}>
                            Credit Score: {answers[answers.length - 2]?.score || 650} → {answers[answers.length - 1].score} 
                            ({answers[answers.length - 1].option.impact > 0 ? '+' : ''}{answers[answers.length - 1].option.impact})
                          </p>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleNext}
                      className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-xl font-semibold transition-transform hover:scale-105"
                    >
                      {currentQuestion < scenarios.length - 1 ? 'Next Question' : 'Complete Game'}
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-12">
              <div className="text-center mb-8">
                <div className="text-7xl mb-6">🎓</div>
                <h1 className="text-4xl font-bold mb-4">Quest Complete!</h1>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-black/30 rounded-xl p-6 text-center">
                  <div className="text-3xl font-bold text-green-400">{creditScore}</div>
                  <div className="text-gray-400">Final Credit Score</div>
                </div>
                <div className="bg-black/30 rounded-xl p-6 text-center">
                  <div className="text-3xl font-bold text-purple-400">{Math.round((answers.filter(a => a.option.correct).length / scenarios.length) * 100)}%</div>
                  <div className="text-gray-400">Accuracy</div>
                </div>
              </div>

              <div className="bg-indigo-500/20 border border-indigo-500/30 rounded-xl p-6 mb-8 text-center">
                <p className={`text-lg font-semibold ${getScoreColor(creditScore)}`}>
                  {getScoreLabel(creditScore)} Score
                </p>
                <p className="text-sm text-gray-400 mt-2">You're on the path to financial success!</p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setCurrentQuestion(0);
                    setCreditScore(650);
                    setAnswers([]);
                    setShowFeedback(false);
                    setGameComplete(false);
                  }}
                  className="flex-1 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl text-xl font-bold hover:scale-105 transition-transform"
                >
                  Play Again
                </button>
                <button
                  onClick={handleExit}
                  className="flex-1 py-4 bg-white/10 border border-white/20 rounded-xl text-xl font-bold hover:bg-white/20 transition-colors"
                >
                  Dashboard
                </button>
              </div>
            </div>
          )}

        {/* Progress indicators */}
        {!gameComplete && (
          <div className="mt-8 flex justify-center gap-2">
            {scenarios.map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full transition-all ${
                  i < currentQuestion 
                    ? answers[i]?.option.correct 
                      ? 'bg-green-500' 
                      : 'bg-red-500'
                    : i === currentQuestion
                    ? 'bg-yellow-400 animate-pulse'
                    : 'bg-white/20'
                }`}
              />
            ))}
          </div>
        )}

        {/* Exit button */}
        {!gameComplete && (
          <div className="mt-6 text-center">
            <button
              onClick={handleExit}
              className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 mx-auto"
            >
              <ArrowLeft className="w-4 h-4" /> Exit Game
            </button>
          </div>
        )}
      </div>
    </div>
  );
}