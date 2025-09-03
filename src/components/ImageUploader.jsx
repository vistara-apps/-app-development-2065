import React, { useRef, useState } from 'react'
import { Upload, Image as ImageIcon, X } from 'lucide-react'
import Button from './ui/Button'

const ImageUploader = ({ onUpload, multiple = true }) => {
  const [dragActive, setDragActive] = useState(false)
  const [previews, setPreviews] = useState([])
  const inputRef = useRef(null)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const files = [...e.dataTransfer.files].filter(file => 
      file.type.startsWith('image/')
    )
    
    if (files.length > 0) {
      handleFiles(files)
    }
  }

  const handleChange = (e) => {
    e.preventDefault()
    const files = [...e.target.files].filter(file => 
      file.type.startsWith('image/')
    )
    
    if (files.length > 0) {
      handleFiles(files)
    }
  }

  const handleFiles = (files) => {
    if (!multiple && files.length > 1) {
      files = [files[0]]
    }

    const newPreviews = files.map(file => ({
      file,
      url: URL.createObjectURL(file),
      name: file.name
    }))

    setPreviews(prev => multiple ? [...prev, ...newPreviews] : newPreviews)
  }

  const removePreview = (index) => {
    setPreviews(prev => {
      const newPreviews = prev.filter((_, i) => i !== index)
      return newPreviews
    })
  }

  const handleUpload = () => {
    if (previews.length > 0) {
      onUpload(previews.map(p => p.file))
      setPreviews([])
    }
  }

  const onButtonClick = () => {
    inputRef.current?.click()
  }

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`glass-effect rounded-xl border-2 border-dashed transition-all duration-200 ${
          dragActive 
            ? 'border-blue-400 bg-blue-500/10' 
            : 'border-white/30 hover:border-white/50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <Upload className="w-8 h-8 text-white" />
          </div>
          
          <h3 className="text-xl font-semibold mb-2">
            Drop your images here
          </h3>
          
          <p className="text-white/70 mb-6">
            or click to browse from your device
          </p>
          
          <Button variant="primary" onClick={onButtonClick}>
            <ImageIcon className="w-4 h-4 mr-2" />
            Choose Images
          </Button>
          
          <input
            ref={inputRef}
            type="file"
            multiple={multiple}
            accept="image/*"
            onChange={handleChange}
            className="hidden"
          />
          
          <p className="text-sm text-white/50 mt-4">
            Supports JPG, PNG, WebP up to 10MB
          </p>
        </div>
      </div>

      {/* Preview Area */}
      {previews.length > 0 && (
        <div className="glass-effect rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">
              Ready to upload ({previews.length} image{previews.length !== 1 ? 's' : ''})
            </h3>
            <Button variant="primary" onClick={handleUpload}>
              Upload & Edit
            </Button>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {previews.map((preview, index) => (
              <div key={index} className="relative group">
                <img
                  src={preview.url}
                  alt={preview.name}
                  className="w-full aspect-square object-cover rounded-lg"
                />
                <button
                  onClick={() => removePreview(index)}
                  className="absolute top-2 right-2 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 rounded-b-lg">
                  <p className="text-xs text-white truncate">
                    {preview.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ImageUploader