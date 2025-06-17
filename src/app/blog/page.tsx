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

interface BlogPageConfig {
  enabled: boolean;
  showTitle: boolean;
  showSubtitle: boolean;
  showSearch: boolean;
  title: string;
  showExcerpt: boolean;
  showAuthor: boolean;
  showDate: boolean;
  showReadTime: boolean;
  showBenefits: boolean;
  subtitle: string;
  components: {
    popularPosts: {
      enabled: boolean;
      title: string;
      maxPosts: number;
    };
    categories: {
      enabled: boolean;
      title: string;
      showCount: boolean;
    };
    newsletter: {
      enabled: boolean;
      title: string;
      description: string;
    };
    tags: {
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

  // Get categories
  const categories = filters.categories?.options || 
    [...new Set(allPosts.map((post) => post.category))] as string[];

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
        return (
          <div
            key={componentName}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-12"
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

                {config.showSearch && page.showSearch && (
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
                <p className="text-muted-foreground">
                  Don&apos;t miss these important articles
                </p>
              </div>

              <BlogEntry
                posts={featuredPosts as unknown as BlogPost[]}
                layout="featured"
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
            sortingOptions={filters.sorting?.options || ["newest", "popular", "oldest"]}
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
                    Stay up to date with the latest gaming news and insights
                  </p>
                </div>
              </div>
              <BlogEntry
                posts={recentPosts as unknown as BlogPost[]}
                layout="grid"
                showExcerpt={config.showExcerpt}
                showAuthor={config.showAuthor}
                showDate={config.showDate}
                showReadTime={config.showReadTime}
              />

              {/* Load More */}
              {allPosts.length > recentPosts.length && (
                <div className="text-center mt-12">
                  <Button variant="secondary" size="lg">
                    Load More Articles
                  </Button>
                </div>
              )}
            </div>
          </div>
        );

      // case "sidebar":
        return (
          <div key={componentName} className="py-16 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="grid lg:grid-cols-4 gap-8">
                {config.components?.popularPosts?.enabled && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      {config.components.popularPosts.title}
                    </h3>
                    <div className="space-y-3">
                      {allPosts
                        .slice(0, config.components.popularPosts.maxPosts || 5)
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
                          {config.components.categories.showCount && (
                            <span className="text-muted-foreground">
                              {
                                allPosts.filter((p) => p.category === category)
                                  .length
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
          </div>
        );

      case "newsletter":
        return (
          <div key={componentName} className="py-16 bg-primary text-white">
            <div className="container mx-auto px-4">
              <div className="max-w-2xl mx-auto text-center">
                <h2 className="text-3xl font-bold mb-4">{config.title}</h2>
                <p className="text-xl opacity-90 mb-8">{config.subtitle}</p>
                {config.showBenefits && (
                  <div className="flex justify-center gap-6 mb-8 text-sm">
                    <div>📧 Weekly Updates</div>
                    <div>🎮 Game Reviews</div>
                    <div>📈 Industry News</div>
                  </div>
                )}
                <div className="flex gap-2 max-w-md mx-auto">
                  <Input
                    placeholder="Enter your email"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/70"
                  />
                  <Button variant="secondary">Subscribe</Button>
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
