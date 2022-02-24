/**
 * Represents the audio of the video!
 */

export interface IAudio {
  id: number;
  title: string;
  playURL: string;
  coverLarge: string;
  coverThumb: string;
  author: string;
  original?: boolean;
  duration: number;
  album?: string;
}
