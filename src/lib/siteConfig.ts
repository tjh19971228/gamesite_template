import siteConfigData from '../../siteconfig.json';

export interface SiteConfig {
  siteInfo: typeof siteConfigData.siteInfo;
  branding: {
    siteName: string;
    logo: {
      href: string;
      icon: {
        type: 'image' | 'svg';
        src?: string;
        alt?: string;
        className: string;
        fallback?: {
          svg: string;
          className: string;
        };
      };
    };
  };
}

export function getSiteConfig(): SiteConfig {
  return siteConfigData as SiteConfig;
}

export function getBrandingConfig() {
  const config = getSiteConfig();
  return config.branding;
}

export function getSiteName() {
  const config = getSiteConfig();
  return config.branding.siteName;
}

export function getLogoConfig() {
  const config = getSiteConfig();
  return config.branding.logo;
}

// 导出站点信息
export function getSiteInfo() {
  const config = getSiteConfig();
  return config.siteInfo;
} 