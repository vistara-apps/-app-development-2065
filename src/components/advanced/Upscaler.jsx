import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import advancedEditingService from '../../services/advancedEditing';
import Button from '../ui/Button';
import { ZoomIn, AlertCircle, CheckCircle, Lock } from 'lucide-react';

const Upscaler = ({ imageFile, onComplete, onCancel, onUpgrade }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [scale, setScale] = useState(2);
  const [model, setModel] = useState('standard');

  // Check if user can use this premium feature
  const canUseFeature = user && user.subscriptionTier !== 'free';

  const handleUpscale = async () => {
    if (!canUseFeature) {
      onUpgrade();
      return;
    }

    if (!imageFile) {
      setError('No image selected for upscaling');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const options = {
        scale,
        model,
        format: 'jpeg'
      };
      
      const result = await advancedEditingService.upscaleImage(
        imageFile,
        options,
        (progressPercent) => {
          setProgress(progressPercent);
        }
      );
      
      setSuccess('Image upscaled successfully!');
      
      // Call the onComplete callback with the result
      if (onComplete && typeof onComplete === 'function') {
        onComplete(result);
      }
    } catch (err) {
      console.error('Upscaling error:', err);
      setError(err.message || 'Failed to upscale image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-effect rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <ZoomIn className="w-5 h-5" />
          AI Upscaler
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
            AI Upscaling is a premium feature available on Pro and Max plans
          </p>
          <Button variant="primary" size="sm" onClick={onUpgrade}>
            Upgrade to Pro
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1">
              Upscale Factor
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[2, 3, 4].map((value) => (
                <button
                  key={value}
                  onClick={() => setScale(value)}
                  className={`p-2 rounded-lg text-center transition-colors ${
                    scale === value
                      ? 'bg-blue-600 text-white'
                      : 'glass-effect hover:bg-white/10'
                  }`}
                >
                  {value}x
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-1">
              Model Quality
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'standard', name: 'Standard' },
                { id: 'hd', name: 'HD Quality' }
              ].map((option) => (
                <button
                  key={option.id}
                  onClick={() => setModel(option.id)}
                  className={`p-2 rounded-lg text-center transition-colors ${
                    model === option.id
                      ? 'bg-blue-600 text-white'
                      : 'glass-effect hover:bg-white/10'
                  }`}
                >
                  {option.name}
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
              onClick={handleUpscale}
              disabled={loading}
            >
              {loading ? 'Upscaling...' : 'Upscale Image'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Upscaler;

