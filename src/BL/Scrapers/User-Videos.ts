const Signer = require("tiktok-signature");
import fetch, { RequestInit } from "node-fetch";

const TT_REQ_USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 Edg/107.0.1418.56";

const TT_REQ_PERM_URL =
  "https://www.tiktok.com/api/post/item_list/?aid=1988&app_language=en&app_name=tiktok_web&battery_info=1&browser_language=en-US&browser_name=Mozilla&browser_online=true&browser_platform=Win32&browser_version=5.0%20%28Windows%20NT%2010.0%3B%20Win64%3B%20x64%29%20AppleWebKit%2F537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome%2F107.0.0.0%20Safari%2F537.36%20Edg%2F107.0.1418.56&channel=tiktok_web&cookie_enabled=true&device_id=7165118680723998214&device_platform=web_pc&focus_state=true&from_page=user&history_len=3&is_fullscreen=false&is_page_visible=true&os=windows&priority_region=RO&referer=&region=RO&screen_height=1440&screen_width=2560&tz_name=Europe%2FBucharest&webcast_language=en&msToken=G3C-3f8JVeDj9OTvvxfaJ_NppXWzVflwP1dOclpUOmAv4WmejB8kFwndJufXBBrXbeWNqzJgL8iF5zn33da-ZlDihRoWRjh_TDSuAgqSGAu1-4u2YlvCATAM2jl2J1dwNPf0_fk9dx1gJxQ21S0=&X-Bogus=DFSzswVYxTUANS/JS8OTqsXyYJUo&_signature=_02B4Z6wo00001CoOkNwAAIDBCa--cQz5e0wqDpRAAGoE8f";

const PARAMS = {
  aid: "1988",
  count: 35,
  secUid: "",
  cursor: "",
  cookie_enabled: true,
  screen_width: 0,
  screen_height: 0,
  browser_language: "",
  browser_platform: "",
  browser_name: "",
  browser_version: "",
  browser_online: "",
  timezone_name: "Europe/London",
};

/**
 *
 * @param userUID user secret UID
 * @param cursor position to start from to get user videos
 * @returns JSON.Object
 */

export async function getUserVideos(userUID: string, cursor: string) {
  PARAMS.secUid = userUID;
  PARAMS.cursor = cursor;

  const signer = new Signer(null, TT_REQ_USER_AGENT);
  await signer.init();

  //@ts-expect-error
  const qsObject = new URLSearchParams(PARAMS);
  const qs = qsObject.toString();
  const unsignedUrl = `https://m.tiktok.com/api/post/item_list/?${qs}`;
  const signature = await signer.sign(unsignedUrl);
  const navigator = await signer.navigator();
  await signer.close();

  const { "x-tt-params": xTtParams } = signature;
  const { user_agent: userAgent } = navigator;

  const getVideos = await fetchVideos(userAgent, xTtParams);

  if (getVideos.status !== 200) {
    throw new Error("A request to get the user's videos was not successful!");
  }
  return await getVideos.json();
}

async function fetchVideos(userAgent: string, xTtParams: string) {
  const options: RequestInit = {
    method: "GET",
    headers: {
      "user-agent": userAgent,
      "x-tt-params": xTtParams,
    },
  };

  return await fetch(TT_REQ_PERM_URL, options);
}
