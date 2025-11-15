import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../../firebase.config';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import backgroundVideo from '../assets/background-landing.mp4';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Helper function to save user data to localStorage
  const saveUserData = (user) => {
    const userData = {
      uid: user.uid,
      email: user.email,
      name: user.displayName || user.email.split('@')[0], // Use displayName or email prefix
      photoURL: user.photoURL,
      emailVerified: user.emailVerified
    };
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Save user data to localStorage
      saveUserData(userCredential.user);
      
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);

    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      
      // Save user data to localStorage
      saveUserData(userCredential.user);
      
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Google login error:', error);
      toast.error(error.message || 'Google login failed');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="h-screen relative flex items-center justify-center px-4 overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={backgroundVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Dark overlay for better readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/85 via-blue-950/85 to-black/85"></div>

      {/* Animated decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-gradient-to-br from-cyan-400 via-blue-500 to-transparent opacity-10 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-tr from-blue-500 via-cyan-400 to-transparent opacity-10 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative w-full max-w-md z-10">
        {/* Main card */}
        <div className="bg-gradient-to-br from-gray-900/80 via-blue-950/80 to-gray-900/80 backdrop-blur-2xl border border-cyan-500/30 rounded-2xl shadow-2xl shadow-cyan-500/20 p-8 space-y-5">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-400 via-blue-500 to-blue-600 rounded-2xl mb-3 shadow-lg shadow-cyan-500/50 animate-pulse">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-blue-500 bg-clip-text text-transparent mb-2">Welcome back</h1>
              <p className="text-sm text-gray-300">Sign in to continue your journey with LevelUpFi</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-cyan-300">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 transition-colors group-focus-within:text-cyan-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-3 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-all duration-300 backdrop-blur-sm text-sm hover:border-cyan-500/50"
                  placeholder="Enter your email address"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-cyan-300">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 transition-colors group-focus-within:text-cyan-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-12 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-all duration-300 backdrop-blur-sm text-sm hover:border-cyan-500/50"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-cyan-400 transition-colors duration-200"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-blue-600 text-white py-3 rounded-xl font-bold hover:shadow-xl hover:shadow-cyan-500/50 transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none flex items-center justify-center space-x-2 text-sm mt-6"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-4 bg-gradient-to-r from-gray-900 via-blue-950 to-gray-900 text-gray-400">Or continue with</span>
            </div>
          </div>

          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full bg-white/5 border border-cyan-500/30 text-white py-3 rounded-xl font-medium hover:bg-white/10 hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 group text-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Footer */}
          <div className="text-center pt-4">
            <p className="text-gray-400 text-xs">
              Don't have an account?{' '}
              <Link 
                to="/register" 
                className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors duration-200 hover:underline"
              >
                Create account
              </Link>
            </p>
          </div>
        </div>

        {/* Bottom decorative text */}
        <div className="text-center mt-6">
          <p className="text-gray-500 text-xs flex items-center justify-center gap-2">
            <span className="inline-block w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
            Secure authentication powered by Firebase
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;