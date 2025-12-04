import randNumber from "../../../Utility/randtimout.js";
import randomUseragent from "random-useragent";
import fetchToken from "../../../Auth/Indigo/fetchToken.js";
import axios from "axios";
import { supabase } from "../../../Config/supabaseClient.js";
import { Writable } from "stream";
import chain from "stream-chain";
import pickPkg from "stream-json/filters/Pick.js";
import streamArrayPkg from "stream-json/streamers/StreamArray.js";
import streamJsonPkg from "stream-json";
import pLimit from "p-limit";

const limit = pLimit(10);

const { parser } = streamJsonPkg;
const { pick } = pickPkg;
const { streamArray } = streamArrayPkg;

export const getToken = async (req, res) => {
  try {
    await new Promise((resolve) => setTimeout(resolve, randNumber()));
    const token = await fetchToken();
    res.send(token);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: err.message });
  }
};

export const GetFlightData = async (params) => {
  let attempt = 4;
  let lastError;
  while (attempt--) {
    try {
      const { origin, destination, startDate, endDate } = params;
      await new Promise((resolve) => setTimeout(resolve, randNumber()));
      const the_token = await fetchToken();

      const url = "https://api-prod-booking-skyplus6e.goindigo.in/v1/getfarecalendar";
       

      const randUserAgent = randomUseragent.getRandom();
      const axiosRes = await axios.post(
        url,
        {
          startDate,
          endDate,
          origin,
          // NOTE format is in year month date
          destination,
          currencyCode: "INR",
          promoCode: "",
          lowestIn: "M",
        },
        {
          headers: {
            Authorization: the_token,
            Referer: "https://www.goindigo.in/",
            User_key: "15faf8ddf1e8354e90e54fa098e8b1a8",
            "Content-Type": "application/json",
            "User-Agent": randUserAgent,
            Accept: "*/*",
          },
          timeout: 7000,
        }
      );
      return {
        startDate: startDate,
        endDate: endDate,
        status: "success",
        airline: "INDIGO",
        data: axiosRes.data.data.lowFares,
      };
    } catch (err) {
      lastError = err;
      console.error(
        "Axios error:",
        err.response ? err.response.data : err.message
      );
    }
  }
  return { message: lastError?.message, data: lastError?.response?.data };
};

export const IndigoSpecific = async (req, res) => {
  let attempt = 6;
  let lastError;

  while (attempt--) {
    await new Promise((resolve) => setTimeout(resolve, randNumber()));
    try {
      const { origin, destination, startDate, endDate } = req.body;
      const the_token = await fetchToken();

      const urls = [
        "https://api-prod-booking-skyplus6e.goindigo.in/v1/getfarecalendar",
        "https://api-prod-booking-skyplus6e.goindigo.in/v2/getfarecalendar",
      ];
      const url = urls[Math.floor(Math.random() * urls.length)];

      const randUserAgent = randomUseragent.getRandom();

      const axiosRes = await axios.post(
        url,
        {
          startDate,
          endDate,
          origin,
          destination,
          currencyCode: "INR",
          promoCode: "",
          lowestIn: "M",
        },
        {
          headers: {
            Authorization: the_token,
            Referer: "https://www.goindigo.in/",
            User_key: "15faf8ddf1e8354e90e54fa098e8b1a8",
            "Content-Type": "application/json",
            "User-Agent": randUserAgent,
            Accept: "*/*",
          },
          timeout: 7000,
        }
      );

      return res.status(200).json({
        status: "success",
        origin: origin,
        destination: destination,
        startDate: startDate,
        endDate: endDate,
        airline: "Indigo",
        data: axiosRes.data.data.lowFares,
      });
    } catch (err) {
      lastError = err;
      console.error(
        "Axios error:",
        err.response ? err.response.data : err.message
      );
    }
  }

  return res.status(500).json({
    status: "error",
    airline: "Indigo",
    message: lastError?.message || "All attempts failed",
    data: lastError?.response?.data,
  });
};

export const GetAndStoreFlightsIndigo = async (req, res) => {
  let attempt = 7;
  let lastError;
  let successCount = 0;
  let errorCount = 0;
  let totalProcessed = 0;
  while (attempt--) {
    await new Promise((resolve) => setTimeout(resolve, randNumber()));

    try {
      const { origin, destination, startDate, endDate } = req.body;
      const the_token = await fetchToken();

      const url ="https://api-prod-booking-skyplus6e.goindigo.in/v1/getfarecalendar";

      // const url = urls[Math.floor(Math.random() * urls.length)];
      const randUserAgent = randomUseragent.getRandom();

      const axiosRes = await axios.post(
        url,
        {
          startDate,
          endDate,
          origin,
          destination,
          currencyCode: "INR",
          promoCode: "",
          lowestIn: "M",
        },
        {
          headers: {
            Authorization: the_token,
            Referer: "https://www.goindigo.in/",
            User_key: "15faf8ddf1e8354e90e54fa098e8b1a8",
            "Content-Type": "application/json",
            "User-Agent": randUserAgent,
            Accept: "*/*",
          },
          timeout: 8000,
          responseType: "stream",
        }
      );
      if (!axiosRes.data || typeof axiosRes.data.pipe !== "function") {
        throw new Error("Response is not a valid stream");
      }

      const writableStream = new Writable({
        objectMode: true,
        highWaterMark: 16,
        write(chunk, encoding, callback) {
          const flight = chunk.value;
          totalProcessed++;

          if (!flight.price || isNaN(flight.price) || flight.price <= 0) {
            errorCount++;
            return callback();
          }

          limit(async () => {
            try {
              const { error } = await supabase.rpc("insert_flight_price", {
                _airline: "Indigo",
                _origin: origin,
                _destination: destination,
                _departure_date: flight.date,
                _price: parseInt(flight.price),
                _source_site: "Indigo",
              });

              if (error) {
                console.error("❌ DB error:", error.message);
                errorCount++;
              } else {
                successCount++;
              }
            } catch (err) {
              console.error("❌ RPC failed:", err);
              errorCount++;
            }
          }).then(() => callback());
        },
      });

      const pipeline = chain([
        axiosRes.data,
        parser(),
        pick({ filter: "data.lowFares" }),
        streamArray(),
        writableStream,
      ]);

      // Wait for pipeline to complete
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error("Stream timeout: 30s exceeded"));
        }, 30000);

        pipeline.on("error", (err) => {
          clearTimeout(timeout);
          console.error("❌ Pipeline error:", err);
          reject(err);
        });

        // Listen on the writable stream, not the pipeline
        writableStream.on("finish", () => {
          clearTimeout(timeout);
          console.log("✅ Stream finished successfully");
          resolve();
        });

        writableStream.on("error", (err) => {
          clearTimeout(timeout);
          console.error("❌ Writable stream error:", err);
          reject(err);
        });
      });

      return res.status(200).json({
        status: "success",
        airline: "Indigo",
        route: `${origin} → ${destination}`,
        inserted: successCount,
        errors: errorCount,
        total: totalProcessed,
      });
    } catch (err) {
      lastError = err;
      console.error("Error:", err.message);

      if (err.response && [403, 409].includes(err.response.status)) {
        console.log("Rate limited, retrying in 5s...");
        await new Promise((r) => setTimeout(r, 5000));
      }
    }
  }

  return res.status(500).json({
    status: "error",
    airline: "Indigo",
    message: lastError?.message || "All attempts failed",
  });
};
