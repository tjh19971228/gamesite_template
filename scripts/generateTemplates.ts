/**
 * Template Generator Script
 * 
 * This script helps generate JSON structure templates
 * for different pages in the GameSite template.
 */

import fs from 'fs';
import path from 'path';
import { 
  HomepageStructure, 
  GameDetailStructure, 
  TagPageStructure, 
  PageStructure 
} from '../src/types';

const TEMPLATES_DIR = path.join(process.cwd(), 'app/template1');

// Base structure templates
const homeStructure: HomepageStructure = {
  hero: { 
    enabled: true, 
    props: {
      title: "Welcome to Game Paradise",
      subtitle: "Discover Amazing Games",
      backgroundImage: "https://picsum.photos/seed/hero/1920/1080"
    }
  },
  newGames: { 
    enabled: true, 
    maxItems: 8,
    order: 2
  },
  hotRanking: { 
    enabled: true, 
    showTrend: true,
    showStats: true,
    maxItems: 6,
    order: 3
  },
  blogsEntry: { 
    enabled: true, 
    maxPosts: 4,
    showAuthor: true,
    showDate: true,
    order: 5
  },
  categoryNav: { 
    enabled: true, 
    showCounts: true,
    maxVisible: 6,
    order: 4
  }
};

const gameDetailStructure: GameDetailStructure = {
  sections: {
    gameHero: {
      enabled: true,
      order: 1
    },
    gameInfo: {
      enabled: true,
      showTags: true,
      showCategory: true,
      showStats: true,
      order: 2
    },
    gameDescription: {
      enabled: true,
      order: 3
    },
    gameFeatures: {
      enabled: true,
      order: 4
    },
    screenshotGallery: {
      enabled: true,
      maxImages: 4,
      order: 5
    },
    gameControls: {
      enabled: true,
      order: 6
    },
    videoSection: {
      enabled: true,
      order: 7
    },
    relatedGames: {
      enabled: true,
      maxItems: 4,
      order: 8
    },
    commentSection: {
      enabled: true,
      order: 9
    },
    faqSection: {
      enabled: true,
      order: 10
    }
  },
  metadata: {
    title: "Game Details",
    description: "Play {game_title} online for free",
    keywords: ["free games", "online games", "browser games"]
  },
  page: {
    title: "{game_title}",
    showBreadcrumb: true
  }
};

const tagPageStructure: TagPageStructure = {
  tagInfo: {
    enabled: true,
    order: 1
  },
  relatedGames: {
    enabled: true,
    maxItems: 12,
    order: 2
  },
  tagDescription: {
    enabled: true,
    order: 3
  },
  faqSection: {
    enabled: true,
    order: 4
  },
  pagination: {
    enabled: true,
    pageSize: 12,
    order: 5
  }
};

const blogPageStructure: PageStructure = {
  header: {
    enabled: true,
    showTitle: true,
    showImage: true,
    order: 1
  },
  content: {
    enabled: true,
    showAuthor: true,
    showDate: true,
    showReadTime: true,
    order: 2
  },
  comments: {
    enabled: true,
    order: 3
  },
  relatedPosts: {
    enabled: true,
    maxItems: 3,
    order: 4
  },
  sidebar: {
    enabled: true,
    showCategories: true,
    showTags: true,
    showRecentPosts: true,
    order: 5
  }
};

// Function to create directory if it doesn't exist
function ensureDirectoryExists(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
}

// Function to generate a JSON file
function generateJSONFile(filePath: string, data: any) {
  const jsonData = JSON.stringify(data, null, 2);
  fs.writeFileSync(filePath, jsonData);
  console.log(`Generated: ${filePath}`);
}

// Function to generate homepage structure
function generateHomepageStructure() {
  const filePath = path.join(TEMPLATES_DIR, 'homepage-structure.json');
  generateJSONFile(filePath, homeStructure);
}

// Function to generate game detail structure
function generateGameDetailStructure() {
  const filePath = path.join(TEMPLATES_DIR, 'game/[slug]/game-detail-structure.json');
  ensureDirectoryExists(path.dirname(filePath));
  generateJSONFile(filePath, gameDetailStructure);
}

// Function to generate tag page structure
function generateTagPageStructure() {
  const filePath = path.join(TEMPLATES_DIR, 'tag/[tagname]/tag-page-structure.json');
  ensureDirectoryExists(path.dirname(filePath));
  generateJSONFile(filePath, tagPageStructure);
}

// Function to generate blog page structure
function generateBlogPageStructure() {
  const filePath = path.join(TEMPLATES_DIR, 'blog/[slug]/blog-page-structure.json');
  ensureDirectoryExists(path.dirname(filePath));
  generateJSONFile(filePath, blogPageStructure);
}

// Generate all templates
function generateAllTemplates() {
  generateHomepageStructure();
  generateGameDetailStructure();
  generateTagPageStructure();
  generateBlogPageStructure();
}

// Run the generator
generateAllTemplates();
console.log('All template JSON files generated successfully!');
console.log('You can now customize these files to control the structure of your pages.'); 