import type { APIRoute } from 'astro';
import { getPosts, stripMarkdown } from '../lib/posts';

export const GET: APIRoute = async () => {
  const posts = await getPosts();

  const docs = posts.map((post) => ({
    slug: post.id,
    title: post.data.title,
    description: post.data.description,
    date: post.data.date.toISOString(),
    lang: post.data.lang,
    category: post.data.category,
    tags: post.data.tags,
    body: stripMarkdown(post.body).slice(0, 2000),
  }));

  return new Response(JSON.stringify(docs), {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'public, max-age=3600',
    },
  });
};
