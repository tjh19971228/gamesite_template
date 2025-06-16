import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { Layout } from "@/components/layout";
import { GameGrid } from "@/components/sections/GameGrid";
import { BlogEntry } from "@/components/sections/BlogEntry";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAllGames, getAllBlogPosts, categories } from "@/lib/data";
import { getSearchPageStructure, sortComponentsByOrder } from "@/lib/config";
import { BlogPost } from "@/types";

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    type?: "games" | "articles" | "all";
  }>;
}

interface SearchPageConfig {
  enabled: boolean;
  showTitle: boolean;
  showSubtitle: boolean;
  showSearchForm: boolean;
  showCategories: boolean;
  showTabs: boolean;
  title: string;
  showOnEmptyResults: boolean;
  maxItems: number;
  maxCategories: number;
  subtitle: string;
  showSuggestions: boolean;
  showPopularContent: boolean;
}
/**
 * Generate metadata for search page
 */
export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams.q;

  if (query) {
    return {
      title: `Search Results for "${query}" - GameSite`,
      description: `Search results for ${query} on GameSite. Find games and articles related to ${query}.`,
    };
  }

  return {
    title: "Search - GameSite",
    description: "Search for games, articles, and more on GameSite.",
  };
}

/**
 * Search Page
 * 搜索页面
 */
