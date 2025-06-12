import fs from 'fs';
import path from 'path';
import {
  StylesConfig,
  PageStructure,
  SEOData,
  Game,
  BlogPost,
  GameDetailStructure,
  HomepageStructure,
  BlogPostDetailStructure,
  BlogPageStructure,
  CategoryDetailStructure,
  CategoriesPageStructure,
  GamesPageStructure,
  TagPageStructure
} from '@/types';

/**
 * Configuration Manager for JSON-driven Game Site Template
 * JSON驱动游戏站点模板的配置管理器
 */

// Cache for configuration files
const configCache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = process.env.NODE_ENV === 'development' ? 0 : 5 * 60 * 1000; // 5 minutes in prod, no cache in dev

/**
 * Generic configuration loader with caching
 * 通用配置加载器（带缓存）
 */
async function loadConfig<T>(filePath: string, fallback?: T): Promise<T> {
  const cacheKey = filePath;
  const now = Date.now();
  
  // Check cache (skip cache in development to ensure latest config)
  if (CACHE_TTL > 0 && configCache.has(cacheKey)) {
    const cached = configCache.get(cacheKey);
    if (cached && now - cached.timestamp < CACHE_TTL) {
      return cached.data as T;
    }
  }

  try {
    const fullPath = path.join(process.cwd(), filePath);
    const fileContent = await fs.promises.readFile(fullPath, 'utf-8');
    const config = JSON.parse(fileContent) as T;
    
    // Cache the result
    configCache.set(cacheKey, {
      data: config,
      timestamp: now
    });
    
    return config;
  } catch (error) {
    console.warn(`Failed to load config from ${filePath}:`, error);
    
    if (fallback) {
      return fallback;
    }
    
    throw new Error(`Configuration file not found: ${filePath}`);
  }
}

/**
 * Load styles configuration
 * 加载样式配置
 */
export async function getStylesConfig(): Promise<StylesConfig> {
  const defaultStyles: StylesConfig = {
    colors: {
      primary: {
        '500': '#0ea5e9',
        '600': '#0284c7',
        '700': '#0369a1'
      },
      secondary: {
        '500': '#d946ef',
        '600': '#c026d3',
        '700': '#a21caf'
      },
      accent: {
        '500': '#f59e0b',
        '600': '#d97706',
        '700': '#b45309'
      },
      neutral: {
        '500': '#737373',
        '600': '#525252',
        '700': '#404040'
      },
      success: {
        '500': '#22c55e'
      },
      warning: {
        '500': '#f59e0b'
      },
      error: {
        '500': '#ef4444'
      }
    },
    fonts: {
      sans: ['Inter', 'sans-serif'],
      serif: ['Georgia', 'serif'],
      mono: ['Monaco', 'monospace']
    },
    spacing: {},
    borderRadius: {},
    shadows: {},
    animations: {}
  };

  return loadConfig('styles-config.json', defaultStyles);
}

/**
 * Load homepage structure configuration
 * 加载首页结构配置
 */
export async function getHomepageStructure(): Promise<HomepageStructure> {
  const defaultStructure: HomepageStructure = {
    hero: { enabled: true, order: 1 },
    newGames: { enabled: true, order: 2 },
    hotRanking: { enabled: true, order: 3 },
    categoryNav: { enabled: true, order: 4 },
    blogsEntry: { enabled: false, order: 5 }
  };

  return loadConfig('src/app/homepage-structure.json', defaultStructure);
}

/**
 * Load game detail page structure
 * 加载游戏详情页结构配置
 */
export async function getGameDetailStructure(): Promise<GameDetailStructure> {
  const defaultStructure: GameDetailStructure = {
    sections: {
      gameHero: { enabled: true, order: 1 },
      gameInfo: { enabled: true, order: 2 },
      gameDescription: { enabled: true, order: 3 },
      gameFeatures: { enabled: true, order: 4 },
      gameControls: { enabled: true, order: 5 },
      screenshotGallery: { enabled: false, order: 6 },
      relatedGames: { enabled: true, order: 7 },
      commentSection: { enabled: false, order: 8 }
    },
    metadata: {
      title: "{gameTitle} - Play Free Online | GameSite",
      description: "Play {gameTitle} online for free. {gameDescription}",
      keywords: ["{gameTitle}", "online game", "free game", "browser game"]
    },
    page: {
      title: "{gameTitle}",
      showBreadcrumb: true
    }
  };

  return loadConfig('src/app/game/[slug]/game-detail-structure.json', defaultStructure);
}

/**
 * Load tag page structure
 * 加载标签页结构配置
 */
