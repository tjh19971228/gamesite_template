import React from 'react';
import { Metadata } from 'next';
import { Layout } from '@/components/layout';
import { GameGrid } from '@/components/sections/GameGrid';
import { CategoryNav } from '@/components/sections/CategoryNav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SchemaOrg } from '@/components/SchemaOrg';
import { 
  getAllGames, 
  getPopularGames, 
  getNewGames, 
  getAllCategories 
} from '@/lib/data';
import { getGamesPageStructure } from '@/lib/config';
import { getGameListSchema } from '@/lib/schema';
import { GamesPageStructure } from '@/types';

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
 * Games List Page
 * 游戏列表页面
 */
export default async function GamesPage() {
  const config: GamesPageStructure = await getGamesPageStructure();
  const { page, sections, filters } = config;
  
  // Get data
  const allGames = getAllGames();
  const popularGames = getPopularGames(sections.popularGames?.maxGames || 8);
  const newGames = getNewGames(sections.recentlyAdded?.maxGames || 6);
  const categories = getAllCategories();
  
  // 获取游戏列表页结构化数据
  const schemaData = await getGameListSchema();

  return (
    <>
      {/* 添加结构化数据 */}
      <SchemaOrg data={schemaData} />
      
      <Layout>
        {/* Page Header */}
        {sections.pageHeader?.enabled && (
          <div className="text-white py-12" style={{
              backgroundImage: `linear-gradient(to right, rgb(var(--color-primary-500)) 0%, rgb(var(--color-secondary-500)) 100%)`
            }}>
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
        )}

        {/* Filter Bar */}
        {sections.filterBar?.enabled && (
          <div className="bg-muted/30 border-b">
            <div className="container mx-auto px-4 py-6">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing {allGames.length} games
                </div>

                <div className="flex gap-2">
                  {sections.filterBar?.showSortOptions && filters.sorting?.enabled && (
                    <Select defaultValue={filters.sorting.defaultValue}>
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        {(filters.sorting.options || []).map((option: string) => (
                          <SelectItem key={option} value={option}>
                            {option === 'newest' ? 'Newest First' :
                             option === 'popular' ? 'Most Popular' :
                             option === 'rating' ? 'Highest Rated' :
                             option === 'name' ? 'Name (A-Z)' : option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}

                  {sections.filterBar?.showSearch && filters.search?.enabled && (
                    <div className="flex gap-2">
                      <Input
                        type="search"
                        placeholder={filters.search.placeholder}
                        className="w-[200px] bg-white border-gray-300"
                        style={{
                          backgroundColor: 'white',
                          borderColor: 'rgb(var(--color-neutral-300))'
                        }}
                      />
                      <Button 
                        size="sm"
                        style={{
                          backgroundColor: 'rgb(var(--color-primary-500))',
                          color: 'white',
                          border: 'none'
                        }}
                      >
                        <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        Search
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Category Navigation */}
        {sections.categoryNavigation?.enabled && (
          <div className="py-8 bg-muted/20">
            <div className="container mx-auto px-4">
              <CategoryNav
                categories={categories}
                layout={sections.categoryNavigation.layout as "horizontal" | "grid" | "list" || "horizontal"}
                maxVisible={sections.categoryNavigation.maxVisible}
                showAllButton={sections.categoryNavigation.showAllButton}
              />
            </div>
          </div>
        )}

        {/* Main Games Grid */}
        {sections.gameGrid?.enabled && (
          <div className="py-12">
            <div className="container mx-auto px-4">
              <GameGrid
                games={allGames}
                columns={sections.gameGrid.columns}
                gap={sections.gameGrid.gap}
              />
              
              {/* Load More Button */}
              {sections.gameGrid.showLoadMore && allGames.length >= (sections.gameGrid.gamesPerPage || 12) && (
                <div className="text-center mt-8">
                  <Button variant="secondary" size="lg">
                    Load More Games
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Popular Games Section */}
        {sections.popularGames?.enabled && (
          <div className="py-16 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">
                  {sections.popularGames.title}
                </h2>
                <p className="text-muted-foreground">
                  The most played games this week
                </p>
              </div>
              
              <GameGrid
                games={popularGames}
                columns={4}
                gap="6"
              />
            </div>
          </div>
        )}

        {/* Recently Added Section */}
        {sections.recentlyAdded?.enabled && (
          <div className="py-16">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">
                  {sections.recentlyAdded.title}
                </h2>
                <p className="text-muted-foreground">
                  Check out the latest additions to our game collection
                </p>
              </div>
              
              <GameGrid
                games={newGames}
                columns={3}
                gap="6"
              />
            </div>
          </div>
        )}
      </Layout>
    </>
  );
}

export const dynamic = 'force-static';
export const revalidate = 900; // 15 minutes 