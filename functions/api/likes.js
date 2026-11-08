/**
 * Cloudflare Pages Function：文章的点赞计数。
 * 需要绑定一个 KV namespace，变量名为 LIKES。
 * 未绑定或本地开发时，前端会自动退回到 localStorage 计数。
 */

const headers = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'no-store',
};

const json = (payload, status = 200) =>
  new Response(JSON.stringify(payload), { status, headers });

const validSlug = (slug) =>
  typeof slug === 'string' && /^[a-zA-Z0-9/_-]{1,120}$/.test(slug);

export async function onRequestGet({ request, env }) {
  const slug = new URL(request.url).searchParams.get('slug');

  if (!validSlug(slug)) {
    return json({ error: 'invalid slug' }, 400);
  }

  if (!env.LIKES) {
    return json({ error: 'likes storage is not configured', count: 0 }, 503);
  }

  const count = Number(await env.LIKES.get(`likes:${slug}`)) || 0;
  return json({ count });
}

export async function onRequestPost({ request, env }) {
  if (!env.LIKES) {
    return json({ error: 'likes storage is not configured' }, 503);
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return json({ error: 'invalid json' }, 400);
  }

  const { slug, action } = payload ?? {};

  if (!validSlug(slug)) {
    return json({ error: 'invalid slug' }, 400);
  }

  const key = `likes:${slug}`;
  const current = Number(await env.LIKES.get(key)) || 0;
  const next = Math.max(0, current + (action === 'unlike' ? -1 : 1));

  await env.LIKES.put(key, String(next));
  return json({ count: next });
}