export async function getTagPageStructure(): Promise<TagPageStructure> {
  const defaultStructure: TagPageStructure = {
    tagInfo: { enabled: true, order: 1 },
    relatedGames: { enabled: true, order: 2 },
    tagDescription: { enabled: true, order: 3 },
    faqSection: { enabled: true, order: 4 },
    pagination: { enabled: true, order: 5 }
  };

  return loadConfig('src/app/tag/[tagname]/tag-page-structure.json', defaultStructure);
}

/**
 * Load games page structure
 * 加载游戏页面结构配置
 */
export async function getGamesPageStructure(): Promise<GamesPageStructure> {
  const defaultStructure: GamesPageStructure = {
    metadata: {
      title: "Free Online Games - GameSite",
      description: "Play the best free online games. No downloads required!",
      keywords: ["free games", "online games", "browser games", "no download"]
    },
    page: {
      title: "Game Collection",
      subtitle: "Discover amazing games to play for free",
      showBreadcrumb: true,
      showFilters: true,
      showSorting: true
    },
    sections: {
      pageHeader: { 
        enabled: true, 
        order: 1,
        showTitle: true,
        showSubtitle: true,
        showStats: true
      },
      filterBar: { 
        enabled: true, 
        order: 2,
        showSortOptions: true,
        showSearch: true
      },
      categoryNavigation: {
        enabled: true,
        order: 3,
        layout: "horizontal",
        maxVisible: 8,
        showAllButton: true
      },
      gameGrid: {
        enabled: true,
        order: 4,
        columns: 4,
        gap: "6",
        showLoadMore: true,
        gamesPerPage: 12
      },
      popularGames: {
        enabled: true,
        order: 5,
        title: "Popular This Week",
        maxGames: 8
      },
      recentlyAdded: {
        enabled: true,
        order: 6,
        title: "Recently Added",
        maxGames: 6
      }
    },
    filters: {
      categories: {
        enabled: true,
        defaultValue: "all"
      },
      sorting: {
        enabled: true,
        options: ["newest", "popular", "rating", "name"],
        defaultValue: "newest"
      },
      search: {
        enabled: true,
        placeholder: "Search games...",
        showSuggestions: true
      }
    },
    pagination: {
      enabled: true,
      type: "loadMore",
      itemsPerPage: 12
    }
  };

  return loadConfig('src/app/games/games-page-structure.json', defaultStructure);
}

/**
 * Load blog page structure
 * 加载博客页面结构配置
 */
export async function getBlogPageStructure(): Promise<BlogPageStructure> {
  const defaultStructure: BlogPageStructure = {
    metadata: {
      title: "Gaming Blog - Latest News & Reviews | GameSite",
      description: "Stay updated with the latest gaming news, reviews, and guides",
      keywords: ["gaming blog", "game reviews", "gaming news", "game guides"]
    },
    page: {
      title: "Gaming Blog",
      subtitle: "Latest news, reviews, and insights from the gaming world",
      showBreadcrumb: true,
      showSearch: true
    },
    sections: {
      pageHeader: { enabled: true, order: 1, showTitle: true, showSubtitle: true, showSearch: true },
      featuredPosts: { enabled: true, order: 2, title: "Featured Articles", maxPosts: 3 },
      recentPosts: { enabled: true, order: 3, title: "Recent Articles", postsPerPage: 9 }
    },
    filters: {
      search: {
        enabled: true,
        placeholder: "Search articles..."
      },
      sorting: {
        enabled: true,
        defaultValue: "newest"
      }
    }
  };

  return loadConfig('src/app/blog/blog-page-structure.json', defaultStructure);
}

/**
 * Load categories page structure
 * 加载分类页面结构配置
 */
export async function getCategoriesPageStructure(): Promise<CategoriesPageStructure> {
  const defaultStructure: CategoriesPageStructure = {
    metadata: {
      title: "Game Categories - Browse by Genre | GameSite",
      description: "Explore games by category - Action, Adventure, Puzzle, Sports and more",
      keywords: ["game categories", "gaming genres", "browse games", "game types"]
    },
    page: {
      title: "Game Categories",
      subtitle: "Explore games by genre and find your favorites",
      showBreadcrumb: true,
      showSearch: false
    },
    sections: {
      pageHeader: { 
        enabled: true, 
        order: 1,
        showTitle: true,
        showSubtitle: true,
        showStats: true
      },
      categoryGrid: { 
        enabled: true, 
        order: 2,
        title: "All Categories",
        maxPreviewGames: 3
      },
      popularCategories: {
        enabled: true,
        order: 3,
        title: "Most Popular Categories",
        maxCategories: 6,
        showStats: true
      },
      allCategories: {
        enabled: true,
        order: 4,
        title: "All Categories",
        showGameCount: true,
        showDescription: true
      }
    },
    display: {
      layout: "grid",
      showGameCount: true,
      showDescription: true,
      showPreviewGames: true,
      sortBy: "name"
    },
    filters: {
      sorting: {
        enabled: true,
        options: ["name", "gameCount", "popularity", "recent"],
        defaultValue: "name"
      }
    }
  };

  return loadConfig('src/app/categories/categories-page-structure.json', defaultStructure);
}

