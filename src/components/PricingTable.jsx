import React from 'react'
import { Check, Sparkles, Zap, Crown } from 'lucide-react'
import Button from './ui/Button'

const PricingTable = ({ user, onUpgrade }) => {
  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: '$0',
      period: 'forever',
      icon: <Sparkles className="w-6 h-6" />,
      description: 'Perfect for trying out PixelPerfect AI',
      features: [
        '3 edits per month',
        'Basic background removal',
        'Standard enhancements',
        'Single image editing',
        'Community support'
      ],
      limitations: [
        'No batch editing',
        'No premium filters',
        'Limited exports'
      ],
      cta: 'Current Plan',
      popular: false
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$10',
      period: 'per month',
      icon: <Zap className="w-6 h-6" />,
      description: 'Best for content creators and small businesses',
      features: [
        '100 edits per month',
        'Advanced AI background removal',
        'All enhancement filters',
        'Batch editing (up to 20 images)',
        'Premium adjustments',
        'Direct social sharing',
        'Priority support',
        'HD exports'
      ],
      cta: 'Upgrade to Pro',
      popular: true
    },
    {
      id: 'max',
      name: 'Max',
      price: '$25',
      period: 'per month',
      icon: <Crown className="w-6 h-6" />,
      description: 'For power users and agencies',
      features: [
        'Unlimited edits',
        'Premium AI features',
        'Advanced batch editing (unlimited)',
        'Custom filters and presets',
        'API access',
        'White-label options',
        'Dedicated support',
        '4K exports',
        'Team collaboration'
      ],
      cta: 'Upgrade to Max',
      popular: false
    }
  ]

  const handleUpgradeClick = (planId) => {
    if (planId === 'free') return
    
    // In a real app, this would integrate with Stripe
    const confirmed = confirm(`Upgrade to ${planId.toUpperCase()} plan for ${plans.find(p => p.id === planId)?.price}/month?`)
    
    if (confirmed) {
      onUpgrade(planId)
      alert(`Successfully upgraded to ${planId.toUpperCase()} plan!`)
    }
  }

  const getCurrentPlan = () => {
    return user?.subscriptionTier || 'free'
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">
          Choose Your Plan
        </h1>
        <p className="text-xl text-white/80 max-w-3xl mx-auto">
          Unlock the full power of AI-driven image editing. Upgrade anytime, cancel anytime.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {plans.map((plan) => {
          const isCurrentPlan = getCurrentPlan() === plan.id
          const canUpgrade = getCurrentPlan() === 'free' && plan.id !== 'free'
          
          return (
            <div
              key={plan.id}
              className={`relative glass-effect rounded-2xl p-8 transition-all duration-300 hover:scale-105 ${
                plan.popular 
                  ? 'ring-2 ring-blue-500 bg-gradient-to-b from-blue-500/10 to-purple-500/10' 
                  : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              {isCurrentPlan && (
                <div className="absolute -top-4 right-4">
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Current
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                  {plan.icon}
                </div>
                
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-white/70 mb-4">{plan.description}</p>
                
                <div className="mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-white/60 ml-2">/{plan.period}</span>
                </div>

                <Button
                  variant={plan.popular ? "primary" : "outline"}
                  className="w-full"
                  onClick={() => handleUpgradeClick(plan.id)}
                  disabled={isCurrentPlan}
                >
                  {isCurrentPlan ? 'Current Plan' : plan.cta}
                </Button>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-white/90">What's included:</h4>
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-white/80">{feature}</span>
                    </li>
                  ))}
                </ul>

                {plan.limitations && (
                  <div className="pt-4 border-t border-white/20">
                    <h5 className="text-sm font-medium text-white/60 mb-2">Limitations:</h5>
                    <ul className="space-y-2">
                      {plan.limitations.map((limitation, index) => (
                        <li key={index} className="text-xs text-white/50">
                          • {limitation}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* FAQ Section */}
      <div className="glass-effect rounded-2xl p-8">
        <h2 className="text-2xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold mb-2">Can I cancel anytime?</h3>
            <p className="text-white/70 text-sm">
              Yes, you can cancel your subscription at any time. You'll continue to have access to premium features until the end of your billing period.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">What happens to my images?</h3>
            <p className="text-white/70 text-sm">
              Your images are securely stored and you can download them anytime. We don't use your images for any purpose other than providing our services.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Do you offer refunds?</h3>
            <p className="text-white/70 text-sm">
              We offer a 7-day money-back guarantee for new subscribers. If you're not satisfied, we'll provide a full refund.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Can I upgrade or downgrade?</h3>
            <p className="text-white/70 text-sm">
              Yes, you can change your plan at any time. Upgrades take effect immediately, while downgrades take effect at the next billing cycle.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PricingTable