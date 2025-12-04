import axios from "axios";
import { ScrapingRoutes } from "./ScrapingRoutes.js";
import pLimit from "p-limit";

const limit = pLimit(4);

const API_BASE_URL = `http://localhost:5000/flight/AllStore`;

async function run() {
  let i = 1;

  console.log("[CronScraper] starting, routes:", ScrapingRoutes.length);

  const tasks = ScrapingRoutes.map((route) => {
   return limit(async () => {
      try {
        const response = await axios.post(API_BASE_URL, route, {
          headers: { "Content-Type": "application/json" },
        });

        if (response.status >= 200 && response.status < 300) {
          console.log(
            `✅ Success inserting route #${i}: ${route.origin} → ${route.destination}`
          );
        } else {
          console.warn(`⚠️ Route #${i} unexpected status: ${response.status}`);
        }
      } catch (error) {
        console.error(
          `scraper failed for route ${i}`,
          route.origin,
          "->",
          route.destination
        );
        console.error(error.message);
      }
      finally {
        i++;
      }
    });
  });
  await Promise.allSettled(tasks);

  console.log("[CronScraper] finished");
}

run().catch((err) => {
  console.error("Unhandled error in CronScraper:", err);
  process.exitCode = 1;
});