/**
 * Load search page structure
 * 加载搜索页面结构配置
 */
export async function getSearchPageStructure(): Promise<Record<string, unknown>> {
  const defaultStructure = {
    metadata: {
      title: "Search Results - GameSite",
      description: "Search for games, articles, and more on GameSite",
      keywords: ["search", "find games", "game search", "article search"]
    },
    sections: {
      pageHeader: { enabled: true, order: 1 },
      searchResults: { enabled: true, order: 2 }
    }
  };

  return loadConfig('src/app/search/search-page-structure.json', defaultStructure);
}

/**
 * Load category detail page structure
 * 加载分类详情页面结构配置
 */
export async function getCategoryDetailStructure(): Promise<CategoryDetailStructure> {
  const defaultStructure: CategoryDetailStructure = {
    metadata: {
      title: '{categoryName} Games - GameSite',
      description: 'Play the best {categoryName} games online for free',
      keywords: ['{categoryName}', 'games', 'online games', 'browser games']
    },
    page: {
      title: '{categoryName} Games',
      subtitle: 'Discover amazing {categoryName} games to play for free',
      showBreadcrumb: true
    },
    sections: {
      pageHeader: {
        enabled: true,
        order: 1,
        showTitle: true,
        showSubtitle: true,
        showStats: true,
        backgroundType: 'gradient'
      },
      gameGrid: {
        enabled: true,
        order: 2,
        columns: 4,
        gap: '6',
        showLoadMore: true
      },
      relatedCategories: {
        enabled: true,
        order: 3,
        title: 'Related Categories',
        maxItems: 4
      }
    }
  };
  
  return loadConfig('src/app/category/[slug]/category-detail-structure.json', defaultStructure);
}

/**
 * Load blog post detail page structure
 * 加载博客文章详情页面结构配置
 */
export async function getBlogPostDetailStructure(): Promise<BlogPostDetailStructure> {
  const defaultStructure = {
    metadata: {
      title: '{postTitle} - GameSite Blog',
      description: '{postExcerpt}',
      keywords: ['{postTitle}', '{postCategory}', 'blog', 'gaming articles']
    },
    page: {
      title: '{postTitle}',
      showBreadcrumb: true
    },
    sections: {
      pageHeader: {
        enabled: true,
        order: 1,
        showTitle: true,
        showExcerpt: true,
        showMeta: true,
        showCategory: true,
        showAuthor: true,
        showDate: true,
        showReadTime: true,
        backgroundType: 'gradient'
      },
      content: {
        enabled: true,
        order: 2,
        showFeaturedImage: true
      },
      tags: {
        enabled: true,
        order: 3,
        title: 'Tags'
      },
      authorBio: {
        enabled: true,
        order: 4,
        showFollowButton: true,
        showProfileButton: true
      },
      sharing: {
        enabled: true,
        order: 5,
        title: 'Share Article',
        showTwitter: true,
        showFacebook: true,
        showLinkedIn: true
      },
      tableOfContents: {
        enabled: true,
        order: 6,
        title: 'In This Article'
      },
      newsletter: {
        enabled: true,
        order: 7,
        title: 'Stay Updated',
        subtitle: 'Get the latest gaming news and articles'
      },
      relatedArticles: {
        enabled: true,
        order: 8,
        title: 'Related Articles',
        subtitle: 'Discover more insightful articles about gaming and technology',
        maxPosts: 3,
        showViewAllButton: true
      }
    }
  };
  
  return loadConfig('src/app/blog/[slug]/blog-detail-structure.json', defaultStructure);
}

/**
 * Load SEO configuration for a specific route
 * 加载特定路由的SEO配置
 */
export async function getSEOConfig(route: string): Promise<SEOData | null> {
  try {
    // Try to load route-specific SEO config
    const seoConfig = await loadConfig<{ [route: string]: SEOData }>('src/app/seo-config.json');
    return seoConfig[route] || null;
  } catch {
    return null;
  }
}

/**
 * Load games data
 * 加载游戏数据
 */
export async function getGamesData(): Promise<Game[]> {
  const gamesData = await loadConfig<{ games: Game[] }>('games.json', { games: [] });
  return gamesData.games || [];
}

