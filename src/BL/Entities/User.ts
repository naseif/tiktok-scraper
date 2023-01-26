import { IUser } from "../../Interfaces/IUser";

export class User implements IUser {
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

  /**
   *
   * @param id the id of the User
   * @param uniqueId The tiktok unique id of the User
   * @param nickname optional nickname of the User
   * @param avatar the avatar link of the User
   * @param signature the bio description of the User
   * @param createdAt the date of the creation of the User
   * @param verified Whether the User is a verified User by TikTok
   * @param secretUID the secret UID of the User
   * @param bioLink The link in the bio if the it contains any
   * @param privateAccount Whether the account privacy is set to private
   * @param isUnderAge18 Whether the User is underage
   * @param followers Number of followers for this User
   * @param following Number of the accounts this user follows
   * @param hearts How many likes this User got over the time
   * @param videos Number of the Videos this User has posted
   */
  constructor(
    id: string,
    uniqueId: string,
    nickname: string,
    avatar: string,
    signature: string,
    createdAt: string,
    verified: boolean,
    secretUID: string,
    bioLink: string,
    privateAccount: boolean,
    followers: number,
    following: number,
    hearts: number,
    videos: number
  ) {
    this.id = id;
    this.uniqueId = uniqueId;
    this.nickname = nickname;
    this.avatar = avatar;
    this.signature = signature;
    this.createdAt = createdAt;
    this.verified = verified;
    this.secretUID = secretUID;
    this.bioLink = bioLink;
    this.privateAccount = privateAccount;
    this.followers = followers;
    this.following = following;
    this.hearts = hearts;
    this.videos = videos;
  }
}
