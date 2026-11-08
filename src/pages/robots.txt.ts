import type { APIRoute } from 'astro';
import { site } from '../site.config';

export const GET: APIRoute = () => {
  const body = `User-agent: *
Allow: /

Sitemap: ${site.url}/sitemap-index.xml
`;

  return new Response(body, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
    },
  });
};
