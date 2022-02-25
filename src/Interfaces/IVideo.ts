/**
 * Represents the video File
 */

export interface IVideo {
  id: string;
  description: string;
  createdAt: string;
  height: number;
  width: number;
  duration: number;
  resolution: string;
  shareCount: number;
  likesCount: number;
  commentCount: number;
  playCount: number;
  cover?: string;
  dynamicCover?: string;
  playURL?: string;
  downloadURL?: string;
  fomrat?: string;
}
