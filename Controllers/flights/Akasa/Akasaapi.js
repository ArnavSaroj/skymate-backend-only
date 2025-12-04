import axios from "axios";
import randomUseragent from "random-useragent";
import randNumber from "../../../Utility/randtimout.js";

import attachEncodedTime from "../../../Utility/attachencodedtime.js";
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

const languages = [
  "en-US,en;q=0.9",
  "en-GB,en;q=0.8",
  "hi-IN,hi;q=0.9,en-US;q=0.8,en;q=0.7",
  "fr-FR,fr;q=0.9,en-US;q=0.8",
  "de-DE,de;q=0.9,en;q=0.8",
];
const acceptLanguage = languages[Math.floor(Math.random() * languages.length)];

export const GetdataAkasa = async (params) => {
  let attempt = 3;
  let lasterror;

  while (attempt--) {
    await new Promise((resolve) => setTimeout(resolve, randNumber()));
    try {
      const { origin, destination, startDate } = params;
      let encodedDate = attachEncodedTime(startDate);

      const url = `https://prod-bl.qp.akasaair.com/api/ibe/availability?origin=${origin}&destination=${destination}&startDate=${encodedDate}&numberOfPassengers=1&channel=WEB&currencyCode=INR`;
      const useragent = randomUseragent.getRandom();

      const axiosRES = await axios.get(url, {
        headers: {
          "User-Agent": useragent,
          Accept: "application/json, text/plain, */*",
          "Accept-Language": acceptLanguage,
          "Accept-Encoding": "gzip, deflate, br, zstd",
          Referer: "https://www.akasaair.com/",
          // "Authorization": "token_if_needed",
          Origin: "https://www.akasaair.com",
          DNT: "1",
          Connection: "keep-alive",
          Pragma: "no-cache",
          "Cache-Control": "no-cache",
        },
        timeout: 7000,
      });
      return {
        startDate: startDate,
        status: "success",
        airline: "Akasa",
        data: axiosRES.data.data,
      };
    } catch (err) {
      lasterror = err;
      console.error(err.message);
    }
  }
  return { message: lasterror.message };
};

export const AkasaDataSpecific = async (req, res) => {
  let attempt = 3;
  let lasterror;

  while (attempt--) {
    await new Promise((resolve) => setTimeout(resolve, randNumber()));
    try {
      const { origin, destination, startDate } = req.body;
      let encodedDate = attachEncodedTime(startDate);

      const url = `https://prod-bl.qp.akasaair.com/api/ibe/availability?origin=${origin}&destination=${destination}&startDate=${encodedDate}&numberOfPassengers=1&channel=WEB&currencyCode=INR`;
      const useragent = randomUseragent.getRandom();

      const axiosRES = await axios.get(url, {
        headers: {
          "User-Agent": useragent,
          Accept: "application/json, text/plain, */*",
          "Accept-Language": acceptLanguage,
          "Accept-Encoding": "gzip, deflate, br, zstd",
          Referer: "https://www.akasaair.com/",
          Origin: "https://www.akasaair.com",
          DNT: "1",
          Connection: "keep-alive",
          Pragma: "no-cache",
          "Cache-Control": "no-cache",
          // authentication if required in future
        },
        timeout: 7000,
      });

      return res.status(200).json({
        startDate: startDate,
        status: "success",
        airline: "Akasa",
        data: axiosRES.data.data,
      });
    } catch (err) {
      lasterror = err;
      console.error(err.message);
    }
  }

  return res.status(500).json({
    status: "error",
    airline: "Akasa",
    message: lasterror?.message || "All attempts failed",
  });
};

// TODO refactored  this  one for streaming large chunks of data
// still some bugs are there

export const GetAndStoreAkasa = async (req, res) => {
  let attempt = 7;
  let lasterror;

  let successCount = 0;
  let errorCount = 0;
  let totalProcessed = 0;

  while (attempt--) {
    await new Promise((resolve) => setTimeout(resolve, randNumber()));
    try {
      const { origin, destination, startDate, endDate } = req.body;
      const encodedDate = attachEncodedTime(startDate);
      const endDateObj = endDate ? new Date(endDate) : null;

      const url = `https://prod-bl.qp.akasaair.com/api/ibe/availability?origin=${origin}&destination=${destination}&startDate=${encodedDate}&numberOfPassengers=1&channel=WEB&currencyCode=INR`;
      const useragent = randomUseragent.getRandom();

      const axiosRES = await axios.get(url, {
        headers: {
          "User-Agent": useragent,
          Accept: "application/json, text/plain, */*",
          "Accept-Language": acceptLanguage,
          "Accept-Encoding": "gzip, deflate, br, zstd",
          Referer: "https://www.akasaair.com/",
          Origin: "https://www.akasaair.com",
          DNT: "1",
          Connection: "keep-alive",
          Pragma: "no-cache",
          "Cache-Control": "no-cache",
        },
        timeout: 10000,
        responseType: "stream",
      });
 const pipeline = chain([
        axiosRES.data,
        parser(),
        pick({ filter: "data" }),
        streamArray(),
        new Writable({
          objectMode: true,
          async write(chunk, encoding, callback) {
            totalProcessed++;
            const flight = chunk.value;

            if (endDateObj && new Date(flight.date) > endDateObj) return callback();
            if (!flight.price || isNaN(flight.price) || parseInt(flight.price) <= 0) {
              errorCount++;
              return callback();
            }

            limit(async () => {
              try {
                const { error } = await supabase.rpc("insert_flight_price", {
                  _airline: "Akasa",
                  _origin: origin,
                  _destination: destination,
                  _departure_date: flight.date,
                  _price: parseInt(flight.price),
                  _source_site: "Akasa",
                });

                if (error) {
                  console.error("Supabase RPC error:", error);
                  errorCount++;
                } else {
                  successCount++;
                }
              } catch (dbError) {
                console.error("DB insert error:", dbError);
                errorCount++;
              }
            }).then(() => callback());
          },
        }),
      ]);
 await new Promise((resolve, reject) => {
        pipeline.on("error", (err) => {
          console.error("stream pipeline error", err);
          reject(err);
        });
        pipeline.on("finish", resolve);
        pipeline.on("close", resolve);
      });

      return res.status(200).json({
        status: "success",
        airline: "Akasa",
        inserted: successCount,
        errors: errorCount,
        total: totalProcessed,
      });
    } catch (err) {
      lasterror = err;
      console.error("Outer error:", err.message);
    }
  }

  return res.status(500).json({
    status: "error",
    airline: "Akasa",
    message: lasterror?.message || "All attempts failed",
  });
};
