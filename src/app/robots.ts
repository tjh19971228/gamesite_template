import siteConfig from '../../siteconfig.json';
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: siteConfig.robots.rules.userAgent,
      allow: siteConfig.robots.rules.allow,
      disallow: siteConfig.robots.rules.disallow,
    },
    sitemap: `${siteConfig.seo.metadataBase}/sitemap.xml`,
    host: siteConfig.seo.metadataBase,
  };
} 