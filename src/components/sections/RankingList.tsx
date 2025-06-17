'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Game } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PinContainer } from '@/components/ui/3d-pin';
import { getAllCategories } from '@/lib/data';

interface RankingListProps {
  games: Game[];
  title?: string;
  showTrend?: boolean;
  showStats?: boolean;
  maxItems?: number;
  layout?: 'list' | 'grid' | 'compact';
  className?: string;
}

/**
 * Ranking List Component
 * 排行榜列表组件 - 显示游戏排名
 */
export function RankingList({
  games,
  title,
  showTrend = true,
  showStats = true,
  maxItems = 10,
  layout = 'list',
  className,
  ...props
}: RankingListProps) {
  const displayGames = games.slice(0, maxItems);
  
  // 获取分类颜色配置
  const categories = getAllCategories();
  const getCategoryColor = (categoryName: string) => {
    const categoryData = categories.find(cat => cat.name === categoryName);
    return categoryData?.color || '#6B7280';
  };

  // Mock trend data for demonstration
  const getTrend = (index: number): 'up' | 'down' | 'same' => {
    const trends: ('up' | 'down' | 'same')[] = ['up', 'down', 'same'];
    return trends[index % 3];
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'same') => {
    switch (trend) {
      case 'up':
        return (
          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
          </svg>
        );
      case 'down':
        return (
          <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
          </svg>
        );
      case 'same':
        return (
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        );
    }
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <Badge 
          className="text-white font-bold"
          style={{ 
            backgroundColor: 'rgb(var(--color-warning-400))',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          🥇 #{rank}
        </Badge>
      );
    } else if (rank === 2) {
      return (
        <Badge 
          className="text-white font-bold"
          style={{ 
            backgroundColor: 'rgb(var(--color-neutral-400))',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          🥈 #{rank}
        </Badge>
      );
    } else if (rank === 3) {
      return (
        <Badge 
          className="text-white font-bold"
          style={{ 
            backgroundColor: 'rgb(var(--color-accent-600))',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          🥉 #{rank}
        </Badge>
      );
    } else {
      return <Badge variant="outline" className="font-medium">#{rank}</Badge>;
    }
  };

  // Grid布局渲染 - 使用3D Pin效果
  const renderGridLayout = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-8">
      {displayGames.map((game, index) => {
        const rank = index + 1;
        const trend = getTrend(index);
        const categoryColor = getCategoryColor(game.category);

        return (
          <PinContainer
            key={game.slug}
            title={`#${rank} ${game.title}`}
            href={`/game/${game.slug}`}
            className="w-full h-full bg-background border border-border shadow-lg hover:shadow-xl rounded-lg p-4"
            containerClassName="h-96 w-full"
          >
            <div className="w-full h-full flex flex-col">
              {/* 排名和趋势角标 */}
              <div className="flex justify-between items-start mb-3">
                <div 
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm"
                  style={{ 
                    backgroundColor: rank <= 3 ? categoryColor : 'hsl(var(--muted))',
                    color: rank <= 3 ? 'white' : 'hsl(var(--muted-foreground))'
                  }}
                >
                  {rank <= 3 && (
                    <span className="mr-1">
                      {rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉'}
                    </span>
                  )}
                  #{rank}
                </div>
                {showTrend && (
                  <div className="flex items-center bg-muted/50 p-1.5 rounded-full">
                    {getTrendIcon(trend)}
                  </div>
                )}
              </div>

              {/* 游戏图片 */}
              <div className="relative w-full aspect-video mb-3 rounded-lg overflow-hidden group">
                <Image
                  src={game.thumbnail || game.images[0] || `https://picsum.photos/seed/${game.slug}/400/300`}
                  alt={game.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="400px"
                />
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Button
                    size="sm"
                    className="bg-white/90 text-black hover:bg-white shadow-lg"
                  >
                    Play Now
                  </Button>
                </div>

                {/* Rating Badge */}
                {game.rating && (
                  <div className="absolute top-2 left-2">
                    <Badge variant="secondary" className="bg-black/80 text-white border-0 shadow-sm">
                      ⭐ {game.rating.toFixed(1)}
                    </Badge>
                  </div>
                )}

                {/* Category Badge */}
                <div className="absolute top-2 right-2">
                  <Badge 
                    variant="outline" 
                    className="text-white border-0 shadow-sm"
                    style={{
                      backgroundColor: categoryColor,
                      color: '#ffffff',
                      textShadow: '0 1px 2px rgba(0,0,0,0.5)'
                    }}
                  >
                    {game.category}
                  </Badge>
                </div>
              </div>

              {/* 游戏信息 */}
              <div className="space-y-2 flex-1 flex flex-col">
                <h3 
                  className="font-semibold text-lg leading-tight text-foreground group-hover:text-primary transition-colors"
                  style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}
                >
                  {game.title}
                </h3>
                
                {/* 游戏标签 */}
                {game.tags && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {game.tags.slice(0, 3).map((tag, tagIndex) => (
                      <Badge
                        key={`${tag}-${tagIndex}`}
                        variant="secondary"
                        className="text-xs px-2 py-0.5"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* 统计信息 */}
                <div className="mt-auto pt-3 border-t border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      {game.popularity && (
                        <span className="flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                          </svg>
                          {game.popularity}k plays
                        </span>
                      )}
                    </div>
                    
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">Rank</div>
                      <div 
                        className="text-sm font-bold"
                        style={{
                          color: rank <= 3 ? categoryColor : 'hsl(var(--foreground))'
                        }}
                      >
                        #{rank}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </PinContainer>
        );
      })}
    </div>
  );

  // 紧凑布局渲染 - 稍微增大
  const renderCompactLayout = () => (
    <div className="space-y-2">
      {displayGames.map((game, index) => {
        const rank = index + 1;
        const trend = getTrend(index);
        const categoryColor = getCategoryColor(game.category);

        return (
          <Link
            key={game.slug}
            href={`/game/${game.slug}`}
            className="block"
          >
            <div 
              className="group p-4 rounded-md border hover:bg-accent/10 transition-all duration-300 cursor-pointer"
              style={{
                borderRadius: 'var(--radius)',
                boxShadow: 'var(--shadow-xs)',
                borderLeft: `3px solid ${categoryColor}`,
                transition: 'all 0.3s ease',
              }}
            >
              <div className="flex items-center gap-4">
                {/* 排名 */}
                <div className="flex-shrink-0 w-10 text-center">
                  <span className="text-base font-bold" style={{ color: rank <= 3 ? categoryColor : undefined }}>
                    #{rank}
                  </span>
                </div>

                {/* 趋势 */}
                {showTrend && (
                  <div className="flex-shrink-0 w-6">
                    {getTrendIcon(trend)}
                  </div>
                )}

                {/* 游戏图片 */}
                <div 
                  className="relative w-12 h-12 flex-shrink-0 rounded overflow-hidden"
                  style={{
                    boxShadow: 'var(--shadow-xs)',
                  }}
                >
                  <Image
                    src={game.thumbnail || game.images[0] || `https://picsum.photos/seed/${game.slug}/48/48`}
                    alt={game.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="48px"
                  />
                </div>

                {/* 游戏信息 */}
                <div className="flex-1 min-w-0">
                  <h3 
                    className="font-medium text-base transition-colors truncate"
                    style={{
                      color: rank <= 3 ? categoryColor : undefined
                    }}
                  >
                    {game.title}
                  </h3>
                  
                  <div className="flex items-center gap-2 mt-1">
                    <Badge 
                      className="text-xs font-medium text-white"
                      style={{
                        backgroundColor: categoryColor,
                        fontSize: '11px',
                        padding: '2px 6px'
                      }}
                    >
                      {game.category}
                    </Badge>
                    
                    {game.rating && (
                      <Badge 
                        variant="outline" 
                        className="text-xs font-medium"
                        style={{
                          borderColor: rank <= 3 ? categoryColor : undefined,
                          fontSize: '11px',
                          padding: '2px 6px'
                        }}
                      >
                        ⭐ {game.rating.toFixed(1)}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* 统计信息 */}
                {showStats && game.popularity && (
                  <div className="flex-shrink-0 text-right">
                    <div 
                      className="text-base font-medium"
                      style={{
                        color: rank <= 3 ? categoryColor : undefined,
                      }}
                    >
                      {game.popularity}k
                    </div>
                    <div className="text-xs text-muted-foreground">
                      plays
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );

  // 列表布局渲染
  const renderListLayout = () => (
    <div className="space-y-2">
      {displayGames.map((game, index) => {
          const rank = index + 1;
          const trend = getTrend(index);
          const categoryColor = getCategoryColor(game.category);

          return (
            <Link
              key={game.slug}
              href={`/game/${game.slug}`}
              className="block"
            >
              <div 
                className={`group p-4 rounded-lg border hover:bg-accent/10 transition-all duration-300 cursor-pointer`}
                style={{
                  borderRadius: 'var(--radius-card)',
                  boxShadow: 'var(--shadow-sm)',
                  borderLeft: `4px solid ${categoryColor}`,
                  transition: 'all 0.3s ease',
                }}
              >
                <div className="flex items-center gap-4">
                  {/* Rank */}
                  <div className="flex-shrink-0 w-16 flex items-center justify-center">
                    {getRankBadge(rank)}
                  </div>

                  {/* Trend Indicator */}
                  {showTrend && (
                    <div className="flex-shrink-0 w-8 flex items-center justify-center">
                      {getTrendIcon(trend)}
                    </div>
                  )}

                  {/* Game Image */}
                  <div 
                    className="relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0 rounded-lg overflow-hidden"
                    style={{
                      boxShadow: 'var(--shadow-sm)',
                    }}
                  >
                    <Image
                      src={game.thumbnail || game.images[0] || `https://picsum.photos/seed/${game.slug}/80/80`}
                      alt={game.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="80px"
                    />
                  </div>

                  {/* Game Info */}
                  <div className="flex-1 min-w-0">
                    <h3 
                      className="font-semibold text-lg transition-colors truncate"
                      style={{
                        color: rank <= 3 ? categoryColor : undefined
                      }}
                    >
                      {game.title}
                    </h3>
                    
                    <div className="flex items-center gap-2 mt-1">
                      <Badge 
                        className="text-xs font-medium text-white"
                        style={{
                          backgroundColor: categoryColor,
                          boxShadow: 'var(--shadow-sm)'
                        }}
                      >
                        {game.category}
                      </Badge>
                      
                      {game.rating && (
                        <Badge 
                          variant="outline" 
                          className="text-xs font-medium"
                          style={{
                            borderColor: rank <= 3 ? categoryColor : undefined
                          }}
                        >
                          ⭐ {game.rating.toFixed(1)}
                        </Badge>
                      )}
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {game.tags?.slice(0, 3).map((tag, tagIndex) => (
                        <Badge
                          key={`${tag}-${tagIndex}`}
                          variant="secondary"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Stats */}
                  {showStats && (
                    <div className="flex-shrink-0 text-right">
                      {game.popularity && (
                        <div 
                          className="text-sm font-medium"
                          style={{
                            color: rank <= 3 ? categoryColor : undefined,
                          }}
                        >
                          {game.popularity}k
                        </div>
                      )}
                      <div className="text-xs text-muted-foreground">
                        plays
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    );

  return (
    <div className={cn('space-y-4', className)} {...props}>
      {title && (
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold">{title}</h2>
        </div>
      )}

      {/* 根据layout类型渲染不同布局 */}
      {layout === 'grid' && renderGridLayout()}
      {layout === 'compact' && renderCompactLayout()}
      {layout === 'list' && renderListLayout()}

      {games.length > maxItems && (
        <div className="text-center pt-6">
          <Button variant="outline" size="lg" asChild>
            <Link href="/games?sort=popular">
              View All Rankings
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}

export default RankingList; 