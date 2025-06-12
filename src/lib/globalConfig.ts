/**
 * Global Configuration Utilities
 * 全局配置工具函数
 */

import globalConfig from '@/data/globalConfig.json';

export interface LoadingConfig {
  enabled: boolean;
  type: 'spinner' | 'dots' | 'pulse';
  showProgressBar: boolean;
  showPercentage: boolean;
  backgroundColor: string;
  spinnerColor: string;
  progressBarColor: string;
  text: string;
  showText: boolean;
  animationType: 'fade' | 'slide' | 'scale';
  delayMs: number;
  minimumDurationMs: number;
  position: 'center' | 'top' | 'bottom';
  size: 'small' | 'medium' | 'large';
  overlay: boolean;
  blurBackground: boolean;
}

export interface ISRPageConfig {
  revalidate: number;
  enabled: boolean;
}

export interface ISRConfig {
  enabled: boolean;
  revalidateTime: number;
  backgroundRevalidation: boolean;
  fallback: 'blocking' | 'true' | 'false';
  pages: {
    home: ISRPageConfig;
    game: ISRPageConfig;
    category: ISRPageConfig;
    games: ISRPageConfig;
    blog: ISRPageConfig;
  };
  cacheHeaders: {
    maxAge: number;
    staleWhileRevalidate: number;
    mustRevalidate: boolean;
  };
}

export interface PerformanceConfig {
  enableImageOptimization: boolean;
  lazyLoading: boolean;
  prefetchLinks: boolean;
  compression: {
    enabled: boolean;
    level: number;
  };
  caching: {
    staticFiles: number;
    apiResponses: number;
    images: number;
  };
}

export interface GlobalConfig {
  loading: LoadingConfig;
  isr: ISRConfig;
  performance: PerformanceConfig;
}

/**
 * Get loading configuration
 */
export function getLoadingConfig(): LoadingConfig {
  return globalConfig.loading as LoadingConfig;
}

/**
 * Get ISR configuration
 */
export function getISRConfig(): ISRConfig {
  return globalConfig.isr as ISRConfig;
}

/**
 * Get ISR configuration for specific page
 */
export function getPageISRConfig(pageType: keyof ISRConfig['pages']): ISRPageConfig | null {
  const config = getISRConfig();
  
  if (!config.enabled) {
    return null;
  }
  
  const pageConfig = config.pages[pageType];
  if (!pageConfig?.enabled) {
    return null;
  }
  
  return pageConfig;
}

/**
 * Get revalidate time for specific page
 */
export function getPageRevalidateTime(pageType: keyof ISRConfig['pages']): number | false {
  const pageConfig = getPageISRConfig(pageType);
  
  if (!pageConfig) {
    return false;
  }
  
  return pageConfig.revalidate;
}

/**
 * Get performance configuration
 */
export function getPerformanceConfig(): PerformanceConfig {
  return globalConfig.performance as PerformanceConfig;
}

/**
 * Get complete global configuration
 */
export function getGlobalConfig(): GlobalConfig {
  return globalConfig as GlobalConfig;
}

/**
 * Check if feature is enabled
 */
export function isFeatureEnabled(feature: 'loading' | 'isr' | 'imageOptimization' | 'lazyLoading'): boolean {
  const config = getGlobalConfig();
  
  switch (feature) {
    case 'loading':
      return config.loading.enabled;
    case 'isr':
      return config.isr.enabled;
    case 'imageOptimization':
      return config.performance.enableImageOptimization;
    case 'lazyLoading':
      return config.performance.lazyLoading;
    default:
      return false;
  }
}

/**
 * Generate cache headers based on configuration
 */
export function getCacheHeaders() {
  const config = getISRConfig();
  
  const headers: Record<string, string> = {};
  
  if (config.enabled) {
    const { maxAge, staleWhileRevalidate, mustRevalidate } = config.cacheHeaders;
    
    headers['Cache-Control'] = [
      `max-age=${maxAge}`,
      `s-maxage=${staleWhileRevalidate}`,
      mustRevalidate ? 'must-revalidate' : 'stale-while-revalidate',
    ].join(', ');
  }
  
  return headers;
}

const globalConfigUtils = {
  getLoadingConfig,
  getISRConfig,
  getPageISRConfig,
  getPageRevalidateTime,
  getPerformanceConfig,
  getGlobalConfig,
  isFeatureEnabled,
  getCacheHeaders,
};

export default globalConfigUtils; 