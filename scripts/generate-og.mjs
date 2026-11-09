import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import sharp from 'sharp';

const root = process.cwd();
const postsDir = path.join(root, 'src/content/posts');
const outDir = path.join(root, 'public/og');

// 与 src/site.config.ts 中的 url 保持一致，避免手写两遍域名
const siteConfig = fs.readFileSync(path.join(root, 'src/site.config.ts'), 'utf8');
const siteUrl = siteConfig.match(/url:\s*'([^']+)'/)?.[1] ?? 'https://paper-scraps.pages.dev';
const siteDomain = new URL(siteUrl).host.toUpperCase();

fs.mkdirSync(outDir, { recursive: true });

const categories = {
  tech: { zh: '技术', en: 'TECH' },
  tutorial: { zh: '教程', en: 'TUTORIAL' },
  essay: { zh: '随笔', en: 'ESSAY' },
  life: { zh: '生活', en: 'LIFE' },
};

const escapeXml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const charWidth = (char) => {
  if (/[\u3400-\u9fff\u3000-\u303f\uff00-\uffef]/.test(char)) return 1;
  if (char === ' ') return 0.3;
  if (/[iIl1.,'!|:;]/.test(char)) return 0.3;
  if (/[mwMW]/.test(char)) return 0.86;
  return 0.56;
};

const textWidth = (text, size) =>
  Array.from(text).reduce((sum, char) => sum + charWidth(char) * size, 0);

function wrapAll(text, size, maxWidth) {
  const lines = [];
  let line = '';
  let lastSpace = -1;

  for (const char of Array.from(text)) {
    if (line.length > 0 && textWidth(line + char, size) > maxWidth) {
      if (/[a-zA-Z0-9]/.test(char) && lastSpace > 0) {
        lines.push(line.slice(0, lastSpace).trim());
        line = line.slice(lastSpace + 1) + char;
      } else {
        lines.push(line.trim());
        line = char;
      }
      lastSpace = -1;
    } else {
      line += char;
      if (char === ' ') lastSpace = line.length - 1;
    }
  }

  if (line.trim()) lines.push(line.trim());
  return lines;
}

function truncateToWidth(text, size, maxWidth) {
  let line = '';
  for (const char of Array.from(text)) {
    if (textWidth(line + char, size) > maxWidth) break;
    line += char;
  }
  return line.length < Array.from(text).length ? `${line.trim()}…` : line;
}

function fitTitle(title, maxWidth = 940, maxLines = 3) {
  let size = 66;
  let lines = wrapAll(title, size, maxWidth);

  const hasOrphan = (items) =>
    items.length > 1 && Array.from(items[items.length - 1]).length <= 1;

  while (size > 40 && (lines.length > maxLines || hasOrphan(lines))) {
    size -= 3;
    lines = wrapAll(title, size, maxWidth);
  }

  if (lines.length > maxLines) {
    lines = lines.slice(0, maxLines);
    lines[maxLines - 1] = `${lines[maxLines - 1].replace(/…$/, '')}…`;
  }

  return { size, lines };
}

function buildSvg({ title, category, date, lang, subtitle }) {
  const { size, lines } = fitTitle(title);
  const lineHeight = size * 1.24;
  const firstBaseline = 340 - ((lines.length - 1) * lineHeight) / 2;
  const subtitleText = subtitle
    ? truncateToWidth(subtitle, 15, 900)
    : '记录 Minecraft、Web、摄影与影像';

  const categoryLabel = category
    ? `${categories[category]?.zh ?? category} / ${categories[category]?.en ?? ''}`
    : 'S.A';
  const metaDate = date
    ? new Intl.DateTimeFormat('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(date)
    : '';

  const titleLines = lines
    .map(
      (line, index) =>
        `<text x="80" y="${firstBaseline + index * lineHeight}" font-family="Noto Serif CJK SC, Songti SC, serif" font-size="${size}" font-weight="500" fill="#1d1d1f" letter-spacing="-1">${escapeXml(line)}</text>`,
    )
    .join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="wash" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#e7f0ff"/>
      <stop offset="1" stop-color="#f5f5f7"/>
    </linearGradient>
  </defs>

  <rect width="1200" height="630" fill="#f5f5f7"/>
  <rect width="1200" height="630" fill="url(#wash)" opacity="0.55"/>

  <!-- 右侧纸片 -->
  <g transform="rotate(4 1090 160)">
    <path d="M1010 62 L1160 52 L1172 250 L1148 262 L1018 254 L1004 244 Z" fill="#eee4cf" stroke="#c9c0ae" stroke-width="1"/>
    <rect x="1030" y="86" width="96" height="10" fill="#b3986a" opacity="0.35"/>
    <rect x="1030" y="112" width="72" height="8" fill="#b3986a" opacity="0.2"/>
  </g>
  <g transform="rotate(-6 1080 482)">
    <path d="M1020 396 L1148 388 L1160 560 L1130 574 L1014 566 Z" fill="#dde8f0" stroke="#c9c0ae" stroke-width="1"/>
  </g>
  <rect x="1000" y="330" width="110" height="22" fill="#c4ac78" opacity="0.4" transform="rotate(3 1055 341)"/>

  <!-- 品牌标记 -->
  <g transform="rotate(-3 108 98)">
    <path d="M70 60 L146 58 L148 138 L138 144 L68 136 L64 128 Z" fill="#007aff"/>
    <text x="108" y="121" text-anchor="middle" font-family="Noto Serif CJK SC, Songti SC, serif" font-size="40" fill="#fbf8f1">S</text>
  </g>
  <text x="168" y="96" font-family="Noto Serif CJK SC, Songti SC, serif" font-size="30" fill="#1d1d1f" letter-spacing="2">S.A</text>
  <text x="169" y="122" font-family="IBM Plex Mono, monospace" font-size="13" fill="#6e6e73" letter-spacing="4">SHADOW AGENT</text>

  <text x="1130" y="98" text-anchor="end" font-family="IBM Plex Mono, monospace" font-size="13" fill="#6e6e73" letter-spacing="3">VOL. / 2026</text>

  <!-- 分类 -->
  <rect x="80" y="178" width="${Math.max(150, textWidth(categoryLabel, 15) + 34)}" height="30" fill="#e5efff"/>
  <text x="97" y="199" font-family="IBM Plex Mono, monospace" font-size="15" fill="#0062cc" letter-spacing="2">${escapeXml(categoryLabel)}</text>

  <!-- 标题 -->
  ${titleLines}

  <!-- 分隔线 -->
  <rect x="80" y="500" width="120" height="3" fill="#007aff"/>

  <!-- 底部信息 -->
  <text x="80" y="552" font-family="IBM Plex Mono, monospace" font-size="15" fill="#6e6e73" letter-spacing="1">${escapeXml(subtitleText)}</text>
  <text x="80" y="582" font-family="IBM Plex Mono, monospace" font-size="14" fill="#6e6e73" opacity="0.85" letter-spacing="1.5">${escapeXml(lang === 'en' ? 'WRITTEN IN ENGLISH' : '用中文写作')}${metaDate ? ` · ${escapeXml(metaDate)}` : ''}</text>

  <text x="1120" y="582" text-anchor="end" font-family="IBM Plex Mono, monospace" font-size="14" fill="#6e6e73" opacity="0.7" letter-spacing="2">${escapeXml(siteDomain)}</text>

</svg>`;
}

async function writeImage(file, svg) {
  await sharp(Buffer.from(svg))
    .png({ compressionLevel: 9, palette: true })
    .toFile(path.join(outDir, file));
  console.log(`✓ ${file}`);
}

function collectPosts(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectPosts(full));
    } else if (entry.name.endsWith('.md')) {
      results.push(full);
    }
  }
  return results;
}

const files = collectPosts(postsDir);

for (const file of files) {
  const raw = fs.readFileSync(file, 'utf8');
  const { data } = matter(raw);
  const id = path.basename(file, '.md');
  const date = data.date ? new Date(data.date) : undefined;
  const svg = buildSvg({
    title: data.title,
    category: data.category,
    date,
    lang: data.lang,
    subtitle: data.description,
  });
  await writeImage(`${id}.png`, svg);
}

const defaultSvg = buildSvg({
  title: '把想法剪成纸片',
  category: undefined,
  date: undefined,
  lang: 'zh',
  subtitle: 'Minecraft · 开发 · 摄影 · 音乐 · 影像',
});
await writeImage('default.png', defaultSvg);
