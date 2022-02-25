import fetch, { RequestInit } from "node-fetch";
import * as cheerio from "cheerio";
import http from "node:http";
import https from "node:https";
import { writeFileSync } from "node:fs";
import { IVideo } from "../../Interfaces/index";
import { IUser } from "../../Interfaces/IUser";
import { User } from "../Entities/User";
import { Video } from "../Entities/Video";

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

  private async requestWebsite(baseUrl: string, fetchOptions?: RequestInit) {
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
   * Replaces the window Object with a export string and writes the new JS file to work with the result as a JS Object
   * @param type type of the data you are handling.
   * @param content the HTML content of the Page
   */

  private handleHTMLContent(type: string, content: string) {
    const removeWindowObject = content
      .replace(`window['SIGI_STATE']`, `module.exports.${type}`)
      .replace(`window['SIGI_RETRY']`, `const idc`);

    writeFileSync(`${__dirname}/${type}.js`, removeWindowObject, "utf-8");
  }

  /**
   * Scrapes the tiktok video info from the given Link
   * @param uri the tiktok video to scrape
   * @returns Video
   */

  async video(uri: string): Promise<Video> {
    if (!uri) throw new Error("A video URL must be provided");

    const $ = await this.requestWebsite(uri);
    const videoObject = $("#sigi-persisted-data").text();

    this.handleHTMLContent("video", videoObject);

    const { video } = require(`${__dirname}/video.js`);

    const id = video.ItemList.video.list[0];

    const videoResult: IVideo = {
      id: video.ItemModule[id].video.id,
      description: video.ItemModule[id].video.desc,
      createdAt: new Date(
        Number(video.ItemModule[id].createTime) * 1000
      ).toLocaleDateString(),
      height: Number(video.ItemModule[id].video.height),
      width: Number(video.ItemModule[id].video.width),
      duration: Number(video.ItemModule[id].video.duration),
      resolution: video.ItemModule[id].video.ratio,
      shareCount: video.ItemModule[id].stats.shareCount,
      likesCount: video.ItemModule[id].stats.diggCount,
      commentCount: video.ItemModule[id].stats.commentCount,
      playCount: video.ItemModule[id].stats.playCount,
      cover: video.ItemModule[id].video.cover,
      dynamicCover: video.ItemModule[id].video.dynamicCover,
      playURL: video.ItemModule[id].video.playAddr.trim(),
      downloadURL: video.ItemModule[id].video.downloadAddr.trim(),
      fomrat: video.ItemModule[id].video.format,
    };

    return new Video(
      videoResult.id,
      videoResult.description,
      videoResult.createdAt,
      videoResult.height,
      videoResult.width,
      videoResult.duration,
      videoResult.resolution,
      videoResult.shareCount,
      videoResult.likesCount,
      videoResult.commentCount,
      videoResult.playCount,
      videoResult.cover,
      videoResult.dynamicCover,
      videoResult.playURL,
      videoResult.downloadURL,
      videoResult.fomrat
    );
  }

  /**
   * Scrapes the given user page and returns all available info
   * @param username tiktok username of a user
   * @returns User
   */

  async user(username: string): Promise<User> {
    if (!username) throw new Error("Please enter a username");

    const $ = await this.requestWebsite(`https://www.tiktok.com/@${username}`);
    const grabInfoObject = $("#sigi-persisted-data").text();

    this.handleHTMLContent("user", grabInfoObject);
    const { user } = require(`${__dirname}/user.js`);
    const userObject = user.UserModule.users[username];

    const userResult: IUser = {
      id: userObject.id,
      uniqueId: userObject.uniqueId,
      nickname: userObject.nickname,
      avatar: userObject.avatarLarger,
      signature: userObject.signature.trim(),
      createdAt: new Date(userObject.createTime * 1000).toLocaleDateString(),
      verified: userObject.verified,
      secretUID: userObject.secUid,
      bioLink: userObject?.bioLink?.link,
      privateAccount: userObject.privateAccount,
      isUnderAge18: userObject.isUnderAge18,
      followers: user.UserModule.stats[username].followerCount,
      following: user.UserModule.stats[username].followingCount,
      hearts: user.UserModule.stats[username].heart,
      videos: user.UserModule.stats[username].videoCount,
    };

    return new User(
      userResult.id,
      userResult.uniqueId,
      userResult.nickname,
      userResult.avatar,
      userResult.signature,
      userResult.createdAt,
      userResult.verified,
      userResult.secretUID,
      userResult.bioLink,
      userResult.privateAccount,
      userResult.isUnderAge18,
      userResult.followers,
      userResult.following,
      userResult.hearts,
      userResult.videos
    );
  }

  async getAllVideosFromUser() {}
  async getMusic() {}
}
