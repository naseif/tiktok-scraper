import { IVideo } from "../../Interfaces";

export class Video implements IVideo {
  /**
   * the unique id of the video
   */
  id: string;
  /**
   * the description of the video if available
   */
  description: string;
  /**
   * the date on which the video was created on tiktok
   */
  createdAt: string;
  /**
   * height of the video
   */
  height: number;
  /**
   * width of the video
   */
  width: number;
  /**
   * duration of the video
   */
  duration: number;
  /**
   * resolution of the video
   */
  resolution: string;
  /**
   * Number of times the video was shared
   */
  shareCount: number;
  /**
   * Number of likes on the video
   */
  likesCount: number;
  /**
   * Number of comments on the video
   */
  commentCount: number;
  /**
   * Number of times the video has been played
   */
  playCount: number;
  /**
   * a direct download url for the video
   */
  downloadURL: string;
  /**
   * a direct url to the video cover
   */
  cover?: string | undefined;
  /**
   * a direct url to the dynamic video cover
   */
  dynamicCover?: string | undefined;
  /**
   * a direct play url for the video
   */
  playURL?: string | undefined;
  /**
   * the format of the video
   */
  format?: string | undefined;
  /**
   * Author of the Video
   */
  author?: string | undefined;

  /**
   *
   * @param id the unique id of the video
   * @param description the description of the video if available
   * @param createdAt the date on which the video was created on tiktok
   * @param height height of the video
   * @param width width of the video
   * @param duration duration of the video
   * @param resolution resolution of the video
   * @param shareCount Number of times the video was shared
   * @param likesCount Number of likes on the video
   * @param commentCount Number of comments on the video
   * @param playCount Number of times the video has been played
   * @param cover a direct url to the video cover
   * @param dynamicCover a direct url to the dynamic video cover
   * @param playURL a direct play url for the video
   * @param downloadURL a direct download url for the video
   * @param format the format of the video
   */
  constructor(
    id: string,
    description: string,
    createdAt: string,
    height: number,
    width: number,
    duration: number,
    resolution: string,
    shareCount: number,
    likesCount: number,
    commentCount: number,
    playCount: number,
    downloadURL: string,
    cover?: string | undefined,
    dynamicCover?: string | undefined,
    playURL?: string | undefined,
    format?: string | undefined,
    author?: string | undefined
  ) {
    this.id = id;
    this.description = description;
    this.createdAt = createdAt;
    this.height = height;
    this.width = width;
    this.duration = duration;
    this.resolution = resolution;
    this.shareCount = shareCount;
    this.likesCount = likesCount;
    this.commentCount = commentCount;
    this.playCount = playCount;
    this.downloadURL = downloadURL;
    this.cover = cover;
    this.dynamicCover = dynamicCover;
    this.playURL = playURL;
    this.format = format;
    this.author = author;
  }
}
