import React, { useState } from 'react';
import { Sparkles, User, Menu, X, LogOut, CreditCard, HardDrive, Code } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from './ui/Button';

const Navbar = ({ onViewChange, currentView }) => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const navItems = [
    { id: 'hero', label: 'Home' },
    { id: 'editor', label: 'Editor' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'api', label: 'API', icon: <Code className="w-4 h-4" /> }
  ];

  const profileMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <User className="w-4 h-4" /> },
    { id: 'subscription', label: 'Subscription', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'storage', label: 'Storage', icon: <HardDrive className="w-4 h-4" /> },
    { id: 'logout', label: 'Log Out', icon: <LogOut className="w-4 h-4" /> }
  ];

  const handleProfileAction = async (actionId) => {
    if (actionId === 'logout') {
      try {
        await logout();
        onViewChange('hero');
      } catch (error) {
        console.error('Logout error:', error);
      }
    } else if (actionId === 'subscription' || actionId === 'storage') {
      // Redirect to dashboard with the appropriate tab
      onViewChange('dashboard');
    } else {
      onViewChange(actionId);
    }
    
    setIsProfileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-white/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => onViewChange('hero')}
          >
            <Sparkles className="w-8 h-8 text-blue-400" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              PixelPerfect AI
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`text-sm font-medium transition-colors hover:text-blue-400 flex items-center gap-1 ${
                  currentView === item.id ? 'text-blue-400' : 'text-white/80'
                }`}
              >
                {item.icon && item.icon}
                {item.label}
              </button>
            ))}
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center space-x-3"
                >
                  <div className="text-sm">
                    <span className="text-white/60">Welcome back!</span>
                    <div className="text-xs text-blue-400 capitalize">
                      {user.subscriptionTier} Plan
                    </div>
                  </div>
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    {user.profileImage ? (
                      <img 
                        src={user.profileImage} 
                        alt={user.name} 
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <User className="w-4 h-4 text-white" />
                    )}
                  </div>
                </button>
                
                {/* Profile Dropdown */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 glass-effect rounded-xl overflow-hidden shadow-lg z-50">
                    <div className="py-2">
                      {profileMenuItems.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => handleProfileAction(item.id)}
                          className="w-full text-left px-4 py-2 text-sm text-white/80 hover:bg-white/10 flex items-center gap-2"
                        >
                          {item.icon}
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Button variant="outline" onClick={() => onViewChange('auth')}>
                Sign In
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/20">
            <div className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onViewChange(item.id);
                    setIsMenuOpen(false);
                  }}
                  className={`text-left px-4 py-2 text-sm font-medium transition-colors hover:text-blue-400 flex items-center gap-2 ${
                    currentView === item.id ? 'text-blue-400' : 'text-white/80'
                  }`}
                >
                  {item.icon && item.icon}
                  {item.label}
                </button>
              ))}
              
              {user ? (
                <>
                  <div className="px-4 py-2 border-t border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">{user.name || user.email}</div>
                        <div className="text-xs text-blue-400 capitalize">
                          {user.subscriptionTier} Plan
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {profileMenuItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        handleProfileAction(item.id);
                        setIsMenuOpen(false);
                      }}
                      className="text-left px-4 py-2 text-sm text-white/80 hover:bg-white/10 flex items-center gap-2"
                    >
                      {item.icon}
                      {item.label}
                    </button>
                  ))}
                </>
              ) : (
                <div className="px-4 pt-2">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      onViewChange('auth');
                      setIsMenuOpen(false);
                    }} 
                    className="w-full"
                  >
                    Sign In
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

