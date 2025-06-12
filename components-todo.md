# 🧩 Components TODO List

> 基于 task.md 需求，规划各页面所需组件的开发任务

---

## 📋 Component Development Priority

### Phase 1: Core Components (首页必需)

#### 1. Hero Section Components
- **`HeroSection`** - 主展示区组件
  - Props: `title`, `subtitle`, `backgroundImage`, `ctaButtons[]`, `showVideo?`
  - 复用场景: 首页、游戏详情页头部
  - 依赖: MagicUI/ShadcnUI Button, Image优化

#### 2. Game Showcase Components  
- **`NewGameCard`** - 新游戏卡片
  - Props: `game`, `layout?: "grid" | "list"`, `showTags?`
  - 复用场景: 首页新游推荐、相关推荐
- **`GameGrid`** - 游戏网格容器
  - Props: `games[]`, `columns?`, `gap?`, `itemComponent`
  - 复用场景: 所有游戏列表展示

#### 3. Ranking Components
- **`RankingCard`** - 排行榜卡片
  - Props: `rank`, `game`, `trend?`, `showStats?`
  - 复用场景: 首页热门排行、分类排行
- **`RankingList`** - 排行榜容器
  - Props: `games[]`, `title`, `showNumbers?`, `maxItems?`

#### 4. Navigation Components
- **`CategoryNav`** - 分类导航
  - Props: `categories[]`, `activeCategory?`, `layout?: "horizontal" | "grid"`
  - 复用场景: 首页、Tag页面
- **`Breadcrumb`** - 面包屑导航
  - Props: `items[]`, `separator?`
  - 复用场景: 所有详情页

### Phase 2: Detail Page Components (游戏详情页)

#### 5. Game Detail Components
- **`GameInfo`** - 游戏基本信息
  - Props: `game`, `showRating?`, `showTags?`, `layout?`
- **`GameplayDescription`** - 玩法说明
  - Props: `content`, `images[]?`, `expandable?`
- **`TagSection`** - 标签展示区
  - Props: `tags[]`, `clickable?`, `maxDisplay?`
- **`RelatedGames`** - 相关游戏推荐
  - Props: `games[]`, `title?`, `columns?`
  - 复用: 使用 `GameGrid` + `NewGameCard`

#### 6. Media Components
- **`VideoPlayer`** - 视频播放器
  - Props: `videoUrl`, `poster?`, `autoplay?`, `controls?`
- **`ImageGallery`** - 图片画廊
  - Props: `images[]`, `showThumbnails?`, `allowZoom?`

#### 7. Interactive Components
- **`CommentSection`** - 评论模块
  - Props: `gameId`, `comments[]?`, `allowPost?`, `sortBy?`
- **`FAQSection`** - 常见问题
  - Props: `faqs[]`, `searchable?`, `categories?`

### Phase 3: Content & Blog Components

#### 8. Blog Components
- **`BlogCard`** - 博客卡片
  - Props: `article`, `layout?: "card" | "list"`, `showExcerpt?`
- **`BlogGrid`** - 博客网格
  - Props: `articles[]`, `columns?`, `pagination?`
- **`BlogEntry`** - 博客入口区
  - Props: `featuredPosts[]`, `title?`, `viewAllLink?`

#### 9. Article Components
- **`ArticleContent`** - 文章内容渲染
  - Props: `content`, `toc?`, `syntax highlighting?`
- **`RelatedArticles`** - 相关文章
  - Props: `articles[]`, `title?`, `maxItems?`

### Phase 4: Layout & Utility Components

#### 10. Layout Components
- **`PageLayout`** - 页面布局容器
  - Props: `children`, `sidebar?`, `header?`, `footer?`
- **`Section`** - 通用区块容器
  - Props: `children`, `title?`, `background?`, `padding?`
- **`Container`** - 响应式容器
  - Props: `children`, `maxWidth?`, `centered?`

#### 11. UI Enhancement Components
- **`LoadingSpinner`** - 加载状态
- **`Pagination`** - 分页组件
  - Props: `currentPage`, `totalPages`, `onPageChange`, `showInfo?`
- **`SearchBox`** - 搜索框
  - Props: `placeholder`, `onSearch`, `suggestions?`
- **`FilterBar`** - 筛选栏
  - Props: `filters[]`, `activeFilters`, `onFilterChange`

---

## 🔄 Component Reusability Matrix

| Component | 首页 | 游戏详情 | Tag页 | 博客页 | 复用度 |
|-----------|------|----------|-------|-------|--------|
| `GameCard` | ✅ | ✅ | ✅ | - | 高 |
| `GameGrid` | ✅ | ✅ | ✅ | - | 高 |
| `HeroSection` | ✅ | ✅ | ✅ | ✅ | 高 |
| `CategoryNav` | ✅ | - | ✅ | - | 中 |
| `Breadcrumb` | - | ✅ | ✅ | ✅ | 中 |
| `FAQSection` | - | ✅ | ✅ | - | 中 |
| `CommentSection` | - | ✅ | - | ✅ | 中 |
| `Pagination` | - | - | ✅ | ✅ | 中 |

---

## 🎨 Design System Requirements

### MagicUI Components to Use
- `AnimatedList` - for game listings
- `BorderBeam` - for featured content borders  
- `ShimmerButton` - for CTAs
- `SparklesText` - for titles
- `TextReveal` - for descriptions

### ShadcnUI Components to Leverage
- `Button`, `Card`, `Badge` - basic UI elements
- `Carousel` - for game/image galleries
- `Tabs` - for content organization
- `Dialog` - for modals
- `Select`, `Input` - for forms and filters

---

## 📦 Props Interface Planning

```typescript
// Core Game Interface
interface Game {
  id: string;
  title: string;
  slug: string;
  description: string;
  tags: string[];
  category: string;
  images: string[];
  rating?: number;
  popularity?: number;
  releaseDate?: string;
  features?: string[];
}

// Component Props Examples
interface GameCardProps {
  game: Game;
  layout?: 'grid' | 'list' | 'featured';
  showTags?: boolean;
  showRating?: boolean;
  clickable?: boolean;
  className?: string;
}

interface SectionProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  background?: 'default' | 'accent' | 'muted';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
}
```

---

## ✅ Development Checklist

- [ ] Phase 1: Core Components (Hero, GameCard, Ranking, Navigation)
- [ ] Phase 2: Detail Page Components (GameInfo, Video, Comments, FAQ)  
- [ ] Phase 3: Content Components (Blog, Article)
- [ ] Phase 4: Layout & Utility Components
- [ ] TypeScript interfaces for all props
- [ ] Responsive design implementation
- [ ] Accessibility features (ARIA labels, keyboard navigation)
- [ ] Performance optimization (lazy loading, image optimization)
- [ ] Storybook documentation (optional but recommended)

---

## 🚀 Next Steps

1. **Start with Phase 1** - 实现首页必需的核心组件
2. **建立 TypeScript 接口** - 在 `src/types/` 中定义通用数据结构  
3. **创建样式配置** - 生成 `styles-config.json` 供 Tailwind 使用
4. **组件开发顺序**: HeroSection → GameCard → GameGrid → CategoryNav 