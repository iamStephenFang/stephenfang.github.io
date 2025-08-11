export const SITE = {
  website: "https://stephenfang.me",
  author: "Stephen Fang",
  profile: "https://jike.city/stephenfang",
  desc: "stephenfang.me",
  title: "StephenFang's Blog",
  ogImage: "https://image.stephenfang.me/og-image.jpeg",
  lightAndDarkMode: true,
  postPerIndex: 4,
  postPerPage: 4,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: true,
  showBackButton: true,
  editPost: {
    enabled: false,
    text: "Edit page",
    url: "https://github.com/iamStephenFang/stephenfang.github.io/edit/master",
  },
  dynamicOgImage: true,
  dir: "auto", // "rtl" | "auto"
  lang: "en", // html lang code. Set this empty and default will be "en"
  timezone: "Asia/Shanghai", // Default global timezone (IANA format) https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
} as const;
