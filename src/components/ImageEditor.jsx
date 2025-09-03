import React, { useState, useRef } from 'react'
import { Upload, Download, Share2, Trash2, Eye, EyeOff, Sparkles, Image as ImageIcon, Grid, Sliders } from 'lucide-react'
import Button from './ui/Button'
import ImageUploader from './ImageUploader'
import EditPanel from './EditPanel'
import BatchEditor from './BatchEditor'

const ImageEditor = ({ user, onUpgrade, onLogin }) => {
  const [images, setImages] = useState([])
  const [selectedImage, setSelectedImage] = useState(null)
  const [activeTab, setActiveTab] = useState('single')
  const [isProcessing, setIsProcessing] = useState(false)

  const handleImageUpload = (uploadedImages) => {
    const newImages = uploadedImages.map((file, index) => ({
      id: Date.now() + index,
      file,
      url: URL.createObjectURL(file),
      name: file.name,
      originalUrl: URL.createObjectURL(file),
      editedUrl: null,
      edits: []
    }))
    
    setImages(prev => [...prev, ...newImages])
    if (newImages.length === 1) {
      setSelectedImage(newImages[0])
    }
  }

  const handleEditApply = async (editType, settings) => {
    if (!selectedImage) return

    // Check subscription limits
    if (!user) {
      onLogin()
      return
    }

    if (user.subscriptionTier === 'free' && user.editsRemaining <= 0) {
      onUpgrade()
      return
    }

    setIsProcessing(true)
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const editedImage = {
      ...selectedImage,
      editedUrl: selectedImage.originalUrl, // In real app, this would be the processed image
      edits: [...selectedImage.edits, { type: editType, settings, timestamp: Date.now() }]
    }

    setImages(prev => prev.map(img => 
      img.id === selectedImage.id ? editedImage : img
    ))
    setSelectedImage(editedImage)
    setIsProcessing(false)

    // Update user's remaining edits
    if (user.subscriptionTier === 'free') {
      user.editsRemaining = Math.max(0, user.editsRemaining - 1)
    }
  }

  const handleDownload = (image) => {
    const link = document.createElement('a')
    link.href = image.editedUrl || image.originalUrl
    link.download = `edited_${image.name}`
    link.click()
  }

  const handleShare = (image) => {
    if (navigator.share) {
      navigator.share({
        title: 'Edited with PixelPerfect AI',
        url: image.editedUrl || image.originalUrl
      })
    } else {
      // Fallback for browsers without native sharing
      alert('Sharing feature coming soon!')
    }
  }

  const tabs = [
    { id: 'single', label: 'Single Edit', icon: <ImageIcon className="w-4 h-4" /> },
    { id: 'batch', label: 'Batch Edit', icon: <Grid className="w-4 h-4" /> }
  ]

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
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleShare(selectedImage)}
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setImages(prev => prev.filter(img => img.id !== selectedImage.id))
                        setSelectedImage(null)
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
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                      <div className="flex items-center gap-3 text-white">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                        <span>Processing with AI...</span>
                      </div>
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
            <EditPanel
              selectedImage={selectedImage}
              onApplyEdit={handleEditApply}
              user={user}
              onUpgrade={onUpgrade}
              isProcessing={isProcessing}
            />
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
  )
}

export default ImageEditor