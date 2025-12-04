import express from "express";
import GetdataAkasa from "../Controllers/Akasa/Akasaapi.js";

const router = express.Router();

router.get("/getAkasaData/:origin/:destination/:startDate", GetdataAkasa);
export default router;
