/**
 * Represents the author of the tiktok video
 */

export interface IAuthor {
  /**
   * Unique ID of the Author
   */
  uniqueId: string;
  /**
   * ID of the Author
   */
  id: number;
  /**
   * Author Avatar Link
   */
  avatar: string;
  /**
   * Bio of the Author
   */
  signature?: string;
  /**
   * Registration Date of the User
   */
  user_created?: string;
  /**
   * Whether the Author is verified
   */
  verified?: boolean;
}
