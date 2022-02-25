import { IMusic } from "../../Interfaces/IMusic";

export class Music implements IMusic {
  /**
   * tiktok music id
   */
  id: number;
  /**
   * tiktok music title
   */
  title: string;
  /**
   * direct link to the music
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
   * The Album name if it is part of an album
   */
  album?: string;

  /**
   *
   * @param id tiktok music id
   * @param title tiktok music title
   * @param playURL direct link to the music
   * @param coverLarge tiktok music original cover
   * @param coverThumb tiktok music thumnail cover
   * @param author tiktok music author
   * @param duration tiktok music duration
   * @param original Whether the music is original or user made
   * @param album The Album name if it is part of an album
   */
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
