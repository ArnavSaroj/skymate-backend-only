import express from 'express'
import { AirIndiaRoutesData } from '../Controllers/AirIndia/AirIndiaApi';

const router = express.Router();

router.post("/AirIndia/get_Routes",AirIndiaRoutesData)
export default router;