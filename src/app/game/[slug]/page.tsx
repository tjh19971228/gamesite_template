import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Layout } from "@/components/layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GamePlayer } from "@/components/game/GamePlayer";
import { GameComments } from "@/components/game/GameComments";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SchemaOrg } from "@/components/SchemaOrg";
import {
  getGameBySlug,
  getGamesByCategory,
  getPopularGames,
  getCategoryBySlug,
  getAllGames,
} from "@/lib/data";
import { getGameDetailStructure } from "@/lib/config";
import { getGameSchema } from "@/lib/schema";
import Link from "next/link";
import { GameCard } from "@/components/cards/GameCard";

interface GamePageProps {
  params: Promise<{
    slug: string;
  }>;
}

interface SectionConfig {
  enabled: boolean;
  order: number;
  title: string;
  maxImages: number;
  maxComments: number;
  maxItems: number;
  showTags: boolean;
  showCategory: boolean;
  showStats: boolean;
}

/**
 * Generate metadata for game detail page
 */
export async function generateMetadata({
  params,
}: GamePageProps): Promise<Metadata> {
  // 确保params已被解析
  const resolvedParams = await params;
  const game = getGameBySlug(resolvedParams.slug);

  if (!game) {
    return {
      title: "Game Not Found - GameSite",
      description: "The requested game could not be found.",
    };
  }

  return {
    title: `${game.title} - Free Online Game | GameSite`,
    description:
      game.description ||
      game.shortDescription ||
      `Play ${game.title} online for free`,
    keywords: [game.title, ...game.tags, game.category, "free online game"],
    openGraph: {
      title: game.title,
      description: game.description || game.shortDescription,
      images: game.images.length > 0 ? [game.images[0]] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: game.title,
      description: game.description || game.shortDescription,
      images: game.images.length > 0 ? [game.images[0]] : [],
    },
  };
}

/**
 * Generate static params for all games
 */
export async function generateStaticParams() {
  return getAllGames().map((game) => ({
    slug: game.slug,
  }));
}

/**
 * Game Detail Page
 * 游戏详情页面
 */
