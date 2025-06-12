# 全局Loading和ISR配置指南

本项目提供了完全基于JSON配置的全局Loading组件和ISR (Incremental Static Regeneration) 功能，使用Next.js App Router的内置loading机制。

## 📁 文件结构

```
src/
├── app/
│   └── loading.tsx                # Next.js全局loading文件
├── data/
│   └── globalConfig.json          # 全局配置文件
├── components/
│   ├── GlobalLoading.tsx          # 可配置的Loading组件
│   └── examples/
│       └── LoadingDemo.tsx        # 使用示例和演示
└── lib/
    └── globalConfig.ts            # 配置工具函数
```

## ⚙️ 配置文件说明

### globalConfig.json

```json
{
  "loading": {
    "enabled": true,                    // 是否启用全局loading
    "type": "spinner",                  // loading类型: "spinner" | "dots" | "pulse"
    "showProgressBar": true,            // 是否显示进度条
    "showPercentage": false,            // 是否显示百分比
    "backgroundColor": "rgba(255, 255, 255, 0.9)",  // 背景色
    "spinnerColor": "#6366f1",          // 加载器颜色
    "progressBarColor": "#10b981",      // 进度条颜色
    "text": "Loading...",               // 默认文本
    "showText": true,                   // 是否显示文本
    "animationType": "fade",            // 动画类型: "fade" | "slide" | "scale"
    "delayMs": 200,                     // 显示延迟 (毫秒)
    "minimumDurationMs": 800,           // 最小显示时间 (毫秒)
    "position": "center",               // 位置: "center" | "top" | "bottom"
    "size": "medium",                   // 大小: "small" | "medium" | "large"
    "overlay": true,                    // 是否显示遮罩
    "blurBackground": true              // 是否模糊背景
  },
  "isr": {
    "enabled": true,                    // 是否启用ISR
    "revalidateTime": 3600,             // 默认重新验证时间 (秒)
    "backgroundRevalidation": true,     // 是否后台重新验证
    "fallback": "blocking",             // 回退策略
    "pages": {
      "home": {
        "revalidate": 1800,             // 首页重新验证时间 (30分钟)
        "enabled": true
      },
      "game": {
        "revalidate": 3600,             // 游戏页重新验证时间 (1小时)
        "enabled": true
      },
      "category": {
        "revalidate": 1800,             // 分类页重新验证时间 (30分钟)
        "enabled": true
      },
      "games": {
        "revalidate": 900,              // 游戏列表重新验证时间 (15分钟)
        "enabled": true
      },
      "blog": {
        "revalidate": 7200,             // 博客页重新验证时间 (2小时)
        "enabled": true
      }
    },
    "cacheHeaders": {
      "maxAge": 86400,                  // 最大缓存时间
      "staleWhileRevalidate": 3600,     // 过期重新验证时间
      "mustRevalidate": false           // 是否必须重新验证
    }
  }
}
```

## 🚀 使用方法

### 1. 全局路由Loading (自动)

Next.js App Router会在路由切换时自动显示 `app/loading.tsx` 中的loading组件：

```tsx
// src/app/loading.tsx
import { GlobalLoading } from '@/components/GlobalLoading';

export default function Loading() {
  return <GlobalLoading isLoading={true} />;
}
```

### 2. 在组件中使用Loading

对于特定操作的loading，可以在组件中直接使用：

```tsx
'use client';

import React, { useState } from 'react';
import { GlobalLoading } from '@/components/GlobalLoading';

function MyComponent() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleAction = async () => {
    setLoading(true);
    
    try {
      // 执行异步操作
      await someAsyncOperation();
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleAction}>执行操作</button>
      {loading && (
        <GlobalLoading 
          isLoading={true} 
          text="处理中..." 
        />
      )}
    </div>
  );
}
```

### 3. 进度Loading

```tsx
const handleProgressAction = () => {
  setLoading(true);
  setProgress(0);
  
  const interval = setInterval(() => {
    setProgress(prev => {
      const newProgress = prev + 10;
      if (newProgress >= 100) {
        clearInterval(interval);
        setLoading(false);
      }
      return newProgress;
    });
  }, 200);
};

// 在JSX中
{loading && (
  <GlobalLoading 
    isLoading={true} 
    progress={progress}
    text={progress < 50 ? "下载中..." : "安装中..."}
  />
)}
```

## 🏗️ ISR配置

### 页面级别ISR

每个页面可以独立配置ISR：

```tsx
// 在页面文件中
import { getPageRevalidateTime } from '@/lib/globalConfig';

export const dynamic = 'force-static';
export const revalidate = getPageRevalidateTime('home');
```

### 检查ISR状态

```tsx
import { getPageISRConfig, isFeatureEnabled } from '@/lib/globalConfig';

// 检查ISR是否启用
const isISREnabled = isFeatureEnabled('isr');

// 获取特定页面的ISR配置
const homeISRConfig = getPageISRConfig('home');
```

## 🎨 自定义配置

### Loading样式

可以通过修改 `globalConfig.json` 中的 `loading` 部分来自定义外观：

- **type**: 更改loading动画类型
- **spinnerColor**: 自定义颜色
- **position**: 调整显示位置
- **size**: 设置大小
- **overlay**: 控制遮罩显示

### ISR设置

可以为不同页面类型设置不同的重新验证时间：

- **home**: 首页（频繁更新）
- **game**: 游戏详情页（相对稳定）
- **category**: 分类页（中等更新频率）
- **games**: 游戏列表（经常更新）
- **blog**: 博客页（较少更新）

## 🔧 API参考

### GlobalLoading组件

```tsx
interface GlobalLoadingProps {
  isLoading?: boolean;             // 是否显示loading (默认true)
  progress?: number;               // 进度 0-100 (默认0)
  text?: string;                  // 显示文本 (可选)
  className?: string;             // 自定义样式类名 (可选)
}
```

### 配置工具函数

```tsx
// 获取loading配置
getLoadingConfig(): LoadingConfig

// 获取ISR配置
getISRConfig(): ISRConfig

// 获取页面ISR配置
getPageISRConfig(pageType: string): ISRPageConfig | null

// 获取页面重新验证时间
getPageRevalidateTime(pageType: string): number | false

// 检查功能是否启用
isFeatureEnabled(feature: string): boolean
```

## 📊 性能优化

1. **最小显示时间**: 防止loading闪烁
2. **显示延迟**: 避免短时间操作显示loading
3. **ISR配置**: 优化页面缓存策略
4. **背景重新验证**: 提升用户体验

## 🐛 故障排除

### 全局Loading不显示
- 检查 `globalConfig.json` 中 `loading.enabled` 是否为 `true`
- 确认 `src/app/loading.tsx` 文件存在
- 验证GlobalLoading组件导入正确

### 组件Loading不显示
- 检查loading状态变量是否正确设置
- 确认条件渲染逻辑正确
- 验证GlobalLoading组件的props

### ISR不工作
- 检查 `isr.enabled` 配置
- 确认页面配置正确导入
- 验证 `revalidate` 值不为 `false`

### 样式问题
- 检查CSS类名冲突
- 确认配置中的颜色值格式正确
- 验证动画类型支持

## 📝 示例代码

完整的使用示例请参考：
- `src/components/examples/LoadingDemo.tsx`
- `src/app/loading.tsx`
- 各页面文件中的ISR配置

## 🔄 更新配置

修改 `globalConfig.json` 后，需要重新构建项目才能生效：

```bash
npm run build
# 或
npm run dev  # 开发环境会自动重载
``` 