import { getRelativeLocaleUrl } from "astro:i18n";

export const defaultLocale = "zh-cn" as const;
export const locales = ["zh-cn", "en"] as const;
export type Locale = (typeof locales)[number];

export const messages = {
  "zh-cn": {
    htmlLang: "zh-CN",
    ogLocale: "zh_CN",
    siteDescription: "Kklyee.top 是 Kklyee 的中文技术博客，记录 AI Agent、LLM 应用工程与 AI Coding 的实践和思考。",
    nav: {
      ariaLabel: "主导航",
      collections: "合集",
      about: "关于",
      language: "选择语言",
    },
    footer: {
      ariaLabel: "页脚导航",
      archive: "归档",
    },
    theme: {
      light: "当前为浅色主题，切换为深色主题",
      dark: "当前为深色主题，切换为浅色主题",
    },
    home: {
      tagline: "写代码，也记录技术背后的判断与取舍。",
      pagination: "文章分页",
      previousPage: "上一页",
      nextPage: "下一页",
    },
    posts: {
      eyebrow: "ARCHIVE",
      title: "文章归档",
      description: "Kklyee.top 的全部文章。",
      readingMinutes: "分钟阅读",
    },
    collections: {
      title: "合集",
      description: "按主题连续阅读 Kklyee.top 的技术文章。",
      status: {
        planning: "准备中",
        writing: "连载中",
        complete: "已完结",
      },
      countSuffix: "篇",
      view: "查看合集",
      previewLabel: "中的文章",
    },
    about: {
      title: "关于",
      description: "Kklyee，全栈开发者，专注 AI Agent 与 LLM 应用工程。",
      greeting: "你好，我是 Kklyee",
      intro: "全栈开发者，专注 AI Agent 与 LLM 应用工程。",
      mapLabel: "从模型能力到真实应用的 Agent 工程链路",
      result: "从模型能力，到真实应用。",
      manifestoLabel: "工作方法",
      manifesto: "让模型、上下文与工具，在真实的软件系统中协同工作。",
      focusTitle: "FOCUS / 03",
      workTitle: "WORKS / 03",
      jobTitle: "全栈开发者",
    },
    article: {
      home: "首页",
      posts: "文章",
      breadcrumbLabel: "面包屑",
      author: "作者：",
      publishedAt: "发布于",
      updatedAt: "更新于",
      seriesNavigation: "系列文章导航",
      previous: "上一篇",
      next: "下一篇",
      toc: "文章大纲",
    },
  },
  en: {
    htmlLang: "en",
    ogLocale: "en_US",
    siteDescription: "Kklyee.top is Kklyee's personal blog about AI Agent engineering, LLM applications, and AI Coding.",
    nav: {
      ariaLabel: "Main navigation",
      collections: "Collections",
      about: "About",
      language: "Choose language",
    },
    footer: {
      ariaLabel: "Footer navigation",
      archive: "Archive",
    },
    theme: {
      light: "Light theme is active, switch to dark theme",
      dark: "Dark theme is active, switch to light theme",
    },
    home: {
      tagline: "Writing code, and recording the judgment and trade-offs behind it.",
      pagination: "Post pagination",
      previousPage: "Previous page",
      nextPage: "Next page",
    },
    posts: {
      eyebrow: "ARCHIVE",
      title: "Post archive",
      description: "All articles from Kklyee.top.",
      readingMinutes: "min read",
    },
    collections: {
      title: "Collections",
      description: "Read Kklyee.top's technical articles by topic.",
      status: {
        planning: "Planning",
        writing: "In progress",
        complete: "Complete",
      },
      countSuffix: "posts",
      view: "View collection",
      previewLabel: " articles",
    },
    about: {
      title: "About",
      description: "Kklyee, a full-stack developer focused on AI Agent and LLM application engineering.",
      greeting: "Hi, I'm Kklyee",
      intro: "Full-stack developer focused on AI Agent and LLM application engineering.",
      mapLabel: "The Agent engineering path from model capability to real applications",
      result: "From model capability to real applications.",
      manifestoLabel: "Working method",
      manifesto: "Making models, context, and tools work together in real software systems.",
      focusTitle: "FOCUS / 03",
      workTitle: "WORKS / 03",
      jobTitle: "Full-stack developer",
    },
    article: {
      home: "Home",
      posts: "Posts",
      breadcrumbLabel: "Breadcrumb",
      author: "Author: ",
      publishedAt: "Published",
      updatedAt: "Updated",
      seriesNavigation: "Series article navigation",
      previous: "Previous",
      next: "Next",
      toc: "On this page",
    },
  },
} satisfies Record<Locale, object>;

export function getLocaleFromPath(pathname: string): Locale {
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : defaultLocale;
}

export function getLocalizedPath(locale: Locale, pathname: string) {
  const pathWithoutLocale = pathname.replace(/^\/en(?=\/|$)/, "") || "/";
  return getRelativeLocaleUrl(locale, pathWithoutLocale);
}
