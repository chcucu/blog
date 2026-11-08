---
title: 'Notes on Writing in Two Languages'
description: 'On keeping a single voice while publishing in Chinese and English — and why this site has no translation pairs.'
date: 2026-06-05
lang: en
category: essay
tags: ['Writing', 'Bilingual']
---

I write in Chinese and English, but I do not translate myself.

That decision sounds more ideological than it is. Early on, I tried the usual pattern: write a post in Chinese, then produce an English version, link the two, and add a small language switcher. It lasted about four posts. The English versions were shorter, flatter, and strangely polite. They read like summaries of the Chinese originals, because that is exactly what they were.

## Translation flattens the thought

A sentence in Chinese often carries its rhythm in the characters themselves. When you translate it, you keep the meaning and lose the cadence. What remains is technically correct and emotionally thinner.

The reverse is also true. An English paragraph built from short, declarative sentences becomes bloated when rendered into Chinese, because Chinese expects a different kind of connective tissue.

You can solve this with skill. I could spend another hour on each translation, rewriting instead of converting. But then I would be writing two essays, not one — and at that point the language switcher is a promise I cannot keep.

## One URL space, two kinds of posts

So this site treats language as metadata, not architecture:

- every post has a `lang` field;
- posts live in the same `/blog/` space;
- the language appears as a small tag next to the title;
- there are no paired translations and no automatic redirects.

A reader who only reads English will miss some posts. That is fine. A personal blog is not a product with locale coverage requirements.

```ts
type Post = {
  title: string;
  lang: 'zh' | 'en';
  // no translationOf, no locale routes
};
```

## Voice is the thing that survives

The interesting question is not whether the two languages sound the same. They cannot. The question is whether the same person is obviously behind both.

For me, that means keeping a few constants:

1. **Concrete before abstract.** Start with a scene, a failure, a number — not a thesis.
2. **Short paragraphs.** Both languages tolerate white space better than they tolerate density.
3. **No throat-clearing.** Delete the first paragraph of any draft. It is usually an apology for writing.
4. **One idea per piece.** If two ideas need each other, they are one idea. If they do not, they are two posts.

## The reader in the middle

There is a specific kind of reader I care about: someone who reads both languages, perhaps not equally well, and who notices when a sentence has been sanded down.

For that reader, a translation is often more visible than the original. They can feel the place where a metaphor was replaced by an explanation. Publishing each piece in the language it was thought in is a way of respecting that attention.

It also makes the archive more honest. What you see is what was actually written, not a second-hand version cleaned up for a broader audience.
