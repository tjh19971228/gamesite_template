# 样式系统使用文档

## 概述

本项目实现了完全基于 `styles-config.json` 的动态样式系统，允许通过修改配置文件来自定义网站的颜色、间距、动画等样式元素。

## 架构

```
styles-config.json → scripts/generate-styles.js → src/app/globals.css → Tailwind CSS
```

### 核心文件

- **styles-config.json** - 样式配置文件，包含所有主题定制
- **scripts/generate-styles.js** - 构建脚本，将配置转换为CSS变量和工具类
- **src/lib/styles.ts** - TypeScript 工具函数，用于运行时访问样式配置
- **src/app/globals.css** - 全局CSS文件，包含生成的动态样式

## 配置结构

### colors（颜色配置）

```json
{
  "colors": {
    "primary": {
      "50": "#f0f9ff",
      "500": "#0ea5e9",
      "900": "#0c4a6e"
    },
    "game": {
      "action": "#ff6b6b",
      "adventure": "#4ecdc4",
      "puzzle": "#45b7d1"
    }
  }
}
```

### fonts（字体配置）

```json
{
  "fonts": {
    "sans": ["Inter", "sans-serif"],
    "heading": ["Poppins", "Inter", "sans-serif"],
    "mono": ["Fira Code", "monospace"]
  }
}
```

### spacing（间距配置）

```json
{
  "spacing": {
    "xs": "0.5rem",
    "sm": "1rem",
    "section": "4rem"
  }
}
```

### animations（动画配置）

```json
{
  "animations": {
    "fadeIn": {
      "0%": { "opacity": "0" },
      "100%": { "opacity": "1" }
    }
  }
}
```

## 使用方法

### 1. 生成样式

修改 `styles-config.json` 后，运行以下命令生成CSS：

```bash
npm run generate-styles
```

这会自动更新 `src/app/globals.css` 文件。

### 2. 在组件中使用

#### 使用CSS变量

```tsx
<div 
  className="w-20 h-20 rounded-lg"
  style={{ backgroundColor: `rgb(var(--color-primary-500))` }}
>
  内容
</div>
```

#### 使用生成的工具类

```tsx
<div className="bg-game-action text-white border-game-action">
  动作游戏
</div>
```

#### 使用Tailwind类名

```tsx
<div className="bg-primary-500 text-primary-50 shadow-card">
  卡片内容
</div>
```

### 3. 动画使用

```tsx
<div style={{ animation: 'fadeIn 2s ease-in-out' }}>
  淡入动画
</div>
```

### 4. 运行时访问配置

```tsx
import { getStylesConfig } from '@/lib/config';

export default async function MyComponent() {
  const styles = await getStylesConfig();
  
  return (
    <div className="space-y-4">
      {Object.entries(styles.colors.game).map(([category, color]) => (
        <div 
          key={category}
          style={{ backgroundColor: color }}
          className="p-4 rounded-lg text-white"
        >
          {category}
        </div>
      ))}
    </div>
  );
}
```

## 生成的CSS变量

构建脚本会自动生成以下格式的CSS变量：

### 颜色变量
```css
:root {
  --color-primary-50: 240 249 255;
  --color-primary-500: 14 165 233;
  --color-game-action: 255 107 107;
}
```

### 间距变量
```css
:root {
  --spacing-xs: 0.5rem;
  --spacing-section: 4rem;
}
```

### 阴影变量
```css
:root {
  --shadow-card: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-glow: 0 0 20px rgba(14, 165, 233, 0.3);
}
```

## 生成的工具类

### 游戏分类颜色类
```css
.text-game-action { color: #ff6b6b; }
.bg-game-action { background-color: #ff6b6b; }
.border-game-action { border-color: #ff6b6b; }
```

## 开发工作流

1. **修改配置** - 编辑 `styles-config.json`
2. **生成样式** - 运行 `npm run generate-styles`
3. **使用样式** - 在组件中使用生成的变量和类名
4. **构建项目** - `npm run build` 会自动生成样式

## 最佳实践

### 1. 语义化命名
使用描述性的颜色名称而不是具体的颜色值：
```json
{
  "colors": {
    "brand": "#0ea5e9",      // ✅ 好
    "blue": "#0ea5e9"        // ❌ 不推荐
  }
}
```

### 2. 保持一致性
确保颜色阶梯的一致性：
```json
{
  "primary": {
    "50": "#f0f9ff",    // 最浅
    "100": "#e0f2fe",
    "500": "#0ea5e9",   // 主色
    "900": "#0c4a6e",   // 最深
    "950": "#082f49"
  }
}
```

### 3. 响应式设计
使用配置的间距值创建一致的响应式设计：
```tsx
<div className="p-4 md:p-8" style={{ padding: 'var(--spacing-md)' }}>
  内容
</div>
```

### 4. 动画性能
使用transform和opacity进行动画以获得最佳性能：
```json
{
  "slideUp": {
    "0%": { "transform": "translateY(20px)", "opacity": "0" },
    "100%": { "transform": "translateY(0)", "opacity": "1" }
  }
}
```

## 演示页面

访问 `/template1/style-demo` 查看完整的样式演示，包括：
- 颜色调色板
- 动画效果
- 间距配置
- 阴影效果
- 交互元素

## 故障排除

### 样式未生效
1. 确保运行了 `npm run generate-styles`
2. 检查 `src/app/globals.css` 是否包含动态样式部分
3. 重启开发服务器

### CSS变量未定义
确保在 `:root` 中定义了相应的变量，并且格式正确。

### 构建错误
检查 `styles-config.json` 的JSON格式是否正确。

## 技术细节

- **Tailwind CSS v4** - 使用内联 `@theme` 配置
- **CSS变量** - 使用RGB值格式以支持透明度
- **构建时生成** - 样式在构建时生成，运行时性能最佳
- **热更新** - 开发环境支持配置缓存禁用，实现实时更新 