import React from "react";
import { Metadata } from "next";
import { Layout } from "@/components/layout";
import { GameGrid } from "@/components/sections/GameGrid";
import { CategoryNav } from "@/components/sections/CategoryNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SchemaOrg } from "@/components/SchemaOrg";
import {
  getAllGames,
  getPopularGames,
  getNewGames,
  getAllCategories,
} from "@/lib/data";
import { getGamesPageStructure, sortComponentsByOrder } from "@/lib/config";
import { getGameListSchema } from "@/lib/schema";
import { GamesPageStructure } from "@/types";
import { Game } from "@/types";
import Link from "next/link";

/**
 * Generate metadata for games page
 */
export async function generateMetadata(): Promise<Metadata> {
  const config: GamesPageStructure = await getGamesPageStructure();
  const { metadata } = config;

  return {
    title: metadata.title,
    description: metadata.description,
    keywords: metadata.keywords,
  };
}

/**
 * Sort games based on the sort parameter
 */
function sortGames(games: Game[], sortBy: string): Game[] {
  switch (sortBy) {
    case "popular":
      return [...games].sort(
        (a, b) => (b.popularity || 0) - (a.popularity || 0)
      );
    case "newest":
      return [...games].sort((a, b) => {
        const dateA = a.releaseDate ? new Date(a.releaseDate).getTime() : 0;
        const dateB = b.releaseDate ? new Date(b.releaseDate).getTime() : 0;
        return dateB - dateA;
      });
    case "rating":
      return [...games].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    case "name":
      return [...games].sort((a, b) => a.title.localeCompare(b.title));
    default:
      return games;
  }
}

/**
 * Games List Page
 * 游戏列表页面
 */
