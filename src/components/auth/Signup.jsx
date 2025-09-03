import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';
import { Mail, Lock, User, AlertCircle } from 'lucide-react';

const Signup = ({ onSuccess, onLoginClick }) => {
  const { register, loading, error } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    // Basic validation
    if (!name.trim()) {
      setFormError('Name is required');
      return;
    }

    if (!email.trim()) {
      setFormError('Email is required');
      return;
    }

    if (!password) {
      setFormError('Password is required');
      return;
    }

    if (password.length < 8) {
      setFormError('Password must be at least 8 characters');
      return;
    }

    if (password !== confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }

    try {
      await register({ name, email, password });
      if (onSuccess && typeof onSuccess === 'function') {
        onSuccess();
      }
    } catch (err) {
      // Error is already handled by the auth context
      console.error('Registration error:', err);
    }
  };

  return (
    <div className="glass-effect rounded-xl p-8 max-w-md w-full mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Create an Account</h2>

      {(error || formError) && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 mb-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-200">{formError || error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-white/70 mb-1">
            Full Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-white/40" />
            </div>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="John Doe"
              disabled={loading}
            />
          </div>
        </div>

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
          <p className="mt-1 text-xs text-white/50">
            Must be at least 8 characters
          </p>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-white/70 mb-1">
            Confirm Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-white/40" />
            </div>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
              disabled={loading}
            />
          </div>
        </div>

        <div className="flex items-center">
          <input
            id="terms"
            name="terms"
            type="checkbox"
            className="h-4 w-4 bg-white/10 border-white/30 rounded"
            required
          />
          <label htmlFor="terms" className="ml-2 block text-sm text-white/70">
            I agree to the{' '}
            <a href="#" className="text-blue-400 hover:text-blue-300">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-blue-400 hover:text-blue-300">
              Privacy Policy
            </a>
          </label>
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          disabled={loading}
        >
          {loading ? 'Creating account...' : 'Create Account'}
        </Button>

        <div className="text-center mt-4">
          <p className="text-sm text-white/70">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onLoginClick}
              className="text-blue-400 hover:text-blue-300"
            >
              Sign in
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Signup;

