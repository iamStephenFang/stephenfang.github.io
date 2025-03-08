import IconMail from "@/assets/icons/IconMail.svg";
import IconGitHub from "@/assets/icons/IconGitHub.svg";
import IconBrandX from "@/assets/icons/IconBrandX.svg";
import IconLinkedin from "@/assets/icons/IconLinkedin.svg";
import IconWhatsapp from "@/assets/icons/IconWhatsapp.svg";
import IconFacebook from "@/assets/icons/IconFacebook.svg";
import IconTelegram from "@/assets/icons/IconTelegram.svg";
import IconPinterest from "@/assets/icons/IconPinterest.svg";
// import IconInstagram from "@/assets/icons/IconInstagram.svg";
// import IconJike from "@/assets/icons/IconJike.svg";
import { SITE } from "@/config";

export const LOCALE = {
  lang: "zh", // html lang code. Set this empty and default will be "en"
  langTag: ["zh-CN"], // BCP 47 Language Tags. Set this empty [] to use the environment default
} as const;

export const SOCIALS = [
  {
    name: "Github",
    href: "https://github.com/iamstephenfang",
    linkTitle: ` ${SITE.title} on Github`,
    icon: IconGitHub,
  },
  // {
  //   name: "Instagram",
  //   href: "https://instagram.com/iamstephenfang",
  //   linkTitle: `${SITE.author} on Instagram`,
  //   icon: IconInstagram,
  // },
  {
    name: "X",
    href: "https://x.com/fangxuanmiao",
    linkTitle: `${SITE.title} on X`,
    icon: IconBrandX,
  },
  {
    name: "Mail",
    href: "mailto:fangxuanmiao@hotmail.com",
    linkTitle: `Send an email to ${SITE.title}`,
    icon: IconMail,
  },
  {
    name: "Telegram",
    href: "https://t.me/stephenfang",
    linkTitle: `${SITE.author} on Telegram`,
    icon: IconTelegram,
  },
  // {
  //   name: "Jike",
  //   href: "https://okjk.co/LZFasc",
  //   linkTitle: `${SITE.author} on Jike`,
  //   icon: IconJike,
  // },
] as const;

export const SHARE_LINKS = [
  {
    name: "WhatsApp",
    href: "https://wa.me/?text=",
    linkTitle: `Share this post via WhatsApp`,
    icon: IconWhatsapp,
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/sharer.php?u=",
    linkTitle: `Share this post on Facebook`,
    icon: IconFacebook,
  },
  {
    name: "X",
    href: "https://x.com/intent/post?url=",
    linkTitle: `Share this post on X`,
    icon: IconBrandX,
  },
  {
    name: "Telegram",
    href: "https://t.me/share/url?url=",
    linkTitle: `Share this post via Telegram`,
    icon: IconTelegram,
  },
  {
    name: "Mail",
    href: "mailto:?subject=See%20this%20post&body=",
    linkTitle: `Share this post via email`,
    icon: IconMail,
  },
] as const;
