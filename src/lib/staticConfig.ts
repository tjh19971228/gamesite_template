/**
 * Static Configuration for Build-time Values
 * 构建时静态配置值 - 此文件由脚本自动生成，请勿手动修改
 */

// 在模块顶层读取配置值，这样Next.js可以在构建时静态分析
export const ISR_CONFIG = {
  HOME_REVALIDATE: 1800,
  GAME_REVALIDATE: 3600,
  CATEGORY_REVALIDATE: 1800,
  GAMES_REVALIDATE: 900,
  BLOG_REVALIDATE: 7200,
};

// 类型安全的获取函数
export function getStaticRevalidateTime(pageType: keyof typeof ISR_CONFIG): number {
  switch (pageType) {
    case 'HOME_REVALIDATE':
      return ISR_CONFIG.HOME_REVALIDATE;
    case 'GAME_REVALIDATE':
      return ISR_CONFIG.GAME_REVALIDATE;
    case 'CATEGORY_REVALIDATE':
      return ISR_CONFIG.CATEGORY_REVALIDATE;
    case 'GAMES_REVALIDATE':
      return ISR_CONFIG.GAMES_REVALIDATE;
    case 'BLOG_REVALIDATE':
      return ISR_CONFIG.BLOG_REVALIDATE;
    default:
      return 3600; // 默认1小时
  }
}

// 导出配置概要，用于调试
export const ISR_SUMMARY = {
  enabled: true,
  defaultRevalidateTime: 3600,
  backgroundRevalidation: true,
  fallback: 'blocking',
  lastUpdated: '2025-06-12T07:09:56.961Z'
};
