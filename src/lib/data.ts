/**
 * Data Utilities for Loading Game and Blog Data from JSON
 * 从JSON文件加载游戏和博客数据的工具函数
 */

import { Game, BlogPost, GameCategory } from '@/types';
import gamesData from '../../games-data.json';
import blogData from '../../blog-data.json';
import categoryConfig from '../data/categoryConfig.json';

// Type assertions for imported JSON
const games = gamesData as Game[];
// Transform blog data to match BlogPost type
const blogPosts = (blogData as Record<string, unknown>[]).map(post => ({
  ...post,
  publishedAt: post.date, // Map date to publishedAt
  status: post.status || 'published' // Ensure status exists
})) as BlogPost[];

/**
 * Generate categories dynamically from games data
 */
export const categories: GameCategory[] = (() => {
  // Extract unique categories from games
  const categoryMap = new Map<string, number>();
  
  games.forEach(game => {
    const category = game.category;
    categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
  });
  
  // Generate category data with configuration
  return Array.from(categoryMap.entries()).map(([name, count], index) => {
    const attributes = categoryConfig.categoryAttributes[name as keyof typeof categoryConfig.categoryAttributes] || {
      icon: categoryConfig.defaultAttributes.icon,
      color: categoryConfig.defaultAttributes.color,
      description: categoryConfig.defaultAttributes.description.replace('{categoryName}', name.toLowerCase())
    };
    
    return {
      id: (index + 1).toString(),
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
      count,
      icon: attributes.icon,
      color: attributes.color,
      description: attributes.description
    };
  });
})();

// Game-related data access functions
export const getPopularGames = (limit: number = 6): Game[] => {
  return [...games]
    .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
    .slice(0, limit);
};

export const getNewGames = (limit: number = 8): Game[] => {
  return [...games]
    .sort((a, b) => {
      const dateA = a.releaseDate ? new Date(a.releaseDate).getTime() : 0;
      const dateB = b.releaseDate ? new Date(b.releaseDate).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, limit);
};

export const getGamesByCategory = (categorySlug: string, limit?: number): Game[] => {
  // 首先找到对应的分类对象
  const category = getCategoryBySlug(categorySlug);
  if (!category) return [];
  
  // 根据分类名称匹配游戏
  const filteredGames = games.filter(game => 
    game.category === category.name || 
    (Array.isArray(game.category) && game.category.includes(category.name))
  );
  
  return limit ? filteredGames.slice(0, limit) : filteredGames;
};

export const getGameBySlug = (slug: string): Game | undefined => {
  return games.find(game => game.slug === slug);
};

export const getAllGames = (): Game[] => {
  return games;
};

export const getGamesByTag = (tag: string, limit?: number): Game[] => {
  const filteredGames = games.filter(game => 
    game.tags.includes(tag)
  );
  
  return limit ? filteredGames.slice(0, limit) : filteredGames;
};

// Blog-related data access functions
export const getRecentBlogPosts = (limit: number = 4): BlogPost[] => {
  return [...blogPosts]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit);
};

export const getBlogPostBySlug = (slug: string): BlogPost | undefined => {
  return blogPosts.find(post => post.slug === slug);
};

export const getAllBlogPosts = (): BlogPost[] => {
  return blogPosts;
};

export const getBlogPostsByTag = (tag: string, limit?: number): BlogPost[] => {
  const filteredPosts = blogPosts.filter(post => 
    post.tags.includes(tag)
  );
  
  return limit ? filteredPosts.slice(0, limit) : filteredPosts;
};

export const getCategoryBySlug = (slug: string): GameCategory | undefined => {
  return categories.find(category => category.slug === slug);
};

export const getAllCategories = (): GameCategory[] => {
  return categories;
}; 