export default async function GameDetailPage({ params }: GamePageProps) {
  // 确保params已被解析
  const resolvedParams = await params;
  const game = getGameBySlug(resolvedParams.slug);

  if (!game) {
    notFound();
  }

  // Get category info first
  const category = getCategoryBySlug(
    game.category.toLowerCase().replace(/\s+/g, "-")
  );

  // Get related games from the same category
  const relatedGames = getGamesByCategory(
    category?.slug || game.category.toLowerCase().replace(/\s+/g, "-")
  )
    .filter((g) => g.slug !== game.slug)
    .slice(0, 4);

  // Get popular games as fallback if no related games
  const recommendedGames =
    relatedGames.length > 0 ? relatedGames : getPopularGames(4);

  // 获取游戏详情页面结构配置
  const config = await getGameDetailStructure();
  // 获取游戏结构化数据
  const schemaData = await getGameSchema(
    game as unknown as Record<string, unknown>
  );

  // 根据order排序sections
  const sortedSections = Object.entries(config.sections || {})
    .filter(([, sectionConfig]) => sectionConfig?.enabled)
    .sort(([, a], [, b]) => (a?.order || 0) - (b?.order || 0));

  // 渲染section的函数
  const renderSection = (sectionName: string, sectionConfig: SectionConfig) => {
    if (!sectionConfig) return null;

    switch (sectionName) {
      case "gameHero":
        return (
          <div
            key="gameHero"
            className="text-white py-4 md:py-8"
            style={{
              background: `linear-gradient(to right, rgb(var(--color-primary-500)) 0%, rgb(var(--color-secondary-500)) 100%)`,
              backdropFilter: "blur(4px)",
            }}
          >
            <div className="container mx-auto px-4">
              {/* 移动端：只显示标题，隐藏图片 */}
              <div className="md:hidden text-center py-2">
                <h1 className="text-xl font-bold text-white mb-1">
                  {game.title}
                </h1>
                <p className="text-sm text-white/80 line-clamp-1">
                  {game.shortDescription || game.description}
                </p>
              </div>

              {/* 桌面端：显示完整布局 */}
              <div className="hidden md:flex flex-col lg:flex-row gap-8 items-start">
                {/* Game Image */}
                <div className="w-full lg:w-80 flex-shrink-0">
                  <div className="aspect-video rounded-lg overflow-hidden bg-black/20">
                    <Image
                      src={
                        game.images[0] ||
                        game.thumbnail ||
                        "https://via.placeholder.com/400x300"
                      }
                      alt={game.title}
                      width={320}
                      height={180}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Game Basic Info */}
                <div className="flex-1 space-y-4">
                  <div>
                    <h1 className="text-4xl font-bold mb-2 text-white">
                      {game.title}
                    </h1>
                    <p className="text-xl text-white opacity-90">
                      {game.shortDescription || game.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "gameInfo":
        return (
          <div key="gameInfo" className="py-8 bg-muted/30">
            <div className="container mx-auto px-4">
              <Card>
                <CardHeader>
                  <CardTitle>Game Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Tags and Category */}
                    {sectionConfig.showTags && (
                      <div>
                        <h3 className="font-semibold mb-3">Tags & Category</h3>
                        <div className="flex flex-wrap gap-2">
                          {sectionConfig.showCategory && category && (
                            <Badge variant="secondary">{category.name}</Badge>
                          )}
                          {game.tags.slice(0, 8).map((tag) => (
                            <Badge key={tag} variant="outline">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Game Stats */}
                    {sectionConfig.showStats && (
                      <div>
                        <h3 className="font-semibold mb-3">Game Details</h3>
                        <div className="grid grid-cols-2 gap-4">
                          {game.rating && (
                            <div className="text-center border rounded-lg p-3">
                              <div className="text-2xl font-bold">
                                ⭐ {game.rating}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Rating
                              </div>
                            </div>
                          )}
                          {game.developer && (
                            <div className="text-center border rounded-lg p-3">
                              <div className="text-lg font-semibold">
                                {game.developer}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Developer
                              </div>
                            </div>
                          )}
                          {game.releaseDate && (
                            <div className="text-center border rounded-lg p-3">
                              <div className="text-lg font-semibold">
                                {new Date(game.releaseDate).getFullYear()}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Released
                              </div>
                            </div>
                          )}
                          <div className="text-center border rounded-lg p-3">
                            <div className="text-lg font-semibold">Free</div>
                            <div className="text-sm text-muted-foreground">
                              Price
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case "gameDescription":
        return (
          <div key="gameDescription" className="py-8">
            <div className="container mx-auto px-4">
              <Card>
                <CardHeader>
                  <CardTitle>About This Game</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {game.description ||
                      "Experience this amazing game with stunning graphics and engaging gameplay. Perfect for players of all skill levels, this game offers hours of entertainment and challenge."}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case "gameFeatures":
        if (!game.features || game.features.length === 0) return null;
        return (
          <div key="gameFeatures" className="py-8 bg-muted/30">
            <div className="container mx-auto px-4">
              <Card>
                <CardHeader>
                  <CardTitle>Key Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {game.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-primary mt-1">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case "gameControls":
        return (
          <div key="gameControls" className="py-2 md:py-8" id="game-player">
            {/* 移动端：全宽显示，去掉标题 */}
            <div className="md:hidden">
              <GamePlayer game={game} isMobileView={true} />
            </div>

            {/* 桌面端：保持原有样式 */}
            <div className="hidden md:block">
              <div className="container mx-auto px-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Play {game.title}</CardTitle>
                    <CardDescription>
                      Enjoy playing directly in your browser
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <GamePlayer game={game} isMobileView={false} />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        );

      case "screenshotGallery":
        if (game.images.length <= 1) return null;
        return (
          <div key="screenshotGallery" className="py-8 bg-muted/30">
            <div className="container mx-auto px-4">
              <Card>
                <CardHeader>
                  <CardTitle>Screenshots</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {game.images
                      .slice(1, sectionConfig.maxImages || 5)
                      .map((image, index) => (
                        <div
                          key={index}
                          className="aspect-video rounded-lg overflow-hidden"
                        >
                          <Image
                            src={image}
                            alt={`${game.title} screenshot ${index + 1}`}
                            width={400}
                            height={225}
                            className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                          />
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case "commentSection":
        return (
          <div key="commentSection" className="py-8">
            <div className="container mx-auto px-4">
              <GameComments
                comments={game.comments || []}
                enabled={sectionConfig.enabled}
                title={sectionConfig.title || "Player Comments"}
                maxComments={Number(sectionConfig.maxComments) || 10}
              />
            </div>
          </div>
        );

      case "relatedGames":
        return (
          <div key="relatedGames" className="py-8 md:py-16 bg-muted/30">
            <div className="container mx-auto px-4">
              {/* 移动端：紧凑的标题 */}
              <div className="text-center mb-6 md:mb-12">
                <h2 className="text-xl md:text-3xl font-bold mb-2 md:mb-4">
                  {sectionConfig.title || "Similar Games"}
                </h2>
                <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
                  Discover more exciting games in the {category?.name || "same"}{" "}
                  category
                </p>
              </div>

              {/* 直接使用grid布局，避免组件冲突 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {recommendedGames
                  .slice(0, sectionConfig.maxItems || 4)
                  .map((game, index) => (
                    <div key={game.slug} className="w-full">
                      <GameCard
                        game={game}
                        layout="grid"
                        showTags={true}
                        showRating={true}
                        showDescription={false}
                        clickable
                        priority={index < 4}
                        className="h-full"
                      />
                    </div>
                  ))}
              </div>

              <div className="text-center mt-6 md:mt-8">
                <Button
                  asChild
                  variant="secondary"
                  size="sm"
                  className="md:size-lg"
                >
                  <Link
                    href={`/category/${
                      category?.slug ||
                      game.category.toLowerCase().replace(/\s+/g, "-")
                    }`}
                    className="px-0"
                  >
                    View All {category?.name || game.category} Games
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <SchemaOrg data={schemaData} />

      <Layout>
        {/* 面包屑导航 */}
        {config.page?.showBreadcrumb && (
          <div className="bg-muted/20 border-b">
            <div className="container mx-auto px-4 py-3">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link href="/">Home</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link href="/games">Games</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  {category && (
                    <>
                      <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                          <Link href={`/category/${category.slug}`}>
                            {category.name}
                          </Link>
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator />
                    </>
                  )}
                  <BreadcrumbItem>
                    <BreadcrumbPage>{game.title}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </div>
        )}

        {/* 按order顺序渲染所有sections */}
        {sortedSections.map(([sectionName, sectionConfig]) =>
          renderSection(sectionName, sectionConfig as unknown as SectionConfig)
        )}
      </Layout>
    </>
  );
}

export const dynamic = "force-static";
export const revalidate = 3600; // 1 hour
