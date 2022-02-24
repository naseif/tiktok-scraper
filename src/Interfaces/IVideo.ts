/**
 * Represents the video File
 */

export interface IVideo {
  id: number;
  description: string;
  height: number;
  width: number;
  duration: number;
  resolution: string;
  cover?: string;
  dynamicCover?: string;
  playURL?: string;
  downloadURL?: string;
  fomrat?: string;
}
