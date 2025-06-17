import React from "react";
import { Metadata } from "next";
import { Layout } from "@/components/layout";
import { getSiteInfo } from "@/lib/siteConfig";
import { getAllCategories, getAllGames, getRecentBlogPosts } from "@/lib/data";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Site Map",
  description: "Navigate our website with our comprehensive site map",
};

export default function SiteMapPage() {
  const siteInfo = getSiteInfo();
  const categories = getAllCategories();
  const games = getAllGames();
  const blogPosts = getRecentBlogPosts(10);
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Site Map</h1>
        <p className="text-lg text-muted-foreground mb-12">
          Find all the pages and content available on {siteInfo.siteName}
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Main Pages */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-primary">Main Pages</h2>
            <div className="space-y-2">
              <Link href="/" className="block hover:text-primary transition-colors">
                Home
              </Link>
              <Link href="/games" className="block hover:text-primary transition-colors">
                All Games
              </Link>
              <Link href="/categories" className="block hover:text-primary transition-colors">
                Game Categories
              </Link>
              <Link href="/blog" className="block hover:text-primary transition-colors">
                Blog & News
              </Link>
              <Link href="/search" className="block hover:text-primary transition-colors">
                Search
              </Link>
            </div>
          </section>

          {/* Game Categories */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-primary">Game Categories</h2>
            <div className="space-y-2">
              {categories.slice(0, 10).map((category) => (
                <Link 
                  key={category.slug}
                  href={`/category/${category.slug}`} 
                  className="block hover:text-primary transition-colors"
                >
                  {category.name} ({category.count})
                </Link>
              ))}
              {categories.length > 10 && (
                <Link href="/categories" className="block text-sm text-muted-foreground hover:text-primary">
                  View all categories...
                </Link>
              )}
            </div>
          </section>

          {/* Popular Games */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-primary">Popular Games</h2>
            <div className="space-y-2">
              {games.slice(0, 10).map((game) => (
                <Link 
                  key={game.slug}
                  href={`/game/${game.slug}`} 
                  className="block hover:text-primary transition-colors text-sm"
                >
                  {game.title}
                </Link>
              ))}
              {games.length > 10 && (
                <Link href="/games" className="block text-sm text-muted-foreground hover:text-primary">
                  View all games...
                </Link>
              )}
            </div>
          </section>

          {/* Recent Blog Posts */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-primary">Recent Blog Posts</h2>
            <div className="space-y-2">
              {blogPosts.map((post) => (
                <Link 
                  key={post.slug}
                  href={`/blog/${post.slug}`} 
                  className="block hover:text-primary transition-colors text-sm"
                >
                  {post.title}
                </Link>
              ))}
              <Link href="/blog" className="block text-sm text-muted-foreground hover:text-primary">
                View all blog posts...
              </Link>
            </div>
          </section>

          {/* Legal & Support */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-primary">Legal & Support</h2>
            <div className="space-y-2">
              <Link href="/contact" className="block hover:text-primary transition-colors">
                Contact Us
              </Link>
              <Link href="/privacy" className="block hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="block hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="block hover:text-primary transition-colors">
                Cookie Policy
              </Link>
              <Link href="/site-map" className="block hover:text-primary transition-colors">
                Site Map
              </Link>
            </div>
          </section>

          {/* Technical */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-primary">Technical</h2>
            <div className="space-y-2">
              <a 
                href="/sitemap.xml" 
                className="block hover:text-primary transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                XML Sitemap
              </a>
              <a 
                href="/robots.txt" 
                className="block hover:text-primary transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Robots.txt
              </a>
            </div>
          </section>
        </div>

        {/* Additional Information */}
        <section className="mt-16 p-6 bg-muted/30 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">About This Site Map</h2>
          <p className="text-muted-foreground">
            This site map provides an overview of all the main sections and content available on {siteInfo.siteName}. 
            If you&apos;re looking for something specific and can&apos;t find it here, try using our{" "}
            <Link href="/search" className="text-primary hover:underline">search function</Link> or{" "}
            <Link href="/contact" className="text-primary hover:underline">contact us</Link> for assistance.
          </p>
        </section>
      </div>
    </Layout>
  );
} 