#!/usr/bin/env node

/**
 * Update Revalidate Script
 * 更新ISR revalidate配置的脚本
 */

const fs = require('fs');
const path = require('path');

// 读取全局配置
const globalConfigPath = path.join(process.cwd(), 'src/data/globalConfig.json');
const globalConfig = JSON.parse(fs.readFileSync(globalConfigPath, 'utf8'));

// 生成静态配置文件
const staticConfigContent = `/**
 * Static Configuration for Build-time Values
 * 构建时静态配置值 - 此文件由脚本自动生成，请勿手动修改
 */

// 在模块顶层读取配置值，这样Next.js可以在构建时静态分析
export const ISR_CONFIG = {
  HOME_REVALIDATE: ${globalConfig.isr.pages.home.revalidate},
  GAME_REVALIDATE: ${globalConfig.isr.pages.game.revalidate},
  CATEGORY_REVALIDATE: ${globalConfig.isr.pages.category.revalidate},
  GAMES_REVALIDATE: ${globalConfig.isr.pages.games.revalidate},
  BLOG_REVALIDATE: ${globalConfig.isr.pages.blog.revalidate},
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
  enabled: ${globalConfig.isr.enabled},
  defaultRevalidateTime: ${globalConfig.isr.revalidateTime},
  backgroundRevalidation: ${globalConfig.isr.backgroundRevalidation},
  fallback: '${globalConfig.isr.fallback}',
  lastUpdated: '${new Date().toISOString()}'
};
`;

// 写入文件
const outputPath = path.join(process.cwd(), 'src/lib/staticConfig.ts');
fs.writeFileSync(outputPath, staticConfigContent);

console.log('✅ ISR revalidate配置已更新');
console.log(`📄 文件位置: ${outputPath}`);
console.log('📊 当前配置:');
console.log(`   首页: ${globalConfig.isr.pages.home.revalidate}s`);
console.log(`   游戏页: ${globalConfig.isr.pages.game.revalidate}s`);
console.log(`   分类页: ${globalConfig.isr.pages.category.revalidate}s`);
console.log(`   游戏列表页: ${globalConfig.isr.pages.games.revalidate}s`);
console.log(`   博客页: ${globalConfig.isr.pages.blog.revalidate}s`); 