export default async function GamesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { sort } = await searchParams;
  const config: GamesPageStructure = await getGamesPageStructure();
  const { page, sections, filters } = config;

  // Get the sort parameter from URL
  const sortParam =
    (sort as string) ||
    (filters.sorting?.defaultValue as string) ||
    "newest";

  // Get data
  const allGamesRaw = getAllGames();
  const allGames = sortGames(allGamesRaw, sortParam);
  const popularGames = getPopularGames(sections.popularGames?.maxGames || 8);
  const newGames = getNewGames(sections.recentlyAdded?.maxGames || 6);
  const categories = getAllCategories();

  // Debug logging (remove in production)
  console.log("Sort parameter:", sortParam);
  console.log(
    "First 3 games after sorting:",
    allGames.slice(0, 3).map((g) => ({
      title: g.title,
      popularity: g.popularity,
      releaseDate: g.releaseDate,
      rating: g.rating,
    }))
  );

  // 获取游戏列表页结构化数据
  const schemaData = await getGameListSchema();

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
  const renderComponent = (
    componentName: string,
    config: unknown
  ): React.ReactElement | null => {
    const componentConfig = config as {
      enabled?: boolean;
      showTitle?: boolean;
      showSubtitle?: boolean;
      showStats?: boolean;
      showSortOptions?: boolean;
      showSearch?: boolean;
      layout?: string;
      maxVisible?: number;
      showAllButton?: boolean;
      columns?: number;
      gap?: string;
      showLoadMore?: boolean;
      gamesPerPage?: number;
      title?: string;
      [key: string]: unknown;
    };
    if (!componentConfig.enabled) return null;

    switch (componentName) {
      case "pageHeader":
        return (
          <div
            key={componentName}
            className="text-white py-12"
            style={{
              backgroundImage: `linear-gradient(to right, rgb(var(--color-primary-500)) 0%, rgb(var(--color-secondary-500)) 100%)`,
            }}
          >
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                {componentConfig.showTitle && (
                  <h1 className="text-4xl font-bold mb-4">
                    {page.title as React.ReactNode}
                  </h1>
                )}

                {componentConfig.showSubtitle && page.subtitle && (
                  <p className="text-xl opacity-90 mb-6">
                    {page.subtitle as React.ReactNode}
                  </p>
                )}

                {componentConfig.showStats && (
                  <div className="flex flex-wrap justify-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <span>🎮</span>
                      <span>{allGames.length} Games Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>🆓</span>
                      <span>100% Free to Play</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>🌐</span>
                      <span>No Download Required</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case "filterBar":
        return (
          <div key={componentName} className="bg-muted/30 border-b">
            <div className="container mx-auto px-4 py-6">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing {allGames.length} games - sorted by{" "}
                  {sortParam === "newest"
                    ? "newest first"
                    : sortParam === "popular"
                    ? "most popular"
                    : sortParam === "rating"
                    ? "highest rated"
                    : sortParam === "name"
                    ? "name (A-Z)"
                    : sortParam}
                </div>

                <div className="flex gap-2">
                  {componentConfig.showSortOptions &&
                    filters.sorting?.enabled && (
                      <div className="flex gap-2">
                        {(filters.sorting.options || []).map(
                          (option: string) => (
                            <Link key={option} href={`/games?sort=${option}`}>
                              <Button
                                variant={
                                  sortParam === option ? "default" : "outline"
                                }
                                size="sm"
                                className={
                                  sortParam === option
                                    ? "bg-blue-500 text-white hover:bg-blue-600 border-blue-500"
                                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                                }
                              >
                                {option === "newest"
                                  ? "Newest First"
                                  : option === "popular"
                                  ? "Most Popular"
                                  : option === "rating"
                                  ? "Highest Rated"
                                  : option === "name"
                                  ? "Name (A-Z)"
                                  : option}
                              </Button>
                            </Link>
                          )
                        )}
                      </div>
                    )}

                  {componentConfig.showSearch && filters.search?.enabled && (
                    <div className="flex gap-2">
                      <Input
                        type="search"
                        placeholder={filters.search.placeholder as string}
                        className="w-[200px] bg-white border-gray-300"
                        style={{
                          backgroundColor: "white",
                          borderColor: "rgb(var(--color-neutral-300))",
                        }}
                      />
                      <Button
                        size="sm"
                        style={{
                          backgroundColor: "rgb(var(--color-primary-500))",
                          color: "white",
                          border: "none",
                        }}
                      >
                        <svg
                          className="h-4 w-4 mr-2"
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
                        Search
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case "categoryNavigation":
        return (
          <div key={componentName} className="py-8 bg-muted/20">
            <div className="container mx-auto px-4">
              <CategoryNav
                categories={categories}
                layout={
                  (componentConfig.layout as "horizontal" | "grid" | "list") ||
                  "horizontal"
                }
                maxVisible={componentConfig.maxVisible as number}
                showAllButton={componentConfig.showAllButton as boolean}
              />
            </div>
          </div>
        );

      case "gameGrid":
        return (
          <div key={componentName} className="py-12">
            <div className="container mx-auto px-4">
              <GameGrid
                games={allGames}
                layout={
                  componentConfig.layout as
                    | "grid"
                    | "list"
                    | "featured"
                    | "card"
                }
                columns={componentConfig.columns as number}
                gap={componentConfig.gap as string}
                maxItems={componentConfig.gamesPerPage as number}
              />

              {/* Load More Button */}
              {componentConfig.showLoadMore &&
                allGames.length >=
                  ((componentConfig.gamesPerPage as number) || 12) && (
                  <div className="text-center mt-8">
                    <Button variant="secondary" size="lg">
                      Load More Games
                    </Button>
                  </div>
                )}
            </div>
          </div>
        );

      case "popularGames":
        return (
          <div key={componentName} className="py-16 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">
                  {(componentConfig.title as string) || "Popular Games"}
                </h2>
                <p className="text-muted-foreground">
                  The most played games this week
                </p>
              </div>
              <GameGrid
                games={popularGames}
                layout={
                  (componentConfig.layout as
                    | "grid"
                    | "list"
                    | "featured"
                    | "card") || "grid"
                }
                columns={4}
                gap="6"
                maxItems={componentConfig.maxGames as number}
              />
            </div>
          </div>
        );

      case "recentlyAdded":
        return (
          <div key={componentName} className="py-16">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">
                  {(componentConfig.title as string) || "Recently Added"}
                </h2>
                <p className="text-muted-foreground">
                  Latest games added to our collection
                </p>
              </div>
              <GameGrid
                games={newGames}
                layout={
                  (componentConfig.layout as
                    | "grid"
                    | "list"
                    | "featured"
                    | "card") || "grid"
                }
                columns={4}
                gap="6"
                maxItems={componentConfig.maxGames as number}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Layout>
      <SchemaOrg data={schemaData} />

      {/* 面包屑导航 */}
      {page.showBreadcrumb && (
        <div className="bg-muted/20 border-b">
          <div className="container mx-auto px-4 py-3">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/">Home</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Games</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>
      )}

      {sortedComponents.map(([componentName, componentConfig]) =>
        renderComponent(componentName, componentConfig)
      )}
    </Layout>
  );
}

// Remove static export since we need dynamic routing for sort params
