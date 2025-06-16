import siteConfig from "../../siteconfig.json";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.seo.metadataBase;
  const now = new Date();

  // 静态路由
  const staticRoutes = siteConfig.sitemap.staticRoutes.map((route: { path: string; changeFrequency: string; priority: number }) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency as
      | "daily"
      | "weekly"
      | "monthly"
      | "always"
      | "hourly"
      | "yearly"
      | "never",
    priority: route.priority,
  }));

  // 这里可以添加动态路由的生成逻辑
  // 例如通过API或数据库获取博客文章和游戏列表
  // 以下是示例代码，实际代码需要根据您的数据源调整
  /*
  interface BlogPost {
    slug: string;
    updatedAt: string;
  }

  interface Game {
    slug: string;
    updatedAt: string;
  }

  // 获取博客文章
  const blogPosts: BlogPost[] = await fetch(`${baseUrl}/api/blog-posts`).then(res => res.json());
  const blogRoutes: SitemapItem[] = blogPosts.map(post => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: siteConfig.sitemap.dynamicRoutes.blog.changeFrequency,
    priority: siteConfig.sitemap.dynamicRoutes.blog.priority,
  }));

  // 获取游戏列表
  const games: Game[] = await fetch(`${baseUrl}/api/games`).then(res => res.json());
  const gameRoutes: SitemapItem[] = games.map(game => ({
    url: `${baseUrl}/games/${game.slug}`,
    lastModified: new Date(game.updatedAt),
    changeFrequency: siteConfig.sitemap.dynamicRoutes.games.changeFrequency,
    priority: siteConfig.sitemap.dynamicRoutes.games.priority,
  }));
  
  return [...staticRoutes, ...blogRoutes, ...gameRoutes];
  */

  // 暂时只返回静态路由
  return staticRoutes;
}
