import fetch, { RequestInit } from "node-fetch";
import * as cheerio from "cheerio";
import http from "node:http";
import https from "node:https";
import { writeFileSync } from "node:fs";
import { ITikTokResult } from "../../Interfaces/index";
import { TikTokResult } from "../Entities/TikTokResult";

export type HTTPMethods = "get" | "post" | "put" | "delete" | "patch";

export class TikTokScraper {
  /**
   *  Fetches the website content and convert its content into text.
   * @param baseUrl baseUrl of the site to fetch
   * @param searchQuery string of the product you wish to search for
   * @returns Promise<cheerio.CheerioAPI>
   *
   * Example:
   * ```ts
   * const $ = await requestWebsite("https://www.amazon.de/s?k=" + "airpods")
   * // => will return cheerio API Object to work with.
   *
   * $(".prices").each((_, value) => {
   *     console.log($(value).text().trim());
   * });
   * ```
   */

  protected async requestWebsite(baseUrl: string, fetchOptions?: RequestInit) {
    const httpAgent = new http.Agent({
      keepAlive: true,
      maxSockets: 20,
    });
    const httpsAgent = new https.Agent({
      keepAlive: true,
      maxSockets: 20,
    });

    const DefaultOptions = {
      agent: (_parsedURL: any) => {
        if (_parsedURL.protocol == "http:") {
          return httpAgent;
        } else {
          return httpsAgent;
        }
      },
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36 Edg/97.0.1072.62",
      },
    };

    const req = await fetch(
      `${baseUrl}`,
      fetchOptions ? fetchOptions : DefaultOptions
    );
    const res = await req.text();
    const $ = cheerio.load(res, {
      xmlMode: true,
    });
    return $;
  }

  /**
   * Scrapes a given tiktok video page and returns its info!
   * @param link the tiktok link to scrape
   * @returns ITikTokResult
   */

  async scrapeByLink(link: string): Promise<ITikTokResult> {
    const $ = await this.requestWebsite(link);
    const grabInfoObject = $("#sigi-persisted-data").text();

    const replaceObjectName = grabInfoObject
      .replace(`window['SIGI_STATE']`, "module.exports.info")
      .replace(`window['SIGI_RETRY']`, "const idc");

    writeFileSync(`${__dirname}/info.js`, replaceObjectName, "utf8");
    const { info } = require(`${__dirname}/info.js`);

    const id = info.ItemList.video.list[0];
    const author = info.ItemModule[id].author;

    const ScrapeResult: ITikTokResult = {
      author: {
        id: info.UserModule.users[author].id,
        uniqueId: info.UserModule.users[author].uniqueId,
        avatar: info.UserModule.users[author]?.avatarLarger,
        signature: info.UserModule.users[author]?.signature,
        user_created: new Date(info.UserModule.users[author]?.createTime),
        verified: info.UserModule.users[author]?.verified,
      },

      video: {
        id: info.ItemModule[id].video.id,
        height: Number(info.ItemModule[id].video.height),
        width: Number(info.ItemModule[id].video.width),
        duration: Number(info.ItemModule[id].video.duration),
        resolution: info.ItemModule[id].video.ratio,
        cover: info.ItemModule[id].video.cover,
        dynamicCover: info.ItemModule[id].video.dynamicCover,
        playURL: info.ItemModule[id].video.playAddr.trim(),
        downloadURL: info.ItemModule[id].video.downloadAddr.trim(),
      },

      audio: {
        id: info.ItemModule[id].music.id,
        title: info.ItemModule[id].music.title,
        playURL: info.ItemModule[id].music.playUrl,
        coverLarge: info.ItemModule[id].music.coverLarge,
        coverThumb: info.ItemModule[id].music.coverThumb,
        author: info.ItemModule[id].music.authorName,
        original: info.ItemModule[id].music.original,
        duration: Number(info.ItemModule[id].music.duration),
        album: info.ItemModule[id].music.album,
      },
      shareCount: info.ItemModule[id].stats.shareCount,
      likesCount: info.ItemModule[id].stats.diggCount,
      commentCount: info.ItemModule[id].stats.commentCount,
      playCount: info.ItemModule[id].stats.playCount,
      createdAt: new Date(Number(info.ItemModule[id].createTime)),
      tiktokLink: `https://www.tiktok.com/@${info.ItemModule[id].author}/video/${info.ItemModule[id].video.id}`,
      thumbnail: info.ItemModule[id].video.cover,
    };

    return new TikTokResult(
      ScrapeResult.author,
      ScrapeResult.video,
      ScrapeResult.audio,
      ScrapeResult.shareCount,
      ScrapeResult.likesCount,
      ScrapeResult.commentCount,
      ScrapeResult.playCount,
      ScrapeResult.createdAt,
      ScrapeResult.tiktokLink,
      ScrapeResult.thumbnail
    );
  }
}
