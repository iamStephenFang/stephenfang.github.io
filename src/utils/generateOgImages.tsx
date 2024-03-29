import satori, { type SatoriOptions } from "satori";
import { Resvg } from "@resvg/resvg-js";
import { type CollectionEntry } from "astro:content";
import postOgImage from "./og-templates/post";
import siteOgImage from "./og-templates/site";

const fetchFont = async () => {
  // Regular Font
  const fontFileRegular = await fetch(
    "https://image.stephenfang.me/fonts/SmileySans-Oblique.ttf"
  );
  const fontRegular: ArrayBuffer = await fontFileRegular.arrayBuffer();
  return { fontRegular };
};

const { fontRegular } = await fetchFont();

const options: SatoriOptions = {
  width: 1200,
  height: 630,
  embedFont: true,
  fonts: [
    {
      name: "SmileySans-Oblique",
      data: fontRegular,
      weight: 400,
      style: "normal",
    }
  ],
};

function svgBufferToPngBuffer(svg: string) {
  const resvg = new Resvg(svg);
  const pngData = resvg.render();
  return pngData.asPng();
}

export async function generateOgImageForPost(post: CollectionEntry<"blog">) {
  const svg = await satori(postOgImage(post), options);
  return svgBufferToPngBuffer(svg);
}

export async function generateOgImageForSite() {
  const svg = await satori(siteOgImage(), options);
  return svgBufferToPngBuffer(svg);
}
