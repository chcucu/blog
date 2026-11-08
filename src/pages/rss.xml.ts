import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPosts } from '../lib/posts';
import { site } from '../site.config';

export async function GET(context: APIContext) {
  const posts = await getPosts();

  return rss({
    title: `${site.name} · ${site.tagline}`,
    description: site.description,
    site: context.site ?? site.url,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description,
      link: `/blog/${post.id}/`,
      categories: [post.data.category, ...post.data.tags],
    })),
    customData: `<language>zh-cn</language><copyright>© ${new Date().getFullYear()} ${site.author}</copyright>`,
  });
}
