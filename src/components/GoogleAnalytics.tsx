'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import { getSiteInfo } from '@/lib/siteConfig';
import { usePathname, useSearchParams } from 'next/navigation';

// 获取 Google Analytics ID
const gaId = getSiteInfo().googleAnalyticsId;

// 页面浏览追踪
function trackPageView(url: string) {
  if (!window.gtag || !gaId) return;
  
  window.gtag('config', gaId, {
    page_path: url,
  });
}

// 定义全局 Window 接口扩展
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

/**
 * Google Analytics 组件
 * 使用 siteInfo 中的 googleAnalyticsId
 */
export function GoogleAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // 处理路由变化，发送页面浏览事件
  useEffect(() => {
    if (!gaId) return;
    
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
    trackPageView(url);
  }, [pathname, searchParams]);
  
  // 如果没有配置 Google Analytics ID，则不渲染任何内容
  if (!gaId) return null;
  
  return (
    <>
      {/* Global Site Tag (gtag.js) - Google Analytics */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
} 