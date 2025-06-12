# 🧩 通过JSON定制游戏站点 

本文档说明如何通过修改JSON配置文件来完全定制游戏站点，而无需修改任何代码。

## 核心概念

本站点基于"配置驱动"原则设计，主要特点：

- 🔄 **零代码修改**：所有内容和结构变更都通过JSON配置
- 🧱 **组件化架构**：每个页面由可重用组件构建
- 📱 **响应式设计**：支持所有设备尺寸
- 🔍 **SEO友好**：内置结构化数据支持

## 主要配置文件

| 文件                    | 作用                                  | 位置                               |
|------------------------|--------------------------------------|-----------------------------------|
| `games-data.json`      | 游戏数据仓库                           | 项目根目录                         |
| `blog-data.json`       | 博客文章数据仓库                       | 项目根目录                         |
| `styles-config.json`   | 全局设计系统（颜色、字体等）             | 项目根目录                         |
| `*-structure.json`     | 页面结构配置（组件开关及顺序）           | 对应路由目录                       |
| `seo-config.json`      | SEO配置（标题、描述、结构化数据）        | 对应路由目录                       |

## 1. 游戏和博客数据

### games-data.json

此文件包含所有游戏数据，以数组格式存储。每个游戏对象包含：

```json
{
  "id": "1",
  "title": "游戏标题",
  "slug": "game-title",
  "description": "详细描述...",
  "shortDescription": "简短描述",
  "category": "游戏分类",
  "images": ["图片URL1", "图片URL2"],
  "thumbnail": "缩略图URL",
  "rating": 4.8,
  "popularity": 956,
  "releaseDate": "2024-01-15",
  "tags": ["标签1", "标签2"],
  "videoUrl": "YouTube视频链接",
  "platform": ["Browser", "Mobile"],
  "developer": "开发者名称",
  "features": ["特性1", "特性2"],
  "comments": [
    {
      "username": "用户名",
      "avatar": "头像URL",
      "content": "评论内容",
      "timestamp": "2024-06-20T00:00:00Z",
      "likes": 28
    }
  ],
  "faqContent": [
    {
      "question": "常见问题",
      "answer": "问题解答"
    }
  ]
}
```

### blog-data.json

此文件包含所有博客文章，以数组格式存储：

```json
{
  "id": "1",
  "slug": "article-slug",
  "title": "文章标题",
  "date": "2025-06-04",
  "author": {
    "name": "作者名",
    "avatar": "头像URL",
    "bio": "作者简介",
    "social": {
      "twitter": "@twitter",
      "instagram": "@instagram"
    }
  },
  "excerpt": "文章摘要",
  "content": "完整Markdown内容",
  "category": "文章分类",
  "featuredImage": "特色图片URL",
  "tags": ["标签1", "标签2"]
}
```

## 2. 页面结构配置

每个页面都有对应的`*-structure.json`文件，用于控制组件的显示与顺序。

### homepage-structure.json

控制首页显示的组件：

```json
{
  "hero": {
    "enabled": true,
    "props": {
      "title": "欢迎来到游戏天堂",
      "subtitle": "发现令人惊叹的游戏"
    }
  },
  "newGames": {
    "enabled": true,
    "maxItems": 8,
    "order": 2
  },
  "hotRanking": {
    "enabled": true,
    "order": 3
  },
  "blogsEntry": {
    "enabled": false,
    "order": 5
  },
  "categoryNav": {
    "enabled": true,
    "order": 4
  }
}
```

### game-detail-structure.json

控制游戏详情页面的组件：

```json
{
  "sections": {
    "gameHero": {
      "enabled": true,
      "order": 1
    },
    "gameInfo": {
      "enabled": true,
      "showTags": true,
      "showCategory": true,
      "order": 2
    },
    "gameDescription": {
      "enabled": true,
      "order": 3
    },
    "gameFeatures": {
      "enabled": true,
      "order": 4
    },
    "relatedGames": {
      "enabled": true,
      "maxItems": 4,
      "order": 5
    }
  }
}
```

## 3. 样式配置

`styles-config.json`文件控制全站设计系统：

```json
{
  "colors": {
    "primary": {
      "50": "#f0f9ff",
      "500": "#0ea5e9",
      "900": "#0c4a6e"
    },
    "accent": {
      "500": "#8b5cf6"
    }
  },
  "fonts": {
    "sans": ["Inter", "system-ui"],
    "serif": ["Georgia", "serif"],
    "mono": ["Menlo", "monospace"]
  },
  "borderRadius": {
    "sm": "0.125rem",
    "md": "0.375rem",
    "lg": "0.5rem"
  }
}
```

## 4. SEO配置

在每个路由目录下的`seo-config.json`文件控制特定页面的SEO信息：

```json
{
  "/": {
    "title": "GameSite - 畅玩免费网页游戏",
    "description": "发现并体验最好玩的免费在线游戏",
    "keywords": ["免费游戏", "网页游戏", "在线游戏"]
  },
  "/game/[slug]": {
    "title": "{game_title} - 免费在线游戏",
    "description": "立即免费玩{game_title}！{game_description}",
    "keywords": ["{game_title}", "免费游戏", "{game_category}"]
  }
}
```

## 定制示例

### 示例1：调整首页布局

1. 编辑 `homepage-structure.json`：
   - 禁用博客入口: `"blogsEntry": { "enabled": false }`
   - 更改热门排行显示数量: `"hotRanking": { "maxItems": 10 }`
   - 调整组件顺序: 通过更改 `order` 值

### 示例2：添加新游戏

1. 编辑 `games-data.json`，添加新游戏对象：
```json
{
  "id": "new-game-id",
  "title": "新游戏名称",
  "slug": "new-game-slug",
  ...其他必要字段
}
```

### 示例3：自定义品牌色系

1. 编辑 `styles-config.json` 中的颜色：
```json
"colors": {
  "primary": {
    "500": "#ff3e00"  // 修改主色调
  }
}
```

## 脚本工具

本项目提供了方便的脚本工具来生成配置模板：

```bash
# 生成所有页面的JSON结构模板
npm run generate-templates
```

## 注意事项

- 修改JSON文件后，需要重新构建或重启开发服务器以应用更改
- 确保JSON格式正确，避免语法错误
- 游戏和博客的`slug`字段必须唯一，作为URL标识符
- 所有图片路径应使用完整URL
- 对于任何组件的`enabled`字段设为`false`，该组件将不会显示 