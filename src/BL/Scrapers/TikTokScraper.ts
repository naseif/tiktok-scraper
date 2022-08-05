import * as cheerio from "cheerio";
import miniget from "miniget";
import fetch, { RequestInit } from "node-fetch";
import { createWriteStream, existsSync, mkdirSync, unlinkSync } from "node:fs";
import * as puppeteer from "puppeteer";
import http from "node:http";
import https from "node:https";
import { exit } from "node:process";
import { IMusic, IUser, IVideo } from "../../Interfaces";
import { Music, User, Video } from "../Entities";

export class TTScraper {
  /**
   * Fetches the website content and convert its content into text.
   * @param baseUrl baseUrl of the site to fetch
   * @param fetchOptions node-fetch fetch options. Optional
   * @returns Promise<cheerio.CheerioAPI>
  
  Example:
  ```ts
  const $ = await requestWebsite("https://www.amazon.de/s?k=" + "airpods")
  // => will return cheerio API Object to work with.
  
  $(".prices").each((_, value) => {
  console.log($(value).text().trim());
  });
  ```
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
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.134 Safari/537.36",
        Accept: "application/json, text/plain, */*",
        "Accept-Encoding": "gzip, deflate, br",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
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

  private async requestWithPuppeteer(url: string) {
    const browser = await puppeteer.launch({
      headless: true,
    });
    const page = await browser.newPage();
    const tiktokPage = await page.goto(url);

    if (tiktokPage == null) {
      throw new Error("Could not load the desired Page!");
    }

    const html = await tiktokPage.text();
    const endofJson = html
      .split(`<script id="SIGI_STATE" type="application/json">`)[1]
      .indexOf("</script>");

    const InfoObject = JSON.parse(
      html
        .split(`<script id="SIGI_STATE" type="application/json">`)[1]
        .slice(0, endofJson)
    );
    await browser.close();
    return InfoObject;
  }

  /**
   * Replaces the window Object with a export string and writes the new JS file to work with the result as a JS Object
   * @param content the HTML content of the Page
   * @deprecated No need for this function anymore since Tiktok now adds the json directly to the html
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
   * @param uri tiktok video url
   * @returns Video
   */

