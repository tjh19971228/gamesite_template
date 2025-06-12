'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Header } from './Header';
import { Footer } from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
  showHeader?: boolean;
  showFooter?: boolean;
  headerClassName?: string;
  footerClassName?: string;
  mainClassName?: string;
}

/**
 * Layout Component
 * 页面布局包装器组件
 */
export function Layout({
  children,
  className,
  showHeader = true,
  showFooter = true,
  headerClassName,
  footerClassName,
  mainClassName,
}: LayoutProps) {
  return (
    <div className={cn(
      'min-h-screen flex flex-col',
      className
    )}>
      {/* Header */}
      {showHeader && (
        <Header className={headerClassName} />
      )}

      {/* Main Content */}
      <main className={cn(
        'flex-1',
        mainClassName
      )}>
        {children}
      </main>

      {/* Footer */}
      {showFooter && (
        <Footer className={footerClassName} />
      )}
    </div>
  );
}

export default Layout; 