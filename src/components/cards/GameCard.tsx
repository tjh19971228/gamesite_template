'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { GameCardProps } from '@/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getAllCategories } from '@/lib/data';

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
  // 获取分类颜色配置
  const categories = getAllCategories();
  const categoryData = categories.find(cat => cat.name === game.category);
  const categoryColor = categoryData?.color || '#6B7280';

  // Focus cards 悬停状态
  const [hovered, setHovered] = useState(false);

  // Focus Cards 样式的组件 (用于 grid 布局)
  if (layout === 'grid') {
    const focusCardContent = (
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={cn(
          "rounded-lg relative bg-gray-100 dark:bg-neutral-900 overflow-hidden aspect-[3/4] w-full transition-all duration-300 ease-out group cursor-pointer",
          className
        )}
        {...props}
      >
        <Image
          src={game.thumbnail || game.images[0] || `https://picsum.photos/seed/${game.slug}/400/300`}
          alt={game.title}
          fill
          className="object-cover"
          priority={priority}
          sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        />
        
        {/* Category Badge */}
        <div className="absolute top-4 right-4 z-10">
          <Badge 
            variant="outline" 
            className="text-white border-0 backdrop-blur-sm"
            style={{
              backgroundColor: `${categoryColor}CC`,
              color: '#ffffff',
            }}
          >
            {game.category}
          </Badge>
        </div>

        {/* Rating Badge */}
        {showRating && game.rating && (
          <div className="absolute top-4 left-4 z-10">
            <Badge variant="secondary" className="bg-black/80 text-white border-0 backdrop-blur-sm">
              ⭐ {game.rating.toFixed(1)}
            </Badge>
          </div>
        )}

        {/* Hover Overlay */}
        <div
          className={cn(
            "absolute inset-0 bg-black/50 flex flex-col justify-end transition-opacity duration-300",
            "p-2 sm:p-4 md:p-6", // 响应式内边距
            hovered ? "opacity-100" : "opacity-0"
          )}
        >
          {/* 标题 - 移动端更小 */}
          <div className="text-sm sm:text-lg md:text-xl font-medium bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-200 mb-1 sm:mb-2 md:mb-3 line-clamp-2">
            {game.title}
          </div>
          
          {/* Tags - 移动端只显示1个 */}
          {showTags && game.tags && game.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2 sm:mb-3 md:mb-4">
              {/* 只显示第一个tag */}
              <Badge
                variant="secondary"
                className="text-xs px-1.5 py-0.5 bg-white/20 text-white border-0"
              >
                {game.tags[0]}
              </Badge>
              
              {/* 移动端隐藏额外的tags，桌面端显示 */}
              <div className="hidden sm:flex flex-wrap gap-1">
                {game.tags.slice(1, 3).map((tag, index) => (
                  <Badge
                    key={`${tag}-${index + 1}`}
                    variant="secondary"
                    className="text-xs px-1.5 py-0.5 bg-white/20 text-white border-0"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
              
              {/* 显示剩余数量 */}
              {game.tags.length > 3 && (
                <Badge variant="outline" className="hidden sm:inline-flex text-xs px-1.5 py-0.5 bg-white/20 text-white border-white/30">
                  +{game.tags.length - 3}
                </Badge>
              )}
              {game.tags.length > 1 && (
                <Badge variant="outline" className="sm:hidden text-xs px-1.5 py-0.5 bg-white/20 text-white border-white/30">
                  +{game.tags.length - 1}
                </Badge>
              )}
            </div>
          )}

          {/* Game Stats - 移动端隐藏 */}
          <div className="hidden sm:flex items-center gap-4 text-sm text-white/80 mb-4">
            {game.popularity && (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          </div>

          {/* Play Button - 移动端更小 */}
          <Button 
            className="bg-white/90 text-black hover:bg-white w-full h-8 sm:h-10 text-xs sm:text-sm" 
            size="sm"
          >
            Play Now
          </Button>
        </div>
      </div>
    );

    if (clickable && game.slug) {
      return (
        <Link href={`/game/${game.slug}`} className="block">
          {focusCardContent}
        </Link>
      );
    }

    return focusCardContent;
  }

  // 原有的其他布局样式
  const cardContent = (
    <Card
      className={cn(
        'group transition-all duration-300',
        clickable && 'cursor-pointer',
        layout === 'list' && 'flex flex-row items-center hover:bg-muted/50',
        layout === 'card' && 'border-0 shadow-lg hover:shadow-xl',
        layout === 'featured' && 'border-2 border-gradient-to-r from-yellow-400/20 to-orange-500/20 shadow-xl hover:shadow-2xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900',
        className
      )}
      style={{
        boxShadow: layout === 'card' 
          ? '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' 
          : layout === 'featured' 
            ? '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' 
            : 'var(--shadow-card)',
        transition: layout === 'list' 
          ? 'background-color 0.3s ease, border-color 0.3s ease'
          : 'transform 0.3s ease, box-shadow 0.3s ease',
        ...(clickable && layout !== 'list' && {
          transform: 'translateY(0)',
          ':hover': {
            transform: layout === 'card' 
              ? 'translateY(-8px)' 
              : layout === 'featured' 
                ? 'translateY(-6px)' 
                : 'translateY(-4px)',
            boxShadow: layout === 'card' 
              ? '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' 
              : layout === 'featured' 
                ? '0 25px 50px -12px rgb(0 0 0 / 0.25)' 
                : 'var(--shadow-lg)'
          }
        })
      }}
      {...props}
    >
      {/* Game Image */}
      <div className={cn(
        'relative overflow-hidden',
        layout === ('grid' as string) && 'aspect-video',
        layout === ('list' as string) && 'w-48 h-32 flex-shrink-0',
        layout === ('featured' as string) && 'aspect-[4/3]',
        layout === ('card' as string) && 'aspect-video rounded-t-lg'
      )}>
        <Image
          src={game.thumbnail || game.images[0] || `https://picsum.photos/seed/${game.slug}/400/300`}
          alt={game.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          priority={priority}
          sizes={layout === 'list' ? '192px' : '(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw'}
        />
        
        {/* Play Button Overlay - 只在非 list 和 grid 布局显示 */}
        {(layout === 'featured' || layout === 'card') && (
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <Button
              size="sm"
              className="bg-white/90 text-black hover:bg-white shadow-lg"
            >
              Play Now
            </Button>
          </div>
        )}

        {/* Rating Badge */}
        {showRating && game.rating && (
          <div className={cn(
            "absolute top-2",
            layout === 'featured' ? 'left-2 top-12' : 'left-2'
          )}>
            <Badge variant="secondary" className="bg-black/80 text-white border-0">
              ⭐ {game.rating.toFixed(1)}
            </Badge>
          </div>
        )}

        {/* Category Badge */}
        <div className="absolute top-2 right-2">
          <Badge 
            variant="outline" 
            className="text-white border-0"
            style={{
              backgroundColor: categoryColor,
              color: '#ffffff',
              textShadow: '0 1px 2px rgba(0,0,0,0.5)', /* 添加文字阴影增加对比度 */
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            {game.category}
          </Badge>
        </div>

        {/* Featured Badge */}
        {layout === 'featured' && (
          <div className="absolute top-2 left-2 z-10">
            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black border-0 shadow-lg">
              ⭐ Featured
            </Badge>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className={cn(
        'flex flex-col',
        layout === 'list' && 'flex-1'
      )}>
        <CardHeader className={cn(
          'pb-2',
          layout === 'list' && 'pb-1',
          layout === 'card' && 'pb-3 pt-4'
        )}>
          <h3 className={cn(
            'font-semibold line-clamp-2 group-hover:text-primary transition-colors',
            layout === ('grid' as string) ? 'text-lg' : '',
            layout === ('list' as string) ? 'text-xl' : '',
            layout === ('featured' as string) ? 'text-xl' : '',
            layout === ('card' as string) ? 'text-xl font-bold' : ''
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
          layout === 'list' && 'py-0',
          layout === 'card' && 'px-4 pb-6'
        )}>
          {/* Tags */}
          {showTags && game.tags && game.tags.length > 0 && (
            <div className={cn(
              "flex flex-wrap gap-1 mb-2",
              layout === 'card' && "mb-3"
            )}>
              {game.tags.slice(0, layout === 'list' ? 4 : (layout === 'card' ? 4 : 3)).map((tag, index) => (
                <Badge
                  key={`${tag}-${index}`}
                  variant="secondary"
                  className={cn(
                    "text-xs px-2 py-0.5",
                    layout === 'card' && "px-3 py-1 text-xs font-medium"
                  )}
                  style={{
                    color: '#ffffff',
                    textShadow: '0 1px 2px rgba(0,0,0,0.5)' /* 添加文字阴影增加对比度 */
                  }}
                >
                  {tag}
                </Badge>
              ))}
              {game.tags.length > (layout === 'list' ? 4 : (layout === 'card' ? 4 : 3)) && (
                <Badge variant="outline" className="text-xs px-2 py-0.5">
                  +{game.tags.length - (layout === 'list' ? 4 : (layout === 'card' ? 4 : 3))}
                </Badge>
              )}
            </div>
          )}

          {/* Game Stats */}
          <div className={cn(
            "flex items-center gap-4 text-xs text-muted-foreground",
            layout === 'card' && "text-sm"
          )}>
            {game.popularity && (
              <span className="flex items-center gap-1">
                <svg className={cn(
                  "w-3 h-3",
                  layout === 'card' && "w-4 h-4"
                )} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <Button className="w-full" size="sm" variant="default">
              Play Game
            </Button>
          </CardFooter>
        )}
      </div>

      {/* Play Now Button for List Layout */}
      {layout === 'list' && (
        <div className="flex items-center px-4">
          <Button 
            size="sm" 
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Play Now
          </Button>
        </div>
      )}
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