import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Layout } from '@/components/layout';
import { GameGrid } from '@/components/sections/GameGrid';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { 
  categories,
  getGamesByCategory,
  getCategoryBySlug 
} from '@/lib/data';
import { getCategoryDetailStructure } from '@/lib/config';
import { SchemaOrg } from '@/components/SchemaOrg';
import { getCategorySchema } from '@/lib/schema';
import { CategoryDetailStructure } from '@/types';

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * Generate metadata for category page
 */
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  // 确保params已被解析
  const resolvedParams = await params;
  const category = getCategoryBySlug(resolvedParams.slug);
  
  if (!category) {
    return {
      title: 'Category Not Found - GameSite',
      description: 'The requested category could not be found.',
    };
  }

  return {
    title: `${category.name} Games - Free Online Games | GameSite`,
    description: category.description || `Play the best ${category.name.toLowerCase()} games online for free. Discover amazing ${category.name.toLowerCase()} games in our collection.`,
    keywords: [category.name, `${category.name} games`, 'free online games', 'browser games'],
    openGraph: {
      title: `${category.name} Games - GameSite`,
      description: category.description,
      type: 'website',
    },
  };
}

/**
 * Generate static params for all categories
 */
export async function generateStaticParams() {
  return categories.map((category) => ({
    slug: category.slug,
  }));
}

/**
 * Category Page
 * 分类页面
 */
export default async function CategoryPage({ params }: CategoryPageProps) {
  // 确保params已被解析
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const category = getCategoryBySlug(slug);
  
  if (!category) {
    notFound();
  }

  const games = getGamesByCategory(slug);
  const totalGames = games.length;
  
  // 获取分类详情页面结构配置
  const config: CategoryDetailStructure = await getCategoryDetailStructure();
  
  // 获取分类页结构化数据
  const schemaData = await getCategorySchema(category as unknown as Record<string, unknown>);

  return (
    <>
      {/* 添加结构化数据 */}
      <SchemaOrg data={schemaData} />
      
      <Layout>
        {/* 面包屑导航 */}
        {config.page?.showBreadcrumb && (
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
                    <BreadcrumbLink asChild>
                      <Link href="/categories">Categories</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{category.name}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </div>
        )}
        
        {/* Category Hero Section */}
        {config.sections.pageHeader?.enabled && (
          <div className="text-white py-12" style={{
            backgroundImage: `linear-gradient(to right, ${category.color || '#8B5CF6'} 0%, rgb(79, 70, 229) 100%)`
          }}>
            <div className="container mx-auto px-4">
              <div className="max-w-4xl">
                {config.sections.pageHeader.showTitle && (
                  <div className="flex items-center gap-3 mb-4">
                    {category.icon && (
                      <span className="text-4xl">{category.icon}</span>
                    )}
                    <h1 className="text-4xl font-bold">{category.name} Games</h1>
                    <Badge variant="secondary" className="bg-white/20 text-white">
                      {totalGames} games
                    </Badge>
                  </div>
                )}
                
                {config.sections.pageHeader.showSubtitle && (
                  <p className="text-xl opacity-90 mb-6">
                    {category.description || `Discover the best ${category.name.toLowerCase()} games in our collection. Play for free online!`}
                  </p>
                )}

                {/* Category Stats */}
                {config.sections.pageHeader.showStats && (
                  <div className="flex flex-wrap gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <span>🎮</span>
                      <span>{totalGames} Games Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>🆓</span>
                      <span>100% Free to Play</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>🌐</span>
                      <span>No Download Required</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>📱</span>
                      <span>Mobile Friendly</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Filters and Sorting */}
        <div className="bg-muted/30 border-b">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {totalGames} {category.name.toLowerCase()} games
              </div>

              <div className="flex gap-2">
                <Select defaultValue="newest">
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="name">Name (A-Z)</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="secondary" size="sm">
                  <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
                  </svg>
                  Filters
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Games Grid */}
        {config.sections.gameGrid?.enabled && (
          <div className="py-12">
            <div className="container mx-auto px-4">
              {games.length > 0 ? (
                <>
                  <GameGrid
                    games={games}
                    columns={config.sections.gameGrid.columns || 4}
                    gap={config.sections.gameGrid.gap || "6"}
                  />
                  
                  {/* Load More Section (for future pagination) */}
                  {config.sections.gameGrid.showLoadMore && games.length >= 12 && (
                    <div className="text-center mt-12">
                      <Button variant="secondary" size="lg">
                        Load More Games
                      </Button>
                      <p className="text-sm text-muted-foreground mt-2">
                        Showing 12 of {totalGames} games
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <Card>
                  <CardContent className="flex items-center justify-center py-16">
                    <div className="text-center max-w-md">
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
                            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold mb-2">
                        No {category.name} Games Yet
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        We&apos;re working on adding more {category.name.toLowerCase()} games to our collection. 
                        Check back soon or explore other categories!
                      </p>
                      <Button asChild>
                        <Link href="/games">Browse All Games</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Related Categories */}
        {config.sections.relatedCategories?.enabled && (
          <div className="py-16 bg-muted/30">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl font-bold text-center mb-8">
                {config.sections.relatedCategories.title || "Explore Other Categories"}
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {categories
                  .filter(cat => cat.slug !== slug)
                  .slice(0, config.sections.relatedCategories.maxItems || 6)
                  .map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/category/${cat.slug}`}
                      className="group block p-4 bg-background rounded-lg border hover:border-primary transition-colors"
                    >
                      <div className="text-center">
                        {cat.icon && (
                          <div className="text-2xl mb-2">{cat.icon}</div>
                        )}
                        <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
                          {cat.name}
                        </h3>
                        {cat.count && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {cat.count} games
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
              </div>
              
              <div className="text-center mt-8">
                <Button asChild variant="secondary">
                  <Link href="/categories">View All Categories</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </Layout>
    </>
  );
}

export const dynamic = 'force-static';
export const revalidate = 1800; // 30 minutes 