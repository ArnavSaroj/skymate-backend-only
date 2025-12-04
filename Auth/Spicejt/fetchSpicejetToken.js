import request from "request-promise";
import randomUseragent from "random-useragent";
import axios from "axios";

let cachedtoken = null;
let tokenExpiry = null;

const fetchSpicejetToken = async () => {
  const now = Date.now();

  if (cachedtoken && tokenExpiry && now < tokenExpiry) {
    return cachedtoken;
  }

  try {
    const randUserAgent = randomUseragent.getRandom();

    const res = await axios.post(
  "https://www.spicejet.com/api/v1/token",
  {}, // empty body
  {
    headers: {
      user_key: "654a6a3cc4998e498e5c0c8ead072915",
      Referer: "https://www.spicejet.com/",
      "Content-Type": "application/json",
      "User-Agent": randUserAgent,
      os: "web",
      Origin: "https://www.spicejet.com",
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "same-origin",
    },
  }
    );
    
    cachedtoken = res.data.data.token;
    tokenExpiry = now + 9 * 60 * 1000;
    return cachedtoken;
  } catch (e) {
    console.error("Error:", e.message);
    throw e;
  }
};
export default fetchSpicejetToken;
