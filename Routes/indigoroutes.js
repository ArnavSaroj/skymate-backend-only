import express from "express";
import { GetFlightData, getToken } from "../Controllers/Indigo/getFlightsindigo.js";

const router = express.Router();

router.post("/get_token_go", getToken);
router.post("/get_flight_Data_go", GetFlightData);


export default router;
