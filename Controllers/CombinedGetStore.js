import { GetAndStoreAkasa } from "./flights/Akasa/Akasaapi.js";
import { GetAndStoreFlightsIndigo } from "./flights/Indigo/getFlightsindigo.js";
import { GetAndStoreSpicejet } from "./flights/Spicejet/getFlightsSpicejet.js";
import { StoreGetAirIndia } from "./flights/AirIndia/AirIndiaApi.js";

export const CombinedGetStore = async (req, res) => {
  try {
    const { origin, startDate, endDate, destination } = req.body;

    const results = {
      indigo: { status: "pending", inserted: 0, errors: 0, total: 0 },
      spicejet: { status: "pending", inserted: 0, errors: 0, total: 0 },
      akasa: { status: "pending", inserted: 0, errors: 0, total: 0 },
      airIndia: { status: "pending", inserted: 0, errors: 0, total: 0 },
    };

    const promises = [
      // Indigo Promise
      new Promise(async (resolve) => {
        try {
          const mockRes = {
            status: (code) => ({
              json: (data) => {
                // ✅ Immediately resolve with captured data
                resolve({
                  success: true,
                  statusCode: code,
                  data: data,
                });
                return mockRes;
              },
            }),
          };
          await GetAndStoreFlightsIndigo(req, mockRes);
        } catch (err) {
          resolve({ success: false, error: err.message });
        }
      }),

      // SpiceJet Promise

      new Promise(async (resolve) => {
        try {
          const mockRes = {
            status: (code) => ({
              json: (data) => {
                resolve({
                  success: true,
                  statusCode: code,
                  data: data,
                });
                return mockRes;
              },
            }),
          };
          await GetAndStoreSpicejet(req, mockRes);
        } catch (err) {
          resolve({ success: false, error: err.message });
        }
      }),

      // Akasa Promise
      new Promise(async (resolve) => {
        try {
          const mockRes = {
            status: (code) => ({
              json: (data) => {
                resolve({
                  success: true,
                  statusCode: code,
                  data: data,
                });
                return mockRes;
              },
            }),
          };
          await GetAndStoreAkasa(req, mockRes);
        } catch (err) {
          resolve({ success: false, error: err.message });
        }
      }),

      // airIndia promise
      new Promise(async (resolve) => {
        try {
          const mockRes = {
            status: (code) => ({
              json: (data) => {
                resolve({
                  success: true,
                  statusCode: code,
                  data: data,
                });
                return mockRes;
              },
            }),
          };
          await StoreGetAirIndia(req, mockRes);
        } catch (error) {
          resolve({ success: false, error: error.message });
        }
      }),
    ];

    const [indigoResponse, akasaResponse, spicejetResponse, AirIndiaResponse] =
      await Promise.allSettled(promises);

    // Process Indigo results
    if (
      indigoResponse.status === "fulfilled" &&
      indigoResponse.value.success &&
      indigoResponse.value.statusCode === 200
    ) {
      results.indigo = {
        status: "success",
        inserted: indigoResponse.value.data.inserted || 0,
        errors: indigoResponse.value.data.errors || 0,
        total: indigoResponse.value.data.total || 0,
      };
      console.log(`✅ Indigo: ${results.indigo.inserted} flights stored`);
    } else {
      results.indigo = {
        status: "error",
        message: indigoResponse.value?.error || "Failed to fetch",
        inserted: 0,
        errors: 0,
        total: 0,
      };
      console.log(`❌ Indigo: Failed`);
    }

    // Process SpiceJet results
    if (
      spicejetResponse.status === "fulfilled" &&
      spicejetResponse.value.success &&
      spicejetResponse.value.statusCode === 200
    ) {
      results.spicejet = {
        status: "success",
        inserted: spicejetResponse.value.data.inserted || 0,
        errors: spicejetResponse.value.data.errors || 0,
        total: spicejetResponse.value.data.total || 0,
      };
      console.log(`✅ SpiceJet: ${results.spicejet.inserted} flights stored`);
    } else {
      results.spicejet = {
        status: "error",
        message: spicejetResponse.value?.error || "Failed to fetch",
        inserted: 0,
        errors: 0,
        total: 0,
      };
      console.log(`❌ Spicejet:Failed`);
    }

    // Process Akasa results
    if (
      akasaResponse.status === "fulfilled" &&
      akasaResponse.value.success &&
      akasaResponse.value.statusCode === 200
    ) {
      results.akasa = {
        status: "success",
        inserted: akasaResponse.value.data.inserted || 0,
        errors: akasaResponse.value.data.errors || 0,
        total: akasaResponse.value.data.total || 0,
      };
      console.log(`✅ Akasa: ${results.spicejet.inserted} flights stored`);
    } else {
      results.akasa = {
        status: "error",
        message: akasaResponse.value?.error || "Failed to fetch",
        inserted: 0,
        errors: 0,
        total: 0,
      };
      console.log(`❌ Akasa: Failed`);
    }
    // process airindia
    if (
      AirIndiaResponse.status === "fulfilled" &&
      AirIndiaResponse.value.success &&
      AirIndiaResponse.value.statusCode === 200
    ) {
      results.airIndia = {
        status: "success",
        inserted: AirIndiaResponse.value.data.inserted || 0,
        errors: AirIndiaResponse.value.data.errors || 0,
        total: AirIndiaResponse.value.data.total || 0,
      };
      console.log(`✅ AirIndia: ${results.airIndia.inserted} flights stored`);
    } else {
      results.airIndia = {
        status: "error",
        message: AirIndiaResponse.value?.error || "Failed to fetch",
        inserted: 0,
        errors: 0,
        total: 0,
      };
      console.log(`❌ AirIndia: Failed`);
    }

    // Calculate totals
    const totals = {
      inserted:
        results.indigo.inserted +
        results.spicejet.inserted +
        results.akasa.inserted +
        results.airIndia.inserted,
      errors:
        // here i hv removed spicejet for now lets see how the application performs
        results.indigo.errors +
        results.akasa.errors +
        results.spicejet.errors +
        results.airIndia.errors,
      total:
        results.spicejet.total +
        results.indigo.total +
        results.akasa.total +
        results.airIndia.total,
      successfulAirlines: [
        results.indigo.status === "success" ? "Indigo" : null,
        results.spicejet.status === "success" ? "SpiceJet" : null,
        results.akasa.status === "success" ? "Akasa" : null,
        results.airIndia.status === "success" ? "AirIndia" : null,
      ].filter(Boolean),
    };

    console.log(
      `🎉 Combined result: ${totals.inserted} total flights stored from ${totals.successfulAirlines.length} airlines`
    );

    return res.status(200).json({
      status: "success",
      route: `${origin} → ${destination}`,
      period: endDate ? `${startDate} to ${endDate}` : startDate,
      summary: totals,
      airlines: results,
      message: `Successfully processed ${totals.successfulAirlines.length}/4 airlines`,
    });
  } catch (err) {
    console.error("❌ Some error occurred:", err.message);
    res.status(500).json({ error: err.message });
  }
};
