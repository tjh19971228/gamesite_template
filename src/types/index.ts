/**
 * Core Data Types for Game Site Template
 * 游戏站点模板的核心数据类型定义
 */

// ================================
// Game Related Types
// ================================

export interface Comment {
  username: string;
  content: string;
  timestamp: string;
  likes: number;
}

export interface Game {
  title: string;
  slug: string;
  description: string;
  shortDescription?: string;
  tags: string[];
  category: string;
  images: string[];
  thumbnail?: string;
  rating?: number;
  popularity?: number;
  releaseDate?: string;
  features?: string[];
  videoUrl?: string;
  playUrl?: string;
  developer?: string;
  platform?: string[];
  language?: string[];
  fileSize?: string;
  lastUpdated?: string;
  comments?: Comment[];
  faqContent?: Array<{
    question: string;
    answer: string;
  }>;
  videoContent?: {
    name: string;
    description: string;
    thumbnailUrl: string;
    uploadDate: string;
    duration: string;
    embedUrl: string;
    encodingFormat: string;
    videoQuality: string;
    width?: number;
    height?: number;
    genre?: string[];
    keywords?: string[];
    inLanguage?: string;
    interactionStatistic?: Array<{
      "@type": string;
      interactionType: string;
      userInteractionCount: number;
    }>;
  };
  ratingContent?: {
    ratingValue: number;
    bestRating: number;
    worstRating: number;
    ratingCount: number;
    reviewCount: number;
  };
  seo_content?: string;
  iconUrl?: string;
  realUrl?: string;
}

export interface GameCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  count?: number;
}

export interface GameTag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  count?: number;
}

// ================================
// Blog Related Types
// ================================

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: Author;
  publishedAt: string;
  updatedAt?: string;
  tags: string[];
  category: string;
  featuredImage?: string;
  images?: string[];
  readTime?: number;
  status: 'draft' | 'published' | 'archived';
  seo?: SEOData;
  [key: string]: unknown;
}

import { ReactNode } from 'react';

export interface Author {
  role: ReactNode;
  id: string;
  name: string;
  avatar?: string;
  bio?: string;
  social?: {
    twitter?: string;
    github?: string;
    website?: string;
  };
}

// ================================
// SEO & Metadata Types
// ================================

export interface SEOData {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
  twitterCard?: 'summary' | 'summary_large_image';
  canonicalUrl?: string;
  structuredData?: Record<string, unknown>;
}

export interface PageSEOConfig {
  [route: string]: SEOData;
}

// ================================
// Component Props Types
// ================================

export type LayoutType = 'grid' | 'list' | 'featured' | 'card';
export type BackgroundType = 'default' | 'accent' | 'muted' | 'gradient';
export type PaddingType = 'none' | 'sm' | 'md' | 'lg' | 'xl';
export type SizeType = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface BaseComponentProps {
  className?: string;
  id?: string;
}

export interface GameCardProps extends BaseComponentProps {
  game: Game;
  layout?: LayoutType;
  showTags?: boolean;
  showRating?: boolean;
  showDescription?: boolean;
  clickable?: boolean;
  priority?: boolean; // for image loading
}

export interface GameGridProps extends BaseComponentProps {
  games: Game[];
  columns?: number;
  gap?: string;
  loading?: boolean;
  emptyMessage?: string;
}

export interface HeroSectionProps extends BaseComponentProps {
  title: string;
  subtitle?: string;
  description?: string;
  backgroundImage?: string;
  backgroundVideo?: string;
  ctaButtons?: CTAButton[];
  showVideo?: boolean;
  height?: 'sm' | 'md' | 'lg' | 'xl' | 'screen';
}

export interface CTAButton {
  text: string;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: SizeType;
  icon?: string;
}

export interface SectionProps extends BaseComponentProps {
  title?: string;
  subtitle?: string;
  description?: string;
  children: React.ReactNode;
  background?: BackgroundType;
  padding?: PaddingType;
  centered?: boolean;
  maxWidth?: string;
}

export interface RankingCardProps extends BaseComponentProps {
  rank: number;
  game: Game;
  trend?: 'up' | 'down' | 'same';
  showStats?: boolean;
  showTrend?: boolean;
}

export interface CategoryNavProps extends BaseComponentProps {
  categories: GameCategory[];
  activeCategory?: string;
  layout?: 'horizontal' | 'grid' | 'vertical';
  showCount?: boolean;
  onCategoryChange?: (category: string) => void;
}

export interface PaginationProps extends BaseComponentProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showInfo?: boolean;
  showFirstLast?: boolean;
  maxVisiblePages?: number;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

export interface BreadcrumbProps extends BaseComponentProps {
  items: BreadcrumbItem[];
  separator?: string;
  maxItems?: number;
}

// ================================
// Page Structure Types
// ================================

export interface PageStructure {
  [componentName: string]: boolean | ComponentConfig;
}

