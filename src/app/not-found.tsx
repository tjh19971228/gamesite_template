import React from 'react';
import Link from 'next/link';
import { Layout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

/**
 * Not Found Page
 * 404页面
 */
export default function NotFound() {
  return (
    <Layout>
      <div className="py-16">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="text-center py-16">
              <div className="mb-8">
                <div className="text-8xl font-bold text-primary mb-4">404</div>
                <h1 className="text-3xl font-bold mb-2">Page Not Found</h1>
                <p className="text-lg text-muted-foreground">
                  Sorry, the page you are looking for doesn&apos;t exist or has been moved.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild size="lg">
                    <Link href="/">Go Home</Link>
                  </Button>
                  <Button asChild variant="secondary" size="lg">
                    <Link href="/games">Browse Games</Link>
                  </Button>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  Or use the navigation menu above to find what you&apos;re looking for.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
} 