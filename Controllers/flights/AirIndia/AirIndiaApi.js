import axios from "axios";
import randomUseragent from "random-useragent";
import { supabase } from "../../../Config/supabaseClient.js";
import pLimit from "p-limit";

const limit = pLimit(10);
const AirindiaURL = "https://api.airindia.com/airline-fares/v1/search";
const range = 31;
const randomAgent = randomUseragent.getRandom();

export const AirIndiaRoutesData = async (req, res) => {
  const { origin, destination, startDate, endDate } = req.body;
  if (!origin || !destination || !startDate || !endDate) {
    return res
      .status(400)
      .json({ message: "incomplete or missing required field" });
  }

  let attempt = 3;
  let lastError;

  while (attempt--) {
    try {
      const axiosRes = await axios.post(
        AirindiaURL,
        {
          classType: "ECONOMY",
          concessionType: null,
          itinerary: {
            origin: origin,
            destination: destination,
            departureDate: startDate,
            returnDate: null,
            originCountryCode: "IN",
          },
          tripInfo: { duration: null, range: range, durationFlexibility: null },
        },
        {
          headers: {
            "User-Agent": randomAgent,
            Accept: "application/json, text/plain, */*",
            "Accept-Language": "en-US,en;q=0.5",
            "Accept-Encoding": "gzip, deflate, br, zstd",
            "Ocp-Apim-Subscription-Key": "8ea658f3ac1e44cca129d7ed252d4c42",
            "Content-Type": "application/json",
            Origin: "https://www.airindia.com",
            "Sec-GPC": "1",
            Connection: "keep-alive",
            Referer: "https://www.airindia.com/",
          },
          timeout: 10000,
        }
      );

      return res.status(200).json({
        status: "success",
        airline: "AirIndia",
        data: axiosRes.data.data.fares,
      });
    } catch (error) {
      lastError = error;
      console.error(`Attempt failed: ${error.message}`);
    }
  }

  return res.status(500).json({
    status: "error",
    airline: "AirIndia",
    message: lastError?.message || "All attempts failed",
  });
};

async function ScrapeAirIndia(route) {
  const { origin, destination, startDate, endDate } = route;

  let attempt = 3;

  while (attempt--) {
    try {
      const axiosRes = await axios.post(
        AirindiaURL,
        {
          classType: "ECONOMY",
          concessionType: null,
          itinerary: {
            origin: origin,
            destination: destination,
            departureDate: startDate,
            returnDate: null,
            originCountryCode: "IN",
          },
          tripInfo: { duration: null, range: range, durationFlexibility: null },
        },
        {
          headers: {
            "User-Agent": randomAgent,
            Accept: "application/json, text/plain, */*",
            "Accept-Language": "en-US,en;q=0.5",
            "Accept-Encoding": "gzip, deflate, br, zstd",
            "Ocp-Apim-Subscription-Key": "8ea658f3ac1e44cca129d7ed252d4c42",
            "Content-Type": "application/json",
            Origin: "https://www.airindia.com",
            "Sec-GPC": "1",
            Connection: "keep-alive",
            Referer: "https://www.airindia.com/",
          },
          timeout: 10000,
        }
      );
      const flights = axiosRes.data.data.fares || [];
      return flights.map((f) => ({
        price: f.totalPrice.total,
        date: f.departureDate,
        airline: "AirIndia",
      }));
    } catch (error) {
      console.error(
        "airindia fetch failed for route ",
        origin,
        "->",
        destination
      );
    }
  }
  return [];
}

export const StoreGetAirIndia = async (req, res) => {
  const { origin, destination, startDate, endDate } = req.body;
  if (!origin || !destination || !startDate || !endDate) {
    return res.status(400).json({ message: "incomplete or invalid body" });
  }

  const route = {
    origin: origin,
    destination: destination,
    startDate: startDate,
    endDate: endDate,
  };

  const flightData = await ScrapeAirIndia(route);

  if (flightData.length === 0) {
    return res.status(200).json({
      message: "empty flight array",
      inserted: 0,
      errors: 0,
      total: 0,
    });
  }

  let successCount = 0;
  let errorCount = 0;

  // Process all flights with concurrency control
  await Promise.all(
    flightData.map((flight) =>
      limit(async () => {
        try {
          const { error } = await supabase.rpc("insert_flight_price", {
            _airline: "AirIndia",
            _origin: origin,
            _destination: destination,
            _departure_date: flight.date,
            _price: parseInt(flight.price),
            _source_site: "AirIndia",
          });

          if (error) {
            errorCount++;
            console.error("❌ AirIndia DB error:", error.message || error);
          } else {
            successCount++;
          }
        } catch (error) {
          errorCount++;
          console.error(
            "❌ AirIndia error:",
            error?.message || "Unknown error"
          );
        }
      })
    )
  );

  return res.status(200).json({
    message: "inserted successfully",
    inserted: successCount,
    errors: errorCount,
    total: flightData.length,
  });
};
