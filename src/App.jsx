import React, { useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import ImageEditor from './components/ImageEditor'
import PricingTable from './components/PricingTable'
import Footer from './components/Footer'

function App() {
  const [currentView, setCurrentView] = useState('hero')
  const [user, setUser] = useState(null)

  const handleGetStarted = () => {
    setCurrentView('editor')
  }

  const handleLogin = () => {
    // Mock login
    setUser({ 
      id: 1, 
      email: 'user@example.com', 
      subscriptionTier: 'free',
      editsRemaining: 3
    })
  }

  const handleUpgrade = () => {
    setCurrentView('pricing')
  }

  return (
    <div className="min-h-screen gradient-bg text-white">
      <Navbar 
        user={user} 
        onLogin={handleLogin}
        onViewChange={setCurrentView}
        currentView={currentView}
      />
      
      <main className="pt-16">
        {currentView === 'hero' && (
          <Hero onGetStarted={handleGetStarted} />
        )}
        
        {currentView === 'editor' && (
          <ImageEditor 
            user={user} 
            onUpgrade={handleUpgrade}
            onLogin={handleLogin}
          />
        )}
        
        {currentView === 'pricing' && (
          <PricingTable 
            user={user}
            onUpgrade={(tier) => {
              if (user) {
                setUser({ ...user, subscriptionTier: tier })
                setCurrentView('editor')
              }
            }}
          />
        )}
      </main>
      
      <Footer />
    </div>
  )
}

export default App