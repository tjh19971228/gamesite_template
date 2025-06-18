import React from "react";
import { Metadata } from "next";
import { Layout } from "@/components/layout";
import { BlogEntry } from "@/components/sections/BlogEntry";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getAllBlogPosts } from "@/lib/data";
import { getBlogPageStructure, sortComponentsByOrder } from "@/lib/config";
import { SchemaOrg } from "@/components/SchemaOrg";
import { getBlogListSchema } from "@/lib/schema";
import { BlogPost, BlogPageStructure } from "@/types";
import { CategoryFilter } from "@/components/blog/CategoryFilter";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import "./blog-animations.css";

interface BlogPageConfig {
  enabled: boolean;
  order?: number;
  showTitle?: boolean;
  showSubtitle?: boolean;
  showSearch?: boolean;
  title?: string;
  subtitle?: string;
  maxPosts?: number;
  layout?: string;
  postsPerPage?: number;
  showExcerpt?: boolean;
  showAuthor?: boolean;
  showDate?: boolean;
  showReadTime?: boolean;
  showBenefits?: boolean;
  backgroundType?: string;
  showAllCategories?: boolean;
  position?: string;
  components?: {
    mainContent?: {
      enabled?: boolean;
      type?: string;
      title?: string;
      maxPosts?: number;
      categories?: string[];
      showSearch?: boolean;
      showFilters?: boolean;
    };
    popularPosts?: {
      enabled: boolean;
      title: string;
      maxPosts: number;
    };
    categories?: {
      enabled: boolean;
      title: string;
      showCount: boolean;
    };
    newsletter?: {
      enabled: boolean;
      title: string;
      description: string;
    };
    tags?: {
      enabled: boolean;
      title: string;
      maxTags: number;
    };
  };
}

/**
 * Generate metadata for blog page
 */
export async function generateMetadata(): Promise<Metadata> {
  const config: BlogPageStructure = await getBlogPageStructure();
  const { metadata } = config;

  return {
    title: metadata.title,
    description: metadata.description,
    keywords: metadata.keywords,
  };
}

/**
 * Breadcrumb Component
 */
const Breadcrumb = () => (
  <div className="bg-muted/30 py-4">
    <div className="container mx-auto px-4">
      <nav className="flex items-center space-x-2 text-sm">
        <a href="/" className="text-muted-foreground hover:text-foreground">
          首页
        </a>
        <span className="text-muted-foreground">/</span>
        <span className="text-foreground font-medium">博客</span>
      </nav>
    </div>
  </div>
);

/**
 * Get background class based on backgroundType
 */
const getBackgroundClass = (backgroundType?: string) => {
  switch (backgroundType) {
    case "gradient":
      return "bg-gradient-to-r from-purple-600 to-indigo-600";
    case "colored":
      return "bg-primary";
    default:
      return "bg-gradient-to-r from-purple-600 to-indigo-600";
  }
};

/**
 * Blog Page
 * 博客页面
 */
