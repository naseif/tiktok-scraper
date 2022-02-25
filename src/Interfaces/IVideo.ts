/**
 * Represents the video File
 */

export interface IVideo {
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
   * a direct url to the video cover
   */
  cover?: string;
  /**
   * A direct url to the dynamic video cover
   */
  dynamicCover?: string;
  /**
   * a direct play url for the video
   */
  playURL?: string;
  /**
   * a direct download url for the video
   */
  downloadURL?: string;
  /**
   * the format of the video
   */
  fomrat?: string;
}
