import { IAudio, IAuthor, IVideo } from "./index";

/**
 * The Result of the Scraping process
 */

export interface ITikTokResult {
  author: IAuthor;
  video: IVideo;
  audio: IAudio;
  shareCount: number;
  likesCount: number;
  commentCount: number;
  playCount: number;
  createdAt: Date;
  tiktokLink: string;
  thumbnail: string;
}
