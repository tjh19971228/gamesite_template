'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { HeroSectionProps } from '@/types';
import { SparklesText } from '@/components/magicui/sparkles-text';

/**
 * Hero Section Component
 * 首页主要展示区域组件
 */
export function HeroSection({
  title,
  subtitle,
  description,
  backgroundImage,
  backgroundVideo,
  ctaButtons = [],
  showVideo = false,
  height = 'lg',
  className,
  ...props
}: HeroSectionProps) {
  const heightClasses = {
    sm: 'h-[400px]',
    md: 'h-[500px]',
    lg: 'h-[600px]',
    xl: 'h-[700px]',
    screen: 'h-screen'
  };

  return (
    <section
      className={cn(
        'relative overflow-hidden flex items-center justify-center',
        heightClasses[height],
        className
      )}
      {...props}
    >
      {/* Background */}
      <div className="absolute inset-0 z-0">
        {backgroundVideo && showVideo ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src={backgroundVideo} type="video/mp4" />
          </video>
        ) : backgroundImage ? (
          <Image
            src={backgroundImage}
            alt="Hero background"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-500 via-secondary-500 to-accent-500" style={{ 
            backgroundImage: `linear-gradient(135deg, rgb(var(--color-primary-500)) 0%, rgb(var(--color-secondary-500)) 50%, rgb(var(--color-accent-500)) 100%)`
          }} />
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Title */}
          <div className="space-y-4">
            <SparklesText
              className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading"
              sparklesCount={8}
            >
              {title}
            </SparklesText>
            
            {subtitle && (
              <h2 className="text-xl md:text-2xl lg:text-3xl font-medium text-white/90">
                {subtitle}
              </h2>
            )}
          </div>

          {/* Description */}
          {description && (
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
              {description}
            </p>
          )}

          {/* CTA Buttons */}
          {ctaButtons.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
              {/* 使用相同样式的按钮 */}
              {ctaButtons.map((button, index) => (
                <Link key={index} href={button.href || '#'}>
                  <button 
                    className={cn(
                      "h-12 px-8 min-w-[180px] text-lg font-medium rounded-md flex items-center justify-center",
                      index === 0 
                        ? "text-white transition-colors" 
                        : "border-2 border-white text-white bg-transparent hover:bg-white hover:text-black transition-colors"
                    )}
                    style={index === 0 ? {
                      backgroundColor: 'rgb(var(--color-primary-500))',
                    } : {}}
                    onClick={!button.href ? button.onClick : undefined}
                  >
                    {button.icon && <span className="mr-2">{button.icon}</span>}
                    {button.text}
                  </button>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Scroll Indicator */}
        {/* <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse" />
          </div>
        </div> */}
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl" style={{ animation: 'float 3s infinite ease-in-out' }} />
      <div 
        className="absolute bottom-10 right-10 w-32 h-32 rounded-full blur-2xl" 
        style={{ 
          backgroundColor: `rgba(var(--color-primary-500), 0.2)`, 
          animation: 'float 3s infinite ease-in-out', 
          animationDelay: '1s' 
        }} 
      />
      <div 
        className="absolute top-1/2 left-5 w-16 h-16 rounded-full blur-xl" 
        style={{ 
          backgroundColor: `rgba(var(--color-secondary-500), 0.2)`, 
          animation: 'float 3s infinite ease-in-out',
          animationDelay: '2s' 
        }} 
      />
    </section>
  );
}

export default HeroSection; 