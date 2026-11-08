---
title: 'CSS 撕纸边缘的三种做法'
description: '不用一张图片，也能让卡片看起来像从笔记本上撕下来的纸片。比较 clip-path、mask-image 与 SVG 滤镜的取舍。'
date: 2026-09-16
lang: zh
category: tutorial
tags: ['CSS', '设计', '排版']
featured: true
---

纸的质感很少来自「纸」本身，更多来自它的边缘：不规则的毛边、轻微的卷曲、被撕开时留下的纤维。

这篇文章记录我在这个站点里试过的三种做法。它们都不需要图片，也不会增加额外的网络请求。

## 方法一：clip-path 多边形

最直观的方式，是用一长串坐标把矩形裁成不规则形状：

```css
.torn {
  clip-path: polygon(
    0% 1.8%, 3.2% 0%, 9% 1.2%, 16% 0.1%,
    24% 1%, 32% 0.2%, 40% 1.3%, 48% 0%,
    56% 1.1%, 64% 0.2%, 72% 1.2%, 80% 0%,
    88% 1.1%, 94% 0.1%, 99% 1.6%, 100% 8%,
    99.1% 17%, 100% 26%, 99% 35%, 100% 44%
    /* …继续绕一圈 */
  );
}
```

优点是渲染成本极低、兼容性好，而且可以只裁某一条边。缺点是坐标是写死的，形状会随着元素尺寸拉伸——在宽卡片上看起来还算自然，在很小的标签上就会失真。

**适合**：尺寸相对稳定的卡片、按钮、引用块。

## 方法二：mask-image 与渐变

如果只想让下边缘呈现撕裂感，可以用遮罩，把边缘「擦」成锯齿：

```css
.torn-bottom {
  --tooth: 10px;
  mask-image:
    linear-gradient(#000 0 0),
    repeating-linear-gradient(
      90deg,
      #000 0 calc(var(--tooth) * 1.4),
      transparent calc(var(--tooth) * 1.4) calc(var(--tooth) * 1.8),
      #000 calc(var(--tooth) * 1.8) calc(var(--tooth) * 3)
    );
  mask-size: 100% calc(100% - 12px), 100% 12px;
  mask-position: top, bottom;
  mask-repeat: no-repeat;
}
```

它比 `clip-path` 更灵活，因为锯齿的密度可以通过变量调节。但遮罩会创建额外的合成层，元素很多时要留意滚动性能。

**适合**：需要响应式宽度的横幅、分隔带。

## 方法三：SVG 滤镜

真正接近纸张纤维的做法，是用 `feTurbulence` 生成噪声，再用 `feDisplacementMap` 扭曲边缘：

```html
<svg width="0" height="0" aria-hidden="true">
  <filter id="paper-edge">
    <feTurbulence
      type="fractalNoise"
      baseFrequency="0.02 0.04"
      numOctaves="3"
      seed="7"
      result="noise"
    />
    <feDisplacementMap
      in="SourceGraphic"
      in2="noise"
      scale="8"
      xChannelSelector="R"
      yChannelSelector="G"
    />
  </filter>
</svg>
```

```css
.torn-filter {
  filter: url(#paper-edge);
}
```

效果最自然，代价也最大：滤镜在部分设备上会触发较重的栅格化，而且不同浏览器的位移结果不完全一致。我在这个站点里只把它用在首屏的一两块装饰纸片上。

**适合**：少量、面积大、静态的装饰元素。

## 我的取舍

正文卡片和文章列表用 `clip-path`，因为它们的宽度可控；页脚的整条纸带用 `mask-image`，因为它需要跟随视口；只有首页那几片「飘着的纸」用 SVG 滤镜，而且会在 `prefers-reduced-motion` 下保持静止。

还有一个容易被忽略的细节：**撕边不能破坏可读性**。文字与边缘之间至少要留出 20px 的安全距离，否则在窄屏上，第一行字会被裁掉一角。

> 纸的质感不是加出来的，是减出来的。先决定哪里该被撕开，再决定哪里必须保持完整。

## 性能检查清单

- 用 `clip-path` 时避免在滚动容器里频繁改变形状；
- `mask-image` 元素不要嵌套过多；
- SVG 滤镜不要作用于包含大量文本的容器；
- 在所有方案里都保留一个无滤镜的降级状态。
