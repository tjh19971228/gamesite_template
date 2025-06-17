"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BlogEntry } from "@/components/sections/BlogEntry";
import { BlogPost } from "@/types";

// Client component for category filtering
export function CategoryFilter({
  categories,
  posts,
  showExcerpt = true,
  showAuthor = true,
  showDate = true,
  showReadTime = false,
  defaultCategory = "all",
  sortingOptions = ["newest", "popular", "oldest"],
  defaultSortOption = "newest",
  sortingEnabled = false,
}: {
  categories: string[];
  posts: BlogPost[];
  showExcerpt?: boolean;
  showAuthor?: boolean;
  showDate?: boolean;
  showReadTime?: boolean;
  defaultCategory?: string;
  sortingOptions?: string[];
  defaultSortOption?: string;
  sortingEnabled?: boolean;
}) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    defaultCategory === "all" ? null : defaultCategory
  );
  const [sortBy, setSortBy] = useState(defaultSortOption);

  // Filter posts by category
  let filteredPosts = selectedCategory
    ? posts.filter((post) => post.category === selectedCategory)
    : posts;

  // Sort posts based on current sort option
  filteredPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return (
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        );
      case "oldest":
        return (
          new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
        );
      case "popular":
        // Use popularity if available, otherwise fall back to publishedAt
        const popularityA = typeof a.popularity === "number" ? a.popularity : 0;
        const popularityB = typeof b.popularity === "number" ? b.popularity : 0;
        return popularityB - popularityA;
      default:
        return (
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        );
    }
  });

  return (
    <>
      <div className="py-8 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h3 className="text-lg font-semibold mb-4">Browse by Category</h3>
            <div className="flex flex-wrap justify-center gap-2">
              <Badge
                variant={selectedCategory === null ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedCategory(null)}
              >
                All Articles
              </Badge>
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={
                    selectedCategory === category ? "default" : "outline"
                  }
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Display filtered posts */}
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">
              {selectedCategory
                ? `${selectedCategory} Articles`
                : "All Articles"}
            </h2>

            {sortingEnabled && (
              <div className="flex gap-2">
                {sortingOptions.map((option) => (
                  <Button
                    key={option}
                    variant={sortBy === option ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setSortBy(option)}
                  >
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </Button>
                ))}
              </div>
            )}
          </div>

          <BlogEntry
            posts={filteredPosts}
            layout="grid"
            showExcerpt={showExcerpt}
            showAuthor={showAuthor}
            showDate={showDate}
            showReadTime={showReadTime}
          />

          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No articles found in this category.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
