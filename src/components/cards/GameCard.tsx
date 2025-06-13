'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { GameCardProps } from '@/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

/**
 * Game Card Component
 * 游戏卡片组件 - 可复用的游戏展示卡片
 */
export function GameCard({
  game,
  layout = 'grid',
  showTags = true,
  showRating = true,
  showDescription = false,
  clickable = true,
  priority = false,
  className,
  ...props
}: GameCardProps) {
  const cardContent = (
    <Card
      className={cn(
        'group transition-all duration-300',
        clickable && 'cursor-pointer',
        layout === 'list' && 'flex flex-row',
        className
      )}
      style={{
        boxShadow: 'var(--shadow-card)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        ...(clickable && {
          transform: 'translateY(0)',
          ':hover': {
            transform: 'translateY(-4px)',
            boxShadow: 'var(--shadow-lg)'
          }
        })
      }}
      {...props}
    >
      {/* Game Image */}
      <div className={cn(
        'relative overflow-hidden',
        layout === 'grid' && 'aspect-video',
        layout === 'list' && 'w-48 flex-shrink-0',
        layout === 'featured' && 'aspect-[4/3]'
      )}>
        <Image
          src={game.thumbnail || game.images[0] || `https://picsum.photos/seed/${game.slug}/400/300`}
          alt={game.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          priority={priority}
          sizes={layout === 'list' ? '192px' : '(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw'}
        />
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Button
            size="sm"
            className="bg-white/90 text-black hover:bg-white shadow-lg"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m6-7a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Play Now
          </Button>
        </div>

        {/* Rating Badge */}
        {showRating && game.rating && (
          <div className="absolute top-2 left-2">
            <Badge variant="secondary" className="bg-black/80 text-white border-0">
              ⭐ {game.rating.toFixed(1)}
            </Badge>
          </div>
        )}

        {/* Category Badge */}
        <div className="absolute top-2 right-2">
          <Badge 
            variant="outline" 
            className={`bg-game-${game.category.toLowerCase()} text-white border-0`}
            style={{
              backgroundColor: game.category && `var(--color-game-${game.category.toLowerCase()})`,
              color: '#ffffff',
              textShadow: '0 1px 2px rgba(0,0,0,0.5)', /* 添加文字阴影增加对比度 */
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            {game.category}
          </Badge>
        </div>
      </div>

      {/* Card Content */}
      <div className={cn(
        'flex flex-col',
        layout === 'list' && 'flex-1'
      )}>
        <CardHeader className={cn(
          'pb-2',
          layout === 'list' && 'pb-1'
        )}>
          <h3 className={cn(
            'font-semibold line-clamp-2 group-hover:text-primary transition-colors',
            layout === 'grid' && 'text-lg',
            layout === 'list' && 'text-xl',
            layout === 'featured' && 'text-xl'
          )}>
            {game.title}
          </h3>
          
          {showDescription && game.shortDescription && (
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {game.shortDescription}
            </p>
          )}
        </CardHeader>

        <CardContent className={cn(
          'flex-1',
          layout === 'list' && 'py-0'
        )}>
          {/* Tags */}
          {showTags && game.tags && game.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {game.tags.slice(0, layout === 'list' ? 4 : 3).map((tag, index) => (
                <Badge
                  key={`${tag}-${index}`}
                  variant="secondary"
                  className="text-xs px-2 py-0.5"
                  style={{
                    color: '#ffffff',
                    textShadow: '0 1px 2px rgba(0,0,0,0.5)' /* 添加文字阴影增加对比度 */
                  }}
                >
                  {tag}
                </Badge>
              ))}
              {game.tags.length > (layout === 'list' ? 4 : 3) && (
                <Badge variant="outline" className="text-xs px-2 py-0.5">
                  +{game.tags.length - (layout === 'list' ? 4 : 3)}
                </Badge>
              )}
            </div>
          )}

          {/* Game Stats */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            {game.popularity && (
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                {game.popularity}k plays
              </span>
            )}
            
            {game.releaseDate && (
              <span>
                {new Date(game.releaseDate).getFullYear()}
              </span>
            )}
            
            {game.developer && (
              <span className="truncate">
                {game.developer}
              </span>
            )}
          </div>
        </CardContent>

        {layout === 'featured' && (
          <CardFooter className="pt-2">
            <Button className="w-full" size="sm">
              Play Game
            </Button>
          </CardFooter>
        )}
      </div>
    </Card>
  );

  // If clickable, wrap in Link
  if (clickable && game.slug) {
    return (
      <Link href={`/game/${game.slug}`} className="block">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}

export default GameCard; 