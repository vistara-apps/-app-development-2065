import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import stripeService from '../../services/stripe';
import Button from '../ui/Button';
import { CreditCard, AlertCircle, CheckCircle, Calendar, Clock, ArrowUpRight } from 'lucide-react';

const SubscriptionManager = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  // Fetch subscription details on component mount
  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const data = await stripeService.getCurrentSubscription();
        setSubscription(data);
      } catch (err) {
        console.error('Error fetching subscription:', err);
        setError('Failed to load subscription details');
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, []);

  const handleCancelSubscription = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      await stripeService.cancelSubscription({
        cancelAtPeriodEnd: true
      });
      
      // Refresh subscription data
      const updatedSubscription = await stripeService.getCurrentSubscription();
      setSubscription(updatedSubscription);
      
      setSuccess('Your subscription has been canceled and will end at the current billing period');
      setCancelDialogOpen(false);
    } catch (err) {
      console.error('Cancel subscription error:', err);
      setError(err.message || 'Failed to cancel subscription');
    } finally {
      setLoading(false);
    }
  };

  const handleManageBilling = async () => {
    setLoading(true);
    setError('');
    
    try {
      const session = await stripeService.createPortalSession({
        returnUrl: window.location.href
      });
      
      // Redirect to Stripe Customer Portal
      if (session.url) {
        window.location.href = session.url;
      } else {
        throw new Error('Invalid portal session');
      }
    } catch (err) {
      console.error('Billing portal error:', err);
      setError(err.message || 'Failed to access billing portal');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="glass-effect rounded-xl p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
        <p className="mt-4 text-white/70">Loading subscription details...</p>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="glass-effect rounded-xl p-8 text-center">
        <h3 className="text-xl font-semibold mb-4">No Active Subscription</h3>
        <p className="text-white/70 mb-6">
          You don't have an active subscription. Upgrade to access premium features.
        </p>
        <Button variant="primary" onClick={() => window.location.href = '/pricing'}>
          View Plans
        </Button>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="glass-effect rounded-xl p-8">
      <h2 className="text-2xl font-bold mb-6">Your Subscription</h2>

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

      <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg p-6 border border-white/10 mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-xl font-semibold">{subscription.planName} Plan</h3>
            <p className="text-white/70 text-sm">
              {subscription.status === 'active' ? 'Active' : subscription.status}
              {subscription.cancelAtPeriodEnd && ' (Cancels at period end)'}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">${subscription.amount}</div>
            <div className="text-sm text-white/70">per {subscription.interval}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-400" />
            <div>
              <div className="text-sm text-white/70">Current Period</div>
              <div className="text-sm">
                {formatDate(subscription.currentPeriodStart)} - {formatDate(subscription.currentPeriodEnd)}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-400" />
            <div>
              <div className="text-sm text-white/70">Next Billing Date</div>
              <div className="text-sm">
                {subscription.cancelAtPeriodEnd ? 'No renewal' : formatDate(subscription.currentPeriodEnd)}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setCancelDialogOpen(true)}
            disabled={loading || subscription.cancelAtPeriodEnd}
          >
            {subscription.cancelAtPeriodEnd ? 'Cancellation Scheduled' : 'Cancel Subscription'}
          </Button>
          <Button
            variant="primary"
            className="flex-1 group"
            onClick={handleManageBilling}
            disabled={loading}
          >
            Manage Billing
            <ArrowUpRight className="ml-2 w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </Button>
        </div>
      </div>

      {/* Usage Stats */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Usage Statistics</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="glass-effect rounded-lg p-4">
            <div className="text-sm text-white/70 mb-1">Total Edits</div>
            <div className="text-2xl font-semibold">{subscription.usage?.totalEdits || 0}</div>
          </div>
          <div className="glass-effect rounded-lg p-4">
            <div className="text-sm text-white/70 mb-1">Storage Used</div>
            <div className="text-2xl font-semibold">{subscription.usage?.storageUsed || '0 MB'}</div>
          </div>
          <div className="glass-effect rounded-lg p-4">
            <div className="text-sm text-white/70 mb-1">Remaining Edits</div>
            <div className="text-2xl font-semibold">
              {subscription.planName === 'Max' ? 'Unlimited' : (subscription.usage?.remainingEdits || 0)}
            </div>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Payment Method</h3>
        <div className="glass-effect rounded-lg p-4 flex items-center gap-4">
          <div className="w-12 h-8 bg-white/10 rounded flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-white/70" />
          </div>
          <div>
            <div className="font-medium">{subscription.paymentMethod?.brand || 'Card'}</div>
            <div className="text-sm text-white/70">
              •••• •••• •••• {subscription.paymentMethod?.last4 || '****'}
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Dialog */}
      {cancelDialogOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="glass-effect rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Cancel Subscription</h3>
            <p className="text-white/70 mb-6">
              Are you sure you want to cancel your {subscription.planName} subscription?
              You'll still have access to premium features until the end of your current billing period on {formatDate(subscription.currentPeriodEnd)}.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setCancelDialogOpen(false)}
                disabled={loading}
              >
                Keep Subscription
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={handleCancelSubscription}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Confirm Cancellation'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionManager;

