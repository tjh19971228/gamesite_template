# 🎮 Next.js 游戏站点模板需求汇总

> 复制整份内容到 Cursor，即可作为后续开发的蓝图

---

## 1. 项目目标

- **零代码改动**即可通过 JSON 配置动态调整页面结构与内容 （**重要**）
- 基于 **Next.js (App Router)** + **TailwindCSS** + **MagicUI / ShadcnUI**
- 支持 **移动端响应式** 与 **SEO 结构化数据**
- **全英文站点**

---

## 2. 页面架构 & 必要组件

| 页面           | 必要组件                                                                                  |
| -------------- | ----------------------------------------------------------------------------------------- |
| **首页**       | ① Hero 展示区<br>② 新游推荐<br>③ 热门排行<br>④ Blogs 入口<br>⑤ 分类导航                   |
| **游戏详情页** | ① 玩法说明<br>② 标签展示<br>③ 相关推荐<br>④ 视频模块<br>⑤ 评论模块<br>⑥ FAQ<br>⑦ 相关文章 |
| **Tag 页面**   | ① 关联游戏<br>② Tag 介绍<br>③ FAQ<br>④ 分页                                               |

> **原则**：每个模块都封装为可复用组件（`src/components/**`），以 JSON 控制显隐与顺序。

---

## 3. 技术与设计要求

- **UI 库来源**
  - `src/components/magicui/*`（MagicUI）
  - `src/components/ui/*`（ShadcnUI）
- **样式**：TailwindCSS + 自定义主题（见 `styles-config.json`）
- **图片**：全部采用网络地址
  - 推荐 `https://picsum.photos/seed/{keyword}/{w}/{h}`
  - 必须包含 `alt`、`width`、`height`

---

## 4. 配置系统（JSON 驱动）

| 文件                   | 作用                                            | 关键点                                          |
| ---------------------- | ----------------------------------------------- | ----------------------------------------------- |
| **seo-config.json**    | 页面级 SEO（标题 / 描述 / 关键词 / 结构化数据） | 比 `siteconfig.json` 更细粒度，所有路由必须配置 |
| **games-data.json**    | 全站游戏数据                                    | 参考 `games.json`                               |
| **blog-data.json**     | 全站博客数据                                    | 参考 `blog.json`                                |
| **styles-config.json** | 全局主题（色彩 / 字体 / 间距…）                 | 供 Tailwind `theme.extend` 动态读取             |
| `*-structure.json`     | 各页面组件开关                                  | 例见下方                                        |

```jsonc
// 示例：homepage-structure.json
{
  "hero": true,
  "newGames": true,
  "hotRanking": true,
  "blogsEntry": false,
  "categoryNav": true
}

## 5. 目录约定
```
app/
└── template1/
    ├── (首页)/
    │   ├── page.tsx
    │   ├── homepage-structure.json
    │   └── seo-config.json
    │
    ├── game/
    │   └── [slug]/
    │       ├── page.tsx
    │       ├── game-detail-structure.json
    │       └── seo-config.json
    │
    ├── tag/
    │   └── [tagname]/
    │       ├── page.tsx
    │       ├── tag-page-structure.json
    │       └── seo-config.json
    │
    └── blog/
        └── [slug]/
            ├── page.tsx
            ├── blog-page-structure.json
            └── seo-config.json

### 6. 分步开发流程
1. components-todo.md
    - 列出各页面所需组件[components-todo.md] ➜ 评估复用与 props 设计
2. 组件开发
    - 基于 MagicUI / ShadcnUI 封装到 src/components
3. 数据 JSON 生成
    - games-data.json、blog-data.json、styles-config.json
4. pages-todo.md
    - 规划页面实现顺序 & 任务拆解[pages-todo.md]
5. 页面开发（循环以下三步）
    - 生成 xxx-structure.json
    - 生成 xxx-seo-config.json
    - 编写 page.tsx （读取上述 JSON 动态渲染）
    - 验证：仅改动 JSON 能重排组件与内容

### 7. 最终交付
- 可运行的 Next.js 模板仓库（template1）
- 完整 JSON 配置示例
- 组件 / 页面均配备 TypeScript 注释 & Props 校验
- README 指导：如何通过编辑 JSON 完成定制
