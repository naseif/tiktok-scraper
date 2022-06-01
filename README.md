# tiktok-scraper

A fast light-weight scraper for tiktok to fetch and download video posts, video music, user info and more.

## Installation

```
npm i tiktok-scraper-ts
```

## Importing

### TypeScript

```ts
import * as tiktokscraper from "tiktok-scraper-ts";

import { TTScraper } from "tiktok-scraper-ts"; // Individual classes
```

### JavaScript

```js
const tiktokscraper = require("tiktok-scraper-ts");

const { TTScraper } = require("tiktok-scraper-ts"); // Individual classes
```

## Class Methods

```ts
.video(url) scrapes video info and download link. Returns Promise<Video>
.user(username) Scrapes user info. Returns Promise<User>
.getAllVideosFromUser(username) Scrapes all available videos for the given user. Returns Promise<IVideo[]>
.getMusic(url) Scrapes Music info from a video. Returns Promise<Music>
.downloadAllVideosFromUser(username, path?: optional) Downloads all Videos of the given user. Returns Promise<void>
.noWaterMark(link) Returns a direct download link for the video without TikTok Watermark.
.hashtag(tag) Scrapes a hashtag posts
```

## Individual Functions

Since 1.2.6 you can also import functions directly

### API

```ts
fetchVideo(url); // Same as TTScraper.video(url)
fetchUser(username); // Same as TTScraper.user(username)
fetchAllVideosFromUser(username); // Same as TTScraper.getAllVideosFromUser(username)
fetchMusic(url); // Same as TTScraper.getMusic(url)
fetchVideoNoWaterMark(url); // Same as TTScraper.noWaterMark(url)
hashtag(tag); // Same as TTScraper.hashtag(tag)
```

## Examples

### Fetch info for a single video

```ts
import { TTScraper } from "tiktok-scraper-ts";

const TikTokScraper = new TTScraper();

(async () => {
  const fetchVideo = await TikTokScraper.video("link");
  console.log(fetchVideo);
})();

// OR

import { fetchVideo } from "tiktok-scraper-ts";

(async () => {
  const video = await fetchVideo("link");
  console.log(video);
})();

// ==>

Video {
  id: '7049800036758080773',
  description: undefined,
  createdAt: '05/01/2022',
  height: 1024,
  width: 576,
  duration: 10,
  resolution: '720p',
  shareCount: 12400,
  likesCount: 554500,
  commentCount: 7535,
  playCount: 5500000,
  cover: '',
  playURL: 'PLAY LINK',
  downloadURL: 'Download Link',
  fomrat: 'mp4'
}

```

### Fetch user page

```ts
import { TTScraper } from "tiktok-scraper-ts";

const TikTokScraper = new TTScraper();

(async () => {
  const fetchUser = await TikTokScraper.user("user");
  console.log(fetchUser);
})();

// OR

import { fetchUser } from "tiktok-scraper-ts";

(async () => {
  const user = await fetchUser("link");
  console.log(user);
})();

// ==>

User {
  id: '',
  uniqueId: 'user',
  nickname: 'new user',
  avatar: 'PP Link',
  signature: '',
  createdAt: '12/12/2021',
  verified: false,
  secretUID: 'MS4wLjABAAAAkLv5v2jUnsIzViWXSAQoj5U4o685FeSDFSDfsdfsdflrk-k75Znw',
  bioLink: undefined,
  privateAccount: false,
  isUnderAge18: false,
  followers: 1,
  following: 2,
  hearts: 0,
  videos: 0
}
```

## Common Types

<details>
<summary>IUser</summary>

```ts
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
```

</details>

<details>
<summary>IVideo</summary>

```ts
export interface IVideo {
  /**
   * the unique id of the video
   */
  id: string;
  /**
   * the description of the video if available
   */
  description: string;
  /**
   * the date on which the video was created on tiktok
   */
  createdAt: string;
  /**
   * height of the video
   */
  height: number;
  /**
   * width of the video
   */
  width: number;
  /**
   * duration of the video
   */
  duration: number;
  /**
   * resolution of the video
   */
  resolution: string;
  /**
   * Number of times the video was shared
   */
  shareCount: number;
  /**
   * Number of likes on the video
   */
  likesCount: number;
  /**
   * Number of comments on the video
   */
  commentCount: number;
  /**
   * Number of times the video has been played
   */
  playCount: number;
  /**
   * a direct url to the video cover
   */
  cover?: string;
  /**
   * A direct url to the dynamic video cover
   */
  dynamicCover?: string;
  /**
   * a direct play url for the video
   */
  playURL?: string;
  /**
   * a direct download url for the video
   */
  downloadURL?: string;
  /**
   * the format of the video
   */
  fomrat?: string;
}
```

</details>

<details>
<summary>IMusic</summary>

```ts
export interface IMusic {
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
   * The Album name if it is part of an album
   */
  album?: string;
}
```

</details>

## Contributions

Software contributions are welcome. If you are not a dev, testing and reproting bugs can also be very helpful!

## Questions?

Please open an issue if you have questions, wish to request a feature, etc.
