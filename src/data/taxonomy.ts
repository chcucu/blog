export const categories = {
  tech: { label: '技术', labelEn: 'Tech', tone: 'blue' },
  tutorial: { label: '教程', labelEn: 'Tutorial', tone: 'sage' },
  essay: { label: '随笔', labelEn: 'Essay', tone: 'clay' },
  life: { label: '生活', labelEn: 'Life', tone: 'sand' },
} as const;

export type CategoryKey = keyof typeof categories;

export function categoryLabel(key: CategoryKey, lang: 'zh' | 'en' = 'zh') {
  const item = categories[key];
  return lang === 'en' ? item.labelEn : item.label;
}

/** 常用标签的中文名 -> URL 片段。未收录的标签会直接使用原文。 */
const knownTags: Record<string, string> = {
  Astro: 'astro',
  Cloudflare: 'cloudflare',
  CSS: 'css',
  设计: 'design',
  Design: 'design',
  排版: 'typography',
  写作: 'writing',
  Writing: 'writing',
  搜索: 'search',
  性能: 'performance',
  Performance: 'performance',
  工具: 'tools',
  双语: 'bilingual',
  Bilingual: 'bilingual',
  生活: 'life',
  摄影: 'photography',
  Minecraft: 'minecraft',
  服务器: 'server',
  插件: 'plugin',
  Java: 'java',
  音乐: 'music',
  影像: 'video',
};

export function tagToSlug(tag: string) {
  return knownTags[tag] ?? tag;
}

export function slugToTag(slug: string) {
  const found = Object.entries(knownTags).find(([, value]) => value === slug);
  return found ? found[0] : slug;
}

export function languageLabel(lang: 'zh' | 'en') {
  return lang === 'en' ? 'EN' : '中文';
}
