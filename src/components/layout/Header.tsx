'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { categories } from '@/lib/data';
import { getSiteName, getLogoConfig } from '@/lib/siteConfig';
import { Button } from '@/components/ui/button';  
import { Input } from '@/components/ui/input';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

interface HeaderProps {
  className?: string;
}

/**
 * Header Component
 * 网站头部导航组件
 */
export function Header({ className }: HeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();

  // 从配置文件获取品牌信息
  const siteName = getSiteName();
  const logoConfig = getLogoConfig();

  // 固定的导航菜单结构，动态读取分类数据
  const navigationItems = [
    {
      title: 'Home',
      href: '/',
      description: 'Return to homepage'
    },
    {
      title: 'Games',
      href: '/games',
      description: 'Browse all games',
      children: [
        { title: 'New Games', href: '/games?sort=newest' },
        { title: 'Popular Games', href: '/games?sort=popular' },
        // 动态生成前5个分类的游戏链接
        ...categories.slice(0, 5).map(category => ({
          title: `${category.name} Games`,
          href: `/category/${category.slug}`
        })),
        { title: 'All Games', href: '/games' }
      ]
    },
    {
      title: 'Categories',
      href: '/categories',
      description: 'Browse games by category',
      children: [
        // 动态生成所有分类链接
        ...categories.map(category => ({
          title: category.name,
          href: `/category/${category.slug}`
        })),
        { title: 'All Categories', href: '/categories' }
      ]
    },
    {
      title: 'Blog',
      href: '/blog',
      description: 'Latest gaming news and guides'
    },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const isActiveLink = (href: string) => {
    if (href === '/') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <header className={cn(
      'sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
      className
    )}>
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href={logoConfig.href} className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center overflow-hidden">
            {logoConfig.icon.type === 'image' && logoConfig.icon.src ? (
              <Image
                src={logoConfig.icon.src}
                alt={logoConfig.icon.alt || siteName}
                width={32}
                height={32}
                className={cn("object-contain", logoConfig.icon.className)}
              />
            ) : (
              <svg
                className={cn("text-primary-foreground", logoConfig.icon.fallback?.className || logoConfig.icon.className)}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={logoConfig.icon.fallback?.svg || ''}
                />
              </svg>
            )}
          </div>
          <span className="font-bold text-xl">{siteName}</span>
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            {navigationItems.map((item) => (
              <NavigationMenuItem key={item.href}>
                {item.children ? (
                  <>
                    <NavigationMenuTrigger
                      className={cn(
                        'bg-transparent',
                        isActiveLink(item.href) && 'text-primary'
                      )}
                    >
                      {item.title}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <NavigationMenuLink asChild>
                              <Link
                                href={child.href}
                                className={cn(
                                  'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
                                  isActiveLink(child.href) && 'bg-accent'
                                )}
                              >
                                <div className="text-sm font-medium leading-none">
                                  {child.title}
                                </div>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </>
                ) : (
                  <NavigationMenuLink asChild>
                    <Link 
                      href={item.href}
                      className={cn(
                        'group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50',
                        isActiveLink(item.href) && 'text-primary'
                      )}
                    >
                      {item.title}
                    </Link>
                  </NavigationMenuLink>
                )}
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Search and Actions */}
        <div className="flex items-center space-x-2">
          {/* Theme Toggle */}
          <ThemeToggle />
          
          {/* Search */}
          <div className="hidden sm:block">
            {isSearchOpen ? (
              <form onSubmit={handleSearch} className="flex items-center space-x-2">
                <Input
                  type="search"
                  placeholder="Search games..."
                  className="w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                <Button type="submit" size="sm">
                  Search
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsSearchOpen(false)}
                >
                  Cancel
                </Button>
              </form>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSearchOpen(true)}
                className="w-9 px-0"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <span className="sr-only">Search</span>
              </Button>
            )}
          </div>

          {/* Mobile Navigation */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="md:hidden w-9 px-0"
                size="sm"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>Navigation</SheetTitle>
                <SheetDescription>
                  Browse games and articles
                </SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                {/* Mobile Search */}
                <form onSubmit={handleSearch}>
                  <Input
                    type="search"
                    placeholder="Search games..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </form>
                
                {/* Mobile Theme Toggle */}
                <div className="flex items-center justify-between px-2">
                  <span className="text-sm font-medium">切换主题</span>
                  <ThemeToggle />
                </div>
                
                {/* Mobile Navigation Links */}
                <nav className="grid gap-2">
                  {navigationItems.map((item) => (
                    <div key={item.href} className="space-y-2">
                      <Link
                        href={item.href}
                        className={cn(
                          'block px-2 py-1 text-lg font-medium hover:text-primary transition-colors',
                          isActiveLink(item.href) && 'text-primary'
                        )}
                      >
                        {item.title}
                      </Link>
                      {item.children && (
                        <div className="pl-4 space-y-1">
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className={cn(
                                'block px-2 py-1 text-sm text-muted-foreground hover:text-foreground transition-colors',
                                isActiveLink(child.href) && 'text-foreground font-medium'
                              )}
                            >
                              {child.title}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export default Header; 