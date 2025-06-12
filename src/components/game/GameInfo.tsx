'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Game } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface GameInfoProps {
  game: Game;
  className?: string;
}

/**
 * Game Info Component
 * 游戏信息展示组件
 */
export function GameInfo({ game, className }: GameInfoProps) {
  const infoItems = [
    {
      label: 'Developer',
      value: game.developer || 'Unknown',
      icon: '👨‍💻'
    },
    {
      label: 'Release Date',
      value: game.releaseDate ? new Date(game.releaseDate).toLocaleDateString() : 'Unknown',
      icon: '📅'
    },
    {
      label: 'Platform',
      value: game.platform?.join(', ') || 'Web Browser',
      icon: '💻'
    },
    {
      label: 'Language',
      value: game.language?.join(', ') || 'English',
      icon: '🌐'
    },
    {
      label: 'File Size',
      value: game.fileSize || 'N/A',
      icon: '📦'
    },
    {
      label: 'Last Updated',
      value: game.lastUpdated ? new Date(game.lastUpdated).toLocaleDateString() : 'Unknown',
      icon: '🔄'
    }
  ];

  return (
    <Card className={cn('', className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>🎮</span>
          Game Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Rating */}
        {game.rating && (
          <div className="flex items-center justify-between py-2 border-b">
            <span className="text-sm font-medium">Rating</span>
            <div className="flex items-center gap-1">
              <span className="text-yellow-500">⭐</span>
              <span className="font-semibold">{game.rating}</span>
              <span className="text-muted-foreground text-sm">/5</span>
            </div>
          </div>
        )}

        {/* Popularity */}
        {game.popularity && (
          <div className="flex items-center justify-between py-2 border-b">
            <span className="text-sm font-medium">Popularity</span>
            <div className="flex items-center gap-1">
              <span className="text-red-500">🔥</span>
              <span className="font-semibold">{game.popularity}</span>
              <span className="text-muted-foreground text-sm">plays</span>
            </div>
          </div>
        )}

        {/* Game Info Items */}
        <div className="space-y-3">
          {infoItems.map((item, index) => (
            <div key={index} className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <span className="text-sm">{item.icon}</span>
                <span className="text-sm font-medium text-muted-foreground">
                  {item.label}
                </span>
              </div>
              <span className="text-sm text-right font-medium min-w-0 flex-1">
                {item.value}
              </span>
            </div>
          ))}
        </div>

        {/* Game Tags */}
        {game.tags.length > 0 && (
          <div className="pt-4 border-t">
            <h4 className="text-sm font-medium mb-2">Tags</h4>
            <div className="flex flex-wrap gap-1">
              {game.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Video Link */}
        {game.videoUrl && (
          <div className="pt-4 border-t">
            <a
              href={game.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <span>🎬</span>
              Watch Gameplay Video
            </a>
          </div>
        )}

        {/* Play URL */}
        {game.playUrl && (
          <div className="pt-2">
            <a
              href={game.playUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <span>🎮</span>
              Play External Version
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default GameInfo; 