  async video(uri: string): Promise<Video> {
    if (!uri) throw new Error("A video URL must be provided");

    const videoJson = await this.requestWithPuppeteer(uri);

    const id = videoJson.ItemList.video.list[0];
    const videoResult: IVideo = new Video(
      videoJson.ItemModule[id].video.id,
      videoJson.ItemModule[id].desc,
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
      videoJson.ItemModule[id].video.downloadAddr.trim(),
      videoJson.ItemModule[id].video.cover,
      videoJson.ItemModule[id].video.dynamicCover,
      videoJson.ItemModule[id].video.playAddr.trim(),
      videoJson.ItemModule[id].video.format,
      videoJson.ItemModule[id].nickname
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

    const grabInfoObject = await this.requestWithPuppeteer(
      `https://www.tiktok.com/@${username}`
    );
    if (!grabInfoObject)
      throw new Error(
        `Could not parse user page, please consider adding tiktok cookies.`
      );
    const userObject = grabInfoObject.UserModule.users[username];

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
      grabInfoObject.UserModule.stats[username].followerCount,
      grabInfoObject.UserModule.stats[username].followingCount,
      grabInfoObject.UserModule.stats[username].heart,
      grabInfoObject.UserModule.stats[username].videoCount
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

    const userInfo = await this.requestWithPuppeteer(
      `https://www.tiktok.com/@${username}`
    );

    const videos: IVideo[] = [];

    const { ItemList } = userInfo;
    ItemList["user-post"].list.forEach((id: string) => {
      videos.push(
        new Video(
          userInfo.ItemModule[id].video.id,
          userInfo.ItemModule[id].desc,
          new Date(
            Number(userInfo.ItemModule[id].createTime) * 1000
          ).toLocaleDateString(),
          Number(userInfo.ItemModule[id].video.height),
          Number(userInfo.ItemModule[id].video.width),
          Number(userInfo.ItemModule[id].video.duration),
          userInfo.ItemModule[id].video.ratio,
          userInfo.ItemModule[id].stats.shareCount,
          userInfo.ItemModule[id].stats.diggCount,
          userInfo.ItemModule[id].stats.commentCount,
          userInfo.ItemModule[id].stats.playCount,
          userInfo.ItemModule[id].video.downloadAddr.trim(),
          userInfo.ItemModule[id].video.cover,
          userInfo.ItemModule[id].video.dynamicCover,
          userInfo.ItemModule[id].video.playAddr.trim(),
          userInfo.ItemModule[id].video.format
        )
      );
    });
    return videos;
  }

  /**
   * Scrapes the given Link and returns information about the Music of the Video
   * @param link tiktok video url
   * @returns Music
   */
  async getMusic(link: string): Promise<Music> {
    if (!link) throw new Error("You must provide a link!");

    const infoObject = await this.requestWithPuppeteer(link);

    const id = infoObject.ItemList.video.list[0];

    const music: IMusic = new Music(
      infoObject.ItemModule[id].music.id,
      infoObject.ItemModule[id].music.title,
      infoObject.ItemModule[id].music.playUrl,
      infoObject.ItemModule[id].music.coverLarge,
      infoObject.ItemModule[id].music.coverThumb,
      infoObject.ItemModule[id].music.authorName,
      Number(infoObject.ItemModule[id].music.duration),
      infoObject.ItemModule[id].music.original,
      infoObject.ItemModule[id].music.album
    );

    return music;
  }

  /**
   * Downloads all videos from a user page!
   * @param username tiktok username of the user
   * @param options download options
   */

  async downloadAllVideosFromUser(
    username: string,
    options: {
      path?: string;
      watermark?: boolean;
    }
  ) {
    if (!username) throw new Error("Please enter a username!");

    const getAllvideos = await this.getAllVideosFromUser(username);

    if (!getAllvideos)
      throw new Error(
        "No Videos were found for this username. Either the videos are private or the user has not videos"
      );

    if (!options.path) {
      options.path = `${__dirname}/../${username}`;
      if (existsSync(options.path)) {
        console.log(`A folder with this username exists, that is unusual!`);
        try {
          unlinkSync(options.path);
        } catch (error: any) {
          console.log(
            `[ERROR] Could not remove ${options.path}\n Error Message: ${error.message}`
          );
          exit(1);
        }
      }

      if (!existsSync(options.path)) {
        mkdirSync(options.path);
      }
    }

    if (!options.watermark) {
      for (const [index, video] of getAllvideos.entries()) {
        console.log(
          `Downloading Video: ${
            video.description ? video.description : video.id
          }, [${index + 1}/${getAllvideos.length}]`
        );

        let noWaterMarkLink = await this.noWaterMark(video.id);

        if (!noWaterMarkLink) {
          console.log(
            `Could not fetch ${
              video.description ? video.description : video.id
            } with no watermark`
          );
          continue;
        }

        miniget(noWaterMarkLink).pipe(
          createWriteStream(
            `${options.path}/${video.id}_${video.resolution}.${video.format}`
          )
        );
      }
      return;
    }

    for (const [index, video] of getAllvideos.entries()) {
      console.log(
        `Downloading Video: ${
          video.description ? video.description : video.id
        }, [${index + 1}/${getAllvideos.length}]`
      );

      miniget(video.downloadURL).pipe(
        createWriteStream(
          `${options.path}/${video.id}_${video.resolution}.${video.format}`
        )
      );
    }
  }

  /**
   * Returns direct download link for the video with no watermark!
   * @param link tiktok video url
   * @returns string
   */

  async noWaterMark(link: string): Promise<string | undefined | void> {
    let id: string = "";

    if (link.startsWith("https")) {
      id = (await this.video(link)).id;
    } else {
      id = link;
    }

    const fetchNoWaterInfo = await fetch(
      "https://api2.musical.ly/aweme/v1/aweme/detail/?aweme_id=" + id
    );
    const noWaterJson = await fetchNoWaterInfo.json();
    if (!noWaterJson)
      throw new Error(
        "There was an Error retrieveing this video without watermark!"
      );

    const noWaterMarkID = noWaterJson.aweme_detail.video.download_addr.uri;

    if (!noWaterMarkID)
      throw new Error(
        "There was an Error retrieveing this video without watermark!"
      );

    return `https://api-h2.tiktokv.com/aweme/v1/play/?video_id=${noWaterMarkID}`;
  }

  /**
   * Scrapes a hashtag posts
   * @param tag tiktok hashtag
   * @returns Promise<IVideo[]>
   */

  async hashTag(tag: string): Promise<IVideo[]> {
    if (!tag)
      throw new Error("You must provide a tag name to complete the search!");

    const parseTagResult = await this.requestWithPuppeteer(
      `https://www.tiktok.com/tag/${tag}`
    );

    const { ItemList } = parseTagResult;

    const videos: IVideo[] = [];

    for (const video of ItemList.challenge.list) {
      videos.push(
        new Video(
          parseTagResult.ItemModule[video].video.id,
          parseTagResult.ItemModule[video].desc,
          new Date(
            Number(parseTagResult.ItemModule[video].createTime) * 1000
          ).toLocaleDateString(),
          Number(parseTagResult.ItemModule[video].video.height),
          Number(parseTagResult.ItemModule[video].video.width),
          Number(parseTagResult.ItemModule[video].video.duration),
          parseTagResult.ItemModule[video].video.ratio,
          parseTagResult.ItemModule[video].stats.shareCount,
          parseTagResult.ItemModule[video].stats.diggCount,
          parseTagResult.ItemModule[video].stats.commentCount,
          parseTagResult.ItemModule[video].stats.playCount,
          parseTagResult.ItemModule[video].video.downloadAddr.trim(),
          parseTagResult.ItemModule[video].video.cover,
          parseTagResult.ItemModule[video].video.dynamicCover,
          parseTagResult.ItemModule[video].video.playAddr.trim(),
          parseTagResult.ItemModule[video].video.format,
          parseTagResult.ItemModule[video].author
        )
      );
    }
    return videos;
  }
}
