import React from "react";
import { Metadata } from "next";
import { Layout } from "@/components/layout";
import { HeroSection } from "@/components/sections/HeroSection";
import { GameGrid } from "@/components/sections/GameGrid";
import { RankingList } from "@/components/sections/RankingList";
import { CategoryNav } from "@/components/sections/CategoryNav";
import { BlogEntry } from "@/components/sections/BlogEntry";
import { SchemaOrg } from "@/components/SchemaOrg";
import {
  getHomepageStructure,
  getSEOConfig,
  sortComponentsByOrder,
} from "@/lib/config";
import { getHomepageSchema } from "@/lib/schema";
import {
  getPopularGames,
  getNewGames,
  getRecentBlogPosts,
  getAllCategories,
} from "@/lib/data";

/**
 * Generate metadata for homepage
 * 首页元数据生成
 */
export async function generateMetadata(): Promise<Metadata> {
  const homepageSEO = await getSEOConfig("/");

  return {
    title: homepageSEO?.title || "Game Site Template",
    description: homepageSEO?.description || "Discover and play amazing games",
    keywords: homepageSEO?.keywords || [],
    openGraph: {
      title: homepageSEO?.ogTitle || homepageSEO?.title,
      description: homepageSEO?.ogDescription || homepageSEO?.description,
      images: homepageSEO?.ogImage ? [homepageSEO.ogImage] : [],
    },
    twitter: {
      card: homepageSEO?.twitterCard || "summary_large_image",
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

  // Get data from JSON files
  const newGamesData = getNewGames(8);
  const popularGamesData = getPopularGames(6);
  const recentBlogPosts = getRecentBlogPosts(4);
  const categories = getAllCategories();

  // Sort components by order
  const sortedComponents = sortComponentsByOrder(
    structure as {
      [key: string]: {
        enabled: boolean;
        order: number;
        props: Record<string, unknown>;
      };
    }
  );

  // Component rendering function
  const renderComponent = (componentName: string, config: unknown) => {
    const props: Record<string, unknown> = 
      typeof config === "object" && config !== null && 'props' in config 
        ? (config as { props: Record<string, unknown> }).props 
        : {};

    switch (componentName) {
      case "hero":
        return (
          <HeroSection
            title={(props.title as string) || "Welcome to Game Paradise"}
            subtitle={(props.subtitle as string) || "Discover Amazing Games"}
            description={
              (props.description as string) ||
              "Play the best games online for free. From action-packed adventures to brain-teasing puzzles, we have something for everyone."
            }
            backgroundImage={
              (props.backgroundImage as string) ||
              "https://picsum.photos/seed/hero/1920/1080"
            }
            backgroundVideo={props.backgroundVideo as string}
            showVideo={(props.showVideo as boolean) ?? false}
            ctaButtons={
              (props.ctaButtons as { text: string; href: string; variant: string; size: string }[])?.map((button) => ({
                ...button,
                variant: button.variant as "primary" | "secondary" | "outline" | "ghost" | undefined,
                size: button.size as "xs" | "sm" | "md" | "lg" | "xl" | undefined
              })) || [
                {
                  text: "Explore Games",
                  href: "/games",
                  variant: "primary",
                  size: "lg",
                },
                {
                  text: "Latest News",
                  href: "/blog",
                  variant: "outline",
                  size: "lg",
                },
              ]
            }
            height={(props.height as "lg" | "sm" | "md" | "xl" | "screen") || "lg"}
            className="py-24"
          />
        );

      case "newGames":
        return (
          <div className="py-16 bg-background">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  {(props.title as string) || "New Games"}
                </h2>
                <p className="text-lg text-muted-foreground">
                  {(props.subtitle as string) ||
                    "Discover the latest games added to our collection"}
                </p>
              </div>
              <GameGrid
                games={newGamesData}
                columns={(props.columns as number) || 4}
                gap={(props.gap as string) || "6"}
                maxItems={(props.maxItems as number)}
                showTags={(props.showTags as boolean) ?? true}
                layout={(props.layout as "grid" | "list" | "featured" | "card") || "grid"}
              />
            </div>
          </div>
        );

      case "hotRanking":
        return (
          <div className="py-16 bg-muted/30">
            <div className="container mx-auto px-4">
              <RankingList
                games={popularGamesData}
                title={(props.title as string) || "Hot Games Ranking"}
                showTrend={(props.showTrend as boolean) ?? true}
                showStats={(props.showStats as boolean) ?? true}
                maxItems={(props.maxItems as number) || 6}
                layout={(props.layout as 'list' | 'grid' | 'compact') || 'list'}
              />
            </div>
          </div>
        );

      case "categoryNav":
        return (
          <div className="py-16 bg-background">
            <div className="container mx-auto px-4">
              <CategoryNav
                categories={categories}
                title={(props.title as string) || "Browse by Category"}
                showCounts={(props.showCount as boolean) ?? true}
                layout={(props.layout as "grid" | "horizontal" | "list") || "grid"}
                maxVisible={(props.columns as number) || 6}
              />
            </div>
          </div>
        );

      case "blogsEntry":
        return (
          <div className="py-16 bg-muted/30">
            <div className="container mx-auto px-4">
              <BlogEntry
                posts={recentBlogPosts}
                title={(props.title as string) || "Latest Gaming News"}
                subtitle={
                  (props.subtitle as string) ||
                  "Stay updated with the latest trends and news in gaming"
                }
                maxPosts={(props.maxItems as number) || 4}
                layout={(props.layout as "grid" | "list" | "featured") || "grid"}
                showAuthor={(props.showAuthor as boolean) ?? true}
                showDate={(props.showDate as boolean) ?? true}
                showExcerpt={(props.showExcerpt as boolean) ?? true}
              />
            </div>
          </div>
        );

      case "featuredContent":
        return (
          <div className="py-16 bg-background">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  {(props.title as string) || "Featured Games"}
                </h2>
                <p className="text-lg text-muted-foreground">
                  {(props.subtitle as string) || "Handpicked games for you"}
                </p>
              </div>
              <GameGrid
                games={popularGamesData}
                columns={(props.columns as number) || 3}
                gap={(props.gap as string) || "6"}
                maxItems={(props.maxItems as number) || 6}
                showTags={(props.showTags as boolean) ?? true}
                layout={(props.layout as "grid" | "list" | "featured" | "card") || "featured"}
                showDescription={(props.showDescription as boolean) ?? false}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {/* 添加结构化数据 */}
      <SchemaOrg data={schemaData} />

      <Layout>
        {/* 按照配置的顺序动态渲染组件 */}
        {sortedComponents.map(([componentName, config], index) => (
          <React.Fragment key={`${componentName}-${index}`}>
            {renderComponent(componentName, config)}
          </React.Fragment>
        ))}
      </Layout>
    </>
  );
}

/**
 * ISR Configuration
 * 从静态配置ISR设置
 */
export const dynamic = "force-static";
export const revalidate = 1800; // 30 minutes
