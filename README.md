# Kklyee.dev

Astro 7 技术博客骨架。内容使用 Markdown/MDX，首页保持纯文章时间流，合集通过文章标题旁的小型链接进入独立页面。

## 目录

```text
src/
├── components/
│   ├── brand/        # Logo 与主题切换资源
│   ├── comments/     # Giscus 评论
│   ├── layout/       # 页头与页脚
│   └── posts/        # 文章列表组件
├── content/
│   ├── posts/        # Markdown / MDX 文章
│   └── series/       # 合集说明与元数据
├── layouts/          # 全站与文章布局
├── lib/              # 内容查询和阅读时间
├── pages/            # 首页、文章、合集、关于、RSS
└── styles/           # 全局主题与 Markdown 排版
```

## 写一篇文章

复制 `src/content/posts/welcome.md`，修改文件名和 Frontmatter。属于合集时填写 `series` 与 `seriesOrder`；独立文章删除这两个字段。

## 新建合集

在 `src/content/series/` 新建一个 Markdown 文件。文件名就是合集 ID，再让文章的 `series` 引用它。

## 评论

复制 `.env.example` 为 `.env`，填写 Giscus 的仓库、分类与 ID。未配置时评论区不会输出任何脚本。

## Logo

`public/brand/` 同时保存浅色/深色与静态/动画版本。深色版拥有独立的连字和蓝环动效，不是浅色版的简单反色。

## 常用命令

```sh
npm install
npm run dev
npm run build
```

## 发布

站点使用 GitHub Pages 免费托管，生产域名为 `https://kklyee.dev`。推送到 `main` 分支后，GitHub Actions 会自动构建并发布 `dist/`。

自定义根域名需要在域名服务商处添加 GitHub Pages 要求的 `A`/`AAAA` 记录，域名生效后再在仓库 Pages 设置中启用 HTTPS。

项目原计划通过官方 `create astro` CLI 初始化；当前执行环境无法连接包源，因此这里按官方 minimal 模板结构建立了等价骨架。网络可用后运行 `npm install` 即可生成锁文件并构建。
