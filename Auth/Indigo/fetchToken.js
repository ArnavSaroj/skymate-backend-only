import request from "request-promise";
import randomUseragent from 'random-useragent'
import axios from 'axios'

let cachedtoken = null;
let tokenExpiry = null;

const fetchToken = async () => {

  const now=Date.now()

  if (cachedtoken && tokenExpiry && now < tokenExpiry) {
    return cachedtoken;
}

  try {
        const randUserAgent = randomUseragent.getRandom(); ; 
    
    const res = await axios.post(
      "https://api-prod-session-skyplus6e.goindigo.in/v1/token/create",
      {
        strToken: "",
        subscriptionKey: "S9pIpbp4QxCTs98Nzrmy0A==",
      },
      {
        headers: {
          user_key: "654a6a3cc4998e498e5c0c8ead072915",
          Referer: "https://www.goindigo.in/",
          "Content-Type": "application/json",
          "User-Agent": randUserAgent
        },
      }
    );
    cachedtoken = res.data.data.token.token;
    tokenExpiry = now + 14.5 * 60 * 1000;
    return cachedtoken;
  } catch (e) {
    console.error("Error:", e.message);
    throw e;
  }
};
export default fetchToken;
