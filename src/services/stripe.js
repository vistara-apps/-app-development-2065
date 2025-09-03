/**
 * Stripe Service
 * 
 * This module provides functions for handling Stripe payments and subscriptions.
 * It integrates with the Stripe API for payment processing and subscription management.
 */

import { apiRequest } from './api';

/**
 * Get available subscription plans
 * 
 * @returns {Promise<Array<Object>>} - List of available subscription plans
 */
export const getSubscriptionPlans = async () => {
  try {
    return await apiRequest('/subscriptions/plans');
  } catch (error) {
    console.error('Get Subscription Plans Error:', error);
    throw new Error(`Failed to get subscription plans: ${error.message}`);
  }
};

/**
 * Create a checkout session for subscription
 * 
 * @param {string} planId - ID of the subscription plan
 * @param {Object} options - Additional checkout options
 * @returns {Promise<Object>} - Checkout session data with redirect URL
 */
export const createCheckoutSession = async (planId, options = {}) => {
  try {
    return await apiRequest('/subscriptions/checkout', {
      method: 'POST',
      body: {
        planId,
        ...options
      }
    });
  } catch (error) {
    console.error('Create Checkout Session Error:', error);
    throw new Error(`Failed to create checkout session: ${error.message}`);
  }
};

/**
 * Get the current user's subscription
 * 
 * @returns {Promise<Object>} - Subscription data
 */
export const getCurrentSubscription = async () => {
  try {
    return await apiRequest('/subscriptions/current');
  } catch (error) {
    console.error('Get Current Subscription Error:', error);
    throw new Error(`Failed to get current subscription: ${error.message}`);
  }
};

/**
 * Cancel the current subscription
 * 
 * @param {Object} options - Cancellation options
 * @returns {Promise<Object>} - Cancellation confirmation
 */
export const cancelSubscription = async (options = {}) => {
  try {
    return await apiRequest('/subscriptions/cancel', {
      method: 'POST',
      body: options
    });
  } catch (error) {
    console.error('Cancel Subscription Error:', error);
    throw new Error(`Failed to cancel subscription: ${error.message}`);
  }
};

/**
 * Update the current subscription
 * 
 * @param {string} newPlanId - ID of the new subscription plan
 * @param {Object} options - Update options
 * @returns {Promise<Object>} - Updated subscription data
 */
export const updateSubscription = async (newPlanId, options = {}) => {
  try {
    return await apiRequest('/subscriptions/update', {
      method: 'POST',
      body: {
        planId: newPlanId,
        ...options
      }
    });
  } catch (error) {
    console.error('Update Subscription Error:', error);
    throw new Error(`Failed to update subscription: ${error.message}`);
  }
};

/**
 * Get billing history
 * 
 * @param {Object} options - Pagination and filtering options
 * @returns {Promise<Object>} - Billing history with pagination info
 */
export const getBillingHistory = async (options = {}) => {
  try {
    const queryParams = new URLSearchParams({
      page: options.page || 1,
      limit: options.limit || 10,
      ...options
    }).toString();

    return await apiRequest(`/subscriptions/billing-history?${queryParams}`);
  } catch (error) {
    console.error('Get Billing History Error:', error);
    throw new Error(`Failed to get billing history: ${error.message}`);
  }
};

/**
 * Get payment methods
 * 
 * @returns {Promise<Array<Object>>} - List of payment methods
 */
export const getPaymentMethods = async () => {
  try {
    return await apiRequest('/subscriptions/payment-methods');
  } catch (error) {
    console.error('Get Payment Methods Error:', error);
    throw new Error(`Failed to get payment methods: ${error.message}`);
  }
};

/**
 * Create a portal session for managing billing
 * 
 * @param {Object} options - Portal session options
 * @returns {Promise<Object>} - Portal session data with redirect URL
 */
export const createPortalSession = async (options = {}) => {
  try {
    return await apiRequest('/subscriptions/portal', {
      method: 'POST',
      body: options
    });
  } catch (error) {
    console.error('Create Portal Session Error:', error);
    throw new Error(`Failed to create portal session: ${error.message}`);
  }
};

export default {
  getSubscriptionPlans,
  createCheckoutSession,
  getCurrentSubscription,
  cancelSubscription,
  updateSubscription,
  getBillingHistory,
  getPaymentMethods,
  createPortalSession
};

