---
title: '用 Astro 和 Cloudflare Pages 搭一个几乎零 JS 的博客'
description: '内容集合、混合语言、静态搜索与边缘部署：记录这座小站的技术底座，以及那些刻意没有采用的东西。'
date: 2026-10-28
lang: zh
category: tech
tags: ['Astro', 'Cloudflare', '性能']
featured: true
---

这个博客最开始只有一张空白画布和一个很模糊的念头：它应该像一张可以随手翻动的纸，而不是又一个塞满组件库的后台。

技术选型围绕一个约束展开：**读者打开一篇文章，不应该为任何他们用不到的东西付出加载成本。**

## 为什么是 Astro

博客的内容形态非常确定：文章、项目、生活碎片。没有登录、没有购物车、没有需要实时同步的协作面板。这意味着大部分页面可以在构建时变成 HTML，浏览器只需要接管少数几个真正需要交互的地方。

Astro 的默认行为正好符合这个判断：

- `.astro` 组件在服务端渲染，默认不向浏览器发送组件 JavaScript；
- Markdown 在构建时完成语法高亮，代码块不会在客户端二次处理；
- 内容集合用 schema 约束 frontmatter，写错字段会在构建时直接失败；
- 需要交互的地方可以只写一小段原生脚本，不必引入整个运行时。

我没有选 Next.js，不是因为它不好，而是这个站点不需要它的全栈能力。用一把更小的工具，维护成本会更低。

## 内容集合：让结构先于内容

所有文章放在 `src/content/posts` 下，用 schema 描述它们的形状：

```ts
const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    lang: z.enum(['zh', 'en']),
    category: z.enum(['tech', 'tutorial', 'essay', 'life']),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});
```

这样做的好处很直接：日期写错、分类拼错、标签类型不对，都会在构建时报错，而不是等到页面上出现 `undefined` 才发现。

## 混合语言，而不是双语镜像

常见做法是给每种语言建一套路由，比如 `/en/` 和 `/zh/`。但这里的内容并不是逐篇对应的：有些文章只有中文，有些只有英文，还有一些主题只适合其中一种语言。

所以我选择单一 URL 空间，用 `lang` 字段标记语言，在列表和文章页显示语言角标：

```text
/blog/css-torn-paper/      lang: zh
/blog/notes-on-bilingual-writing/   lang: en
```

读者不需要理解一套复杂的语言前缀规则；搜索引擎也能把同一主题的内容放在同一个目录下。代价是界面文案只有一套，但个人博客的读者通常不介意这一点。

## 构建管线

```mermaid
flowchart LR
  A[Markdown] --> B[Content Collections]
  B --> C[Astro Build]
  C --> D[静态 HTML / CSS / 少量 JS]
  D --> E[Cloudflare Pages]
  F[Pages CMS] -->|commit| A
```

整条链路里没有数据库，也没有常驻服务。内容改动通过 Git 提交触发重建，构建产物直接分发到边缘节点。

## 那些刻意没有做的事

- **没有引入 React 或 Vue。** 主题切换、搜索、目录高亮、点赞，用几十行原生脚本就够了。
- **没有用图片做首屏。** 纸张、撕边、胶带都由 CSS 绘制，首屏没有大图请求。
- **没有做服务端渲染。** 所有页面在构建时生成，运行时只有静态文件。
- **没有把统计脚本放进首屏。** 只有在配置了 Umami 之后才会加载，而且放在页面底部。

## 部署

Cloudflare Pages 的部署可以简化成两行命令：

```bash
pnpm build
npx wrangler pages deploy dist --project-name paper-scraps
```

如果绑定 GitHub 仓库，也可以让 Pages 在每次推送时自动构建。构建命令是 `pnpm build`，输出目录是 `dist`。

## 最后

静态不是一种妥协，而是一种取舍：把复杂度留在构建时，把确定性交给读者。对一个以文字为主的个人站点来说，这笔交易很划算。
