import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import stripeService from '../../services/stripe';
import Button from '../ui/Button';
import { CreditCard, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';

const CheckoutForm = ({ planId, onSuccess, onCancel }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [planDetails, setPlanDetails] = useState(null);

  // Fetch plan details on component mount
  useEffect(() => {
    const fetchPlanDetails = async () => {
      try {
        const plans = await stripeService.getSubscriptionPlans();
        const plan = plans.find(p => p.id === planId);
        if (plan) {
          setPlanDetails(plan);
        } else {
          setError('Selected plan not found');
        }
      } catch (err) {
        console.error('Error fetching plan details:', err);
        setError('Failed to load plan details');
      }
    };

    fetchPlanDetails();
  }, [planId]);

  const handleCheckout = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Create checkout session
      const session = await stripeService.createCheckoutSession(planId, {
        successUrl: window.location.origin + '/subscription/success',
        cancelUrl: window.location.origin + '/subscription/cancel'
      });
      
      // Redirect to Stripe Checkout
      if (session.url) {
        window.location.href = session.url;
      } else {
        throw new Error('Invalid checkout session');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err.message || 'Failed to process checkout');
    } finally {
      setLoading(false);
    }
  };

  if (!planDetails) {
    return (
      <div className="glass-effect rounded-xl p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
        <p className="mt-4 text-white/70">Loading plan details...</p>
      </div>
    );
  }

  return (
    <div className="glass-effect rounded-xl p-8 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Checkout</h2>

      {error && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 mb-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-200">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3 mb-4 flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-green-200">{success}</p>
        </div>
      )}

      <div className="mb-6">
        <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg p-6 border border-white/10">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">{planDetails.name} Plan</h3>
            <div className="text-right">
              <div className="text-2xl font-bold">${planDetails.price}</div>
              <div className="text-sm text-white/70">per {planDetails.interval}</div>
            </div>
          </div>

          <ul className="space-y-2 mb-4">
            {planDetails.features.map((feature, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-white/90">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-sm font-medium text-white/70 mb-2">Order Summary</h4>
        <div className="bg-white/5 rounded-lg p-4">
          <div className="flex justify-between mb-2">
            <span className="text-white/70">{planDetails.name} Plan</span>
            <span>${planDetails.price}/{planDetails.interval}</span>
          </div>
          {planDetails.setupFee > 0 && (
            <div className="flex justify-between mb-2">
              <span className="text-white/70">Setup Fee</span>
              <span>${planDetails.setupFee}</span>
            </div>
          )}
          {planDetails.discount > 0 && (
            <div className="flex justify-between mb-2 text-green-400">
              <span>Discount</span>
              <span>-${planDetails.discount}</span>
            </div>
          )}
          <div className="border-t border-white/10 my-2 pt-2 flex justify-between font-semibold">
            <span>Total</span>
            <span>${(planDetails.price + (planDetails.setupFee || 0) - (planDetails.discount || 0)).toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          variant="outline"
          className="flex-1"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          className="flex-1 group"
          onClick={handleCheckout}
          disabled={loading}
        >
          {loading ? 'Processing...' : (
            <>
              Proceed to Payment
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </Button>
      </div>

      <div className="mt-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <CreditCard className="w-4 h-4 text-white/50" />
          <span className="text-sm text-white/70">Secure payment powered by Stripe</span>
        </div>
        <p className="text-xs text-white/50">
          You'll be redirected to Stripe to complete your payment securely.
          Your subscription will begin immediately after successful payment.
        </p>
      </div>
    </div>
  );
};

export default CheckoutForm;

