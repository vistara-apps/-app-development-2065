import React, { useState } from 'react';
import { Code, Copy, Check, ChevronDown, ChevronRight, ExternalLink } from 'lucide-react';
import Button from '../components/ui/Button';

const ApiDocs = () => {
  const [expandedSection, setExpandedSection] = useState('authentication');
  const [copiedEndpoint, setCopiedEndpoint] = useState(null);

  const handleCopyCode = (code, endpoint) => {
    navigator.clipboard.writeText(code);
    setCopiedEndpoint(endpoint);
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const apiEndpoints = [
    {
      id: 'authentication',
      title: 'Authentication',
      description: 'All API requests require authentication using an API key. You can obtain an API key from your PixelPerfect AI dashboard.',
      code: `curl -X GET "https://api.pixelperfect.ai/health" \\
  -H "X-API-Key: your_api_key_here"`,
      response: `{
  "status": "ok",
  "message": "API is operational",
  "version": "1.0.0"
}`
    },
    {
      id: 'remove-background',
      title: 'Remove Background',
      description: 'Removes the background from an image, isolating the subject.',
      endpoint: 'POST /image/remove-background',
      code: `curl -X POST "https://api.pixelperfect.ai/image/remove-background" \\
  -H "X-API-Key: your_api_key_here" \\
  -F "file=@image.jpg" \\
  -F "refinement=high" \\
  -F "format=png"`,
      response: `{
  "success": true,
  "result": {
    "url": "https://storage.pixelperfect.ai/processed/bg_removed_12345.png",
    "width": 1024,
    "height": 768,
    "size": 245678,
    "format": "png"
  }
}`
    },
    {
      id: 'enhance-image',
      title: 'Enhance Image',
      description: 'Applies AI-powered enhancements to improve image quality.',
      endpoint: 'POST /image/enhance',
      code: `curl -X POST "https://api.pixelperfect.ai/image/enhance" \\
  -H "X-API-Key: your_api_key_here" \\
  -F "file=@image.jpg" \\
  -F "enhancement=portrait" \\
  -F "quality=high"`,
      response: `{
  "success": true,
  "result": {
    "url": "https://storage.pixelperfect.ai/processed/enhanced_12345.jpg",
    "width": 1024,
    "height": 768,
    "size": 345678,
    "format": "jpg"
  }
}`
    },
    {
      id: 'apply-filter',
      title: 'Apply Filter',
      description: 'Applies a filter to an image.',
      endpoint: 'POST /image/filter',
      code: `curl -X POST "https://api.pixelperfect.ai/image/filter" \\
  -H "X-API-Key: your_api_key_here" \\
  -F "file=@image.jpg" \\
  -F "filter=vintage" \\
  -F "intensity=0.8"`,
      response: `{
  "success": true,
  "result": {
    "url": "https://storage.pixelperfect.ai/processed/filtered_12345.jpg",
    "width": 1024,
    "height": 768,
    "size": 298765,
    "format": "jpg",
    "filter": "vintage",
    "intensity": 0.8
  }
}`
    },
    {
      id: 'batch-processing',
      title: 'Batch Processing',
      description: 'Process multiple images with the same settings.',
      endpoint: 'POST /image/batch',
      code: `curl -X POST "https://api.pixelperfect.ai/image/batch" \\
  -H "X-API-Key: your_api_key_here" \\
  -F "file0=@image1.jpg" \\
  -F "file1=@image2.jpg" \\
  -F 'settings={"removeBackground":true,"autoEnhance":true,"filter":"none"}'`,
      response: `{
  "success": true,
  "results": [
    {
      "originalName": "image1.jpg",
      "url": "https://storage.pixelperfect.ai/processed/batch_12345_0.png",
      "width": 1024,
      "height": 768,
      "size": 245678,
      "format": "png"
    },
    {
      "originalName": "image2.jpg",
      "url": "https://storage.pixelperfect.ai/processed/batch_12345_1.png",
      "width": 800,
      "height": 600,
      "size": 198765,
      "format": "png"
    }
  ]
}`
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">PixelPerfect AI API</h1>
        <p className="text-xl text-white/80 max-w-3xl mx-auto">
          Integrate AI-powered image editing capabilities into your applications
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="glass-effect rounded-xl p-6 sticky top-24">
            <h3 className="text-lg font-semibold mb-4">API Reference</h3>
            
            <nav className="space-y-1">
              {apiEndpoints.map((endpoint) => (
                <button
                  key={endpoint.id}
                  onClick={() => toggleSection(endpoint.id)}
                  className={`w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    expandedSection === endpoint.id
                      ? 'bg-blue-600/20 text-blue-300'
                      : 'text-white/80 hover:bg-white/10'
                  }`}
                >
                  <span>{endpoint.title}</span>
                </button>
              ))}
            </nav>
            
            <div className="mt-6 pt-6 border-t border-white/20">
              <Button
                variant="outline"
                className="w-full flex items-center gap-2 justify-center"
                onClick={() => window.open('/docs/API.md', '_blank')}
              >
                <ExternalLink className="w-4 h-4" />
                Full Documentation
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="glass-effect rounded-xl p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Getting Started</h2>
              <p className="text-white/80 mb-4">
                The PixelPerfect AI API allows you to integrate our powerful image editing capabilities into your own applications.
                This guide will help you get started with the API and show you how to make your first request.
              </p>
              
              <div className="glass-effect rounded-lg p-4 mb-6">
                <h3 className="text-lg font-semibold mb-2">Base URL</h3>
                <div className="bg-black/30 rounded-lg p-3 font-mono text-sm">
                  https://api.pixelperfect.ai
                </div>
              </div>
              
              <div className="glass-effect rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold">API Key</h3>
                  <Button variant="outline" size="sm">
                    Get API Key
                  </Button>
                </div>
                <p className="text-white/70 text-sm mb-3">
                  All API requests require authentication using an API key. You can obtain an API key from your PixelPerfect AI dashboard.
                </p>
                <div className="bg-black/30 rounded-lg p-3 font-mono text-sm">
                  X-API-Key: your_api_key_here
                </div>
              </div>
            </div>
            
            {/* API Endpoints */}
            <div className="space-y-6">
              {apiEndpoints.map((endpoint) => (
                <div 
                  key={endpoint.id}
                  className={`glass-effect rounded-xl overflow-hidden transition-all duration-300 ${
                    expandedSection === endpoint.id ? 'border border-blue-500/30' : ''
                  }`}
                >
                  <button
                    onClick={() => toggleSection(endpoint.id)}
                    className="w-full flex items-center justify-between p-6 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <Code className="w-5 h-5 text-blue-400" />
                      <h3 className="text-lg font-semibold">{endpoint.title}</h3>
                    </div>
                    {expandedSection === endpoint.id ? (
                      <ChevronDown className="w-5 h-5" />
                    ) : (
                      <ChevronRight className="w-5 h-5" />
                    )}
                  </button>
                  
                  {expandedSection === endpoint.id && (
                    <div className="px-6 pb-6">
                      <p className="text-white/80 mb-4">
                        {endpoint.description}
                      </p>
                      
                      {endpoint.endpoint && (
                        <div className="mb-4">
                          <div className="text-sm text-white/70 mb-1">Endpoint</div>
                          <div className="bg-black/30 rounded-lg p-3 font-mono text-sm flex items-center justify-between">
                            <span>{endpoint.endpoint}</span>
                            <button
                              onClick={() => handleCopyCode(endpoint.endpoint, `${endpoint.id}-endpoint`)}
                              className="p-1 hover:bg-white/10 rounded"
                            >
                              {copiedEndpoint === `${endpoint.id}-endpoint` ? (
                                <Check className="w-4 h-4 text-green-400" />
                              ) : (
                                <Copy className="w-4 h-4 text-white/50" />
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                      
                      <div className="mb-4">
                        <div className="text-sm text-white/70 mb-1">Example Request</div>
                        <div className="bg-black/30 rounded-lg p-3 font-mono text-sm relative">
                          <pre className="whitespace-pre-wrap">{endpoint.code}</pre>
                          <button
                            onClick={() => handleCopyCode(endpoint.code, `${endpoint.id}-code`)}
                            className="absolute top-3 right-3 p-1 hover:bg-white/10 rounded"
                          >
                            {copiedEndpoint === `${endpoint.id}-code` ? (
                              <Check className="w-4 h-4 text-green-400" />
                            ) : (
                              <Copy className="w-4 h-4 text-white/50" />
                            )}
                          </button>
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-white/70 mb-1">Example Response</div>
                        <div className="bg-black/30 rounded-lg p-3 font-mono text-sm relative">
                          <pre className="whitespace-pre-wrap">{endpoint.response}</pre>
                          <button
                            onClick={() => handleCopyCode(endpoint.response, `${endpoint.id}-response`)}
                            className="absolute top-3 right-3 p-1 hover:bg-white/10 rounded"
                          >
                            {copiedEndpoint === `${endpoint.id}-response` ? (
                              <Check className="w-4 h-4 text-green-400" />
                            ) : (
                              <Copy className="w-4 h-4 text-white/50" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {/* SDKs */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-4">Client Libraries</h2>
              <p className="text-white/80 mb-6">
                We provide official client libraries for several programming languages to make integration easier.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <a 
                  href="#" 
                  className="glass-effect rounded-lg p-4 hover:bg-white/5 transition-colors flex items-center gap-3"
                >
                  <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                    <span className="text-yellow-400 font-bold">JS</span>
                  </div>
                  <div>
                    <h3 className="font-medium">JavaScript/TypeScript</h3>
                    <p className="text-sm text-white/70">npm install pixelperfect-ai</p>
                  </div>
                </a>
                
                <a 
                  href="#" 
                  className="glass-effect rounded-lg p-4 hover:bg-white/5 transition-colors flex items-center gap-3"
                >
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <span className="text-blue-400 font-bold">Py</span>
                  </div>
                  <div>
                    <h3 className="font-medium">Python</h3>
                    <p className="text-sm text-white/70">pip install pixelperfect-ai</p>
                  </div>
                </a>
                
                <a 
                  href="#" 
                  className="glass-effect rounded-lg p-4 hover:bg-white/5 transition-colors flex items-center gap-3"
                >
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <span className="text-purple-400 font-bold">PHP</span>
                  </div>
                  <div>
                    <h3 className="font-medium">PHP</h3>
                    <p className="text-sm text-white/70">composer require pixelperfect/pixelperfect-php</p>
                  </div>
                </a>
                
                <a 
                  href="#" 
                  className="glass-effect rounded-lg p-4 hover:bg-white/5 transition-colors flex items-center gap-3"
                >
                  <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                    <span className="text-red-400 font-bold">Rb</span>
                  </div>
                  <div>
                    <h3 className="font-medium">Ruby</h3>
                    <p className="text-sm text-white/70">gem install pixelperfect-ai</p>
                  </div>
                </a>
              </div>
            </div>
            
            {/* Support */}
            <div className="mt-12 glass-effect rounded-xl p-6">
              <h2 className="text-xl font-bold mb-2">Need Help?</h2>
              <p className="text-white/80 mb-4">
                If you have any questions or need assistance with the API, our support team is here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="primary" className="flex-1">
                  Contact Support
                </Button>
                <Button variant="outline" className="flex-1">
                  View Full Documentation
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiDocs;

