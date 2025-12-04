import express from 'express'
import { getAllFlights } from "../Controllers/AllFlights.js";
import valdiateFlightRequest from "../middlewares/ValdiateFlightRequest.js";
import { AkasaDataSpecific, GetAndStoreAkasa } from '../Controllers/flights/Akasa/Akasaapi.js';
import validateFlightRequest from '../middlewares/ValdiateFlightRequest.js';
import { GetAndStoreFlightsIndigo, IndigoSpecific } from '../Controllers/flights/Indigo/getFlightsindigo.js';
import { GetAndStoreSpicejet, SpicejetSpecific } from '../Controllers/flights/Spicejet/getFlightsSpicejet.js';
import { CombinedGetStore } from '../Controllers/CombinedGetStore.js';
import  {getNames}  from '../Controllers/getapis/getNames.js';
import  SearchGetFlights  from '../Controllers/SearchGetFlights.js';
import { CreateBookmark, DeleteBookmark, getAllBookmarks} from '../Controllers/bookmark/bookmark.js';
import getHistory from '../Controllers/trends/getHistory.js';
import { AirIndiaRoutesData, StoreGetAirIndia } from '../Controllers/flights/AirIndia/AirIndiaApi.js';
import topDeals from '../Controllers/trends/topDeals.js';
// import validate from '../Controllers/lib/validator.js';
// import {body} from 'express-validator'

const router = express.Router();

// this routes get data of all flights
router.post("/allflights", valdiateFlightRequest, getAllFlights)

// this routes will be for specific flights api only
router.post("/flights/akasa", valdiateFlightRequest, AkasaDataSpecific)
router.post("/flights/indigo", validateFlightRequest, IndigoSpecific)
router.post("/flights/spicejet", validateFlightRequest, SpicejetSpecific)
router.post("/flights/AirIndia", AirIndiaRoutesData)


// this is for storing and getting data into db
router.post("/flights/indigo/StoreGet", valdiateFlightRequest, GetAndStoreFlightsIndigo);

router.post("/flights/spicejet/StoreGet", validateFlightRequest, GetAndStoreSpicejet)

router.post("/flights/akasa/StoreGet", validateFlightRequest, GetAndStoreAkasa);

router.post("/flights/AirIndia/StoreGet", StoreGetAirIndia)


// this routes combines everything and also stores
router.post("/flight/AllStore", CombinedGetStore);

// this one searches for name of airport
router.get("/api/airport/name", getNames)

// main routes for searching flights
router.get("/api/SearchFlights", SearchGetFlights)

// routes for signup
// router.post("/api/signup",validate([body('username').notEmpty(),body('email').isEmail().notEmpty(),body('password').isLength({min:8}).notEmpty()]),create_User)

// routes for bookmark creation
router.post("/api/create_bookmark", CreateBookmark)
router.post("/api/delete_bookmark", DeleteBookmark)
router.post("/api/getBookmarks",getAllBookmarks)



// routes for graphs feature
router.post("/api/historicPrice", getHistory);

// routes for top deals feature
router.get("/api/top_deals", topDeals);

export default router;