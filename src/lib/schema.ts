import { promises as fs } from 'fs';
import path from 'path';

// Schema interfaces
interface SchemaBase {
  '@context': string;
  '@type': string;
}

interface WebsiteSchema extends SchemaBase {
  name: string;
  url: string;
  description: string;
  potentialAction?: unknown;
  publisher?: unknown;
  sameAs?: string[];
}

interface VideoGameSchema extends SchemaBase {
  name: string;
  description: string;
  genre?: string;
  playMode?: string;
  applicationCategory?: string;
  image?: string;
  offers?: unknown;
  aggregateRating?: {
    '@type': string;
    ratingValue: string;
    reviewCount: string;
    bestRating: string;
    worstRating: string;
  };
  publisher?: unknown;
  url?: string;
}

interface BlogPostSchema extends SchemaBase {
  headline: string;
  description: string;
  datePublished: string;
  dateModified: string;
  author: {
    '@type': string;
    name: string;
  };
  publisher: unknown;
  image: string;
  mainEntityOfPage: {
    '@type': string;
    '@id': string;
  };
}

interface CollectionPageSchema extends SchemaBase {
  name: string;
  description: string;
  url: string;
  isPartOf?: unknown;
}

// Cache for schema data
const schemaCache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = process.env.NODE_ENV === 'development' ? 0 : 5 * 60 * 1000; // 5 minutes in prod, no cache in dev

/**
 * 加载结构化数据配置
 */
async function loadSchemaData<T>(schemaPath: string): Promise<T | null> {
  const cacheKey = `schema_${schemaPath}`;
  const now = Date.now();
  
  // Check cache (skip cache in development to ensure latest config)
  if (CACHE_TTL > 0 && schemaCache.has(cacheKey)) {
    const cached = schemaCache.get(cacheKey);
    if (cached && now - cached.timestamp < CACHE_TTL) {
      return cached.data as T;
    }
  }

  try {
    const filePath = path.join(process.cwd(), schemaPath);
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const schemaData = JSON.parse(fileContent);
    
    // Cache the result
    schemaCache.set(cacheKey, {
      data: schemaData,
      timestamp: now
    });
    
    return schemaData as T;
  } catch (error) {
    console.warn(`Failed to load schema data from ${schemaPath}:`, error);
    return null;
  }
}

/**
 * 获取首页结构化数据
 */
export async function getHomepageSchema(): Promise<WebsiteSchema | null> {
  return loadSchemaData<WebsiteSchema>('src/app/schema.json');
}

/**
 * 获取游戏列表页结构化数据
 */
export async function getGameListSchema(): Promise<CollectionPageSchema | null> {
  return loadSchemaData<CollectionPageSchema>('src/app/games/schema.json');
}

/**
 * 获取游戏详情页结构化数据
 * @param gameData 游戏数据对象
 */
export async function getGameSchema(gameData: Record<string, unknown>): Promise<VideoGameSchema | null> {
  const baseSchema = await loadSchemaData<VideoGameSchema>('src/app/game/schema.json');
  if (!baseSchema || !gameData) return null;
  
  return {
    ...baseSchema,
    name: gameData.title as string,
    description: gameData.description as string,
    genre: (gameData.category as string) || (gameData.tags as string[])?.[0] || '',
    image: (gameData.image as string) || (gameData.thumbnail as string),
    aggregateRating: baseSchema.aggregateRating ? {
      ...baseSchema.aggregateRating,
      ratingValue: (gameData.rating as number)?.toFixed(1) || '4.5',
      reviewCount: (gameData.reviewCount as string) || '10'
    } : undefined,
    url: `https://italianbrainrot-games.github.io/game/${gameData.slug}`
  };
}

/**
 * 获取博客列表页结构化数据
 */
export async function getBlogListSchema(): Promise<CollectionPageSchema | null> {
  return loadSchemaData<CollectionPageSchema>('src/app/blog/schema.json');
}

/**
 * 获取博客文章页结构化数据
 * @param postData 博客文章数据对象
 */
export async function getBlogPostSchema(postData: Record<string, unknown>): Promise<BlogPostSchema | null> {
  const baseSchema = await loadSchemaData<BlogPostSchema>('src/app/blog/[slug]/schema.json');
  if (!baseSchema || !postData) return null;
  
  return {
    ...baseSchema,
    headline: postData.title as string,
    description: (postData.excerpt as string) || '',
    datePublished: postData.date as string,
    dateModified: (postData.updateDate as string) || (postData.date as string),
    author: baseSchema.author ? {
      ...baseSchema.author,
      name: (postData.author as { name?: string })?.name || 'Italian Brainrot Games'
    } : { '@type': 'Person', name: 'Italian Brainrot Games' },
    image: (postData.coverImage as string) || '',
    mainEntityOfPage: baseSchema.mainEntityOfPage ? {
      ...baseSchema.mainEntityOfPage,
      '@id': `https://italianbrainrot-games.github.io/blog/${postData.slug}`
    } : { '@type': 'WebPage', '@id': `https://italianbrainrot-games.github.io/blog/${postData.slug}` }
  };
}

/**
 * 获取分类页结构化数据
 * @param categoryData 分类数据对象
 */
export async function getCategorySchema(categoryData: Record<string, unknown>): Promise<CollectionPageSchema | null> {
  const baseSchema = await loadSchemaData<CollectionPageSchema>('src/app/category/schema.json');
  if (!baseSchema || !categoryData) return null;
  
  return {
    ...baseSchema,
    name: `${categoryData.name} Games - Italian Brainrot Games`,
    description: (categoryData.description as string) || `Browse our collection of ${categoryData.name} games. Play instantly without downloads.`,
    url: `https://italianbrainrot-games.github.io/category/${categoryData.slug}`
  };
}

/**
 * 获取分类列表页结构化数据
 */
export async function getCategoryListSchema(): Promise<CollectionPageSchema | null> {
  return loadSchemaData<CollectionPageSchema>('src/app/categories/schema.json');
}

/**
 * 清除结构化数据缓存
 */
export function clearSchemaCache(): void {
  schemaCache.clear();
} 