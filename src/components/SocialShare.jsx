import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import socialSharingService from '../services/socialSharing';
import Button from './ui/Button';
import { 
  Share2, 
  Instagram, 
  Twitter, 
  Facebook, 
  Linkedin, 
  Copy, 
  CheckCircle, 
  AlertCircle, 
  X,
  Link as LinkIcon
} from 'lucide-react';

const SocialShare = ({ imageUrl, title = 'Check out my edited image!', onClose }) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [connectedAccounts, setConnectedAccounts] = useState([]);
  const [shareText, setShareText] = useState('');
  const [copied, setCopied] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);

  // Fetch connected accounts on component mount
  useEffect(() => {
    const fetchConnectedAccounts = async () => {
      if (user) {
        try {
          const accounts = await socialSharingService.getConnectedAccounts();
          setConnectedAccounts(accounts);
        } catch (err) {
          console.error('Error fetching connected accounts:', err);
        }
      }
    };

    fetchConnectedAccounts();
  }, [user]);

  const togglePlatform = (platform) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const handleShareToSocial = async () => {
    if (selectedPlatforms.length === 0) {
      setError('Please select at least one platform to share to');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Prepare content for each platform
      const content = {
        instagram: { caption: shareText },
        twitter: { text: shareText },
        facebook: { message: shareText },
        linkedin: { comment: shareText }
      };
      
      // Share to selected platforms
      await socialSharingService.shareToMultiplePlatforms(
        imageUrl,
        content,
        selectedPlatforms
      );
      
      setSuccess(`Successfully shared to ${selectedPlatforms.join(', ')}!`);
      setSelectedPlatforms([]);
      setShareText('');
    } catch (err) {
      console.error('Social sharing error:', err);
      setError(err.message || 'Failed to share to social media');
    } finally {
      setLoading(false);
    }
  };

  const handleNativeShare = async () => {
    setLoading(true);
    setError('');
    
    try {
      await socialSharingService.shareNative({
        title,
        text: shareText,
        url: imageUrl
      });
      
      setSuccess('Shared successfully!');
    } catch (err) {
      console.error('Native sharing error:', err);
      setError(err.message || 'Failed to share');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(imageUrl)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('Copy error:', err);
        setError('Failed to copy link');
      });
  };

  const handleConnectAccount = async (platform) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await socialSharingService.connectAccount(platform);
      
      // Redirect to authorization URL
      if (response.authUrl) {
        window.location.href = response.authUrl;
      }
    } catch (err) {
      console.error('Connect account error:', err);
      setError(err.message || `Failed to connect ${platform} account`);
      setLoading(false);
    }
  };

  const socialPlatforms = [
    { id: 'instagram', name: 'Instagram', icon: <Instagram className="w-5 h-5" />, color: 'bg-gradient-to-r from-purple-500 to-pink-500' },
    { id: 'twitter', name: 'Twitter', icon: <Twitter className="w-5 h-5" />, color: 'bg-blue-400' },
    { id: 'facebook', name: 'Facebook', icon: <Facebook className="w-5 h-5" />, color: 'bg-blue-600' },
    { id: 'linkedin', name: 'LinkedIn', icon: <Linkedin className="w-5 h-5" />, color: 'bg-blue-700' }
  ];

  const isNativeSharingAvailable = socialSharingService.isNativeSharingAvailable();

  return (
    <div className="relative">
      {/* Share Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2"
      >
        <Share2 className="w-4 h-4" />
        Share
      </Button>

      {/* Share Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="glass-effect rounded-xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Share Image</h3>
              <button
                onClick={() => {
                  setIsOpen(false);
                  if (onClose) onClose();
                }}
                className="p-1 hover:bg-white/10 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

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

            {/* Image Preview */}
            <div className="mb-4">
              <div className="aspect-square w-full max-h-48 overflow-hidden rounded-lg mb-2">
                <img 
                  src={imageUrl} 
                  alt="Share preview" 
                  className="w-full h-full object-contain bg-black/20"
                />
              </div>
            </div>

            {/* Share Text */}
            <div className="mb-4">
              <label htmlFor="shareText" className="block text-sm font-medium text-white/70 mb-1">
                Caption
              </label>
              <textarea
                id="shareText"
                value={shareText}
                onChange={(e) => setShareText(e.target.value)}
                rows={2}
                className="block w-full p-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add a caption to your shared image..."
                disabled={loading}
              />
            </div>

            {/* Social Platforms */}
            {user ? (
              <div className="mb-6">
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Share to
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {socialPlatforms.map((platform) => {
                    const isConnected = connectedAccounts.some(acc => acc.platform === platform.id);
                    const isSelected = selectedPlatforms.includes(platform.id);
                    
                    return (
                      <button
                        key={platform.id}
                        onClick={() => {
                          if (isConnected) {
                            togglePlatform(platform.id);
                          } else {
                            handleConnectAccount(platform.id);
                          }
                        }}
                        disabled={loading}
                        className={`flex items-center gap-2 p-3 rounded-lg transition-all ${
                          isConnected
                            ? isSelected
                              ? `${platform.color} text-white`
                              : 'glass-effect hover:bg-white/10'
                            : 'border border-dashed border-white/30 hover:border-white/50'
                        }`}
                      >
                        {platform.icon}
                        <span className="text-sm">{platform.name}</span>
                        {!isConnected && (
                          <span className="text-xs ml-auto text-white/50">Connect</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-3 mb-4">
                <p className="text-sm text-yellow-200">
                  Sign in to share directly to social media platforms
                </p>
              </div>
            )}

            {/* Share Actions */}
            <div className="flex flex-col gap-3">
              {user && selectedPlatforms.length > 0 && (
                <Button
                  variant="primary"
                  onClick={handleShareToSocial}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? 'Sharing...' : `Share to ${selectedPlatforms.length} platform${selectedPlatforms.length !== 1 ? 's' : ''}`}
                </Button>
              )}

              {isNativeSharingAvailable && (
                <Button
                  variant="outline"
                  onClick={handleNativeShare}
                  disabled={loading}
                  className="w-full"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share via Device
                </Button>
              )}

              <Button
                variant={copied ? 'primary' : 'outline'}
                onClick={handleCopyLink}
                disabled={loading}
                className="w-full"
              >
                {copied ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <LinkIcon className="w-4 h-4 mr-2" />
                    Copy Link
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialShare;

