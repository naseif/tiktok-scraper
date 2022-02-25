import { IMusic } from "../../Interfaces/IMusic";

export class Music implements IMusic {
  /**
   * tiktok music ic
   */
  id: number;
  /**
   * tiktok music title
   */
  title: string;
  /**
   * direct link to this music
   */
  playURL: string;
  /**
   * tiktok music original cover
   */
  coverLarge: string;
  /**
   * tiktok music thumnail cover
   */
  coverThumb: string;
  /**
   * tiktok music author
   */
  author: string;
  /**
   * tiktok music duration
   */
  duration: number;
  /**
   * Whether the music is original or user made
   */
  original?: boolean;
  /**
   * Whether it is part of an Album
   */
  album?: string;

  constructor(
    id: number,
    title: string,
    playURL: string,
    coverLarge: string,
    coverThumb: string,
    author: string,
    duration: number,
    original: boolean | undefined,
    album?: string | undefined
  ) {
    this.id = id;
    this.title = title;
    this.playURL = playURL;
    this.coverLarge = coverLarge;
    this.coverThumb = coverThumb;
    this.author = author;
    this.duration = duration;
    this.original = original;
    this.album = album;
  }
}
