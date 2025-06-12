'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { GameGridProps } from '@/types';
import { GameCard } from '@/components/cards/GameCard';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Game Grid Component
 * 游戏网格容器组件 - 可复用的游戏列表展示
 */
export function GameGrid({
  games,
  columns = 4,
  gap = '6',
  loading = false,
  emptyMessage = "No games found",
  className,
  ...props
}: GameGridProps) {
  // Grid column classes based on column count
  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    5: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
    6: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6',
  };

  const gapClasses = {
    '2': 'gap-2',
    '3': 'gap-3',
    '4': 'gap-4',
    '6': 'gap-6',
    '8': 'gap-8',
  };

  // Loading skeleton
  if (loading) {
    return (
      <div
        className={cn(
          'grid',
          gridClasses[columns as keyof typeof gridClasses] || gridClasses[4],
          gapClasses[gap as keyof typeof gapClasses] || gapClasses['6'],
          className
        )}
        {...props}
      >
        {Array.from({ length: columns * 2 }).map((_, index) => (
          <div key={index} className="space-y-4">
            <Skeleton className="aspect-video w-full rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Empty state
  if (!games || games.length === 0) {
    return (
      <div className={cn('text-center py-12', className)} {...props}>
        <div className="max-w-sm mx-auto">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <svg
              className="w-10 h-10 text-muted-foreground"
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
          <h3 className="text-lg font-medium text-foreground mb-2">
            {emptyMessage}
          </h3>
          <p className="text-muted-foreground">
            Try adjusting your search or browse our categories.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'grid',
        gridClasses[columns as keyof typeof gridClasses] || gridClasses[4],
        gapClasses[gap as keyof typeof gapClasses] || gapClasses['6'],
        className
      )}
      {...props}
    >
      {games.map((game, index) => (
        <GameCard
          key={game.id}
          game={game}
          layout="grid"
          showTags
          showRating
          clickable
          priority={index < 4} // Priority loading for first 4 images
          className="h-full"
        />
      ))}
    </div>
  );
}

export default GameGrid; 