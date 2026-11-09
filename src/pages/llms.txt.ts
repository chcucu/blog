import type { APIRoute } from 'astro';
import videosData from '../data/videos.json';
import reposData from '../data/repos.json';
import { getPosts, getProjects } from '../lib/posts';
import { site } from '../site.config';

const origin = site.url.replace(/\/$/, '');

function absolute(path: string) {
  return `${origin}${path}`;
}

export const GET: APIRoute = async () => {
  const [posts, projects] = await Promise.all([getPosts(), getProjects()]);
  const videos = videosData.videos;
  const repos = reposData.repos;

  const lines: string[] = [];
  lines.push(`# ${site.name}`);
  lines.push('');
  lines.push(`> ${site.description}`);
  lines.push('');

  lines.push('## 身份');
  lines.push(`- 常用账号：${site.author}（${site.handle}）`);
  lines.push(`- 站点名称：${site.name}`);
  lines.push(`- 邮箱：${site.email}`);
  lines.push(`- 身份：${site.roles.join('、')}`);
  lines.push(
    '- 关注方向：Minecraft 服务端开发、Paper 插件、Web 开发、摄影、音乐制作、视频制作',
  );
  lines.push('');

  lines.push('## 主要链接');
  lines.push(`- 首页：${origin}/`);
  lines.push(`- 关于：${origin}/about/`);
  lines.push(`- 项目：${origin}/projects/`);
  lines.push(`- 视频：${origin}/videos/`);
  lines.push(`- 开源：${origin}/repos/`);
  lines.push(`- 文章：${origin}/blog/`);
  lines.push(`- RSS：${origin}/rss.xml`);
  for (const social of site.socials) {
    const href = social.href.startsWith('http') ? social.href : absolute(social.href);
    lines.push(`- ${social.label}：${href}`);
  }
  lines.push('');

  lines.push('## 项目');
  if (projects.length === 0) {
    lines.push('- 暂无公开项目');
  } else {
    for (const project of projects) {
      const summary = project.data.description ? `：${project.data.description}` : '';
      lines.push(
        `- ${project.data.title}（${project.data.year}）${absolute(`/projects/${project.id}/`)}${summary}`,
      );
    }
  }
  lines.push('');

  lines.push('## 视频（Bilibili）');
  if (videos.length === 0) {
    lines.push('- 暂无视频');
  } else {
    for (const video of videos) {
      lines.push(
        `- ${video.title}（${video.publishedAt.slice(0, 10)}，${video.duration}）：${video.url}`,
      );
    }
  }
  lines.push('');

  lines.push('## 开源仓库');
  if (repos.length === 0) {
    lines.push('- 暂无公开仓库');
  } else {
    for (const repo of repos) {
      const summary = repo.description ? `：${repo.description}` : '';
      const lang = repo.language ? `，${repo.language}` : '';
      lines.push(`- ${repo.name}（${repo.stars} stars${lang}）${repo.url}${summary}`);
    }
  }
  lines.push('');

  lines.push('## 文章');
  if (posts.length === 0) {
    lines.push('- 暂无文章');
  } else {
    for (const post of posts) {
      lines.push(`- ${post.data.title}：${absolute(`/blog/${post.id}/`)}`);
    }
  }
  lines.push('');

  return new Response(`${lines.join('\n')}\n`, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
    },
  });
};
