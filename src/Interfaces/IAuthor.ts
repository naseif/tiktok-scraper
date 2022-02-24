/**
 * Represents the author of the tiktok video
 */

export interface IAuthor {
  uniqueId: string;
  id: number;
  avatar: string;
  signature?: string;
  user_created?: Date;
  verified?: boolean;
}
