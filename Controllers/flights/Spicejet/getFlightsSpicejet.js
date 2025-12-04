import randNumber from "../../../Utility/randtimout.js";

import randomUseragent from "random-useragent";
import fetchSpicejetToken from "../../../Auth/Spicejt/fetchSpicejetToken.js";
import axios from "axios";
import { supabase } from "../../../Config/supabaseClient.js";

const languages = [
  "en-US,en;q=0.9",
  "en-GB,en;q=0.8",
  "hi-IN,hi;q=0.9,en-US;q=0.8,en;q=0.7",
  "fr-FR,fr;q=0.9,en-US;q=0.8",
  "de-DE,de;q=0.9,en;q=0.8",
];
const acceptLanguage = languages[Math.floor(Math.random() * languages.length)];

export const spicejetToken = async (req, res) => {
  try {
    await new Promise((resolve) => setTimeout(resolve, randNumber()));
    const token = await fetchSpicejetToken();
    res.send(token);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: err.message });
  }
};

export const GetFlightDataSpicejet = async (params) => {
  let attempt = 5;
  let lastError;
  while (attempt--) {
    try {
      const { origin, destination, startDate } = params;
      await new Promise((resolve) => setTimeout(resolve, randNumber()));
      const the_token = await fetchSpicejetToken();

      const url = "https://www.spicejet.com/api/v2/search/lowfare";
      const randUserAgent = randomUseragent.getRandom();

      const axiosRes = await axios.post(
        url,
        {
          pax: {
            journeyClass: "ff",
            adult: 1,
            child: 0,
            infant: 0,
            srCitizen: 0,
          },
          codes: {
            currency: "INR",
          },
          origin,
          destination,
          centerDate: startDate,
        },
        {
          headers: {
            Authorization: the_token,
            Referer: "https://www.spicejet.com/",
            User_key: "15faf8ddf1e8354e90e54fa098e8b1a8",
            "Content-Type": "application/json",
            "User-Agent": randUserAgent,
            Accept: "*/*",
            "Accept-Language": acceptLanguage,
          },
          timeout: 7000,
        }
      );
      const formattedData = axiosRes.data.data.lowFareDateMarkets.map(
        (entry) => ({
          date: entry.departureDate.split("T")[0],
          price: entry.lowestFareAmount
            ? entry.lowestFareAmount.fareAmount +
              entry.lowestFareAmount.taxesAndFeesAmount
            : null,
        })
      );

      return {
        startDate: startDate,
        status: "success",
        airline: "SPICEJET",
        data: formattedData,
      };
    } catch (err) {
      lastError = err;
      console.error(`Attempt failed: ${err.message}`);
      // If rate limited, wait longer before next retry
      if (err.response && err.response.status === 429) {
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    }
  }
  return { message: lastError?.message, data: lastError?.response?.data };
};

export const SpicejetSpecific = async (req, res) => {
  let attempt = 5;
  let lastError;
  while (attempt--) {
    try {
      const { origin, destination, startDate } = req.body;
      await new Promise((resolve) => setTimeout(resolve, randNumber()));
      const the_token = await fetchSpicejetToken();

      const url = "https://www.spicejet.com/api/v2/search/lowfare";
      const randUserAgent = randomUseragent.getRandom();

      const axiosRes = await axios.post(
        url,
        {
          pax: {
            journeyClass: "ff",
            adult: 1,
            child: 0,
            infant: 0,
            srCitizen: 0,
          },
          codes: {
            currency: "INR",
          },
          origin,
          destination,
          centerDate: startDate,
        },
        {
          headers: {
            Authorization: the_token,
            Referer: "https://www.spicejet.com/",
            User_key: "15faf8ddf1e8354e90e54fa098e8b1a8",
            "Content-Type": "application/json",
            "User-Agent": randUserAgent,
            Accept: "*/*",
            "Accept-Language": acceptLanguage,
          },
          timeout: 7000,
        }
      );
      const formattedData = axiosRes.data.data.lowFareDateMarkets.map(
        (entry) => ({
          date: entry.departureDate.split("T")[0],
          price: entry.lowestFareAmount
            ? entry.lowestFareAmount.fareAmount +
              entry.lowestFareAmount.taxesAndFeesAmount
            : null,
        })
      );

      return res.status(200).json({
        startDate: startDate,
        status: "success",
        airline: "spicejet",
        data: formattedData,
      });
    } catch (err) {
      lastError = err;
      console.error(`Attempt failed: ${err.message}`);
      // for preventing rate limiting
      if (
        (err.response && err.response.status === 429) ||
        (err.response && err.response.status === 403)
      ) {
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    }
  }
  return res.status(500).json({
    status: "error",
    airline: "spicejet",
    message: lastError?.message || "all attempts resulted in errors",
    data: lastError?.response?.data,
  });
};

export const GetAndStoreSpicejet = async (req, res) => {
  let attempt = 8;
  let lastError;
  while (attempt--) {
    try {
      const { origin, destination, startDate } = req.body;
      await new Promise((resolve) => setTimeout(resolve, randNumber()));
      const the_token = await fetchSpicejetToken();

      const url = "https://www.spicejet.com/api/v2/search/lowfare";
      const randUserAgent = randomUseragent.getRandom();

      const axiosRes = await axios.post(
        url,
        {
          pax: {
            journeyClass: "ff",
            adult: 1,
            child: 0,
            infant: 0,
            srCitizen: 0,
          },
          codes: {
            currency: "INR",
          },
          origin,
          destination,
          centerDate: startDate,
        },
        {
          headers: {
            Authorization: the_token,
            Referer: "https://www.spicejet.com/",
            User_key: "15faf8ddf1e8354e90e54fa098e8b1a8",
            "Content-Type": "application/json",
            "User-Agent": randUserAgent,
            Accept: "*/*",
            "Accept-Language": acceptLanguage,
          },
          timeout: 7000,
        }
      );
      const formattedData = axiosRes.data.data.lowFareDateMarkets.map(
        (entry) => ({
          date: entry.departureDate.split("T")[0],
          price: entry.lowestFareAmount
            ? entry.lowestFareAmount.fareAmount +
              entry.lowestFareAmount.taxesAndFeesAmount
            : null,
        })
      );

      const flightData = formattedData;

      let errorCount = 0;
      let successCount = 0;

      for (const flight of flightData) {
        try {
          if (
            !flight.price ||
            isNaN(parseInt(flight.price)) ||
            parseInt(flight.price) <= 0
          ) {
            errorCount++;
            continue;
          }
          const { data, error } = await supabase.rpc("insert_flight_price", {
            _airline: "spicejet",
            _origin: origin,
            _destination: destination,
            _departure_date: flight.date,
            _price: parseInt(flight.price),
            _source_site: "spicejet",
          });
          if (error) {
            console.error("database error:", error.message);
            errorCount++;
          } else {
            successCount++;
          }
        } catch (storeErr) {
          errorCount++;
          console.error("storage error:", storeErr.message);
        }
      }

      return res.status(200).json({
        status: "success",
        airline: "spicejet",
        route: `${origin}->${destination}`,
        inserted: successCount,
        errors: errorCount,
        total: flightData.length,
      });
    } catch (err) {
      lastError = err;
      console.error(`Attempt failed: ${err.message}`);
      // for preventing rate limiting
      if (
        (err.response && err.response.status === 429) ||
        (err.response && err.response.status === 403)
      ) {
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    }
  }
  return res.status(500).json({
    status: "error",
    airline: "spicejet",
    message: lastError?.message || "all attempts resulted in errors",
    data: lastError?.response?.data,
  });
};
