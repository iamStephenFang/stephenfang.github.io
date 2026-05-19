import { defineAstroPaperConfig } from "./src/types/config";

export default defineAstroPaperConfig({
  site: {
    url: "https://stephenfang.me",
    title: "StephenFang's Blog",
    description: "stephenfang.me",
    author: "Stephen Fang",
    profile: "https://jike.city/stephenfang",
    ogImage: "default-og.jpg",
    lang: "zh-CN",
    timezone: "Asia/Shanghai",
    dir: "auto",
  },
  posts: {
    perPage: 4,
    perIndex: 4,
    scheduledPostMargin: 15 * 60 * 1000,
  },
  features: {
    lightAndDarkMode: true,
    dynamicOgImage: true,
    showArchives: true,
    showBackButton: true,
    editPost: {
      enabled: false,
    },
    search: "pagefind",
  },
  socials: [
    { name: "github", url: "https://github.com/iamstephenfang" },
    { name: "instagram", url: "https://instagram.com/iamstephenfang" },
    { name: "x", url: "https://x.com/fangxuanmiao" },
    { name: "mail", url: "mailto:fangxuanmiao@hotmail.com" },
    { name: "telegram", url: "https://t.me/stephenfang" },
    {
      name: "jike",
      url: "https://okjk.co/LZFasc",
      linkTitle: "Stephen Fang on Jike",
    },
  ],
  shareLinks: [
    { name: "whatsapp", url: "https://wa.me/?text=" },
    { name: "x", url: "https://x.com/intent/post?url=" },
    { name: "telegram", url: "https://t.me/share/url?url=" },
    { name: "mail", url: "mailto:?subject=See%20this%20post&body=" },
  ],
});
