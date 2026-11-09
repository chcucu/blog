/**
 * 站点配置：上线前优先修改这里。
 * 所有可替换的占位信息都集中在 site 对象里，改完即生效。
 */
export const site = {
  name: 'S.A',
  nameEn: 'S.A',
  tagline: '开发、摄影与影像记录',
  description:
    'shadow_agent404 的个人站点，记录 Minecraft 服务端开发、Paper 插件、Web 工程、摄影、音乐与影像。',
  descriptionEn:
    'Personal site of shadow_agent404, covering Minecraft server development, Paper plugins, web engineering, photography, music and video.',
  url: 'https://blog.tenyearmc.top',
  author: 'shadow_agent404',
  handle: '@shadow_agent404',
  email: 'chenjh8557@outlook.com',
  locale: 'zh-CN',
  startYear: 2024,
  /** 首页与关于页展示的身份标签，按你的实际情况修改。 */
  roles: [
    '十年之约服主',
    'Paper 插件开发',
    'Web 开发',
    '摄影',
    '音乐',
    '影像',
    '学生',
    '自媒体',
  ],
  /** 头像：把图片放到 public/uploads 后填写路径，例如 '/uploads/avatar.jpg'；留空显示文字头像。 */
  avatar: '/uploads/avatar.jpg',

  /** 社交链接：把 href 换成你的主页即可；不需要的可以删掉。 */
  socials: [
    {
      label: 'Bilibili',
      href: 'https://space.bilibili.com/3494363455818333',
      icon: 'bilibili',
    },
    { label: 'GitHub', href: 'https://github.com/chcucu', icon: 'github' },
    {
      label: 'Modrinth',
      href: 'https://modrinth.com/project/AQ3n1LCg',
      icon: 'modrinth',
    },
    {
      label: 'QQ',
      href: 'https://wpa.qq.com/msgrd?v=3&uin=1394004275&site=qq&menu=yes',
      icon: 'qq',
    },
    { label: 'RSS', href: '/rss.xml', icon: 'rss' },
  ],

  /** Giscus 评论：在 https://giscus.app 获取这四个值后填入即可开启。 */
  giscus: {
    repo: 'chcucu/blog',
    repoId: 'R_kgDOVnQsFw',
    category: 'Announcements',
    categoryId: 'DIC_kwDOVnQsF84DKq4t',
  },

  /** Umami 统计：填入自托管脚本地址和 website id 后自动加载。 */
  umami: {
    scriptUrl: '',
    websiteId: '',
  },

  /** 点赞接口：部署到 Cloudflare Pages 后由 functions/api/likes.js 提供。 */
  likesEndpoint: '/api/likes',
} as const;

export type SiteConfig = typeof site;
