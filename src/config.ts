import type { Site, SocialObjects } from "./types";
import type { GiscusProps } from "@giscus/react";

export const SITE: Site = {
  website: "https://stephenfang.me",
  author: "StephenFang",
  desc: "stephenfang.me",
  title: "StephenFang's Blog",
  lightAndDarkMode: true,
  postPerIndex: 4,
  postPerPage: 3,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: true,
};

export const LOCALE = ["zh-CN"];

export const LOGO_IMAGE = {
  enable: false,
  svg: true,
  width: 216,
  height: 46,
};

export const SOCIALS: SocialObjects = [
  {
    name: "Github",
    href: "https://github.com/iamstephenfang",
    linkTitle: ` ${SITE.author} on Github`,
    active: true,
  },
  {
    name: "Instagram",
    href: "https://instagram.com/iamstephenfang",
    linkTitle: `${SITE.author} on Instagram`,
    active: true,
  },
  {
    name: "Mail",
    href: "mailto:fangxuanmiao@hotmail.com",
    linkTitle: `Send an email to ${SITE.author}`,
    active: true,
  },
  {
    name: "X",
    href: "https://x.com/fangxuanmiao",
    linkTitle: `${SITE.author} on X`,
    active: true,
  },
  {
    name: "Telegram",
    href: "https://t.me/stephenfang",
    linkTitle: `${SITE.author} on Telegram`,
    active: true,
  },
  {
    name: "Jike",
    href: "https://okjk.co/LZFasc",
    linkTitle: `${SITE.author} on Jike`,
    active: true,
  },
];

export const GISCUS: GiscusProps = {
  repo: "iamStephenFang/stephenfang.github.io",
  repoId: "MDEwOlJlcG9zaXRvcnkyMzg4NzI1MjU=",
  category: "Blog Post Comments",
  categoryId: "DIC_kwDODjznzc4CcOye",
  mapping: "title",
  reactionsEnabled: "1",
  emitMetadata: "0",
  inputPosition: "top",
  lang: "zh-CN",
  loading: "lazy",
};
