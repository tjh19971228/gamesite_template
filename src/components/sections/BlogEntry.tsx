'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { BlogPost } from '@/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface BlogEntryProps {
  posts: BlogPost[];
  title?: string;
  subtitle?: string;
  maxPosts?: number;
  layout?: 'grid' | 'list' | 'featured';
  showAuthor?: boolean;
  showDate?: boolean;
  showExcerpt?: boolean;
  showReadTime?: boolean;
  className?: string;
}

/**
 * Blog Entry Component
 * 博客入口组件 - 显示博客文章和入口链接
 */
export function BlogEntry({
  posts,
  title = "Latest Gaming News",
  subtitle,
  maxPosts = 6,
  layout = 'grid',
  showAuthor = true,
  showDate = true,
  showExcerpt = true,
  showReadTime = false,
  className,
  ...props
}: BlogEntryProps) {
  const displayPosts = posts.slice(0, maxPosts);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getLayoutClasses = () => {
    switch (layout) {
      case 'list':
        return 'space-y-6';
      case 'featured':
        return 'grid grid-cols-1 lg:grid-cols-3 gap-6';
      case 'grid':
      default:
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';
    }
  };

  const renderPost = (post: BlogPost, index: number) => {
    const isFeaturePost = layout === 'featured' && index === 0;
    
    if (layout === 'list') {
      return (
        <Link
          key={post.id}
          href={`/blog/${post.slug}`}
          className="group block"
        >
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <div className="flex gap-6 p-6">
              {/* Image - 固定尺寸，不形变 */}
              <div className="relative w-48 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                <Image
                  src={post.featuredImage || `https://picsum.photos/seed/${post.slug}/300/200`}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="192px"
                />
              </div>
              
              {/* Content - 固定高度 */}
              <div className="flex-1 space-y-3 min-h-[128px] flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{post.category}</Badge>
                    {showDate && (
                      <span className="text-sm text-muted-foreground">
                        {formatDate(post.publishedAt)}
                      </span>
                    )}
                    {showReadTime && post.readTime && (
                      <span className="text-sm text-muted-foreground">
                        • {post.readTime} min read
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-semibold group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  
                  {showExcerpt && (
                    <p className="text-muted-foreground line-clamp-2">
                      {post.excerpt}
                    </p>
                  )}
                </div>
                
                {showAuthor && (
                  <div className="flex items-center gap-2 mt-auto">
                    <div className="relative w-6 h-6 rounded-full overflow-hidden bg-muted">
                      <Image
                        src={post.author.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author.name)}&background=random`}
                        alt={post.author.name}
                        fill
                        className="object-cover"
                        sizes="24px"
                      />
                    </div>
                    <span className="text-sm text-muted-foreground">
                      by {post.author.name}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </Link>
      );
    }

    return (
      <Link
        key={post.id}
        href={`/blog/${post.slug}`}
        className={cn(
          'group block h-full',
          isFeaturePost && 'lg:col-span-2'
        )}
      >
        <Card className="h-full hover:shadow-lg transition-shadow duration-300 flex flex-col">
          {/* Image - 固定宽高比，不形变 */}
          <div className={cn(
            'relative overflow-hidden bg-muted flex-shrink-0',
            isFeaturePost ? 'h-[300px]' : 'h-[200px]'
          )}>
            <Image
              src={post.featuredImage || `https://picsum.photos/seed/${post.slug}/600/400`}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes={isFeaturePost ? '(min-width: 1024px) 66vw, 100vw' : '(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw'}
            />
            
            {/* Category Badge */}
            <div className="absolute top-4 left-4">
              <Badge 
                className="text-white border-0"
                style={{
                  backgroundColor: post.category === 'News' 
                    ? 'rgb(var(--color-primary-500))' 
                    : post.category === 'Reviews' 
                    ? 'rgb(var(--color-accent-500))' 
                    : post.category === 'Guides' 
                    ? 'rgb(var(--color-success-500))' 
                    : post.category === 'Industry' 
                    ? 'rgb(var(--color-secondary-500))'
                    : 'rgb(var(--color-primary-700))',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                {post.category}
              </Badge>
            </div>
          </div>

          {/* Content - 填充剩余空间 */}
          <div className="flex-1 flex flex-col">
            <CardHeader className="space-y-3 flex-shrink-0">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {showDate && (
                  <span>{formatDate(post.publishedAt)}</span>
                )}
                {showReadTime && post.readTime && (
                  <>
                    <span>•</span>
                    <span>{post.readTime} min read</span>
                  </>
                )}
              </div>
              
              <h3 className={cn(
                'font-semibold group-hover:text-primary transition-colors line-clamp-2',
                isFeaturePost ? 'text-2xl' : 'text-lg'
              )}>
                {post.title}
              </h3>
            </CardHeader>

            <CardContent className="pt-0 flex-1 flex flex-col justify-between">
              {showExcerpt && (
                <p className={cn(
                  'text-muted-foreground mb-4 flex-1',
                  isFeaturePost ? 'line-clamp-3' : 'line-clamp-2'
                )}>
                  {post.excerpt}
                </p>
              )}
              
              {showAuthor && (
                <div className="flex items-center gap-3 mt-auto">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden bg-muted flex-shrink-0">
                    <Image
                      src={post.author.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author.name)}&background=random`}
                      alt={post.author.name}
                      fill
                      className="object-cover"
                      sizes="32px"
                    />
                  </div>
                  <div className="text-sm min-w-0">
                    <p className="font-medium truncate">{post.author.name}</p>
                    {post.author.bio && (
                      <p className="text-muted-foreground line-clamp-1">
                        {post.author.bio}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </div>
        </Card>
      </Link>
    );
  };

  return (
    <div className={cn('space-y-8', className)} {...props}>
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl md:text-4xl font-bold">{title}</h2>
        {subtitle && (
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
      </div>

      {/* Posts Grid/List */}
      {displayPosts.length > 0 ? (
        <div className={getLayoutClasses()}>
          {displayPosts.map((post, index) => renderPost(post, index))}
        </div>
      ) : (
        <div className="text-center py-12">
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
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              No articles yet
            </h3>
            <p className="text-muted-foreground">
              Check back soon for the latest gaming news and updates.
            </p>
          </div>
        </div>
      )}

      {/* View All Button */}
      {posts.length > maxPosts && (
        <div className="text-center">
          <Link href="/blog">
            <Button size="lg" variant="outline">
              View All Articles
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default BlogEntry; 