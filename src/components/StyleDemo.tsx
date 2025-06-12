'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

/**
 * Demo component showing how to use styles from styles-config.json
 * 演示组件，展示如何使用从styles-config.json生成的样式
 */
export default function StyleDemo() {
  const gameCategories = [
    'action', 'adventure', 'puzzle', 'strategy', 'racing', 
    'sports', 'rpg', 'simulation', 'arcade', 'casual'
  ];

  return (
    <div className="space-y-8 p-6">
      {/* Color Palette Demo */}
      <Card>
        <CardHeader>
          <CardTitle>颜色主题演示</CardTitle>
          <CardDescription>
            来自 styles-config.json 的调色板
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Primary Colors */}
          <div>
            <h3 className="text-lg font-semibold mb-3">主色调</h3>
            <div className="flex flex-wrap gap-2">
              {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map(shade => (
                <div
                  key={shade}
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                  style={{ backgroundColor: `rgb(var(--color-primary-${shade}))` }}
                >
                  {shade}
                </div>
              ))}
            </div>
          </div>

          {/* Secondary Colors */}
          <div>
            <h3 className="text-lg font-semibold mb-3">辅助色</h3>
            <div className="flex flex-wrap gap-2">
              {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map(shade => (
                <div
                  key={shade}
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                  style={{ backgroundColor: `rgb(var(--color-secondary-${shade}))` }}
                >
                  {shade}
                </div>
              ))}
            </div>
          </div>

          {/* Game Category Colors */}
          <div>
            <h3 className="text-lg font-semibold mb-3">游戏分类颜色</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {gameCategories.map(category => (
                <div key={category} className="text-center space-y-2">
                  <div
                    className={`w-16 h-16 mx-auto rounded-lg bg-game-${category} flex items-center justify-center text-white font-bold text-sm shadow-lg`}
                  >
                    {category.charAt(0).toUpperCase()}
                  </div>
                  <p className="text-sm capitalize">{category}</p>
                  <Badge className={`bg-game-${category} text-white border-game-${category}`}>
                    {category}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Animation Demo */}
      <Card>
        <CardHeader>
          <CardTitle>动画演示</CardTitle>
          <CardDescription>
            来自 styles-config.json 的动画效果
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div 
              className="w-20 h-20 bg-primary-500 rounded-lg flex items-center justify-center text-white font-bold"
              style={{ animation: 'fadeIn 2s infinite' }}
            >
              淡入
            </div>
            <div 
              className="w-20 h-20 bg-secondary-500 rounded-lg flex items-center justify-center text-white font-bold"
              style={{ animation: 'slideUp 2s infinite' }}
            >
              上滑
            </div>
            <div 
              className="w-20 h-20 bg-accent-500 rounded-lg flex items-center justify-center text-white font-bold"
              style={{ animation: 'scaleIn 2s infinite' }}
            >
              缩放
            </div>
            <div 
              className="w-20 h-20 bg-success-500 rounded-lg flex items-center justify-center text-white font-bold"
              style={{ animation: 'pulse 2s infinite' }}
            >
              脉动
            </div>
            <div 
              className="w-20 h-20 bg-warning-500 rounded-lg flex items-center justify-center text-white font-bold"
              style={{ animation: 'bounce 2s infinite' }}
            >
              弹跳
            </div>
            <div 
              className="w-20 h-20 bg-error-500 rounded-lg flex items-center justify-center text-white font-bold"
              style={{ animation: 'float 3s infinite' }}
            >
              漂浮
            </div>
            <div 
              className="w-20 h-20 bg-neutral-700 rounded-lg flex items-center justify-center text-white font-bold"
              style={{ animation: 'glow 2s infinite' }}
            >
              发光
            </div>
            <div 
              className="w-20 h-20 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold"
              style={{ animation: 'spin 2s linear infinite' }}
            >
              旋转
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Spacing and Shadows Demo */}
      <Card>
        <CardHeader>
          <CardTitle>间距和阴影演示</CardTitle>
          <CardDescription>
            来自 styles-config.json 的间距和阴影配置
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Spacing Demo */}
          <div>
            <h3 className="text-lg font-semibold mb-3">间距配置</h3>
            <div className="space-y-2">
              {['xs', 'sm', 'md', 'lg', 'xl', '2xl'].map(size => (
                <div key={size} className="flex items-center gap-4">
                  <span className="w-8 text-sm">{size}:</span>
                  <div 
                    className="bg-primary-200 rounded"
                    style={{ 
                      width: `var(--spacing-${size})`,
                      height: '1rem'
                    }}
                  />
                  <span className="text-sm text-gray-600">
                    var(--spacing-{size})
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Shadow Demo */}
          <div>
            <h3 className="text-lg font-semibold mb-3">阴影效果</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['sm', 'md', 'lg', 'xl', '2xl', 'card', 'glow'].map(shadow => (
                <div 
                  key={shadow}
                  className="w-20 h-20 bg-white rounded-lg flex items-center justify-center text-sm font-bold"
                  style={{ boxShadow: `var(--shadow-${shadow})` }}
                >
                  {shadow}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Elements Demo */}
      <Card>
        <CardHeader>
          <CardTitle>交互元素演示</CardTitle>
          <CardDescription>
            使用主题颜色的按钮和组件
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button className="bg-primary-500 hover:bg-primary-600">
                主要按钮
              </Button>
              <Button className="bg-secondary-500 hover:bg-secondary-600">
                次要按钮
              </Button>
              <Button className="bg-success-500 hover:bg-success-600">
                成功按钮
              </Button>
              <Button className="bg-warning-500 hover:bg-warning-600">
                警告按钮
              </Button>
              <Button className="bg-error-500 hover:bg-error-600">
                错误按钮
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {gameCategories.slice(0, 5).map(category => (
                <Button 
                  key={category}
                  className={`bg-game-${category} hover:opacity-90 text-white`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 