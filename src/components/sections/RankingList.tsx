'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Game } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getAllCategories } from '@/lib/data';

interface RankingListProps {
  games: Game[];
  title?: string;
  showTrend?: boolean;
  showStats?: boolean;
  maxItems?: number;
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

  return (
    <div className={cn('space-y-4', className)} {...props}>
      {title && (
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold">{title}</h2>
        </div>
      )}

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