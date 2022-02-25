import fetch, { RequestInit } from "node-fetch";
import * as cheerio from "cheerio";
import http from "node:http";
import https from "node:https";
import { IMusic, IVideo, IUser } from "../../Interfaces/index";
import { User, Video, Music } from "../Entities";

export class TTScraper {
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

  private handleHTMLContent(content: string) {
    const htmlObject = content;
    const removeWindowObject = htmlObject
      .split("window['SIGI_STATE']=")[1]
      .indexOf(";window['SIGI_RETRY']=");

    const object = JSON.parse(
      htmlObject.split("window['SIGI_STATE']=")[1].slice(0, removeWindowObject)
    );
    return object;
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

    const videoJson = this.handleHTMLContent(videoObject);

    const id = videoJson.ItemList.video.list[0];

    const videoResult: IVideo = new Video(
      videoJson.ItemModule[id].video.id,
      videoJson.ItemModule[id].video.desc,
      new Date(
        Number(videoJson.ItemModule[id].createTime) * 1000
      ).toLocaleDateString(),
      Number(videoJson.ItemModule[id].video.height),
      Number(videoJson.ItemModule[id].video.width),
      Number(videoJson.ItemModule[id].video.duration),
      videoJson.ItemModule[id].video.ratio,
      videoJson.ItemModule[id].stats.shareCount,
      videoJson.ItemModule[id].stats.diggCount,
      videoJson.ItemModule[id].stats.commentCount,
      videoJson.ItemModule[id].stats.playCount,
      videoJson.ItemModule[id].video.cover,
      videoJson.ItemModule[id].video.dynamicCover,
      videoJson.ItemModule[id].video.playAddr.trim(),
      videoJson.ItemModule[id].video.downloadAddr.trim(),
      videoJson.ItemModule[id].video.format
    );

    return videoResult;
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

    const userJson = this.handleHTMLContent(grabInfoObject);
    const userObject = userJson.UserModule.users[username];

    const userResult: IUser = new User(
      userObject.id,
      userObject.uniqueId,
      userObject.nickname,
      userObject.avatarLarger,
      userObject.signature.trim(),
      new Date(userObject.createTime * 1000).toLocaleDateString(),
      userObject.verified,
      userObject.secUid,
      userObject?.bioLink?.link,
      userObject.privateAccount,
      userObject.isUnderAge18,
      userJson.UserModule.stats[username].followerCount,
      userJson.UserModule.stats[username].followingCount,
      userJson.UserModule.stats[username].heart,
      userJson.UserModule.stats[username].videoCount
    );
    return userResult;
  }

  /**
   * Scrapes a user page and returns a list of all videos for this user
   * @param username tiktok username
   * @returns IVideo[]
   */

  async getAllVideosFromUser(username: string): Promise<IVideo[]> {
    if (!username) throw new Error("You must provide a username!");

    const $ = await this.requestWebsite(`https://www.tiktok.com/@${username}`);
    const userInfo = $("#sigi-persisted-data").text();

    const userJsonObject = this.handleHTMLContent(userInfo);

    const videos: IVideo[] = [];

    const { ItemList } = userJsonObject;
    ItemList["user-post"].list.forEach((id: string) => {
      videos.push(
        new Video(
          userJsonObject.ItemModule[id].video.id,
          userJsonObject.ItemModule[id].desc,
          new Date(
            Number(userJsonObject.ItemModule[id].createTime) * 1000
          ).toLocaleDateString(),
          Number(userJsonObject.ItemModule[id].video.height),
          Number(userJsonObject.ItemModule[id].video.width),
          Number(userJsonObject.ItemModule[id].video.duration),
          userJsonObject.ItemModule[id].video.ratio,
          userJsonObject.ItemModule[id].stats.shareCount,
          userJsonObject.ItemModule[id].stats.diggCount,
          userJsonObject.ItemModule[id].stats.commentCount,
          userJsonObject.ItemModule[id].stats.playCount,
          userJsonObject.ItemModule[id].video.cover,
          userJsonObject.ItemModule[id].video.dynamicCover,
          userJsonObject.ItemModule[id].video.playAddr.trim(),
          userJsonObject.ItemModule[id].video.downloadAddr.trim(),
          userJsonObject.ItemModule[id].video.format
        )
      );
    });
    return videos;
  }

  /**
   * Scrapes the given Link and returns information about the Music of the Video
   * @param link Tiktok link of the video
   * @returns Music
   */
  async getMusic(link: string): Promise<Music> {
    if (!link) throw new Error("You must provide a link!");

    const $ = await this.requestWebsite(link);
    const infoObject = $("#sigi-persisted-data").text();

    const audioObject = this.handleHTMLContent(infoObject);
    const id = audioObject.ItemList.video.list[0];

    const music: IMusic = new Music(
      audioObject.ItemModule[id].music.id,
      audioObject.ItemModule[id].music.title,
      audioObject.ItemModule[id].music.playUrl,
      audioObject.ItemModule[id].music.coverLarge,
      audioObject.ItemModule[id].music.coverThumb,
      audioObject.ItemModule[id].music.authorName,
      Number(audioObject.ItemModule[id].music.duration),
      audioObject.ItemModule[id].music.original,
      audioObject.ItemModule[id].music.album
    );

    return music;
  }
}
