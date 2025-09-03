import React, { useState, useEffect } from 'react';
import { Upload, Download, Share2, Trash2, Eye, EyeOff, Sparkles, Image as ImageIcon, Grid, Sliders } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from './ui/Button';
import ImageUploader from './ImageUploader';
import EditPanel from './EditPanel';
import BatchEditor from './BatchEditor';
import SocialShare from './SocialShare';
import Upscaler from './advanced/Upscaler';
import SmartCrop from './advanced/SmartCrop';
import ErrorMessage from './common/ErrorMessage';
import imageProcessingService from '../services/imageProcessing';
import storageService from '../services/storage';
import errorHandlingService from '../services/errorHandling';

const ImageEditor = ({ onUpgrade, onLogin }) => {
  const { user } = useAuth();
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeTab, setActiveTab] = useState('single');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [activeAdvancedTool, setActiveAdvancedTool] = useState(null);

  // Check if user has edits remaining
  const hasEditsRemaining = () => {
    if (!user) return false;
    if (user.subscriptionTier !== 'free') return true;
    return user.editsRemaining > 0;
  };

  const handleImageUpload = async (uploadedImages) => {
    try {
      const newImages = [];
      
      for (const file of uploadedImages) {
        // Create a local preview immediately
        const localPreview = {
          id: Date.now() + Math.random(),
          file,
          url: URL.createObjectURL(file),
          name: file.name,
          originalUrl: URL.createObjectURL(file),
          editedUrl: null,
          edits: []
        };
        
        newImages.push(localPreview);
        
        // If user is logged in, upload to storage
        if (user) {
          try {
            // Upload to storage in the background
            const uploadResult = await storageService.uploadImage(file, {
              title: file.name
            });
            
            // Update the image with the storage URL
            const updatedImage = {
              ...localPreview,
              id: uploadResult.image.id,
              url: uploadResult.image.url,
              originalUrl: uploadResult.image.url
            };
            
            // Replace the local preview with the uploaded image
            setImages(prev => prev.map(img => 
              img.id === localPreview.id ? updatedImage : img
            ));
          } catch (err) {
            console.error('Image upload error:', err);
            // Keep the local preview if upload fails
          }
        }
      }
      
      setImages(prev => [...prev, ...newImages]);
      if (newImages.length === 1) {
        setSelectedImage(newImages[0]);
      }
    } catch (err) {
      const errorObj = errorHandlingService.handleUploadError(err);
      setError(errorObj);
    }
  };

  const handleEditApply = async (editType, settings) => {
    if (!selectedImage) return;

    // Check authentication
    if (!user) {
      onLogin();
      return;
    }

    // Check subscription limits
    if (!hasEditsRemaining()) {
      onUpgrade();
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setError(null);
    
    try {
      let result;
      
      // Process the image based on edit type
      switch (editType) {
        case 'remove-bg':
          result = await imageProcessingService.removeBackground(
            selectedImage.file,
            settings,
            setProgress
          );
          break;
        case 'enhance':
          result = await imageProcessingService.enhanceImage(
            selectedImage.file,
            settings,
            setProgress
          );
          break;
        case 'filter':
          result = await imageProcessingService.applyFilter(
            selectedImage.file,
            settings.filterId,
            settings,
            setProgress
          );
          break;
        case 'adjustments':
          result = await imageProcessingService.applyAdjustments(
            selectedImage.file,
            settings,
            {},
            setProgress
          );
          break;
        default:
          throw new Error(`Unknown edit type: ${editType}`);
      }
      
      // Update the image with the processed result
      const editedImage = {
        ...selectedImage,
        editedUrl: result.url || selectedImage.originalUrl, // Fallback to original if no URL
        edits: [...selectedImage.edits, { type: editType, settings, timestamp: Date.now() }]
      };
      
      setImages(prev => prev.map(img => 
        img.id === selectedImage.id ? editedImage : img
      ));
      setSelectedImage(editedImage);
      
      // Update user's remaining edits if on free plan
      if (user.subscriptionTier === 'free') {
        user.editsRemaining = Math.max(0, user.editsRemaining - 1);
      }
    } catch (err) {
      const errorObj = errorHandlingService.handleProcessingError(err);
      setError(errorObj);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAdvancedToolComplete = (result) => {
    if (!result || !selectedImage) return;
    
    // Update the image with the processed result
    const editedImage = {
      ...selectedImage,
      editedUrl: result.url || selectedImage.originalUrl,
      edits: [...selectedImage.edits, { 
        type: activeAdvancedTool, 
        timestamp: Date.now() 
      }]
    };
    
    setImages(prev => prev.map(img => 
      img.id === selectedImage.id ? editedImage : img
    ));
    setSelectedImage(editedImage);
    setActiveAdvancedTool(null);
  };

  const handleDownload = (image) => {
    const link = document.createElement('a');
    link.href = image.editedUrl || image.originalUrl;
    link.download = `edited_${image.name}`;
    link.click();
  };

  const tabs = [
    { id: 'single', label: 'Single Edit', icon: <ImageIcon className="w-4 h-4" /> },
    { id: 'batch', label: 'Batch Edit', icon: <Grid className="w-4 h-4" /> }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Image Editor</h1>
        <p className="text-white/70">
          Upload your images and enhance them with AI-powered tools
        </p>
        
        {user && (
          <div className="mt-4 flex items-center gap-4">
            <div className="glass-effect px-4 py-2 rounded-lg">
              <span className="text-sm text-white/70">Plan: </span>
              <span className="text-sm font-medium capitalize text-blue-400">
                {user.subscriptionTier}
              </span>
            </div>
            {user.subscriptionTier === 'free' && (
              <div className="glass-effect px-4 py-2 rounded-lg">
                <span className="text-sm text-white/70">Edits remaining: </span>
                <span className="text-sm font-medium text-yellow-400">
                  {user.editsRemaining}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6">
          <ErrorMessage 
            error={error}
            onRetry={() => setError(null)}
          />
        </div>
      )}

      {/* Tabs */}
      <div className="flex space-x-1 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white'
                : 'glass-effect text-white/70 hover:text-white'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'single' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Area */}
          <div className="lg:col-span-2">
            {!selectedImage ? (
              <ImageUploader onUpload={handleImageUpload} />
            ) : (
              <div className="glass-effect rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">{selectedImage.name}</h3>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(selectedImage)}
                      disabled={!selectedImage.editedUrl}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    
                    <SocialShare 
                      imageUrl={selectedImage.editedUrl || selectedImage.originalUrl}
                      title={`Edited with PixelPerfect AI: ${selectedImage.name}`}
                    />
                    
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setImages(prev => prev.filter(img => img.id !== selectedImage.id));
                        setSelectedImage(null);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="relative">
                  <img
                    src={selectedImage.editedUrl || selectedImage.originalUrl}
                    alt={selectedImage.name}
                    className="w-full max-h-96 object-contain rounded-lg bg-black/20"
                  />
                  {isProcessing && (
                    <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center rounded-lg">
                      <div className="flex items-center gap-3 text-white mb-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                        <span>Processing with AI...</span>
                      </div>
                      <div className="w-64 bg-white/20 rounded-full h-2 mb-1">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-white/70">{progress}%</div>
                    </div>
                  )}
                </div>

                {selectedImage.edits.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-white/70 mb-2">Applied Edits:</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedImage.edits.map((edit, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-600/30 text-blue-200 text-xs rounded-md"
                        >
                          {edit.type}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Image Gallery */}
            {images.length > 0 && (
              <div className="mt-6 glass-effect rounded-xl p-4">
                <h3 className="text-sm font-medium text-white/70 mb-3">Your Images</h3>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                  {images.map((image) => (
                    <div
                      key={image.id}
                      onClick={() => setSelectedImage(image)}
                      className={`relative cursor-pointer rounded-lg overflow-hidden aspect-square ${
                        selectedImage?.id === image.id ? 'ring-2 ring-blue-500' : ''
                      }`}
                    >
                      <img
                        src={image.editedUrl || image.originalUrl}
                        alt={image.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                      {image.editedUrl && (
                        <div className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Edit Panel */}
          <div className="lg:col-span-1">
            {activeAdvancedTool === 'upscaler' ? (
              <Upscaler 
                imageFile={selectedImage?.file}
                onComplete={handleAdvancedToolComplete}
                onCancel={() => setActiveAdvancedTool(null)}
                onUpgrade={onUpgrade}
              />
            ) : activeAdvancedTool === 'smartCrop' ? (
              <SmartCrop 
                imageFile={selectedImage?.file}
                onComplete={handleAdvancedToolComplete}
                onCancel={() => setActiveAdvancedTool(null)}
                onUpgrade={onUpgrade}
              />
            ) : (
              <EditPanel
                selectedImage={selectedImage}
                onApplyEdit={handleEditApply}
                user={user}
                onUpgrade={onUpgrade}
                isProcessing={isProcessing}
                onAdvancedToolSelect={setActiveAdvancedTool}
              />
            )}
          </div>
        </div>
      ) : (
        <BatchEditor
          images={images}
          onUpload={handleImageUpload}
          user={user}
          onUpgrade={onUpgrade}
        />
      )}
    </div>
  );
};

export default ImageEditor;

