/**
 * Represents the video File
 */

export interface IVideo {
  id: number;
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
