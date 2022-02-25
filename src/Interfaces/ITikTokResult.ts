import { IMusic, IAuthor, IVideo } from "./index";

/**
 * The Result of the Scraping process
 */

export interface ITikTokResult {
  author: IAuthor;
  video: IVideo;
  audio: IMusic;
  shareCount: number;
  likesCount: number;
  commentCount: number;
  playCount: number;
  createdAt: string;
  tiktokLink: string;
  thumbnail: string;
}