/**
 * Load blog data
 * 加载博客数据
 */
export async function getBlogData(): Promise<BlogPost[]> {
  const blogData = await loadConfig<{ posts: BlogPost[] }>('blog.json', { posts: [] });
  return blogData.posts || [];
}

/**
 * Get game by slug
 * 根据slug获取游戏
 */
export async function getGameBySlug(slug: string): Promise<Game | null> {
  const games = await getGamesData();
  return games.find(game => game.slug === slug) || null;
}

/**
 * Get games by tag
 * 根据标签获取游戏
 */
export async function getGamesByTag(tag: string, limit?: number): Promise<Game[]> {
  const games = await getGamesData();
  const filteredGames = games.filter(game => 
    game.tags.some(t => t.toLowerCase() === tag.toLowerCase())
  );
  
  return limit ? filteredGames.slice(0, limit) : filteredGames;
}

/**
 * Get games by category
 * 根据分类获取游戏
 */
export async function getGamesByCategory(category: string, limit?: number): Promise<Game[]> {
  const games = await getGamesData();
  const filteredGames = games.filter(game => 
    game.category.toLowerCase() === category.toLowerCase()
  );
  
  return limit ? filteredGames.slice(0, limit) : filteredGames;
}

/**
 * Get popular games (sorted by popularity)
 * 获取热门游戏（按热度排序）
 */
export async function getPopularGames(limit: number = 10): Promise<Game[]> {
  const games = await getGamesData();
  return games
    .filter(game => game.popularity !== undefined)
    .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
    .slice(0, limit);
}

/**
 * Get new games (sorted by release date)
 * 获取新游戏（按发布时间排序）
 */
export async function getNewGames(limit: number = 8): Promise<Game[]> {
  const games = await getGamesData();
  return games
    .filter(game => game.releaseDate)
    .sort((a, b) => new Date(b.releaseDate!).getTime() - new Date(a.releaseDate!).getTime())
    .slice(0, limit);
}

/**
 * Get related games based on tags and category
 * 获取相关游戏（基于标签和分类）
 */
export async function getRelatedGames(game: Game, limit: number = 8): Promise<Game[]> {
  const games = await getGamesData();
  
  // Score games based on similarity
  const scoredGames = games
    .filter(g => g.id !== game.id)
    .map(g => {
      let score = 0;
      
      // Same category gets high score
      if (g.category === game.category) {
        score += 10;
      }
      
      // Shared tags get medium score
      const sharedTags = g.tags.filter(tag => game.tags.includes(tag));
      score += sharedTags.length * 3;
      
      return { game: g, score };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
  
  return scoredGames.map(item => item.game);
}

/**
 * Get blog post by slug
 * 根据slug获取博客文章
 */
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const posts = await getBlogData();
  return posts.find(post => post.slug === slug) || null;
}

/**
 * Get unique game categories
 * 获取所有游戏分类
 */
export async function getGameCategories(): Promise<string[]> {
  const games = await getGamesData();
  const categories = [...new Set(games.map(game => game.category))];
  return categories.sort();
}

/**
 * Get unique game tags
 * 获取所有游戏标签
 */
export async function getGameTags(): Promise<string[]> {
  const games = await getGamesData();
  const tags = [...new Set(games.flatMap(game => game.tags))];
  return tags.sort();
}

/**
 * Sort page structure components by order
 * 按顺序排序页面结构组件
 */
export function sortComponentsByOrder<T extends PageStructure>(structure: T): Array<[string, unknown]> {
  return Object.entries(structure)
    .filter(([, config]) => {
      if (typeof config === 'boolean') return config;
      return (config as { enabled?: boolean }).enabled;
    })
    .sort(([, a], [, b]) => {
      const orderA = typeof a === 'boolean' ? 999 : ((a as { order?: number }).order || 999);
      const orderB = typeof b === 'boolean' ? 999 : ((b as { order?: number }).order || 999);
      return orderA - orderB;
    });
}

/**
 * Validate configuration structure
 * 验证配置结构
 */
export function validateStructure<T>(structure: T, requiredFields: string[]): boolean {
  if (!structure || typeof structure !== 'object') {
    return false;
  }
  
  return requiredFields.every(field => 
    field in structure && structure[field as keyof T] !== undefined
  );
}

/**
 * Clear configuration cache (useful for development)
 * 清空配置缓存（开发时有用）
 */
export function clearConfigCache(): void {
  configCache.clear();
}

/**
 * Hot reload configuration in development
 * 开发环境热重载配置
 */
if (process.env.NODE_ENV === 'development') {
  // Clear cache every 5 seconds in development
  setInterval(() => {
    clearConfigCache();
  }, 5000);
} 