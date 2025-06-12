import React from 'react';
import { Metadata } from 'next';
import { Layout } from '@/components/layout';
import { HeroSection } from '@/components/sections/HeroSection';
import { GameGrid } from '@/components/sections/GameGrid';
import { RankingList } from '@/components/sections/RankingList';
import { CategoryNav } from '@/components/sections/CategoryNav';
import { BlogEntry } from '@/components/sections/BlogEntry';
import { SchemaOrg } from '@/components/SchemaOrg';
import { getHomepageStructure, getSEOConfig } from '@/lib/config';
import { getHomepageSchema } from '@/lib/schema';
import { 
  getPopularGames, 
  getNewGames, 
  getRecentBlogPosts,
  getAllCategories
} from '@/lib/data';

/**
 * Generate metadata for homepage
 * 首页元数据生成
 */
export async function generateMetadata(): Promise<Metadata> {
  const homepageSEO = await getSEOConfig('/');
  
  return {
    title: homepageSEO?.title || 'Game Site Template',
    description: homepageSEO?.description || 'Discover and play amazing games',
    keywords: homepageSEO?.keywords || [],
    openGraph: {
      title: homepageSEO?.ogTitle || homepageSEO?.title,
      description: homepageSEO?.ogDescription || homepageSEO?.description,
      images: homepageSEO?.ogImage ? [homepageSEO.ogImage] : [],
    },
    twitter: {
      card: homepageSEO?.twitterCard || 'summary_large_image',
    },
  };
}

/**
 * Homepage Component
 * 首页组件 - JSON驱动的动态页面
 */
export default async function Homepage() {
  // Load configuration
  const structure = await getHomepageStructure();
  const schemaData = await getHomepageSchema();
  
  // Helper function to check if component is enabled
  const isEnabled = (component: boolean | { enabled: boolean; order?: number; props?: unknown } | undefined): boolean => {
    if (typeof component === 'boolean') return component;
    return component?.enabled ?? false;
  };
  
  // Get data from JSON files
  const newGamesData = getNewGames(8);
  const popularGamesData = getPopularGames(6);
  const recentBlogPosts = getRecentBlogPosts(4);
  const categories = getAllCategories();

  return (
    <>
      {/* 添加结构化数据 */}
      <SchemaOrg data={schemaData} />
      
      <Layout>
        {/* Hero Section */}
        {isEnabled(structure.hero) && (
          <HeroSection
            title="Welcome to Game Paradise"
            subtitle="Discover Amazing Games"
            description="Play the best games online for free. From action-packed adventures to brain-teasing puzzles, we have something for everyone."
            backgroundImage="https://picsum.photos/seed/hero/1920/1080"
            ctaButtons={[
              {
                text: "Explore Games",
                href: "/games",
                variant: "primary",
                size: "lg"
              },
              {
                text: "Latest News",
                href: "/blog",
                variant: "outline",
                size: "lg"
              }
            ]}
            height="lg"
            className="py-24"
          />
        )}

        {/* New Games Section */}
        {isEnabled(structure.newGames) && (
          <div className="py-16 bg-background">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">New Games</h2>
                <p className="text-lg text-muted-foreground">
                  Discover the latest games added to our collection
                </p>
              </div>
              <GameGrid
                games={newGamesData}
                columns={4}
                gap="6"
              />
            </div>
          </div>
        )}

        {/* Hot Ranking Section */}
        {isEnabled(structure.hotRanking) && (
          <div className="py-16 bg-muted/30">
            <div className="container mx-auto px-4">
              <RankingList
                games={popularGamesData}
                title="Hot Games Ranking"
                showTrend={true}
                showStats={true}
                maxItems={6}
              />
            </div>
          </div>
        )}

        {/* Category Navigation */}
        {isEnabled(structure.categoryNav) && (
          <div className="py-16 bg-background">
            <div className="container mx-auto px-4">
              <CategoryNav
                categories={categories}
                title="Browse by Category"
                showCounts={true}
                layout="grid"
                maxVisible={6}
              />
            </div>
          </div>
        )}

        {/* Blog Entry Section */}
        {isEnabled(structure.blogsEntry) && (
          <div className="py-16 bg-muted/30">
            <div className="container mx-auto px-4">
              <BlogEntry
                posts={recentBlogPosts}
                title="Latest Gaming News"
                subtitle="Stay updated with the latest trends and news in gaming"
                maxPosts={4}
                layout="grid"
                showAuthor={true}
                showDate={true}
                showExcerpt={true}
              />
            </div>
          </div>
        )}
        
        {/* Development Debug Info has been removed */}
      </Layout>
    </>
  );
}

/**
 * ISR Configuration
 * 从静态配置ISR设置
 */
export const dynamic = 'force-static';
export const revalidate = 1800; // 30 minutes 