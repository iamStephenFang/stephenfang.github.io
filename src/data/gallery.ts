export const unsplashProfile =
  "https://unsplash.com/@stephenfang?utm_source=stephenfang_blog&utm_medium=referral";

export interface GalleryPhoto {
  id: string;
  alt: string;
  width: number;
  height: number;
  imageUrl: string;
  pageUrl: string;
}

function unsplashUrl(value: unknown, hostname: string): string {
  if (typeof value !== "string")
    throw new Error("Unsplash 返回了无效的照片链接。");
  const url = new URL(value);
  if (url.protocol !== "https:" || url.hostname !== hostname) {
    throw new Error("Unsplash 返回了无效的照片链接。");
  }
  return url.href;
}

function parsePhoto(value: unknown): GalleryPhoto {
  if (!value || typeof value !== "object") {
    throw new Error("Unsplash 返回了无效的照片数据。");
  }
  const photo = value as Record<string, unknown>;
  const urls = photo.urls as Record<string, unknown> | undefined;
  const links = photo.links as Record<string, unknown> | undefined;
  if (
    typeof photo.id !== "string" ||
    typeof photo.width !== "number" ||
    !Number.isFinite(photo.width) ||
    photo.width <= 0 ||
    typeof photo.height !== "number" ||
    !Number.isFinite(photo.height) ||
    photo.height <= 0
  ) {
    throw new Error("Unsplash 返回了无效的照片数据。");
  }
  const pageUrl = new URL(unsplashUrl(links?.html, "unsplash.com"));
  pageUrl.searchParams.set("utm_source", "stephenfang_blog");
  pageUrl.searchParams.set("utm_medium", "referral");
  return {
    id: photo.id,
    alt:
      (typeof photo.alt_description === "string" && photo.alt_description) ||
      (typeof photo.description === "string" && photo.description) ||
      "Stephen Fang 的摄影作品",
    width: photo.width,
    height: photo.height,
    imageUrl: unsplashUrl(urls?.raw, "images.unsplash.com"),
    pageUrl: pageUrl.href,
  };
}

// Called only by the Astro page frontmatter, at build time. Never shipped to browsers.
export async function fetchGalleryPhotos(
  accessKey: string,
  fetcher: typeof fetch = fetch
): Promise<GalleryPhoto[]> {
  if (!accessKey.trim()) {
    throw new Error("请配置 UNSPLASH_ACCESS_KEY 后再构建摄影页。");
  }
  const photos = new Map<string, GalleryPhoto>();
  for (let page = 1; page <= 100; page++) {
    const url = new URL("https://api.unsplash.com/users/stephenfang/photos");
    url.searchParams.set("page", String(page));
    url.searchParams.set("per_page", "30");
    url.searchParams.set("order_by", "latest");
    let response: Response;
    try {
      response = await fetcher(url, {
        headers: {
          Authorization: `Client-ID ${accessKey.trim()}`,
          "Accept-Version": "v1",
        },
        signal: AbortSignal.timeout(20_000),
      });
    } catch {
      throw new Error("无法连接 Unsplash API，请稍后重试构建。");
    }
    if (!response.ok) {
      // Do not include request headers or the API response body in build logs.
      throw new Error(
        `Unsplash API 请求失败（HTTP ${response.status}），请检查 Access Key 或配额后重试构建。`
      );
    }
    const batch: unknown = await response.json();
    if (!Array.isArray(batch))
      throw new Error("Unsplash 返回了无效的照片列表。");
    for (const value of batch) {
      const photo = parsePhoto(value);
      photos.set(photo.id, photo);
    }
    const pagination = response.headers.get("link");
    if (
      batch.length < 30 ||
      (pagination !== null && !/rel="next"/.test(pagination))
    ) {
      return [...photos.values()];
    }
  }
  throw new Error("Unsplash 照片分页超过上限，请检查 API 响应。");
}

// Preserve the API's image URL, including its ixid tracking parameter.
export function photoUrl(imageUrl: string, width: number): string {
  const url = new URL(imageUrl);
  url.searchParams.set("auto", "format");
  url.searchParams.set("fit", "max");
  url.searchParams.set("w", String(width));
  url.searchParams.set("q", "80");
  return url.href;
}
