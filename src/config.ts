import type { Site, SocialObjects } from "./types";

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
    name: "Twitter",
    href: "https://twitter.com/fangxuanmiao",
    linkTitle: `${SITE.author} on Twitter`,
    active: true,
  },
  {
    name: "Telegram",
    href: "https://t.me/stephenfang",
    linkTitle: `${SITE.author} on Telegram`,
    active: true,
  },
];
