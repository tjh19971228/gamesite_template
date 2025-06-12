import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Layout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { categories, getAllGames } from '@/lib/data';
import { getCategoriesPageStructure } from '@/lib/config';
import { CategoriesPageStructure } from '@/types';

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
  const categoriesWithCounts = categories.map(category => ({
    ...category,
    gameCount: allGames.filter(game => game.category === category.name).length,
    recentGames: allGames
      .filter(game => game.category === category.name)
      .sort((a, b) => new Date(b.releaseDate || '').getTime() - new Date(a.releaseDate || '').getTime())
      .slice(0, display.showPreviewGames ? (sections.categoryGrid?.maxPreviewGames || 3) : 0)
  }));
  
  // Sort categories
  const sortedCategories = [...categoriesWithCounts].sort((a, b) => {
    switch (display.sortBy) {
      case 'gameCount':
        return b.gameCount - a.gameCount;
      case 'popularity':
        return b.gameCount - a.gameCount; // Using game count as popularity proxy
      case 'recent':
        return b.gameCount - a.gameCount; // Simplified for demo
      case 'name':
      default:
        return a.name.localeCompare(b.name);
    }
  });

  return (
    <Layout>
      {/* Page Header */}
      {sections.pageHeader?.enabled && (
        <div className="bg-gradient-to-r from-emerald-600 to-cyan-600 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              {sections.pageHeader.showTitle && (
                <h1 className="text-4xl font-bold mb-4">
                  {page.title}
                </h1>
              )}
              
              {sections.pageHeader.showSubtitle && page.subtitle && (
                <p className="text-xl opacity-90 mb-6">
                  {page.subtitle}
                </p>
              )}
              
              {sections.pageHeader.showStats && (
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
      )}

      {/* Filters */}
      {filters.sorting?.enabled && (
        <div className="bg-muted/30 border-b">
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
                  {(filters.sorting.options || []).map((option: string) => (
                    <SelectItem key={option} value={option}>
                      {option === 'name' ? 'Name (A-Z)' :
                       option === 'gameCount' ? 'Most Games' :
                       option === 'popularity' ? 'Most Popular' :
                       option === 'recent' ? 'Recently Updated' : option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {/* Popular Categories Section */}
      {sections.popularCategories?.enabled && (
        <div className="py-16 bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                {sections.popularCategories.title || "Most Popular Categories"}
              </h2>
              <p className="text-muted-foreground">
                The most popular game categories on our platform
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedCategories
                .sort((a, b) => b.gameCount - a.gameCount)
                .slice(0, sections.popularCategories.maxCategories || 6)
                .map((category) => (
                  <Link key={category.id} href={`/category/${category.slug}`}>
                    <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer h-full">
                      <div 
                        className="h-32 bg-gradient-to-br from-primary/20 to-secondary/20 relative overflow-hidden"
                        style={{
                          background: `linear-gradient(135deg, ${category.color}20, ${category.color}40)`
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
                        {sections.popularCategories?.showStats && (
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
      )}

      {/* Main Category Grid */}
      {sections.categoryGrid?.enabled && (
        <div className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                {sections.categoryGrid.title || "All Categories"}
              </h2>
              <p className="text-muted-foreground">
                Browse all game categories and find your favorite games
              </p>
            </div>
            
            <div className={`grid gap-6 ${
              display.layout === 'compact' ? 'md:grid-cols-3 lg:grid-cols-4' :
              display.layout === 'detailed' ? 'md:grid-cols-2 lg:grid-cols-3' :
              'md:grid-cols-2 lg:grid-cols-3'
            }`}>
              {sortedCategories.map((category) => (
                <Link key={category.id} href={`/category/${category.slug}`}>
                  <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer h-full">
                    {display.layout !== 'compact' && (
                      <div 
                        className="h-24 bg-gradient-to-br from-primary/20 to-secondary/20 relative overflow-hidden"
                        style={{
                          background: `linear-gradient(135deg, ${category.color}20, ${category.color}40)`
                        }}
                      >
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-3xl">{category.icon}</div>
                        </div>
                      </div>
                    )}
                    
                    <CardContent className={display.layout === 'compact' ? 'p-4' : 'p-6'}>
                      <div className="flex items-center gap-3 mb-2">
                        {display.layout === 'compact' && (
                          <div className="text-2xl">{category.icon}</div>
                        )}
                        <div className="flex-1">
                          <h3 className="font-semibold group-hover:text-primary transition-colors">
                            {category.name}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Badge variant="secondary" className="text-xs">
                              {category.gameCount} games
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      {display.showDescription && display.layout !== 'compact' && (
                        <p className="text-sm text-muted-foreground mb-3">
                          {category.description}
                        </p>
                      )}
                      
                      {display.showPreviewGames && category.recentGames.length > 0 && (
                        <div className="mt-3">
                          <p className="text-xs font-medium text-muted-foreground mb-2">Recent Games:</p>
                          <div className="flex flex-wrap gap-1">
                            {category.recentGames.slice(0, 3).map((game) => (
                              <Badge key={game.id} variant="outline" className="text-xs">
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
      )}

      {/* All Categories List */}
      {sections.allCategories?.enabled && (
        <div className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                {sections.allCategories.title || "All Categories"}
              </h2>
              <p className="text-muted-foreground">
                Complete list of all available game categories
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              {sortedCategories.map((category) => (
                <Link key={category.id} href={`/category/${category.slug}`}>
                  <Card className="group hover:shadow-md transition-all duration-300 cursor-pointer">
                    <CardContent className="flex items-center gap-4 p-4">
                      <div className="text-2xl">{category.icon}</div>
                      <div className="flex-1">
                        <h3 className="font-semibold group-hover:text-primary transition-colors">
                          {category.name}
                        </h3>
                        {sections.allCategories?.showDescription && (
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {category.description}
                          </p>
                        )}
                      </div>
                      {sections.allCategories?.showGameCount && (
                        <Badge variant="outline">
                          {category.gameCount}
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export const dynamic = 'force-static';
export const revalidate = 3600; 