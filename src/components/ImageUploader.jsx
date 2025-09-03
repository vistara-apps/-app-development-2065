import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, X, FileImage } from 'lucide-react';
import Button from './ui/Button';

const ImageUploader = ({ onUpload, multiple = false }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files) => {
    const validFiles = Array.from(files).filter(file => 
      file.type.startsWith('image/')
    );
    
    if (validFiles.length === 0) {
      alert('Please select valid image files (JPEG, PNG, etc.)');
      return;
    }
    
    if (multiple) {
      setSelectedFiles(prev => [...prev, ...validFiles]);
    } else {
      setSelectedFiles([validFiles[0]]);
    }
  };

  const handleRemoveFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = () => {
    if (selectedFiles.length === 0) {
      alert('Please select at least one image to upload');
      return;
    }
    
    onUpload(selectedFiles);
    setSelectedFiles([]);
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="glass-effect rounded-xl p-6">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center ${
          dragActive ? 'border-blue-500 bg-blue-500/10' : 'border-white/30'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={handleChange}
          className="hidden"
        />
        
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 mb-4 bg-white/10 rounded-full flex items-center justify-center">
            <Upload className="w-8 h-8 text-white/70" />
          </div>
          
          <h3 className="text-lg font-semibold mb-2">
            {dragActive ? 'Drop your images here' : 'Upload your images'}
          </h3>
          
          <p className="text-white/70 mb-6 max-w-md">
            Drag and drop your images here, or click the button below to select files from your device
          </p>
          
          <Button
            variant="primary"
            onClick={handleButtonClick}
          >
            <FileImage className="w-4 h-4 mr-2" />
            Select Images
          </Button>
          
          <p className="mt-4 text-xs text-white/50">
            Supported formats: JPEG, PNG, WebP, HEIC
            {multiple ? '' : ' (Max 1 file)'}
          </p>
        </div>
      </div>

      {/* Selected Files Preview */}
      {selectedFiles.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-white/70">
              Selected Images ({selectedFiles.length})
            </h4>
            <Button
              variant="primary"
              size="sm"
              onClick={handleUpload}
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload {selectedFiles.length > 1 ? 'All' : ''}
            </Button>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {selectedFiles.map((file, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden bg-black/20">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  onClick={() => handleRemoveFile(index)}
                  className="absolute top-1 right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
                <p className="text-xs text-white/70 truncate mt-1">
                  {file.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;