export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams.q || "";
  const categoryFilter = resolvedSearchParams.category || "";

  // Load search page structure
  const config = await getSearchPageStructure();
  const sections = config.sections || {};

  // Simple search function
  const searchGames = (searchTerm: string) => {
    const allGames = getAllGames();
    if (!searchTerm) return allGames;

    const term = searchTerm.toLowerCase();
    return allGames.filter(
      (game) =>
        game.title.toLowerCase().includes(term) ||
        game.description.toLowerCase().includes(term) ||
        game.tags.some((tag) => tag.toLowerCase().includes(term)) ||
        game.category.toLowerCase().includes(term)
    );
  };

  const searchArticles = (searchTerm: string) => {
    const allBlogPosts = getAllBlogPosts();
    if (!searchTerm) return allBlogPosts;

    const term = searchTerm.toLowerCase();
    return allBlogPosts.filter(
      (post) =>
        post.title.toLowerCase().includes(term) ||
        post.excerpt.toLowerCase().includes(term) ||
        post.tags.some((tag) => tag.toLowerCase().includes(term)) ||
        post.category.toLowerCase().includes(term)
    );
  };

  const searchResults = {
    games: searchGames(query),
    articles: searchArticles(query),
  };

  const totalResults =
    searchResults.games.length + searchResults.articles.length;

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
  const renderComponent = (componentName: string, config: SearchPageConfig) => {
    if (!config.enabled) return null;

    switch (componentName) {
      case "pageHeader":
        return (
          <div
            key={componentName}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12"
          >
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                {config.showTitle && (
                  <h1 className="text-4xl font-bold mb-6">
                    {query ? `Search Results` : "Search"}
                  </h1>
                )}

                {query && config.showSubtitle && (
                  <div className="mb-6">
                    <p className="text-xl opacity-90 mb-2">
                      Results for &quot;{query}&quot;
                    </p>
                    <p className="opacity-75">
                      Found {totalResults} results ({searchResults.games.length}{" "}
                      games, {searchResults.articles.length} articles)
                    </p>
                  </div>
                )}

                {config.showSearchForm && (
                  <form method="GET" className="max-w-2xl mx-auto">
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <Input
                          type="search"
                          name="q"
                          placeholder="Search games, articles, categories..."
                          defaultValue={query}
                          className="bg-white text-gray-900"
                        />
                      </div>
                      <Button
                        type="submit"
                        className="bg-white text-indigo-600 hover:bg-gray-100"
                      >
                        Search
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        );

      case "searchFilters":
        if (!query) return null;
        return (
          <div key={componentName} className="bg-muted/30 border-b">
            <div className="container mx-auto px-4 py-4">
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm font-medium">Filters:</span>

                {config.showCategories && (
                  <div className="flex gap-1">
                    <Badge
                      variant={!categoryFilter ? "default" : "outline"}
                      className="cursor-pointer"
                    >
                      All Categories
                    </Badge>
                    {categories.slice(0, 5).map((cat) => (
                      <Badge
                        key={cat.id}
                        variant={
                          categoryFilter === cat.slug ? "default" : "outline"
                        }
                        className="cursor-pointer"
                      >
                        {cat.name}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case "searchResults":
        if (!query) return null;
        return (
          <div key={componentName} className="py-12">
            <div className="container mx-auto px-4">
              {totalResults > 0 ? (
                config.showTabs ? (
                  <Tabs defaultValue="all" className="w-full">
                    <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
                      <TabsTrigger value="all">
                        All ({totalResults})
                      </TabsTrigger>
                      <TabsTrigger value="games">
                        Games ({searchResults.games.length})
                      </TabsTrigger>
                      <TabsTrigger value="articles">
                        Articles ({searchResults.articles.length})
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="all" className="space-y-12">
                      {/* Games Results */}
                      {searchResults.games.length > 0 && (
                        <div>
                          <h2 className="text-2xl font-bold mb-6">Games</h2>
                          <GameGrid
                            games={searchResults.games.slice(0, 8)}
                            columns={4}
                            gap="6"
                          />
                          {searchResults.games.length > 8 && (
                            <div className="text-center mt-6">
                              <Button variant="secondary">
                                View All {searchResults.games.length} Games
                              </Button>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Articles Results */}
                      {searchResults.articles.length > 0 && (
                        <div>
                          <h2 className="text-2xl font-bold mb-6">Articles</h2>
                          <BlogEntry
                            posts={
                              searchResults.articles.slice(0, 6) as BlogPost[]
                            }
                            layout="grid"
                            showExcerpt={true}
                            showAuthor={true}
                            showDate={true}
                          />
                          {searchResults.articles.length > 6 && (
                            <div className="text-center mt-6">
                              <Button variant="secondary">
                                View All {searchResults.articles.length}{" "}
                                Articles
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="games">
                      <GameGrid
                        games={searchResults.games}
                        columns={4}
                        gap="6"
                      />
                    </TabsContent>

                    <TabsContent value="articles">
                      <BlogEntry
                        posts={searchResults.articles as BlogPost[]}
                        layout="grid"
                        showExcerpt={true}
                        showAuthor={true}
                        showDate={true}
                      />
                    </TabsContent>
                  </Tabs>
                ) : (
                  <div className="space-y-12">
                    {searchResults.games.length > 0 && (
                      <div>
                        <h2 className="text-2xl font-bold mb-6">Games</h2>
                        <GameGrid
                          games={searchResults.games}
                          columns={4}
                          gap="6"
                        />
                      </div>
                    )}

                    {searchResults.articles.length > 0 && (
                      <div>
                        <h2 className="text-2xl font-bold mb-6">Articles</h2>
                        <BlogEntry
                          posts={searchResults.articles as BlogPost[]}
                          layout="grid"
                          showExcerpt={true}
                          showAuthor={true}
                          showDate={true}
                        />
                      </div>
                    )}
                  </div>
                )
              ) : (
                <div className="text-center py-12">
                  <h2 className="text-2xl font-bold mb-4">No Results Found</h2>
                  <p className="text-muted-foreground mb-8">
                    Try adjusting your search terms or browse our categories
                  </p>
                </div>
              )}
            </div>
          </div>
        );

      case "popularSearches":
        if (!config.showOnEmptyResults && query && totalResults > 0)
          return null;
        return (
          <div key={componentName} className="py-16 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">
                  {config.title || "Popular Searches"}
                </h2>
                <p className="text-muted-foreground">
                  Try these popular search terms
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
                {[
                  "action games",
                  "puzzle games",
                  "multiplayer",
                  "adventure",
                  "strategy",
                  "arcade",
                  "sports",
                  "racing",
                ]
                  .slice(0, config.maxItems || 8)
                  .map((term) => (
                    <Link
                      key={term}
                      href={`/search?q=${encodeURIComponent(term)}`}
                    >
                      <Badge
                        variant="outline"
                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                      >
                        {term}
                      </Badge>
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        );

      case "browseCategories":
        if (!config.showOnEmptyResults && query && totalResults > 0)
          return null;
        return (
          <div key={componentName} className="py-16">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">
                  {config.title || "Browse by Category"}
                </h2>
                <p className="text-muted-foreground">
                  Discover games by exploring our categories
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {categories
                  .slice(0, config.maxCategories || 6)
                  .map((category) => (
                    <Link key={category.id} href={`/category/${category.slug}`}>
                      <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                        <CardContent className="p-6 text-center">
                          <div className="text-3xl mb-3">{category.icon}</div>
                          <h3 className="font-semibold group-hover:text-primary transition-colors mb-2">
                            {category.name}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {category.description}
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        );

      case "noResults":
        if (query && totalResults > 0) return null;
        return (
          <div key={componentName} className="py-16">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-2xl font-bold mb-4">
                {config.title || "No Results Found"}
              </h2>
              <p className="text-muted-foreground mb-8">
                {config.subtitle ||
                  "Try adjusting your search terms or browse our categories"}
              </p>

              {config.showSuggestions && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4">Suggestions:</h3>
                  <ul className="text-muted-foreground space-y-2">
                    <li>• Check your spelling</li>
                    <li>• Try different keywords</li>
                    <li>• Use more general terms</li>
                    <li>• Browse our categories instead</li>
                  </ul>
                </div>
              )}

              {config.showPopularContent && (
                <div>
                  <Button asChild variant="secondary" size="lg">
                    <Link href="/games">Browse All Games</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Layout>
      {/* Render components in order */}
      {sortedComponents.map(([componentName, config]) =>
        renderComponent(componentName, config as SearchPageConfig)
      )}
    </Layout>
  );
}

export const dynamic = "force-dynamic";
export const revalidate = false;
