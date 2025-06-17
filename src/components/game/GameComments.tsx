import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface Comment {
  username: string;
  content: string;
  timestamp: string;
  likes: number;
}

interface GameCommentsProps {
  comments: Comment[];
  enabled?: boolean;
  title?: string;
  maxComments?: number;
}

// 生成用户名缩写头像
function generateAvatar(username: string): string {
  const initials = username
    .split(/[^a-zA-Z0-9\u4e00-\u9fa5]+/)
    .filter(word => word.length > 0)
    .slice(0, 2)
    .map(word => word.charAt(0).toUpperCase())
    .join('');
  
  return initials.length > 0 ? initials : username.charAt(0).toUpperCase();
}

// 生成随机背景颜色
function generateAvatarColor(username: string): string {
  const colors = [
    'bg-red-500',
    'bg-blue-500', 
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-orange-500',
    'bg-teal-500',
    'bg-cyan-500'
  ];
  
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const index = Math.abs(hash) % colors.length;
  return colors[index];
}

export function GameComments({ 
  comments = [], 
  enabled = true, 
  title = "玩家评论",
  maxComments = 10 
}: GameCommentsProps) {
  if (!enabled || comments.length === 0) {
    return null;
  }

  const displayComments = comments.slice(0, maxComments);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{title}</span>
          <Badge variant="secondary">{comments.length} comments</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayComments.map((comment, index) => {
            const avatarInitials = generateAvatar(comment.username);
            const avatarColor = generateAvatarColor(comment.username);
            
            return (
              <div key={index} className="flex gap-3 p-4 rounded-lg bg-muted/30">
                {/* 用户头像 */}
                <div className={`w-10 h-10 rounded-full ${avatarColor} flex items-center justify-center text-white font-semibold text-sm flex-shrink-0`}>
                  {avatarInitials}
                </div>
                
                <div className="flex-1 min-w-0">
                  {/* 用户名和时间 */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-sm">{comment.username}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(comment.timestamp), { 
                        addSuffix: true,
                        locale: zhCN 
                      })}
                    </span>
                  </div>
                  
                  {/* 评论内容 */}
                  <p className="text-sm text-foreground mb-3 leading-relaxed">
                    {comment.content}
                  </p>
                  
                  {/* 点赞按钮 */}
                  {/* <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                      👍 {comment.likes}
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                      回复
                    </Button>
                  </div> */}
                </div>
              </div>
            );
          })}
          
          {/* 加载更多按钮 */}
          {comments.length > maxComments && (
            <div className="text-center pt-4">
              <Button variant="outline" size="sm">
                查看更多评论 ({comments.length - maxComments} 条)
              </Button>
            </div>
          )}
          
          {/* 添加评论提示 */}
          {/* <div className="border-t pt-4 mt-6">
            <div className="bg-muted/50 rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground mb-3">
                想要分享你的游戏体验吗？
              </p>
              <Button size="sm">
                发表评论
              </Button>
            </div>
          </div> */}
        </div>
      </CardContent>
    </Card>
  );
} 