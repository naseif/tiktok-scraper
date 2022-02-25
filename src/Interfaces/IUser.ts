export interface IUser {
  /**
   * the id of the User
   */
  id: string;
  /**
   * The tiktok unique id of the User
   */
  uniqueId: string;
  /**
   * optional nickname of the User
   */
  nickname: string;
  /**
   * the avatar link of the User
   */
  avatar: string;
  /**
   * the bio description of the User
   */
  signature: string;
  /**
   * the date of the creation of the User
   */
  createdAt: string;
  /**
   * Whether the User is a verified User by TikTok
   */
  verified: boolean;
  /**
   * the secret UID of the User
   */
  secretUID: string;
  /**
   * The link in the bio if the it contains any
   */
  bioLink: string;
  /**
   * Whether the account privacy is set to private
   */
  privateAccount: boolean;
  /**
   * Whether the User is underage
   */
  isUnderAge18: boolean;
  /**
   * Number of followers for this User
   */
  followers: number;
  /**
   * Number of the accounts this user follows
   */
  following: number;
  /**
   * How many likes this User got over the time
   */
  hearts: number;
  /**
   * Number of the Videos this User has posted
   */
  videos: number;
}
