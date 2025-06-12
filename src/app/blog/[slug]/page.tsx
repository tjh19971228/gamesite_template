import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Layout } from '@/components/layout';
import { BlogEntry } from '@/components/sections/BlogEntry';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { 
  getBlogPostBySlug,
  getAllBlogPosts,
  getRecentBlogPosts
} from '@/lib/data';
import { getBlogPostDetailStructure } from '@/lib/config';
import { SchemaOrg } from '@/components/SchemaOrg';
import { getBlogPostSchema } from '@/lib/schema';
import { BlogPostDetailStructure } from '@/types';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * Generate metadata for blog post page
 */
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  // 确保params已被解析
  const resolvedParams = await params;
  const post = getBlogPostBySlug(resolvedParams.slug);
  
  if (!post) {
    return {
      title: 'Post Not Found - Blog',
      description: 'The requested blog post could not be found.',
    };
  }

  return {
    title: `${post.title} | GameSite Blog`,
    description: post.excerpt || `Read ${post.title} on GameSite Blog`,
    keywords: [post.title, ...post.tags, post.category, 'gaming blog'],
    authors: [{ name: post.author.name }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.featuredImage ? [post.featuredImage] : [],
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.author.name],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: post.featuredImage ? [post.featuredImage] : [],
    },
  };
}

/**
 * Generate static params for all blog posts
 */
export async function generateStaticParams() {
  return getAllBlogPosts().map((post) => ({
    slug: post.slug,
  }));
}

// 自定义链接渲染器
const CustomLink = (props: React.ComponentPropsWithoutRef<'a'>) => {
  const { href, children, ...rest } = props;
  
  if (!href) return <a {...rest}>{children}</a>;
  
  const isExternal = href.startsWith('http');
  
  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center" {...rest}>
        {children}
        <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </a>
    );
  }
  
  return <Link href={href} {...rest}>{children}</Link>;
};

/**
 * Blog Post Detail Page
 * 博客文章详情页面
 */
export default async function BlogPostPage({ params }: BlogPostPageProps) {
  // 确保params已被解析
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const post = getBlogPostBySlug(slug);
  
  if (!post) {
    notFound();
  }

  // Get related posts (same category, excluding current post)
  const relatedPosts = getAllBlogPosts()
    .filter(p => p.category === post.category && p.id !== post.id)
    .slice(0, 3);
  
  // Get recent posts as fallback
  const recentPosts = relatedPosts.length > 0 ? relatedPosts : getRecentBlogPosts(3);

  const publishedDate = new Date(post.publishedAt);
  const readingTime = post.readTime || 5;
  
  // 获取博客文章详情页面结构配置
  const config: BlogPostDetailStructure = await getBlogPostDetailStructure();

  // 获取博客文章结构化数据
  const schemaData = await getBlogPostSchema(post as Record<string, unknown>);

  return (
    <>
      {/* 添加结构化数据 */}
      <SchemaOrg data={schemaData} />
      
      <Layout>
        {/* Article Header */}
        {config.sections.pageHeader?.enabled && (
          <div className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white py-12">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                {/* Category Badge */}
                {config.sections.pageHeader.showCategory && (
                  <div className="mb-4">
                    <Badge variant="secondary" className="bg-white/20 text-white text-sm">
                      {post.category}
                    </Badge>
                  </div>
                )}
                
                {/* Title */}
                {config.sections.pageHeader.showTitle && (
                  <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                    {post.title}
                  </h1>
                )}
                
                {/* Excerpt */}
                {config.sections.pageHeader.showExcerpt && (
                  <p className="text-xl opacity-90 mb-8 leading-relaxed">
                    {post.excerpt}
                  </p>
                )}
                
                {/* Meta Information */}
                {config.sections.pageHeader.showMeta && (
                  <div className="flex flex-wrap items-center gap-6 text-sm">
                    {/* Author */}
                    {config.sections.pageHeader.showAuthor && (
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border-2 border-white/20">
                          <AvatarImage src={post.author.avatar} alt={post.author.name} />
                          <AvatarFallback className="bg-white/20 text-white">
                            {post.author.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{post.author.name}</div>
                          <div className="opacity-75">{post.author.role}</div>
                        </div>
                      </div>
                    )}
                    
                    {/* Published Date */}
                    {config.sections.pageHeader.showDate && (
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{publishedDate.toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}</span>
                      </div>
                    )}
                    
                    {/* Reading Time */}
                    {config.sections.pageHeader.showReadTime && (
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{readingTime} min read</span>
                      </div>
                    )}
                    
                    {/* Tags */}
                    {config.sections.pageHeader.showTags && post.tags.length > 0 && (
                      <div className="flex items-center gap-2">
                        <span>🏷️</span>
                        <div className="flex gap-1">
                          {post.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="outline" className="border-white/30 text-white text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Featured Image */}
        {config.sections.featuredImage?.enabled && post.featuredImage && (
          <div className="py-8">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <div className="aspect-video rounded-lg overflow-hidden">
                  <Image
                    src={post.featuredImage}
                    alt={post.title}
                    width={1024}
                    height={576}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Article Content */}
        <div className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="prose prose-lg max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                  components={{
                    a: CustomLink,
                    img: ({ src, alt }) => {
                      if (!src || typeof src !== 'string') return null;
                      return (
                        <Image
                          src={src}
                          alt={alt || ''}
                          width={800}
                          height={450}
                          className="rounded-lg"
                        />
                      );
                    },
                  }}
                >
                  {post.content}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Article Actions */}
        <div className="py-8 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button variant="outline" size="sm">
                    👍 Like ({Math.floor(Math.random() * 20) + 5})
                  </Button>
                  <Button variant="outline" size="sm">
                    💬 Comments ({Math.floor(Math.random() * 10) + 2})
                  </Button>
                  <Button variant="outline" size="sm">
                    📤 Share
                  </Button>
                </div>
                
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">
                    Published: {publishedDate.toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Posts */}
        {config.sections.relatedPosts?.enabled && recentPosts.length > 0 && (
          <div className="py-16">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold mb-4">
                    {config.sections.relatedPosts.title || "Related Articles"}
                  </h2>
                  <p className="text-muted-foreground">
                    Continue reading with these related posts
                  </p>
                </div>

                <BlogEntry
                  posts={recentPosts}
                  layout="grid"
                  maxPosts={config.sections.relatedPosts.maxPosts || 3}
                  showAuthor={config.sections.relatedPosts.showAuthor}
                  showDate={config.sections.relatedPosts.showDate}
                  showExcerpt={config.sections.relatedPosts.showExcerpt}
                />
              </div>
            </div>
          </div>
        )}

        {/* Back to Blog */}
        <div className="py-8 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <Button asChild variant="secondary" size="lg">
                <Link href="/blog">
                  ← Back to Blog
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}

export const dynamic = 'force-static';
export const revalidate = 7200; // 2 hours 