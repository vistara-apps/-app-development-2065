import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ImageEditor from './components/ImageEditor';
import PricingTable from './components/PricingTable';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import ApiDocs from './pages/ApiDocs';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import ErrorBoundary from './components/common/ErrorBoundary';

function AppContent() {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState('hero');
  const [authView, setAuthView] = useState('login');

  // Reset to hero view when user logs out
  useEffect(() => {
    if (!user && currentView === 'dashboard') {
      setCurrentView('hero');
    }
  }, [user, currentView]);

  const handleGetStarted = () => {
    setCurrentView('editor');
  };

  const handleUpgrade = () => {
    setCurrentView('pricing');
  };

  const handleViewChange = (view) => {
    // Check if user is authenticated for protected views
    if ((view === 'dashboard' || view === 'editor') && !user) {
      setCurrentView('auth');
      return;
    }
    
    setCurrentView(view);
  };

  return (
    <div className="min-h-screen gradient-bg text-white">
      <Navbar 
        user={user} 
        onViewChange={handleViewChange}
        currentView={currentView}
      />
      
      <main className="pt-16">
        <ErrorBoundary>
          {currentView === 'hero' && (
            <Hero onGetStarted={handleGetStarted} />
          )}
          
          {currentView === 'editor' && (
            <ImageEditor 
              user={user} 
              onUpgrade={handleUpgrade}
              onLogin={() => setCurrentView('auth')}
            />
          )}
          
          {currentView === 'pricing' && (
            <PricingTable 
              user={user}
              onUpgrade={(tier) => {
                // If user is not logged in, redirect to auth
                if (!user) {
                  setCurrentView('auth');
                  return;
                }
                
                // In a real app, this would trigger the Stripe checkout
                // For now, we'll just redirect to the editor
                setCurrentView('editor');
              }}
            />
          )}
          
          {currentView === 'auth' && (
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              {authView === 'login' ? (
                <Login 
                  onSuccess={() => setCurrentView('editor')}
                  onRegisterClick={() => setAuthView('signup')}
                />
              ) : (
                <Signup 
                  onSuccess={() => setCurrentView('editor')}
                  onLoginClick={() => setAuthView('login')}
                />
              )}
            </div>
          )}
          
          {currentView === 'dashboard' && (
            <Dashboard />
          )}
          
          {currentView === 'api' && (
            <ApiDocs />
          )}
        </ErrorBoundary>
      </main>
      
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;

