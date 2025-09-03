import React, { useState } from 'react';
import { Grid, Download, Trash2, Settings, Play, Pause, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from './ui/Button';
import ImageUploader from './ImageUploader';
import ErrorMessage from './common/ErrorMessage';
import imageProcessingService from '../services/imageProcessing';
import errorHandlingService from '../services/errorHandling';

const BatchEditor = ({ images, onUpload, onUpgrade }) => {
  const { user } = useAuth();
  const [selectedImages, setSelectedImages] = useState([]);
  const [batchSettings, setBatchSettings] = useState({
    removeBackground: false,
    autoEnhance: false,
    filter: 'none',
    adjustments: {
      brightness: 0,
      contrast: 0,
      saturation: 0
    }
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedCount, setProcessedCount] = useState(0);
  const [error, setError] = useState(null);

  const handleImageSelect = (imageId) => {
    setSelectedImages(prev => 
      prev.includes(imageId)
        ? prev.filter(id => id !== imageId)
        : [...prev, imageId]
    );
  };

  const handleSelectAll = () => {
    if (selectedImages.length === images.length) {
      setSelectedImages([]);
    } else {
      setSelectedImages(images.map(img => img.id));
    }
  };

  const handleBatchProcess = async () => {
    if (!user) {
      alert('Please sign in to use batch editing');
      return;
    }

    if (user.subscriptionTier === 'free') {
      onUpgrade();
      return;
    }

    if (selectedImages.length === 0) {
      alert('Please select images to process');
      return;
    }

    setIsProcessing(true);
    setProcessedCount(0);
    setError(null);
    
    try {
      // Get the selected images
      const imagesToProcess = images.filter(img => selectedImages.includes(img.id));
      
      // Process each image
      for (let i = 0; i < imagesToProcess.length; i++) {
        const image = imagesToProcess[i];
        
        try {
          // Apply the batch settings
          if (batchSettings.removeBackground) {
            await imageProcessingService.removeBackground(image.file);
          }
          
          if (batchSettings.autoEnhance) {
            await imageProcessingService.enhanceImage(image.file);
          }
          
          if (batchSettings.filter !== 'none') {
            await imageProcessingService.applyFilter(image.file, batchSettings.filter);
          }
          
          if (Object.values(batchSettings.adjustments).some(value => value !== 0)) {
            await imageProcessingService.applyAdjustments(image.file, batchSettings.adjustments);
          }
          
          // Update progress
          setProcessedCount(i + 1);
        } catch (err) {
          console.error(`Error processing image ${image.name}:`, err);
          // Continue with next image
        }
      }
      
      alert(`Successfully processed ${processedCount} images!`);
    } catch (err) {
      const errorObj = errorHandlingService.handleProcessingError(err);
      setError(errorObj);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadAll = () => {
    selectedImages.forEach(imageId => {
      const image = images.find(img => img.id === imageId);
      if (image) {
        const link = document.createElement('a');
        link.href = image.editedUrl || image.originalUrl;
        link.download = `batch_edited_${image.name}`;
        link.click();
      }
    });
  };

  const canUseBatch = user && user.subscriptionTier !== 'free';

  return (
    <div className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="mb-6">
          <ErrorMessage 
            error={error}
            onRetry={() => setError(null)}
          />
        </div>
      )}
      
      {/* Upload Area */}
      {images.length === 0 && (
        <ImageUploader onUpload={onUpload} multiple={true} />
      )}

      {/* Batch Controls */}
      {images.length > 0 && (
        <div className="glass-effect rounded-xl p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Settings Panel */}
            <div className="lg:w-1/3">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Batch Settings
              </h3>

              {!canUseBatch && (
                <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4 mb-4">
                  <p className="text-sm text-yellow-200 mb-2">
                    Batch editing is available with Pro and Max plans
                  </p>
                  <Button variant="primary" size="sm" onClick={onUpgrade}>
                    Upgrade Now
                  </Button>
                </div>
              )}

              <div className="space-y-4">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={batchSettings.removeBackground}
                    onChange={(e) => setBatchSettings(prev => ({
                      ...prev,
                      removeBackground: e.target.checked
                    }))}
                    disabled={!canUseBatch}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm">Remove Background</span>
                </label>

                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={batchSettings.autoEnhance}
                    onChange={(e) => setBatchSettings(prev => ({
                      ...prev,
                      autoEnhance: e.target.checked
                    }))}
                    disabled={!canUseBatch}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm">Auto Enhance</span>
                </label>

                <div>
                  <label className="text-sm text-white/70 block mb-2">Filter</label>
                  <select
                    value={batchSettings.filter}
                    onChange={(e) => setBatchSettings(prev => ({
                      ...prev,
                      filter: e.target.value
                    }))}
                    disabled={!canUseBatch}
                    className="w-full p-2 bg-white/10 border border-white/30 rounded-lg text-white"
                  >
                    <option value="none">None</option>
                    <option value="vintage">Vintage</option>
                    <option value="dramatic">Dramatic</option>
                    <option value="cool">Cool</option>
                    <option value="warm">Warm</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <span className="text-sm text-white/70">Adjustments</span>
                  {Object.entries(batchSettings.adjustments).map(([key, value]) => (
                    <div key={key}>
                      <label className="text-xs text-white/60 capitalize block">
                        {key}: {value}
                      </label>
                      <input
                        type="range"
                        min="-50"
                        max="50"
                        value={value}
                        onChange={(e) => setBatchSettings(prev => ({
                          ...prev,
                          adjustments: {
                            ...prev.adjustments,
                            [key]: parseInt(e.target.value)
                          }
                        }))}
                        disabled={!canUseBatch}
                        className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Image Grid */}
            <div className="lg:w-2/3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  Images ({images.length})
                </h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSelectAll}
                  >
                    {selectedImages.length === images.length ? 'Deselect All' : 'Select All'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onUpload([])}
                  >
                    <Grid className="w-4 h-4 mr-2" />
                    Add More
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mb-4">
                {images.map((image) => (
                  <div
                    key={image.id}
                    onClick={() => handleImageSelect(image.id)}
                    className={`relative cursor-pointer rounded-lg overflow-hidden aspect-square border-2 transition-all ${
                      selectedImages.includes(image.id)
                        ? 'border-blue-500 scale-95'
                        : 'border-transparent hover:border-white/30'
                    }`}
                  >
                    <img
                      src={image.originalUrl}
                      alt={image.name}
                      className="w-full h-full object-cover"
                    />
                    {selectedImages.includes(image.id) && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Processing Status */}
              {isProcessing && (
                <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                    <span className="text-sm">
                      Processing images... ({processedCount}/{selectedImages.length})
                    </span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(processedCount / selectedImages.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  variant="primary"
                  onClick={handleBatchProcess}
                  disabled={selectedImages.length === 0 || isProcessing || !canUseBatch}
                  className="flex-1"
                >
                  {isProcessing ? (
                    <>
                      <Pause className="w-4 h-4 mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Process Selected ({selectedImages.length})
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleDownloadAll}
                  disabled={selectedImages.length === 0}
                >
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BatchEditor;

