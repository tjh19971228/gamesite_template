/**
 * Global Loading UI for Next.js App Router
 * Next.js App Router 全局加载UI
 * 
 * 这个文件会在路由切换时自动显示
 * 配置来自 globalConfig.json
 */

import { GlobalLoading } from '@/components/GlobalLoading';

export default function Loading() {
  return <GlobalLoading isLoading={true} />;
} 