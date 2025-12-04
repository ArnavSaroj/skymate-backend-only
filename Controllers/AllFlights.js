import {GetdataAkasa} from "../Controllers/flights/Akasa/Akasaapi.js";
import { GetFlightData } from "../Controllers/flights/Indigo/getFlightsindigo.js";
import { GetFlightDataSpicejet } from "../Controllers/flights/Spicejet/getFlightsSpicejet.js";
import withRetries from "../Utility/WithRetries.js";

export const getAllFlights = async (req, res) => {
  try {
    const [akasa, indigo, spicejet] = await Promise.all([
      withRetries(GetdataAkasa, req.body, 3),
      withRetries(GetFlightData, req.body, 3),
      withRetries(GetFlightDataSpicejet, req.body, 3),
    ]);
    res.json({ akasa, indigo, spicejet });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};