export interface ComponentConfig {
  enabled: boolean;
  props?: Record<string, unknown>;
  order?: number;
  title?: string;
  maxItems?: number;
  maxImages?: number;
  showTags?: boolean;
  showCategory?: boolean;
  showStats?: boolean;
  [key: string]: unknown;
}

export interface HomepageStructure {
  hero: boolean | ComponentConfig;
  newGames: boolean | ComponentConfig;
  hotRanking: boolean | ComponentConfig;
  blogsEntry: boolean | ComponentConfig;
  categoryNav: boolean | ComponentConfig;
  featuredContent?: boolean | ComponentConfig;
  [key: string]: boolean | ComponentConfig | undefined;
}

export interface GameDetailStructure {
  sections: {
    gameHero?: ComponentConfig;
    gameInfo?: ComponentConfig;
    gameDescription?: ComponentConfig;
    gameFeatures?: ComponentConfig;
    gameControls?: ComponentConfig;
    screenshotGallery?: ComponentConfig;
    relatedGames?: ComponentConfig;
    commentSection?: ComponentConfig;
    [key: string]: ComponentConfig | undefined;
  };
  metadata?: {
    title: string;
    description: string;
    keywords: string[];
  };
  page?: {
    title: string;
    showBreadcrumb: boolean;
  };
}

export interface BlogPostDetailStructure {
  sections: {
    pageHeader?: ComponentConfig & {
      showCategory?: boolean;
      showTitle?: boolean;
      showExcerpt?: boolean;
      showMeta?: boolean;
      showAuthor?: boolean;
      showDate?: boolean;
      showReadTime?: boolean;
      showTags?: boolean;
    };
    featuredImage?: ComponentConfig;
    relatedPosts?: ComponentConfig & {
      title?: string;
      maxPosts?: number;
      showAuthor?: boolean;
      showDate?: boolean;
      showExcerpt?: boolean;
    };
    [key: string]: ComponentConfig | undefined;
  };
  metadata?: {
    title: string;
    description: string;
    keywords: string[];
  };
  page?: {
    title: string;
    showBreadcrumb: boolean;
  };
}

export interface BlogPageStructure {
  metadata: {
    title: string;
    description: string;
    keywords: string[];
  };
  page: {
    title: string;
    subtitle?: string;
    showBreadcrumb?: boolean;
    showSearch?: boolean;
  };
  sections: {
    pageHeader?: ComponentConfig & {
      showTitle?: boolean;
      showSubtitle?: boolean;
      showSearch?: boolean;
      backgroundType?: string;
    };
    featuredPosts?: ComponentConfig & {
      title?: string;
      maxPosts?: number;
      layout?: string;
      showExcerpt?: boolean;
      showAuthor?: boolean;
      showDate?: boolean;
    };
    categoryFilter?: ComponentConfig & {
      showAllCategories?: boolean;
      layout?: string;
    };
    recentPosts?: ComponentConfig & {
      title?: string;
      layout?: string;
      postsPerPage?: number;
      showExcerpt?: boolean;
      showAuthor?: boolean;
      showDate?: boolean;
      showReadTime?: boolean;
    };
    sidebar?: ComponentConfig & {
      position?: string;
      components?: Record<string, unknown>;
    };
    newsletter?: ComponentConfig & {
      title?: string;
      subtitle?: string;
      showBenefits?: boolean;
      backgroundType?: string;
    };
  };
  filters: {
    categories?: {
      enabled?: boolean;
      defaultValue?: string;
      options?: string[];
    };
    sorting?: {
      enabled?: boolean;
      options?: string[];
      defaultValue?: string;
    };
    search?: {
      enabled?: boolean;
      placeholder?: string;
      showSuggestions?: boolean;
    };
  };
  pagination?: {
    enabled?: boolean;
    type?: string;
    itemsPerPage?: number;
  };
}

export interface CategoryDetailStructure {
  metadata: {
    title: string;
    description: string;
    keywords: string[];
  };
  page: {
    title: string;
    subtitle?: string;
    showBreadcrumb?: boolean;
  };
  sections: {
    pageHeader?: ComponentConfig & {
      showTitle?: boolean;
      showSubtitle?: boolean;
      showStats?: boolean;
      backgroundType?: string;
    };
    gameGrid?: ComponentConfig & {
      columns?: number;
      gap?: string;
      showLoadMore?: boolean;
    };
    relatedCategories?: ComponentConfig & {
      title?: string;
      maxItems?: number;
    };
  };
}

