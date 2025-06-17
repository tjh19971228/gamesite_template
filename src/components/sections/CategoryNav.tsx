'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { GameCategory } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface CategoryNavProps {
  categories: GameCategory[];
  title?: string;
  showCounts?: boolean;
  layout?: 'horizontal' | 'grid' | 'list';
  showAllButton?: boolean;
  maxVisible?: number;
  className?: string;
}

/**
 * Category Navigation Component
 * 分类导航组件 - 游戏分类展示和导航
 */
export function CategoryNav({
  categories,
  title,
  showCounts = true,
  layout = 'grid',
  showAllButton = true,
  maxVisible = 8,
  className,
  ...props
}: CategoryNavProps) {
  const [showAll, setShowAll] = useState(false);
  
  const displayCategories = showAll ? categories : categories.slice(0, maxVisible);

  const getCategoryIcon = (slug: string) => {
    const iconMap: Record<string, React.ReactElement> = {
      action: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      adventure: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      puzzle: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
        </svg>
      ),
      sports: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      racing: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      strategy: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      default: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      ),
    };
    
    return iconMap[slug] || iconMap.default;
  };

  const getLayoutClasses = () => {
    switch (layout) {
      case 'horizontal':
        return 'flex flex-wrap gap-2 justify-center';
      case 'list':
        return 'flex flex-col space-y-2';
      case 'grid':
      default:
        return 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-4';
    }
  };

  const getCategoryCard = (category: GameCategory) => {
    if (layout === 'horizontal') {
      return (
        <Link
          key={category.id}
          href={`/category/${category.slug}`}
          className="group"
        >
          <Button
            size="sm"
            className="h-auto px-4 py-2 flex items-center gap-2 transition-colors cursor-pointer"
            style={{
              backgroundColor: category.color || '#6B7280',
              color: 'white',
              border: 'none'
            }}
          >
            {getCategoryIcon(category.slug)}
            <span>{category.name}</span>
            {showCounts && category.count && category.count > 0 && (
              <Badge 
                variant="secondary" 
                className="ml-1 text-xs"
                style={{
                  backgroundColor: category.color || '#6366f1',
                  color: '#ffffff',
                  textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                }}
              >
                {category.count}
              </Badge>
            )}
          </Button>
        </Link>
      );
    }

    if (layout === 'list') {
      return (
        <Link
          key={category.id}
          href={`/category/${category.slug}`}
          className="group"
        >
          <div className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                {getCategoryIcon(category.slug)}
              </div>
              <div>
                <h3 className="font-medium">{category.name}</h3>
                {category.description && (
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                )}
              </div>
            </div>
            {showCounts && (
              <Badge 
                variant="outline"
                style={{
                  backgroundColor: category.count && category.count > 0 
                    ? category.color || '#6B7280'
                    : 'rgba(0, 0, 0, 0.7)',
                  color: '#ffffff',
                  textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                  border: 'none'
                }}
              >
                {category.count && category.count > 0 ? `${category.count} games` : 'coming soon'}
              </Badge>
            )}
          </div>
        </Link>
      );
    }

    // Grid layout (default)
    return (
      <Link
        key={category.id}
        href={`/category/${category.slug}`}
        className="group block"
      >
        <div 
          className="relative p-6 rounded-xl border-2 bg-card hover:bg-accent/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          style={{
            borderRadius: 'var(--radius-xl)',
            boxShadow: 'var(--shadow-card)',
            borderColor: category.color || '#6B7280',
            borderWidth: '2px',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
            height: '100%'
          }}
        >
          {/* Background Pattern */}
          <div 
            className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity" 
            style={{
              backgroundImage: `radial-gradient(circle, ${category.color || '#6B7280'} 1px, transparent 1px)`,
              backgroundSize: '20px 20px',
              backgroundPosition: 'center'
            }}
          />
          
          <div className="relative z-10 text-center">
            {/* Icon */}
            <div 
              className={`inline-flex items-center justify-center w-16 h-16 rounded-full transition-colors mb-4 border-2`}
              style={{
                backgroundColor: `${category.color || '#6B7280'}20`,
                color: category.color || '#6B7280',
                borderColor: category.color || '#6B7280',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              {getCategoryIcon(category.slug)}
            </div>
            
            {/* Title */}
            <h3 
              className={`font-semibold text-lg mb-2 transition-colors`}
              style={{ color: category.color || '#6B7280' }}
            >
              {category.name}
            </h3>
            
            {/* Description */}
            {category.description && (
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {category.description}
              </p>
            )}
            
            {/* Game Count */}
            {showCounts && (
              <Badge 
                className="text-xs font-bold px-3 py-1"
                style={{
                  backgroundColor: category.count && category.count > 0 
                    ? category.color || '#6B7280'
                    : 'rgba(0, 0, 0, 0.7)',
                  color: '#ffffff',
                  textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                  boxShadow: 'var(--shadow-md)',
                  borderRadius: 'var(--radius-full)'
                }}
              >
                {category.count && category.count > 0 ? `${category.count} games` : 'coming soon'}
              </Badge>
            )}
          </div>
        </div>
      </Link>
    );
  };

  return (
    <div className={cn('space-y-6', className)} {...props}>
      {title && (
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">{title}</h2>
          <p className="text-muted-foreground">
            Discover games by category
          </p>
        </div>
      )}

      <div className={getLayoutClasses()}>
        {displayCategories.map((category) => getCategoryCard(category))}
      </div>

      {/* Show More Button */}
      {showAllButton && categories.length > maxVisible && (
        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => setShowAll(!showAll)}
            className="min-w-32"
          >
            {showAll ? 'Show Less' : `Show All (${categories.length})`}
          </Button>
        </div>
      )}
    </div>
  );
}

export default CategoryNav; 