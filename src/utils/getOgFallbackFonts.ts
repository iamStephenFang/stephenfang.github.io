import type { Font } from "satori";

export const ogTitleFontFamily = "Noto Serif SC, Google Sans Code";

const chineseFontCache = new Map<string, Promise<Font[]>>();

async function fetchFont(url: URL | string): Promise<ArrayBuffer> {
  const response = await fetch(url, { signal: AbortSignal.timeout(30_000) });
  if (!response.ok) {
    throw new Error(`Failed to load OG font: ${response.status} (${url})`);
  }
  return response.arrayBuffer();
}

export async function getOgFallbackFonts(text: string): Promise<Font[]> {
  // Latin-only covers keep the upstream fonts and avoid an extra request.
  if (!/[^\u0000-\u024f]/u.test(text)) return [];

  // Request every character used in the image, including punctuation, as one
  // subset. Browser/system font fallbacks are unavailable to Satori.
  const characters = [...new Set(text)].sort().join("");
  let fonts = chineseFontCache.get(characters);
  if (!fonts) {
    fonts = Promise.all(
      ([400, 700] as const).map(async weight => {
        const url = new URL("https://fonts.googleapis.com/css2");
        url.searchParams.set("family", `Noto Serif SC:wght@${weight}`);
        url.searchParams.set("text", characters);
        const response = await fetch(url, {
          signal: AbortSignal.timeout(30_000),
        });
        if (!response.ok) {
          throw new Error(`Failed to load OG font CSS: ${response.status}`);
        }
        // The default (non-browser) request returns a Satori-compatible TTF.
        const css = await response.text();
        const resource = css.match(
          /src:\s*url\(([^)]+)\)\s*format\(['"](?:truetype|opentype)['"]\)/
        );
        if (!resource) {
          throw new Error("No Satori-compatible Chinese OG font found");
        }
        return {
          name: "Noto Serif SC",
          data: await fetchFont(resource[1]),
          weight,
          style: "normal" as const,
        };
      })
    );
    chineseFontCache.set(characters, fonts);
    // Allow a later request to retry after a transient download failure.
    fonts.catch(() => chineseFontCache.delete(characters));
  }
  return fonts;
}
