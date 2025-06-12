import React from 'react';
import { cn } from '@/lib/utils';
import globalConfig from '@/data/globalConfig.json';

interface GlobalLoadingProps {
  isLoading?: boolean;
  progress?: number;
  text?: string;
  className?: string;
}

/**
 * Global Loading Component
 * 全局加载组件 - 根据JSON配置显示loading状态
 */
export function GlobalLoading({ 
  isLoading = true, 
  progress = 0, 
  text,
  className 
}: GlobalLoadingProps) {
  const config = globalConfig.loading;

  if (!config.enabled || !isLoading) return null;

  const getSizeClasses = () => {
    switch (config.size) {
      case 'small':
        return 'w-6 h-6';
      case 'large':
        return 'w-12 h-12';
      case 'medium':
      default:
        return 'w-8 h-8';
    }
  };

  const getPositionClasses = () => {
    switch (config.position) {
      case 'top':
        return 'top-4 left-1/2 -translate-x-1/2';
      case 'bottom':
        return 'bottom-4 left-1/2 -translate-x-1/2';
      case 'center':
      default:
        return 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2';
    }
  };

  const SpinnerComponent = () => (
    <div
      className={cn('animate-spin rounded-full border-2 border-t-transparent', getSizeClasses())}
      style={{
        borderColor: `${config.spinnerColor}40`,
        borderTopColor: config.spinnerColor,
      }}
    />
  );

  const DotsComponent = () => (
    <div className="flex space-x-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-2 h-2 rounded-full animate-pulse"
          style={{
            backgroundColor: config.spinnerColor,
            animationDelay: `${i * 0.1}s`,
          }}
        />
      ))}
    </div>
  );

  const PulseComponent = () => (
    <div
      className={cn('rounded-full animate-pulse', getSizeClasses())}
      style={{ backgroundColor: config.spinnerColor }}
    />
  );

  const LoadingSpinner = () => {
    switch (config.type) {
      case 'dots':
        return <DotsComponent />;
      case 'pulse':
        return <PulseComponent />;
      case 'spinner':
      default:
        return <SpinnerComponent />;
    }
  };

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center transition-all duration-300',
        config.animationType === 'fade' ? 'animate-in fade-in' : '',
        'opacity-100',
        className
      )}
      style={{
        backgroundColor: config.overlay ? config.backgroundColor : 'transparent',
        backdropFilter: config.blurBackground ? 'blur(4px)' : 'none',
      }}
    >
      <div className={cn('absolute', getPositionClasses())}>
        <div className="flex flex-col items-center space-y-4 p-6 rounded-lg bg-background/80 backdrop-blur-sm shadow-lg border">
          {/* Loading Animation */}
          <LoadingSpinner />

          {/* Loading Text */}
          {config.showText && (
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">
                {text || config.text}
              </p>
            </div>
          )}

          {/* Progress Bar */}
          {config.showProgressBar && (
            <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  backgroundColor: config.progressBarColor,
                  width: `${progress}%`,
                }}
              />
            </div>
          )}

          {/* Progress Percentage */}
          {config.showPercentage && (
            <p className="text-xs text-muted-foreground">
              {Math.round(progress)}%
            </p>
          )}
        </div>
      </div>
    </div>
  );
}



export default GlobalLoading; 