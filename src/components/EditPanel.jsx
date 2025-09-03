import React, { useState, useEffect } from 'react';
import { Scissors, Sparkles, Palette, Sliders, Lock, ZoomIn, Crop, Wand2 } from 'lucide-react';
import Button from './ui/Button';

const EditPanel = ({ 
  selectedImage, 
  onApplyEdit, 
  user, 
  onUpgrade, 
  isProcessing,
  onAdvancedToolSelect
}) => {
  const [activeFilter, setActiveFilter] = useState(null);
  const [settings, setSettings] = useState({
    brightness: 0,
    contrast: 0,
    saturation: 0,
    blur: 0
  });
  const [availableFilters, setAvailableFilters] = useState([]);

  // Fetch available filters on component mount
  useEffect(() => {
    // In a real app, this would fetch from the API
    setAvailableFilters([
      { id: 'vintage', name: 'Vintage', preview: 'sepia(0.5) contrast(1.2)' },
      { id: 'dramatic', name: 'Dramatic', preview: 'contrast(1.5) saturate(1.3)' },
      { id: 'cool', name: 'Cool', preview: 'hue-rotate(180deg) saturate(1.1)' },
      { id: 'warm', name: 'Warm', preview: 'hue-rotate(20deg) saturate(1.2)' },
      { id: 'bw', name: 'Black & White', preview: 'grayscale(1)' },
      { id: 'soft', name: 'Soft', preview: 'blur(0.5px) brightness(1.1)' }
    ]);
  }, []);

  const basicEditTools = [
    {
      id: 'remove-bg',
      title: 'Remove Background',
      description: 'AI-powered background removal',
      icon: <Scissors className="w-5 h-5" />,
      premium: false
    },
    {
      id: 'enhance',
      title: 'Auto Enhance',
      description: 'One-click professional enhancement',
      icon: <Sparkles className="w-5 h-5" />,
      premium: false
    },
    {
      id: 'filters',
      title: 'Filters',
      description: 'Apply creative filters',
      icon: <Palette className="w-5 h-5" />,
      premium: true
    },
    {
      id: 'adjustments',
      title: 'Adjustments',
      description: 'Fine-tune brightness, contrast, etc.',
      icon: <Sliders className="w-5 h-5" />,
      premium: false
    }
  ];

  const advancedEditTools = [
    {
      id: 'upscaler',
      title: 'AI Upscaler',
      description: 'Increase resolution without losing quality',
      icon: <ZoomIn className="w-5 h-5" />,
      premium: true
    },
    {
      id: 'smartCrop',
      title: 'Smart Crop',
      description: 'Intelligently crop and resize images',
      icon: <Crop className="w-5 h-5" />,
      premium: true
    },
    {
      id: 'styleTransfer',
      title: 'Style Transfer',
      description: 'Apply artistic styles to your images',
      icon: <Wand2 className="w-5 h-5" />,
      premium: true
    }
  ];

  const handleEditClick = (toolId) => {
    const tool = [...basicEditTools, ...advancedEditTools].find(t => t.id === toolId);
    
    if (!tool) return;
    
    if (tool.premium && (!user || user.subscriptionTier === 'free')) {
      onUpgrade();
      return;
    }

    if (!user) {
      return;
    }

    // Handle advanced tools
    if (advancedEditTools.some(t => t.id === toolId)) {
      if (onAdvancedToolSelect) {
        onAdvancedToolSelect(toolId);
      }
      return;
    }

    // Handle basic tools
    if (toolId === 'filters') {
      setActiveFilter(activeFilter === 'filters' ? null : 'filters');
    } else if (toolId === 'adjustments') {
      setActiveFilter(activeFilter === 'adjustments' ? null : 'adjustments');
    } else {
      onApplyEdit(toolId, {});
    }
  };

  const handleFilterApply = (filterId) => {
    onApplyEdit('filter', { filterId });
    setActiveFilter(null);
  };

  const handleAdjustmentApply = () => {
    onApplyEdit('adjustments', settings);
    setActiveFilter(null);
  };

  const canUse = (tool) => {
    if (!tool.premium) return true;
    return user && user.subscriptionTier !== 'free';
  };

  const hasEditsRemaining = () => {
    if (!user) return false;
    if (user.subscriptionTier !== 'free') return true;
    return user.editsRemaining > 0;
  };

  return (
    <div className="glass-effect rounded-xl p-6 h-fit">
      <h3 className="text-lg font-semibold mb-4">Edit Tools</h3>
      
      {!selectedImage ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-white/10 rounded-full flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-white/50" />
          </div>
          <p className="text-white/70">
            Upload an image to start editing
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {!user && (
            <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4 mb-4">
              <p className="text-sm text-yellow-200">
                Sign in to start editing your images
              </p>
            </div>
          )}

          {user && user.subscriptionTier === 'free' && user.editsRemaining === 0 && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 mb-4">
              <p className="text-sm text-red-200 mb-2">
                You've used all your free edits this month
              </p>
              <Button variant="primary" size="sm" onClick={onUpgrade}>
                Upgrade to Pro
              </Button>
            </div>
          )}

          <div className="mb-6">
            <h4 className="text-sm font-medium text-white/70 mb-3">Basic Tools</h4>
            {basicEditTools.map((tool) => (
              <div key={tool.id} className="mb-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleEditClick(tool.id)}
                  disabled={isProcessing || !hasEditsRemaining() || !canUse(tool)}
                >
                  <div className="flex items-center gap-3">
                    {tool.icon}
                    <div className="text-left">
                      <div className="font-medium flex items-center gap-2">
                        {tool.title}
                        {tool.premium && (!user || user.subscriptionTier === 'free') && (
                          <Lock className="w-3 h-3 text-yellow-400" />
                        )}
                      </div>
                      <div className="text-xs text-white/60">
                        {tool.description}
                      </div>
                    </div>
                  </div>
                </Button>

                {/* Filter Options */}
                {activeFilter === 'filters' && tool.id === 'filters' && (
                  <div className="mt-3 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      {availableFilters.map((filter) => (
                        <button
                          key={filter.id}
                          onClick={() => handleFilterApply(filter.id)}
                          className="p-3 glass-effect rounded-lg hover:bg-white/20 transition-colors text-left"
                        >
                          <div className="text-sm font-medium">{filter.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Adjustment Sliders */}
                {activeFilter === 'adjustments' && tool.id === 'adjustments' && (
                  <div className="mt-3 space-y-3">
                    {Object.entries(settings).map(([key, value]) => (
                      <div key={key}>
                        <label className="text-sm text-white/70 capitalize mb-1 block">
                          {key}: {value}
                        </label>
                        <input
                          type="range"
                          min="-100"
                          max="100"
                          value={value}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            [key]: parseInt(e.target.value)
                          }))}
                          className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                        />
                      </div>
                    ))}
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleAdjustmentApply}
                      className="w-full"
                    >
                      Apply Adjustments
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div>
            <h4 className="text-sm font-medium text-white/70 mb-3">Advanced Tools</h4>
            {advancedEditTools.map((tool) => (
              <div key={tool.id} className="mb-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleEditClick(tool.id)}
                  disabled={isProcessing || !hasEditsRemaining() || !canUse(tool)}
                >
                  <div className="flex items-center gap-3">
                    {tool.icon}
                    <div className="text-left">
                      <div className="font-medium flex items-center gap-2">
                        {tool.title}
                        {tool.premium && (!user || user.subscriptionTier === 'free') && (
                          <Lock className="w-3 h-3 text-yellow-400" />
                        )}
                      </div>
                      <div className="text-xs text-white/60">
                        {tool.description}
                      </div>
                    </div>
                  </div>
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EditPanel;

