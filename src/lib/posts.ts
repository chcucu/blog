import { getCollection, type CollectionEntry } from 'astro:content';
import { categories, type CategoryKey } from '../data/taxonomy';

export type Post = CollectionEntry<'posts'>;
export type Project = CollectionEntry<'projects'>;
export type LifeNote = CollectionEntry<'life'>;

const zhDate = new Intl.DateTimeFormat('zh-CN', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

const enDate = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
});

export function formatDate(date: Date, lang: 'zh' | 'en' = 'zh') {
  return (lang === 'en' ? enDate : zhDate).format(date);
}

export function formatDateShort(date: Date, lang: 'zh' | 'en' = 'zh') {
  return new Intl.DateTimeFormat(lang === 'en' ? 'en-US' : 'zh-CN', {
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

export function postUrl(post: Post) {
  return `/blog/${post.id}/`;
}

export function projectUrl(project: Project) {
  return `/projects/${project.id}/`;
}

export async function getPosts() {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export async function getProjects() {
  const projects = await getCollection('projects');
  return projects.sort((a, b) => a.data.order - b.data.order);
}

export async function getLifeNotes() {
  const notes = await getCollection('life');
  return notes.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export function relatedPosts(current: Post, all: Post[], limit = 3) {
  const scored = all
    .filter((post) => post.id !== current.id)
    .map((post) => {
      const sharedTags = post.data.tags.filter((tag) => current.data.tags.includes(tag)).length;
      const sameCategory = post.data.category === current.data.category ? 1 : 0;
      return { post, score: sharedTags * 2 + sameCategory };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || b.post.data.date.valueOf() - a.post.data.date.valueOf());

  if (scored.length >= limit) {
    return scored.slice(0, limit).map((item) => item.post);
  }

  const picked = scored.map((item) => item.post);
  for (const post of all) {
    if (picked.length >= limit) break;
    if (post.id !== current.id && !picked.some((item) => item.id === post.id)) {
      picked.push(post);
    }
  }
  return picked.slice(0, limit);
}

export function tagCounts(posts: Post[]) {
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.data.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag, 'zh-CN'));
}

export function categoryCounts(posts: Post[]) {
  return (Object.keys(categories) as CategoryKey[]).map((key) => ({
    key,
    ...categories[key],
    count: posts.filter((post) => post.data.category === key).length,
  }));
}

export function stripMarkdown(markdown = '') {
  return markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<svg[\s\S]*?<\/svg>/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/[*_~>|]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
