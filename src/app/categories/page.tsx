import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { SchemaOrg } from '@/components/SchemaOrg';
import { categories, getAllGames } from "@/lib/data";
import {
  getCategoriesPageStructure,
  sortComponentsByOrder,
} from "@/lib/config";
import { getCategoryListSchema } from '@/lib/schema';
import { CategoriesPageStructure } from "@/types";

interface CategoriesPageConfig {
  enabled: boolean;
  showTitle: boolean;
  showSubtitle: boolean;
  showStats: boolean;
  gap: string;
  columns: number;
  showDescription: boolean;
  showGameCount: boolean;
  maxPreviewGames: number;
  title: string;
  maxCategories: number;
  showLastUpdated: boolean;
  showPreviewGames: boolean;
}

/**
 * Generate metadata for categories page
 */
export async function generateMetadata(): Promise<Metadata> {
  const config: CategoriesPageStructure = await getCategoriesPageStructure();
  const { metadata } = config;

  return {
    title: metadata.title,
    description: metadata.description,
    keywords: metadata.keywords,
  };
}

/**
 * Categories Page
 * 分类页面
 */
export default async function CategoriesPage() {
  const config: CategoriesPageStructure = await getCategoriesPageStructure();
  const { page, sections, display, filters } = config;

  // Get data with game counts
  const allGames = getAllGames();
  const categoriesWithCounts = categories.map((category) => ({
    ...category,
    gameCount: allGames.filter((game) => game.category === category.name)
      .length,
    recentGames: allGames
      .filter((game) => game.category === category.name)
      .sort(
        (a, b) =>
          new Date(b.releaseDate || "").getTime() -
          new Date(a.releaseDate || "").getTime()
      )
      .slice(
        0,
        display.showPreviewGames
          ? sections.categoryGrid?.maxPreviewGames || 3
          : 0
      ),
  }));

  // Sort categories
  const sortedCategories = [...categoriesWithCounts].sort((a, b) => {
    switch (display.sortBy) {
      case "gameCount":
        return b.gameCount - a.gameCount;
      case "popularity":
        return b.gameCount - a.gameCount; // Using game count as popularity proxy
      case "recent":
        return b.gameCount - a.gameCount; // Simplified for demo
      case "name":
      default:
        return a.name.localeCompare(b.name);
    }
  });

  // 获取分类列表页结构化数据
  const schemaData = await getCategoryListSchema();

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
    config: CategoriesPageConfig
  ) => {
    if (!config.enabled) return null;

    switch (componentName) {
      case "pageHeader":
        return (
          <div
            key={componentName}
            className="bg-gradient-to-r from-emerald-600 to-cyan-600 text-white py-12"
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

                {config.showStats && (
                  <div className="flex flex-wrap justify-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <span>📁</span>
                      <span>{sortedCategories.length} Categories</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>🎮</span>
                      <span>{allGames.length} Total Games</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>🆓</span>
                      <span>All Free to Play</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case "categoryGrid":
        return (
          <div key={componentName} className="py-16">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">All Categories</h2>
                <p className="text-muted-foreground">
                  Browse all game categories
                </p>
              </div>

              <div
                className={`grid gap-${config.gap || "6"} ${
                  config.columns === 2
                    ? "md:grid-cols-2"
                    : config.columns === 3
                    ? "md:grid-cols-2 lg:grid-cols-3"
                    : config.columns === 4
                    ? "md:grid-cols-2 lg:grid-cols-4"
                    : "md:grid-cols-2 lg:grid-cols-3"
                }`}
              >
                {sortedCategories.map((category) => (
                  <Link key={category.id} href={`/category/${category.slug}`}>
                    <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer h-full">
                      <div
                        className="h-32 bg-gradient-to-br from-primary/20 to-secondary/20 relative overflow-hidden"
                        style={{
                          background: `linear-gradient(135deg, ${category.color}20, ${category.color}40)`,
                        }}
                      >
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-4xl">{category.icon}</div>
                        </div>
                      </div>

                      <CardHeader>
                        <CardTitle className="group-hover:text-primary transition-colors">
                          {category.name}
                        </CardTitle>
                        {config.showDescription && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {category.description}
                          </p>
                        )}
                      </CardHeader>

                      <CardContent>
                        {config.showGameCount && (
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                            <div className="flex items-center gap-1">
                              <span>🎮</span>
                              <span>{category.gameCount} games</span>
                            </div>
                          </div>
                        )}

                        {config.showPreviewGames &&
                          category.recentGames.length > 0 && (
                            <div>
                              <div className="text-xs text-muted-foreground mb-2">
                                Latest Games:
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {category.recentGames
                                  .slice(0, config.maxPreviewGames || 3)
                                  .map((game) => (
                                    <Badge
                                      key={game.slug}
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {game.title}
                                    </Badge>
                                  ))}
                              </div>
                            </div>
                          )}
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        );

      case "popularCategories":
        return (
          <div key={componentName} className="py-16 bg-muted/20">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">
                  {config.title || "Most Popular Categories"}
                </h2>
                <p className="text-muted-foreground">
                  The most popular game categories on our platform
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedCategories
                  .sort((a, b) => b.gameCount - a.gameCount)
                  .slice(0, config.maxCategories || 6)
                  .map((category) => (
                    <Link key={category.id} href={`/category/${category.slug}`}>
                      <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer h-full">
                        <div
                          className="h-32 bg-gradient-to-br from-primary/20 to-secondary/20 relative overflow-hidden"
                          style={{
                            background: `linear-gradient(135deg, ${category.color}20, ${category.color}40)`,
                          }}
                        >
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-4xl">{category.icon}</div>
                          </div>
                        </div>

                        <CardHeader>
                          <CardTitle className="group-hover:text-primary transition-colors">
                            {category.name}
                          </CardTitle>
                          {display.showDescription && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {category.description}
                            </p>
                          )}
                        </CardHeader>

                        <CardContent>
                          {config.showStats && (
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <span>🎮</span>
                                <span>{category.gameCount} games</span>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        );

      case "allCategories":
        return (
          <div key={componentName} className="py-16">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">
                  {config.title || "All Categories"}
                </h2>
                <p className="text-muted-foreground">
                  Complete list of all game categories
                </p>
              </div>

              {/* Filters */}
              {filters.sorting?.enabled && (
                <div className="bg-muted/30 border-b mb-8">
                  <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        {sortedCategories.length} categories
                      </div>

                      <Select defaultValue={filters.sorting.defaultValue}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                          {(filters.sorting.options || []).map(
                            (option: string) => (
                              <SelectItem key={option} value={option}>
                                {option === "name"
                                  ? "Name (A-Z)"
                                  : option === "gameCount"
                                  ? "Most Games"
                                  : option === "popularity"
                                  ? "Most Popular"
                                  : option === "recent"
                                  ? "Recently Updated"
                                  : option}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {sortedCategories.map((category) => (
                  <Link key={category.id} href={`/category/${category.slug}`}>
                    <Card className="group hover:shadow-md transition-all duration-300 cursor-pointer">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="text-3xl">{category.icon}</div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                              {category.name}
                            </h3>
                            {config.showDescription && (
                              <p className="text-sm text-muted-foreground">
                                {category.description}
                              </p>
                            )}
                          </div>
                          {config.showGameCount && (
                            <div className="text-right">
                              <div className="text-2xl font-bold text-primary">
                                {category.gameCount}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                games
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        );

      case "recentlyUpdated":
        return (
          <div key={componentName} className="py-16 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">
                  {config.title || "Recently Updated Categories"}
                </h2>
                <p className="text-muted-foreground">
                  Categories with new games added recently
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {sortedCategories
                  .filter((cat) => cat.gameCount > 0)
                  .slice(0, config.maxCategories || 4)
                  .map((category) => (
                    <Link key={category.id} href={`/category/${category.slug}`}>
                      <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer h-full">
                        <CardHeader>
                          <div className="text-center">
                            <div className="text-3xl mb-2">{category.icon}</div>
                            <CardTitle className="group-hover:text-primary transition-colors">
                              {category.name}
                            </CardTitle>
                          </div>
                        </CardHeader>

                        <CardContent>
                          <div className="text-center space-y-2">
                            <div className="text-sm text-muted-foreground">
                              {category.gameCount} games
                            </div>
                            {config.showLastUpdated && (
                              <div className="text-xs text-muted-foreground">
                                Updated recently
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
              </div>
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
                  <BreadcrumbPage>Categories</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>
      )}

      {/* Render components in order */}
      {sortedComponents.map(([componentName, config]) =>
        renderComponent(componentName, config as CategoriesPageConfig)
      )}
    </Layout>
  );
}

export const dynamic = "force-static";
export const revalidate = 3600;
