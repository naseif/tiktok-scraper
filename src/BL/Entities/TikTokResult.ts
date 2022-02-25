import { IAuthor, IVideo, IAudio, ITikTokResult } from "../../Interfaces/index";

/**
 * TikTok Result Class Template
 */

export class TikTokResult implements ITikTokResult {
  /**
   * Represents the IAuthor interface.
   */

  author: IAuthor;

  /**
   * Represents the IVideo interface.
   */

  video: IVideo;

  /**
   * Represents the IAudio interface.
   */

  audio: IAudio;

  /**
   * Number of shares for this video.
   */
  shareCount: number;

  /**
   * Number of Likes for this video.
   */
  likesCount: number;

  /**
   * Number of comments for this video.
   */
  commentCount: number;

  /**
   * Number of the times this video has been played.
   */
  playCount: number;

  /**
   * When the video was created.
   */
  createdAt: string;

  /**
   * The absolute link of this video.
   */
  tiktokLink: string;

  /**
   * thumbnaill of the video.
   */
  thumbnail: string;

  /**
   *
   * @param author Represents the IAuthor interface.
   * @param video Represents the IAudio interface.
   * @param audio Represents the IAudio interface.
   * @param shareCount Number of shares for this video.
   * @param likesCount Number of Likes for this video.
   * @param commentCount Number of comments for this video.
   * @param playCount Number of the times this video has been played.
   * @param tiktok_created_At When the video was created.
   * @param tiktokLink The absolute link of this video.
   * @param thumbnail thumbnaill of the video.
   */

  constructor(
    author: IAuthor,
    video: IVideo,
    audio: IAudio,
    shareCount: number,
    likesCount: number,
    commentCount: number,
    playCount: number,
    tiktok_created_At: string,
    tiktokLink: string,
    thumbnail: string
  ) {
    this.author = author;
    this.video = video;
    this.audio = audio;
    this.shareCount = shareCount;
    this.likesCount = likesCount;
    this.commentCount = commentCount;
    this.playCount = playCount;
    this.createdAt = tiktok_created_At;
    this.tiktokLink = tiktokLink;
    this.thumbnail = thumbnail;
  }
}
