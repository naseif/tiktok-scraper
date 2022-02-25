import { IVideo } from "../../Interfaces";

export class Video implements IVideo {
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
  cover?: string | undefined;
  dynamicCover?: string | undefined;
  playURL?: string | undefined;
  downloadURL?: string | undefined;
  fomrat?: string | undefined;

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
    cover?: string | undefined,
    dynamicCover?: string | undefined,
    playURL?: string | undefined,
    downloadURL?: string | undefined,
    format?: string | undefined
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
    this.cover = cover;
    this.dynamicCover = dynamicCover;
    this.playURL = playURL;
    this.downloadURL = downloadURL;
    this.fomrat = format;
  }
  playCount: number;
}