export default async function BlogPage() {
  const config: BlogPageStructure = await getBlogPageStructure();
  const { page, sections, filters } = config;

  // Get data
  const allPosts = getAllBlogPosts();
  const featuredPosts = allPosts.slice(
    0,
    sections.featuredPosts?.maxPosts || 3
  );
  const recentPosts = allPosts
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
    .slice(0, sections.recentPosts?.postsPerPage || 9);

  // Get categories - use config options if available, otherwise generate dynamically
  const categories =
    filters.categories?.options ||
    ([...new Set(allPosts.map((post) => post.category))] as string[]);

  // Get blog list schema
  const schemaData = await getBlogListSchema();

  // Sort components by order
  const sortedComponents = sortComponentsByOrder(
    sections as {
      [key: string]: {
        enabled: boolean;
        order: number;
        props: Record<string, unknown>;
      };
    }
  );

  // Component rendering function
  const renderComponent = (componentName: string, config: BlogPageConfig) => {
    if (!config.enabled) return null;

    switch (componentName) {
      case "pageHeader":
        const headerBgClass = getBackgroundClass(config.backgroundType);
        return (
          <div
            key={componentName}
            className={`${headerBgClass} text-white py-12`}
          >
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                {config.showTitle && (
                  <h1 className="text-4xl font-bold mb-4">
                    {page.title as React.ReactNode}
                  </h1>
                )}

                {config.showSubtitle && page.subtitle && (
                  <p className="text-xl opacity-90 mb-6">
                    {page.subtitle as React.ReactNode}
                  </p>
                )}

                {config.showSearch && (
                  <div className="max-w-md mx-auto">
                    <div className="flex gap-2">
                      <Input
                        type="search"
                        placeholder={
                          filters.search?.placeholder || "Search articles..."
                        }
                        className="bg-white/10 border-white/20 placeholder:text-white/70 text-white"
                      />
                      <Button variant="secondary">
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                      </Button>
                    </div>
                    {filters.search?.showSuggestions && (
                      <div className="mt-2 text-sm opacity-70">
                        <span>search...</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case "featuredPosts":
        if (featuredPosts.length === 0) return null;
        return (
          <div key={componentName} className="py-16">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">{config.title}</h2>
                <p className="text-muted-foreground">不要错过这些重要文章</p>
              </div>

              <BlogEntry
                posts={featuredPosts as unknown as BlogPost[]}
                layout={
                  (config.layout as "featured" | "grid" | "list") || "featured"
                }
                showExcerpt={config.showExcerpt}
                showAuthor={config.showAuthor}
                showDate={config.showDate}
              />
            </div>
          </div>
        );

      case "categoryFilter":
        return (
          <CategoryFilter
            key={componentName}
            categories={categories}
            posts={allPosts as unknown as BlogPost[]}
            showExcerpt={config.showExcerpt}
            showAuthor={config.showAuthor}
            showDate={config.showDate}
            showReadTime={config.showReadTime}
            defaultCategory={filters.categories?.defaultValue || "all"}
            sortingOptions={
              filters.sorting?.options || ["newest", "popular", "oldest"]
            }
            defaultSortOption={filters.sorting?.defaultValue || "newest"}
            sortingEnabled={filters.sorting?.enabled || false}
          />
        );

      case "recentPosts":
        return (
          <div key={componentName} className="py-16">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between mb-12">
                <div>
                  <h2 className="text-3xl font-bold mb-2">{config.title}</h2>
                  <p className="text-muted-foreground">
                    Get the latest game news and deep insights
                  </p>
                </div>
              </div>
              <BlogEntry
                posts={recentPosts as unknown as BlogPost[]}
                layout={
                  (config.layout as "featured" | "grid" | "list") || "grid"
                }
                showExcerpt={config.showExcerpt}
                showAuthor={config.showAuthor}
                showDate={config.showDate}
                showReadTime={config.showReadTime}
              />

              {/* Load More */}
              {allPosts.length > recentPosts.length && (
                <div className="text-center mt-12">
                  <Button variant="secondary" size="lg">
                    Load more articles
                  </Button>
                </div>
              )}
            </div>
          </div>
        );

      case "sidebar":
        const sidebarPositionClass =
          config.position === "left" ? "order-first" : "order-last";

        // Render main content based on mainContent config
        const renderMainContent = () => {
          const mainContentConfig = config.components?.mainContent;

          if (!mainContentConfig?.enabled) {
            return (
              <div className="text-center text-muted-foreground py-12">
                <h3 className="text-lg font-semibold mb-2">mainContent</h3>
                <p>Configure mainContent to display content</p>
              </div>
            );
          }

          switch (mainContentConfig.type) {
            case "recentPosts":
              const mainRecentPosts = allPosts.slice(
                0,
                mainContentConfig.maxPosts || 6
              );
              return (
                <div>
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-2">
                      {mainContentConfig.title || "最新文章"}
                    </h2>
                    <p className="text-muted-foreground">
                      Browse the latest game news and reviews
                    </p>
                  </div>

                  {mainContentConfig.showSearch && (
                    <div className="mb-6">
                      <Input
                        placeholder="Search articles..."
                        className="max-w-md"
                      />
                    </div>
                  )}

                  <BlogEntry
                    posts={mainRecentPosts as unknown as BlogPost[]}
                    layout="grid"
                    showExcerpt={true}
                    showAuthor={true}
                    showDate={true}
                    showReadTime={true}
                  />
                </div>
              );

            case "categoryPosts":
              const categoryPosts = mainContentConfig.categories?.length
                ? allPosts
                    .filter((post) =>
                      mainContentConfig.categories?.includes(post.category)
                    )
                    .slice(0, mainContentConfig.maxPosts || 6)
                : allPosts.slice(0, mainContentConfig.maxPosts || 6);

              return (
                <div>
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-2">
                      {mainContentConfig.title || "Category Posts"}
                    </h2>
                    <p className="text-muted-foreground">
                      {mainContentConfig.categories?.length
                        ? `View ${mainContentConfig.categories.join(
                            ", "
                          )} related articles`
                        : "Browse selected category articles"}
                    </p>
                  </div>

                  {mainContentConfig.showFilters && (
                    <div className="mb-6 flex gap-2">
                      {categories.map((category) => (
                        <Badge
                          key={category}
                          variant={
                            mainContentConfig.categories?.includes(category)
                              ? "default"
                              : "outline"
                          }
                          className="cursor-pointer"
                        >
                          {category}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <BlogEntry
                    posts={categoryPosts as unknown as BlogPost[]}
                    layout="list"
                    showExcerpt={true}
                    showAuthor={true}
                    showDate={true}
                  />
                </div>
              );

            case "featuredGrid":
              const featuredGridPosts = allPosts.slice(
                0,
                mainContentConfig.maxPosts || 8
              );
              return (
                <div>
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-2">
                      {mainContentConfig.title || "精选推荐"}
                    </h2>
                    <p className="text-muted-foreground">
                      Edit the best game content
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {featuredGridPosts.map((post, index) => (
                      <Card
                        key={post.slug}
                        className="group hover:shadow-lg transition-shadow"
                      >
                        <div className="relative h-48 overflow-hidden rounded-t-lg">
                          <Image
                            src={
                              post.featuredImage ||
                              `https://picsum.photos/seed/${post.slug}/400/200`
                            }
                            alt={post.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform"
                          />
                          <Badge className="absolute top-4 left-4">
                            {post.category}
                          </Badge>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold mb-2 line-clamp-2">
                            {post.title}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                            {post.excerpt}
                          </p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{post.author.name}</span>
                            <span>
                              {new Date(post.publishedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              );

            case "statistics":
              const totalTags = [...new Set(allPosts.flatMap((p) => p.tags))]
                .length;
              const avgPostsPerCategory = Math.round(
                allPosts.length / categories.length
              );

              return (
                <div className="space-y-8">
                  {/* Header */}
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full mb-4">
                      <svg
                        className="w-8 h-8 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                    </div>
                    <h2 className="text-3xl font-bold mb-2 gradient-text">
                      {mainContentConfig.title || "Blog Statistics"}
                    </h2>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Comprehensive overview of your blog's performance and
                      content distribution
                    </p>
                  </div>

                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="stats-card relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-600/10" />
                      <CardContent className="p-6 relative">
                        <div className="flex items-center justify-between mb-4">
                          <div className="p-3 bg-blue-500/10 rounded-full">
                            <svg
                              className="w-6 h-6 text-blue-600 stats-icon"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-blue-600 mb-1 stats-number">
                              {allPosts.length}
                            </div>
                            <div className="text-sm text-muted-foreground font-medium">
                              Total Articles
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center text-sm text-green-600">
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                            />
                          </svg>
                          <span>Published content</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="stats-card relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-emerald-50 to-green-100 dark:from-emerald-950 dark:to-green-900">
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-green-600/10" />
                      <CardContent className="p-6 relative">
                        <div className="flex items-center justify-between mb-4">
                          <div className="p-3 bg-emerald-500/10 rounded-full">
                            <svg
                              className="w-6 h-6 text-emerald-600 stats-icon"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                              />
                            </svg>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-emerald-600 mb-1 stats-number">
                              {categories.length}
                            </div>
                            <div className="text-sm text-muted-foreground font-medium">
                              Categories
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center text-sm text-emerald-600">
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                            />
                          </svg>
                          <span>Content types</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="stats-card relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-950 dark:to-violet-900">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-violet-600/10" />
                      <CardContent className="p-6 relative">
                        <div className="flex items-center justify-between mb-4">
                          <div className="p-3 bg-purple-500/10 rounded-full">
                            <svg
                              className="w-6 h-6 text-purple-600 stats-icon"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                              />
                            </svg>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-purple-600 mb-1 stats-number">
                              {totalTags}
                            </div>
                            <div className="text-sm text-muted-foreground font-medium">
                              Total Tags
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center text-sm text-purple-600">
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                            />
                          </svg>
                          <span>Topic diversity</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="stats-card relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-orange-50 to-amber-100 dark:from-orange-950 dark:to-amber-900">
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-amber-600/10" />
                      <CardContent className="p-6 relative">
                        <div className="flex items-center justify-between mb-4">
                          <div className="p-3 bg-orange-500/10 rounded-full">
                            <svg
                              className="w-6 h-6 text-orange-600 stats-icon"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                              />
                            </svg>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-orange-600 mb-1 stats-number">
                              {avgPostsPerCategory}
                            </div>
                            <div className="text-sm text-muted-foreground font-medium">
                              Avg Per Category
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center text-sm text-orange-600">
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                            />
                          </svg>
                          <span>Distribution</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Category Distribution */}
                  <Card className="p-6 bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900 dark:to-gray-800 border-0">
                    <div className="mb-6">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
                          <svg
                            className="w-5 h-5 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-foreground">
                            Category Distribution
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Content breakdown across different categories
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {categories.map((category, index) => {
                        const count = allPosts.filter(
                          (p) => p.category === category
                        ).length;
                        const percentage = Math.round(
                          (count / allPosts.length) * 100
                        );

                        // Dynamic colors for each category
                        const colors = [
                          "from-blue-500 to-cyan-500",
                          "from-emerald-500 to-green-500",
                          "from-purple-500 to-violet-500",
                          "from-orange-500 to-amber-500",
                          "from-pink-500 to-rose-500",
                          "from-indigo-500 to-blue-500",
                        ];
                        const colorClass = colors[index % colors.length];

                        return (
                          <div key={category} className="category-item group">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <div
                                  className={`w-3 h-3 rounded-full bg-gradient-to-r ${colorClass}`}
                                />
                                <span className="font-medium text-foreground">
                                  {category}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span className="font-semibold">{count}</span>
                                <span>articles</span>
                                <span className="text-xs">({percentage}%)</span>
                              </div>
                            </div>
                            <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                              <div
                                className={`progress-bar h-full bg-gradient-to-r ${colorClass} rounded-full progress-bar-animated`}
                                style={{
                                  width: `${percentage}%`,
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Summary */}
                    <div className="mt-6 pt-6 border-t border-border/50">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Most popular category:
                        </span>
                        <span className="font-semibold text-foreground">
                          {categories.reduce((prev, current) =>
                            allPosts.filter((p) => p.category === current)
                              .length >
                            allPosts.filter((p) => p.category === prev).length
                              ? current
                              : prev
                          )}
                        </span>
                      </div>
                    </div>
                  </Card>
                </div>
              );

            default:
              return (
                <div className="text-center text-muted-foreground py-12">
                  <h3 className="text-lg font-semibold mb-2">
                    Unknown content type
                  </h3>
                  <p>Please check mainContent.type configuration</p>
                </div>
              );
          }
        };

        return (
          <div key={componentName} className="py-16 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="grid lg:grid-cols-4 gap-8">
                <div className={`lg:col-span-1 ${sidebarPositionClass}`}>
                  <div className="space-y-8">
                    {config.components?.popularPosts?.enabled && (
                      <div>
                        <h3 className="text-lg font-semibold mb-4">
                          {config.components.popularPosts.title}
                        </h3>
                        <div className="space-y-3">
                          {allPosts
                            .slice(
                              0,
                              config.components.popularPosts.maxPosts || 5
                            )
                            .map((post) => (
                              <div key={post.slug} className="text-sm">
                                <h4 className="font-medium line-clamp-2 mb-1">
                                  {post.title}
                                </h4>
                                <p className="text-muted-foreground">
                                  {post.publishedAt}
                                </p>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                    {config.components?.categories?.enabled && (
                      <div>
                        <h3 className="text-lg font-semibold mb-4">
                          {config.components.categories.title}
                        </h3>
                        <div className="space-y-2">
                          {categories.map((category) => (
                            <div
                              key={category}
                              className="flex justify-between text-sm"
                            >
                              <span>{category}</span>
                              {config.components?.categories?.showCount && (
                                <span className="text-muted-foreground">
                                  {
                                    allPosts.filter(
                                      (p) => p.category === category
                                    ).length
                                  }
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {config.components?.newsletter?.enabled && (
                      <div>
                        <h3 className="text-lg font-semibold mb-4">
                          {config.components.newsletter.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          {config.components.newsletter.description}
                        </p>
                        <div className="space-y-2">
                          <Input
                            placeholder="Enter your email"
                            className="text-sm"
                          />
                          <Button size="sm" className="w-full">
                            Subscribe
                          </Button>
                        </div>
                      </div>
                    )}

                    {config.components?.tags?.enabled && (
                      <div>
                        <h3 className="text-lg font-semibold mb-4">
                          {config.components.tags.title}
                        </h3>
                        <div className="flex flex-wrap gap-1">
                          {[...new Set(allPosts.flatMap((p) => p.tags))]
                            .slice(0, config.components.tags.maxTags || 20)
                            .map((tag) => (
                              <Badge
                                key={tag}
                                variant="outline"
                                className="text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="lg:col-span-3">{renderMainContent()}</div>
              </div>
            </div>
          </div>
        );

      case "newsletter":
        const newsletterBgClass = getBackgroundClass(config.backgroundType);
        return (
          <div
            key={componentName}
            className={`py-16 ${newsletterBgClass} text-white`}
          >
            <div className="container mx-auto px-4">
              <div className="max-w-2xl mx-auto text-center">
                <h2 className="text-3xl font-bold mb-4">{config.title}</h2>
                <p className="text-xl opacity-90 mb-8">{config.subtitle}</p>
                {config.showBenefits && (
                  <div className="flex justify-center gap-6 mb-8 text-sm">
                    <div>📧 每周更新</div>
                    <div>🎮 游戏评测</div>
                    <div>📈 行业资讯</div>
                  </div>
                )}
                <div className="flex gap-2 max-w-md mx-auto">
                  <Input
                    placeholder="输入您的邮箱"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/70"
                  />
                  <Button variant="secondary">订阅</Button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <SchemaOrg data={schemaData} />

      <Layout>
        {/* Breadcrumb */}
        {page.showBreadcrumb && <Breadcrumb />}

        {/* Render components in order */}
        {sortedComponents.map(([componentName, config]) =>
          renderComponent(componentName, config as BlogPageConfig)
        )}
      </Layout>
    </>
  );
}

export const dynamic = "force-static";
export const revalidate = 7200; // 2 hours
