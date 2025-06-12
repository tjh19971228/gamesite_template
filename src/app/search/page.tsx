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

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    type?: "games" | "articles" | "all";
  }>;
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
    title: 'Search - GameSite',
    description: 'Search for games, articles, and more on GameSite.',
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

  return (
    <Layout>
      {/* Search Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6">
              {query ? `Search Results` : "Search"}
            </h1>

            {query && (
              <div className="mb-6">
                <p className="text-xl opacity-90 mb-2">Results for &quot;{query}&quot;</p>
                <p className="opacity-75">
                  Found {totalResults} results ({searchResults.games.length}{" "}
                  games, {searchResults.articles.length} articles)
                </p>
              </div>
            )}

            {/* Search Form */}
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
          </div>
        </div>
      </div>

      {/* Search Filters */}
      {query && (
        <div className="bg-muted/30 border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm font-medium">Filters:</span>

              {/* Category Filter */}
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
            </div>
          </div>
        </div>
      )}

      {/* Search Results */}
      <div className="py-12">
        <div className="container mx-auto px-4">
          {query ? (
            totalResults > 0 ? (
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
                  <TabsTrigger value="all">All ({totalResults})</TabsTrigger>
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
                        posts={searchResults.articles.slice(0, 4)}
                        layout="grid"
                        showAuthor={true}
                        showDate={true}
                        showExcerpt={true}
                      />
                      {searchResults.articles.length > 4 && (
                        <div className="text-center mt-6">
                          <Button variant="secondary">
                            View All {searchResults.articles.length} Articles
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="games">
                  {searchResults.games.length > 0 ? (
                    <GameGrid games={searchResults.games} columns={4} gap="6" />
                  ) : (
                    <Card>
                      <CardContent className="text-center py-12">
                        <p className="text-muted-foreground">
                          No games found for &quot;{query}&quot;
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="articles">
                  {searchResults.articles.length > 0 ? (
                    <BlogEntry
                      posts={searchResults.articles}
                      layout="list"
                      showAuthor={true}
                      showDate={true}
                      showExcerpt={true}
                    />
                  ) : (
                    <Card>
                      <CardContent className="text-center py-12">
                        <p className="text-muted-foreground">
                          No articles found for &quot;{query}&quot;
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>
            ) : (
              /* No Results */
              <div className="text-center py-12">
                <div className="max-w-md mx-auto">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                    <svg
                      className="w-12 h-12 text-muted-foreground"
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
                  </div>
                  <h2 className="text-2xl font-bold mb-4">No Results Found</h2>
                  <p className="text-muted-foreground mb-6">
                    We couldn&apos;t find anything matching &quot;{query}&quot;. Try searching with different keywords.
                  </p>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Suggestions:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Check your spelling</li>
                      <li>• Try broader keywords</li>
                      <li>• Use different search terms</li>
                    </ul>
                  </div>
                </div>
              </div>
            )
          ) : (
            /* No Search Query */
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-muted-foreground"
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
                </div>
                <h2 className="text-2xl font-bold mb-4">Search Our Content</h2>
                <p className="text-muted-foreground mb-6">
                  Use the search bar above to find games, articles, and more.
                </p>

                <div className="grid grid-cols-2 gap-4 mt-8">
                  <Button asChild variant="secondary">
                    <Link href="/games">Browse Games</Link>
                  </Button>
                  <Button asChild variant="secondary">
                    <Link href="/blog">Read Articles</Link>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export const dynamic = "force-dynamic";
export const revalidate = false;
