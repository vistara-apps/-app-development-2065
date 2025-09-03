import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import stripeService from '../services/stripe';
import storageService from '../services/storage';
import Button from '../components/ui/Button';
import Profile from '../components/auth/Profile';
import SubscriptionManager from '../components/checkout/SubscriptionManager';
import { 
  User, 
  CreditCard, 
  HardDrive, 
  Image as ImageIcon, 
  Settings, 
  LogOut,
  AlertCircle
} from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [storageUsage, setStorageUsage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch storage usage
        const usage = await storageService.getStorageUsage();
        setStorageUsage(usage);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load some dashboard data');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="glass-effect rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="text-white/70 mb-6">
            Please sign in to access your dashboard
          </p>
          <Button variant="primary" onClick={() => window.location.href = '/'}>
            Go to Home
          </Button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User className="w-5 h-5" /> },
    { id: 'subscription', label: 'Subscription', icon: <CreditCard className="w-5 h-5" /> },
    { id: 'storage', label: 'Storage', icon: <HardDrive className="w-5 h-5" /> },
    { id: 'images', label: 'My Images', icon: <ImageIcon className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> }
  ];

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/';
    } catch (err) {
      console.error('Logout error:', err);
      setError('Failed to log out');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold mb-8">Your Dashboard</h1>

      {error && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 mb-6 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-200">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="glass-effect rounded-xl p-6 mb-6">
            <div className="flex flex-col items-center mb-6">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mb-4">
                {user.profileImage ? (
                  <img 
                    src={user.profileImage} 
                    alt={user.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-10 h-10 text-white" />
                )}
              </div>
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <p className="text-white/70 text-sm">{user.email}</p>
              <div className="mt-2 px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-medium">
                {user.subscriptionTier === 'free' ? 'Free Plan' : `${user.subscriptionTier} Plan`}
              </div>
            </div>

            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'text-white/80 hover:bg-white/10'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
              
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-white/80 hover:bg-white/10"
              >
                <LogOut className="w-5 h-5" />
                <span>Log Out</span>
              </button>
            </nav>
          </div>

          {/* Quick Stats */}
          <div className="glass-effect rounded-xl p-6">
            <h3 className="text-sm font-medium text-white/70 mb-4">Quick Stats</h3>
            
            {loading ? (
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-white/10 rounded"></div>
                <div className="h-4 bg-white/10 rounded"></div>
                <div className="h-4 bg-white/10 rounded"></div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-white/70">Storage Used</span>
                    <span>{storageUsage?.usedFormatted || '0 MB'}</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${storageUsage?.percentUsed || 0}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-white/50 mt-1">
                    <span>0</span>
                    <span>{storageUsage?.totalFormatted || '1 GB'}</span>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/70">Images Processed</span>
                    <span>{storageUsage?.imagesProcessed || 0}</span>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/70">Edits Remaining</span>
                    <span>
                      {user.subscriptionTier === 'max' 
                        ? 'Unlimited' 
                        : (user.editsRemaining || 0)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {activeTab === 'profile' && <Profile />}
          
          {activeTab === 'subscription' && <SubscriptionManager />}
          
          {activeTab === 'storage' && (
            <div className="glass-effect rounded-xl p-8">
              <h2 className="text-2xl font-bold mb-6">Storage Management</h2>
              
              {loading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-8 bg-white/10 rounded w-1/4"></div>
                  <div className="h-4 bg-white/10 rounded"></div>
                  <div className="h-4 bg-white/10 rounded"></div>
                  <div className="h-32 bg-white/10 rounded"></div>
                </div>
              ) : (
                <>
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4">Storage Usage</h3>
                    
                    <div className="glass-effect rounded-lg p-6 mb-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div className="flex-1">
                          <div className="text-3xl font-bold mb-2">
                            {storageUsage?.usedFormatted || '0 MB'}
                            <span className="text-lg text-white/50 ml-2">of {storageUsage?.totalFormatted || '1 GB'}</span>
                          </div>
                          
                          <div className="w-full bg-white/10 rounded-full h-3 mb-2">
                            <div
                              className={`h-3 rounded-full ${
                                (storageUsage?.percentUsed || 0) > 90 
                                  ? 'bg-red-500' 
                                  : (storageUsage?.percentUsed || 0) > 70 
                                    ? 'bg-yellow-500' 
                                    : 'bg-blue-500'
                              }`}
                              style={{ width: `${storageUsage?.percentUsed || 0}%` }}
                            ></div>
                          </div>
                          
                          <p className="text-sm text-white/70">
                            {storageUsage?.percentUsed || 0}% of your storage used
                          </p>
                        </div>
                        
                        <div>
                          <Button variant="primary">
                            Upgrade Storage
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="glass-effect rounded-lg p-4">
                        <h4 className="text-sm text-white/70 mb-1">Original Images</h4>
                        <div className="text-2xl font-semibold">{storageUsage?.originalImagesFormatted || '0 MB'}</div>
                      </div>
                      
                      <div className="glass-effect rounded-lg p-4">
                        <h4 className="text-sm text-white/70 mb-1">Processed Images</h4>
                        <div className="text-2xl font-semibold">{storageUsage?.processedImagesFormatted || '0 MB'}</div>
                      </div>
                      
                      <div className="glass-effect rounded-lg p-4">
                        <h4 className="text-sm text-white/70 mb-1">Available Space</h4>
                        <div className="text-2xl font-semibold">{storageUsage?.availableFormatted || '1 GB'}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Storage Management</h3>
                    
                    <div className="space-y-4">
                      <Button variant="outline" className="w-full justify-start">
                        <HardDrive className="w-5 h-5 mr-2" />
                        Clean Up Unused Images
                      </Button>
                      
                      <Button variant="outline" className="w-full justify-start">
                        <ImageIcon className="w-5 h-5 mr-2" />
                        Optimize Storage
                      </Button>
                      
                      <Button variant="destructive" className="w-full justify-start">
                        <AlertCircle className="w-5 h-5 mr-2" />
                        Delete All Images
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
          
          {activeTab === 'images' && (
            <div className="glass-effect rounded-xl p-8">
              <h2 className="text-2xl font-bold mb-6">My Images</h2>
              <p className="text-white/70 mb-8">
                View and manage all your uploaded and processed images
              </p>
              
              {/* Image gallery would be implemented here */}
              <div className="text-center py-12">
                <ImageIcon className="w-16 h-16 mx-auto text-white/30 mb-4" />
                <p className="text-white/50">
                  Your image gallery will be displayed here
                </p>
              </div>
            </div>
          )}
          
          {activeTab === 'settings' && (
            <div className="glass-effect rounded-xl p-8">
              <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Preferences</h3>
                  <div className="glass-effect rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Email Notifications</h4>
                        <p className="text-sm text-white/70">Receive email updates about your account</p>
                      </div>
                      <div className="relative inline-block w-12 h-6">
                        <input type="checkbox" id="toggle-email" className="sr-only" defaultChecked />
                        <label htmlFor="toggle-email" className="block w-12 h-6 rounded-full bg-white/20 cursor-pointer transition-colors duration-200 ease-in-out peer-checked:bg-blue-600"></label>
                        <span className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 ease-in-out transform peer-checked:translate-x-6"></span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Dark Mode</h4>
                        <p className="text-sm text-white/70">Use dark theme throughout the application</p>
                      </div>
                      <div className="relative inline-block w-12 h-6">
                        <input type="checkbox" id="toggle-dark" className="sr-only" defaultChecked />
                        <label htmlFor="toggle-dark" className="block w-12 h-6 rounded-full bg-white/20 cursor-pointer transition-colors duration-200 ease-in-out peer-checked:bg-blue-600"></label>
                        <span className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 ease-in-out transform peer-checked:translate-x-6"></span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3">Security</h3>
                  <div className="glass-effect rounded-lg p-4 space-y-4">
                    <Button variant="outline" className="w-full justify-start">
                      Change Password
                    </Button>
                    
                    <Button variant="outline" className="w-full justify-start">
                      Two-Factor Authentication
                    </Button>
                    
                    <Button variant="outline" className="w-full justify-start">
                      Connected Devices
                    </Button>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3">Danger Zone</h3>
                  <div className="glass-effect rounded-lg p-4 space-y-4 border border-red-500/30">
                    <Button variant="destructive" className="w-full justify-start">
                      Delete Account
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

