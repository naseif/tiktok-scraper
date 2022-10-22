import { TTScraper } from "./BL/Scrapers/TikTokScraper";

/**
 * Scrapes the tiktok video info from the given url
 * @param url tiktok video url
 * @param noWaterMark if video should be without watermark
 * @returns Video
 */

export async function fetchVideo(url: string, noWaterMark?: boolean) {
  if (!url) throw new Error(`You must provide a Tiktok video url!`);

  return await new TTScraper().video(url, noWaterMark);
}

/**
 * Scrapes the given user page and returns all available info
 * @param username tiktok username of a user
 * @returns User
 */

export async function fetchUser(username: string) {
  if (!username) throw new Error(`You must provide a username!`);
  return await new TTScraper().user(username);
}

/**
 * Scrapes a user page and returns a list of all videos for this user
 * @param username tiktok username of a user
 * @param noWaterMark if true, noWaterMark
 * @returns IVideo[]
 */

export async function fetchAllVideosFromUser(username: string) {
  if (!username) throw new Error(`You must provide a username!`);
  return await new TTScraper().getAllVideosFromUser(username);
}

/**
 * Scrapes the given Link and returns information about the Music of the Video
 * @param url tiktok video url
 * @returns Music
 */

export async function fetchMusic(url: string) {
  if (!url) throw new Error(`You must provide a Tiktok video url!`);

  return await new TTScraper().getMusic(url);
}

/**
 * Returns direct download link for the tiktok video with no watermark!
 * @param url tiktok video url
 * @returns
 */

export async function fetchVideoNoWaterMark(url: string) {
  if (!url) throw new Error(`You must provide a Tiktok video url!`);

  return await new TTScraper().noWaterMark(url);
}

/**
 * Scrapes a hashtag posts
 * @param tag tiktok hashtag
 * @returns Promise<IVideo[]>
 */

export async function hashtag(tag: string) {
  if (!tag) throw new Error(`You must provide a tiktok hashtag`);

  return await new TTScraper().hashTag(tag);
}

export * from "./BL";
export * from "./Interfaces";
