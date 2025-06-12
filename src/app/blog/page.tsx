import React from "react";
import { Metadata } from "next";
import { Layout } from "@/components/layout";
import { BlogEntry } from "@/components/sections/BlogEntry";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getAllBlogPosts } from "@/lib/data";
import { getBlogPageStructure } from "@/lib/config";
import { SchemaOrg } from "@/components/SchemaOrg";
import { getBlogListSchema } from "@/lib/schema";
import { BlogPost, BlogPageStructure } from "@/types";

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
  const categories = [
    ...new Set(allPosts.map((post) => post.category)),
  ] as string[];

  // Get blog list schema
  const schemaData = await getBlogListSchema();

  return (
    <>
      <SchemaOrg data={schemaData} />

      <Layout>
        {/* Page Header */}
        {sections.pageHeader?.enabled && (
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-12">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                {sections.pageHeader.showTitle && (
                  <h1 className="text-4xl font-bold mb-4">{page.title}</h1>
                )}

                {sections.pageHeader.showSubtitle && page.subtitle && (
                  <p className="text-xl opacity-90 mb-6">{page.subtitle}</p>
                )}

                {sections.pageHeader.showSearch && page.showSearch && (
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
        )}

        {/* Featured Posts */}
        {sections.featuredPosts?.enabled && featuredPosts.length > 0 && (
          <div className="py-16">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">
                  {sections.featuredPosts.title}
                </h2>
                <p className="text-muted-foreground">
                  Don&apos;t miss these important articles
                </p>
              </div>

              <BlogEntry
                posts={featuredPosts as unknown as BlogPost[]}
                layout="featured"
                showExcerpt={sections.featuredPosts.showExcerpt}
                showAuthor={sections.featuredPosts.showAuthor}
                showDate={sections.featuredPosts.showDate}
              />
            </div>
          </div>
        )}

        {/* Category Filter */}
        {sections.categoryFilter?.enabled && (
          <div className="py-8 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="text-center mb-8">
                <h3 className="text-lg font-semibold mb-4">
                  Browse by Category
                </h3>
                <div className="flex flex-wrap justify-center gap-2">
                  <Badge variant="default" className="cursor-pointer">
                    All Articles
                  </Badge>
                  {categories.map((category) => (
                    <Badge
                      key={category}
                      variant="outline"
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recent Posts */}
        {sections.recentPosts?.enabled && (
          <div className="py-16">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between mb-12">
                <div>
                  <h2 className="text-3xl font-bold mb-2">
                    {sections.recentPosts.title}
                  </h2>
                  <p className="text-muted-foreground">
                    Stay up to date with the latest gaming news and insights
                  </p>
                </div>

                {filters.sorting?.enabled && (
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm">
                      Newest First
                    </Button>
                    <Button variant="ghost" size="sm">
                      Most Popular
                    </Button>
                  </div>
                )}
              </div>
              <BlogEntry
                posts={recentPosts as unknown as BlogPost[]}
                layout="grid"
                showExcerpt={sections.recentPosts.showExcerpt}
                showAuthor={sections.recentPosts.showAuthor}
                showDate={sections.recentPosts.showDate}
                showReadTime={sections.recentPosts.showReadTime}
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
        )}

        {/* Newsletter Section */}
        {sections.newsletter?.enabled && (
          <div className="py-16 bg-primary text-primary-foreground">
            <div className="container mx-auto px-4">
              <div className="max-w-2xl mx-auto text-center">
                <h2 className="text-3xl font-bold mb-4">
                  {sections.newsletter.title}
                </h2>
                <p className="text-lg opacity-90 mb-8">
                  {sections.newsletter.subtitle}
                </p>

                {sections.newsletter.showBenefits && (
                  <div className="grid md:grid-cols-3 gap-4 mb-8 text-sm">
                    <div className="flex items-center justify-center gap-2">
                      <span>📧</span>
                      <span>Weekly Updates</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <span>🎮</span>
                      <span>Game Reviews</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <span>📰</span>
                      <span>Industry News</span>
                    </div>
                  </div>
                )}

                <div className="max-w-md mx-auto">
                  <div className="flex gap-2">
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      className="bg-white/10 border-white/20 placeholder:text-white/70 text-white"
                    />
                    <Button variant="secondary">Subscribe</Button>
                  </div>
                  <p className="text-xs opacity-75 mt-2">
                    No spam, unsubscribe at any time
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Layout>
    </>
  );
}

export const dynamic = 'force-static';
export const revalidate = 7200; // 2 hours
