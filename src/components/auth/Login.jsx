import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';
import { Mail, Lock, AlertCircle } from 'lucide-react';

const Login = ({ onSuccess, onRegisterClick }) => {
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    // Basic validation
    if (!email.trim()) {
      setFormError('Email is required');
      return;
    }

    if (!password) {
      setFormError('Password is required');
      return;
    }

    try {
      await login({ email, password });
      if (onSuccess && typeof onSuccess === 'function') {
        onSuccess();
      }
    } catch (err) {
      // Error is already handled by the auth context
      console.error('Login error:', err);
    }
  };

  // For demo purposes, let's add a quick login function
  const handleDemoLogin = async () => {
    try {
      // In a real app, this would be a real API call
      // For demo, we'll use the mock user function
      const { setMockUser } = useAuth();
      setMockUser({
        name: 'Demo User',
        email: 'demo@example.com',
        subscriptionTier: 'pro',
        editsRemaining: 100
      });
      
      if (onSuccess && typeof onSuccess === 'function') {
        onSuccess();
      }
    } catch (err) {
      console.error('Demo login error:', err);
    }
  };

  return (
    <div className="glass-effect rounded-xl p-8 max-w-md w-full mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>

      {(error || formError) && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 mb-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-200">{formError || error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-white/70 mb-1">
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-white/40" />
            </div>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
              disabled={loading}
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-white/70 mb-1">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-white/40" />
            </div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
              disabled={loading}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 bg-white/10 border-white/30 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-white/70">
              Remember me
            </label>
          </div>

          <div className="text-sm">
            <a href="#" className="text-blue-400 hover:text-blue-300">
              Forgot password?
            </a>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/20"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-[#0f172a] text-white/50">Or continue with</span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleDemoLogin}
          disabled={loading}
        >
          Demo Account
        </Button>

        <div className="text-center mt-4">
          <p className="text-sm text-white/70">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={onRegisterClick}
              className="text-blue-400 hover:text-blue-300"
            >
              Sign up
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;

