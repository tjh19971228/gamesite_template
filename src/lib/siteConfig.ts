let siteConfigData: any;

try {
  siteConfigData = require('../../siteconfig.json');
} catch (error) {
  console.warn('Failed to load siteconfig.json:', error);
  siteConfigData = null;
}

export interface SiteConfig {
  social: {
    twitter: {
      enabled: boolean;
      link: string;
    };
    youtube: {
      enabled: boolean;
      link: string;
    };
    discord: {
      enabled: boolean;
      link: string;
    };
    github: {
      enabled: boolean;
      link: string;
    };
  };
  siteInfo: {
    title: string;
    description: string;
    siteName: string;
    shortName: string;
    url: string;
    language: string;
    creator: string;
    twitterUsername: string;
    locale: string;
    googleAnalyticsId: string;
    keywords: string;
  };
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

// 默认配置
const defaultConfig: SiteConfig = {
  social: {
    twitter: {
      enabled: false,
      link: ""
    },
    youtube: {
      enabled: false,
      link: ""
    },
    discord: {
      enabled: false,
      link: ""
    },
    github: {
      enabled: false,
      link: ""
    }
  },
  siteInfo: {
    title: "GameSite",
    description: "Your ultimate destination for free online games",
    siteName: "GameSite",
    shortName: "GameSite",
    url: "http://localhost:3000",
    language: "en",
    creator: "@GameSite",
    twitterUsername: "@GameSite",
    locale: "en_US",
    googleAnalyticsId: "",
    keywords: "games, free online games, unblocked games"
  },
  branding: {
    siteName: "GameSite",
    logo: {
      href: "/",
      icon: {
        type: 'svg',
        className: "h-8 w-8",
        fallback: {
          svg: "M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m6-7a9 9 0 11-18 0 9 9 0 0118 0z",
          className: "h-5 w-5"
        }
      }
    }
  }
};

export function getSiteConfig(): SiteConfig {
  if (!siteConfigData) {
    console.warn('Site config data not available, using default config');
    return defaultConfig;
  }
  
  try {
    // 确保所有必需的字段都存在
    const config = {
      social: siteConfigData.social || defaultConfig.social,
      siteInfo: siteConfigData.siteInfo || defaultConfig.siteInfo,
      branding: siteConfigData.branding || defaultConfig.branding
    };
    
    // 确保 social 对象的每个平台都有正确的结构
    config.social = {
      twitter: {
        enabled: config.social.twitter?.enabled ?? false,
        link: config.social.twitter?.link ?? ""
      },
      youtube: {
        enabled: config.social.youtube?.enabled ?? false,
        link: config.social.youtube?.link ?? ""
      },
      discord: {
        enabled: config.social.discord?.enabled ?? false,
        link: config.social.discord?.link ?? ""
      },
      github: {
        enabled: config.social.github?.enabled ?? false,
        link: config.social.github?.link ?? ""
      }
    };
    
    return config as SiteConfig;
  } catch (error) {
    console.warn('Failed to parse site config, using default config:', error);
    return defaultConfig;
  }
}

export function getBrandingConfig() {
  const config = getSiteConfig();
  return config.branding || defaultConfig.branding;
}

export function getSiteName() {
  const config = getSiteConfig();
  return config.branding?.siteName || defaultConfig.branding.siteName;
}

export function getLogoConfig() {
  const config = getSiteConfig();
  return config.branding?.logo || defaultConfig.branding.logo;
}

// 导出站点信息
export function getSiteInfo() {
  const config = getSiteConfig();
  return config.siteInfo || defaultConfig.siteInfo;
} 

// 导出社交配置
export function getSocialConfig() {
  const config = getSiteConfig();
  return config.social || defaultConfig.social;
}