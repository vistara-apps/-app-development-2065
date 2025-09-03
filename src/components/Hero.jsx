import React from 'react'
import { ArrowRight, Sparkles, Zap, Users } from 'lucide-react'
import Button from './ui/Button'

const Hero = ({ onGetStarted }) => {
  const features = [
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "AI Background Removal",
      description: "Remove backgrounds instantly with AI precision"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "One-Click Enhancements",
      description: "Professional-grade filters and adjustments"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Batch Processing",
      description: "Edit multiple images simultaneously"
    }
  ]

  const sampleImages = [
    {
      original: "https://images.unsplash.com/photo-1494790108755-2616c4ec1c3f?w=300&h=400&fit=crop",
      title: "Portrait Enhancement"
    },
    {
      original: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=400&fit=crop",
      title: "Product Photography"
    },
    {
      original: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=400&fit=crop",
      title: "Landscape Photography"
    }
  ]

  return (
    <div className="relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        {/* Hero Content */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
              Effortless AI-powered
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              image editing
            </span>
          </h1>
          
          <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto">
            Transform your visuals instantly with AI. Remove backgrounds, enhance images, 
            and share directly to social media - all in one powerful web app.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              variant="primary" 
              size="lg"
              onClick={onGetStarted}
              className="group"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" size="lg">
              View Demo
            </Button>
          </div>
        </div>

        {/* Sample Images Grid */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold text-center mb-8 text-white/90">
            See the magic in action
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {sampleImages.map((image, index) => (
              <div key={index} className="group relative">
                <div className="glass-effect rounded-xl p-4 hover:scale-105 transition-all duration-300">
                  <img
                    src={image.original}
                    alt={image.title}
                    className="w-full h-48 object-cover rounded-lg mb-3"
                  />
                  <h3 className="text-sm font-medium text-white/90 text-center">
                    {image.title}
                  </h3>
                </div>
                <div className="absolute top-2 right-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs px-2 py-1 rounded-full">
                  AI Enhanced
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center group">
              <div className="glass-effect rounded-xl p-6 hover:scale-105 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2 text-white">
                  {feature.title}
                </h3>
                <p className="text-white/70">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Hero