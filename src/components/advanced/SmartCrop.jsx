import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import advancedEditingService from '../../services/advancedEditing';
import Button from '../ui/Button';
import { Crop, AlertCircle, CheckCircle, Lock, User, Package, Image } from 'lucide-react';

const SmartCrop = ({ imageFile, onComplete, onCancel, onUpgrade }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [width, setWidth] = useState(1024);
  const [height, setHeight] = useState(1024);
  const [focusOn, setFocusOn] = useState('auto');
  const [aspectRatio, setAspectRatio] = useState('1:1');

  // Check if user can use this premium feature
  const canUseFeature = user && user.subscriptionTier !== 'free';

  // Handle aspect ratio change
  const handleAspectRatioChange = (ratio) => {
    setAspectRatio(ratio);
    
    // Update width and height based on aspect ratio
    const [w, h] = ratio.split(':').map(Number);
    
    if (w && h) {
      // Keep the larger dimension at 1024px
      if (w >= h) {
        setWidth(1024);
        setHeight(Math.round(1024 * (h / w)));
      } else {
        setHeight(1024);
        setWidth(Math.round(1024 * (w / h)));
      }
    }
  };

  const handleSmartCrop = async () => {
    if (!canUseFeature) {
      onUpgrade();
      return;
    }

    if (!imageFile) {
      setError('No image selected for cropping');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const options = {
        width,
        height,
        focusOn,
        format: 'jpeg'
      };
      
      const result = await advancedEditingService.smartCrop(
        imageFile,
        options,
        (progressPercent) => {
          setProgress(progressPercent);
        }
      );
      
      setSuccess('Image cropped successfully!');
      
      // Call the onComplete callback with the result
      if (onComplete && typeof onComplete === 'function') {
        onComplete(result);
      }
    } catch (err) {
      console.error('Smart crop error:', err);
      setError(err.message || 'Failed to crop image');
    } finally {
      setLoading(false);
    }
  };

  const focusOptions = [
    { id: 'auto', name: 'Auto', icon: <Image className="w-4 h-4" /> },
    { id: 'face', name: 'Face', icon: <User className="w-4 h-4" /> },
    { id: 'product', name: 'Product', icon: <Package className="w-4 h-4" /> }
  ];

  const aspectRatios = [
    { id: '1:1', name: 'Square' },
    { id: '4:3', name: '4:3' },
    { id: '3:4', name: 'Portrait' },
    { id: '16:9', name: 'Landscape' },
    { id: '9:16', name: 'Mobile' },
    { id: 'custom', name: 'Custom' }
  ];

  return (
    <div className="glass-effect rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Crop className="w-5 h-5" />
          Smart Crop
          {!canUseFeature && <Lock className="w-4 h-4 text-yellow-400" />}
        </h3>
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

      {!canUseFeature ? (
        <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4 mb-4">
          <p className="text-sm text-yellow-200 mb-2">
            Smart Crop is a premium feature available on Pro and Max plans
          </p>
          <Button variant="primary" size="sm" onClick={onUpgrade}>
            Upgrade to Pro
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1">
              Aspect Ratio
            </label>
            <div className="grid grid-cols-3 gap-2">
              {aspectRatios.map((ratio) => (
                <button
                  key={ratio.id}
                  onClick={() => handleAspectRatioChange(ratio.id)}
                  className={`p-2 rounded-lg text-center transition-colors ${
                    aspectRatio === ratio.id
                      ? 'bg-blue-600 text-white'
                      : 'glass-effect hover:bg-white/10'
                  }`}
                >
                  {ratio.name}
                </button>
              ))}
            </div>
          </div>

          {aspectRatio === 'custom' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">
                  Width (px)
                </label>
                <input
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(Number(e.target.value))}
                  min="100"
                  max="4096"
                  className="block w-full p-2 bg-white/10 border border-white/30 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">
                  Height (px)
                </label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  min="100"
                  max="4096"
                  className="block w-full p-2 bg-white/10 border border-white/30 rounded-lg text-white"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-white/70 mb-1">
              Focus On
            </label>
            <div className="grid grid-cols-3 gap-2">
              {focusOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setFocusOn(option.id)}
                  className={`p-2 rounded-lg text-center transition-colors flex flex-col items-center gap-1 ${
                    focusOn === option.id
                      ? 'bg-blue-600 text-white'
                      : 'glass-effect hover:bg-white/10'
                  }`}
                >
                  {option.icon}
                  <span className="text-sm">{option.name}</span>
                </button>
              ))}
            </div>
          </div>

          {loading && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-white/70">Processing...</span>
                <span className="text-sm text-white/70">{progress}%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}

          <div className="flex gap-3 mt-6">
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
              className="flex-1"
              onClick={handleSmartCrop}
              disabled={loading}
            >
              {loading ? 'Cropping...' : 'Smart Crop Image'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartCrop;