export interface CategoriesPageStructure {
  metadata: {
    title: string;
    description: string;
    keywords: string[];
  };
  page: {
    title: string;
    subtitle?: string;
    showBreadcrumb?: boolean;
    showSearch?: boolean;
  };
  sections: {
    pageHeader?: ComponentConfig & {
      showTitle?: boolean;
      showSubtitle?: boolean;
      showStats?: boolean;
      backgroundType?: string;
    };
    categoryGrid?: ComponentConfig & {
      title?: string;
      layout?: string;
      columns?: number;
      gap?: string;
      showGameCount?: boolean;
      showDescription?: boolean;
      showPreviewGames?: boolean;
      maxPreviewGames?: number;
    };
    popularCategories?: ComponentConfig & {
      title?: string;
      layout?: string;
      maxCategories?: number;
      showStats?: boolean;
    };
    allCategories?: ComponentConfig & {
      title?: string;
      layout?: string;
      showGameCount?: boolean;
      showDescription?: boolean;
      sortBy?: string;
    };
    recentlyUpdated?: ComponentConfig & {
      title?: string;
      maxCategories?: number;
      showLastUpdated?: boolean;
    };
  };
  display: {
    layout?: string;
    columns?: {
      desktop?: number;
      tablet?: number;
      mobile?: number;
    };
    showIcons?: boolean;
    showGameCount?: boolean;
    showDescription?: boolean;
    showPreviewGames?: boolean;
    sortBy?: string;
    sortOrder?: string;
  };
  filters: {
    sorting?: {
      enabled?: boolean;
      options?: string[];
      defaultValue?: string;
    };
  };
}

export interface GamesPageStructure {
  metadata: {
    title: string;
    description: string;
    keywords: string[];
  };
  page: {
    title: string;
    subtitle?: string;
    showBreadcrumb?: boolean;
    showFilters?: boolean;
    showSorting?: boolean;
  };
  sections: {
    pageHeader?: ComponentConfig & {
      showTitle?: boolean;
      showSubtitle?: boolean;
      showStats?: boolean;
      backgroundType?: string;
    };
    filterBar?: ComponentConfig & {
      showCategoryFilter?: boolean;
      showSortOptions?: boolean;
      showSearch?: boolean;
      showViewToggle?: boolean;
    };
    categoryNavigation?: ComponentConfig & {
      layout?: string;
      maxVisible?: number;
      showAllButton?: boolean;
    };
    gameGrid?: ComponentConfig & {
      layout?: string;
      columns?: number;
      gap?: string;
      showLoadMore?: boolean;
      gamesPerPage?: number;
    };
    popularGames?: ComponentConfig & {
      title?: string;
      maxGames?: number;
      layout?: string;
    };
    recentlyAdded?: ComponentConfig & {
      title?: string;
      maxGames?: number;
      layout?: string;
    };
  };
  filters: {
    categories?: {
      enabled?: boolean;
      defaultValue?: string;
    };
    sorting?: {
      enabled?: boolean;
      options?: string[];
      defaultValue?: string;
    };
    search?: {
      enabled?: boolean;
      placeholder?: string;
      showSuggestions?: boolean;
    };
  };
  pagination?: {
    enabled?: boolean;
    type?: string;
    itemsPerPage?: number;
  };
}

export interface TagPageStructure {
  tagInfo: boolean | ComponentConfig;
  relatedGames: boolean | ComponentConfig;
  tagDescription: boolean | ComponentConfig;
  faqSection: boolean | ComponentConfig;
  pagination: boolean | ComponentConfig;
  [key: string]: boolean | ComponentConfig;
}

// ================================
// Configuration Types
// ================================

export interface StylesConfig {
  colors: {
    primary: Record<string, string>;
    secondary: Record<string, string>;
    accent: Record<string, string>;
    neutral: Record<string, string>;
    success: Record<string, string>;
    warning: Record<string, string>;
    error: Record<string, string>;
  };
  fonts: {
    sans: string[];
    serif: string[];
    mono: string[];
  };
  spacing: Record<string, string>;
  borderRadius: Record<string, string>;
  shadows: Record<string, string>;
  animations: Record<string, unknown>;
}

export interface SiteConfig {
  name: string;
  description: string;
  url: string;
  ogImage: string;
  author: Author;
  social: {
    twitter?: string;
    github?: string;
    discord?: string;
  };
  navigation: NavigationItem[];
  footer: FooterConfig;
}

export interface NavigationItem {
  label: string;
  href: string;
  icon?: string;
  children?: NavigationItem[];
}

export interface FooterConfig {
  copyright: string;
  links: {
    [category: string]: NavigationItem[];
  };
  socialLinks: {
    platform: string;
    url: string;
    icon: string;
  }[];
}

// ================================
// API Response Types
// ================================

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  };
}

export interface SearchParams {
  q?: string;
  category?: string;
  tag?: string;
  page?: number;
  limit?: number;
  sort?: 'newest' | 'oldest' | 'popular' | 'rating';
}

// ================================
// Utility Types
// ================================

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type Required<T, K extends keyof T> = T & { [P in K]-?: T[P] };

// Re-export common React types for convenience
export type { ReactNode, ReactElement } from 'react'; 