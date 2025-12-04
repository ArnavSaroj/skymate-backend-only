import express from "express";
import { spicejetToken, GetFlightDataSpicejet } from "../Controllers/Spicejet/getFlightsSpicejet.js";

const router = express.Router();

router.post("/token_Spicejet", spicejetToken);
router.post("/get_Data_Spicejet", GetFlightDataSpicejet);

export default router;