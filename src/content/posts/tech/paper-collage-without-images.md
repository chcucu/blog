---
title: 'A Paper Collage Built Without Images'
description: 'How to make a visual identity out of type, torn edges and noise — and why the hero section has zero image requests.'
date: 2026-05-18
lang: en
category: tech
tags: ['Design', 'CSS', 'Performance']
---

The first version of this site had a large photograph at the top. It looked fine. It also weighed 420KB, shifted the layout on slow connections, and forced every article to compete with a stock image that had nothing to do with the text.

The second version removed it. What replaced it was not a smaller image or a clever placeholder, but a set of rules: paper, ink, tape, torn edges, and a lot of type.

## The material is the interface

A paper collage works because every element looks like it belongs to the same physical world:

- a warm off-white background, not pure white;
- a deep ink blue for text, not black;
- edges that are cut or torn, never perfectly square;
- tape and shadow that suggest depth without pretending to be 3D.

None of this requires an image. The background is a CSS gradient plus an inline SVG noise texture. Torn edges are `clip-path` polygons. Tape is a translucent rectangle with a slight rotation.

```css
.scrap {
  transform: rotate(var(--tilt, 0deg));
  transition: transform 0.4s var(--ease);
}

.scrap:hover {
  transform: translateY(-4px) rotate(calc(var(--tilt, 0deg) * 0.25));
}
```

The rotation is small — usually between -2 and 2 degrees. Enough to feel handmade, not enough to make reading uncomfortable.

## Typography does the heavy lifting

With no imagery, hierarchy has to come from scale and contrast. I use three voices:

1. **A display serif** for headlines, slightly soft, with a high optical size.
2. **A neutral sans** for body copy, because long-form reading should be quiet.
3. **A mono face** for labels, dates and metadata, which gives the page its editorial texture.

The Chinese text falls back to a system serif for headings. That is a deliberate compromise: a full CJK webfont would add megabytes, and the difference is not worth it for a personal site.

## Noise is not decoration

A flat background reads as a screen. A tiny amount of noise reads as paper. The whole effect is a single SVG data URI, repeated at 220 pixels and rendered at about 5% opacity:

```css
body {
  background-image:
    radial-gradient(1100px 620px at 88% -8%, var(--wash-blue), transparent 62%),
    url("data:image/svg+xml,%3Csvg …%3E");
}
```

Because it is a background layer, it costs one extra paint and no network request. It also adapts to dark mode through a separate token set rather than a filter.

## What this buys

The home page now transfers roughly 30KB of HTML and CSS before fonts. There is no hero image to wait for, no layout shift reserved for one, and no art direction to maintain.

More importantly, the visual system scales. A new post does not need a cover image. A project card does not need a screenshot. The site can grow without a backlog of missing assets.

## When to use a real photograph

The collage is not a religion. A photo belongs on the site when the photo *is* the content — a travel note, a sketchbook page, a picture of a place that cannot be described in type.

The rule I use is simple: if the image could be replaced by any other image without changing the meaning, it is decoration. Decoration should be drawn by the system, not downloaded from a stock library.
