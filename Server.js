import express, { urlencoded } from "express";
import mainRoutes from "./Routes/MainRoutes.js";
import cors from "cors";
import { supabase } from "./Config/supabaseClient.js";
import { monitorEventLoopDelay } from 'perf_hooks';
import dotenv from 'dotenv'
import path from 'path'


const h = monitorEventLoopDelay({ resolution: 10 });
h.enable();

setInterval(() => {
  console.log(`Event Loop Delay (mean): ${(h.mean / 1e6).toFixed(2)} ms`);
}, 5000);

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const app = express();
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(cors());

app.use(mainRoutes);

const time = new Date

const checkSupabase = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    console.log(`database connected at ${(time)}😄`);
  } catch (err) {
    console.log("Errror connecting to database", err.message);
  }
};

app.listen(5000, async () => {
  {
    console.log(`Unified server running on port ${(5000)}👍`);
    await checkSupabase();
  }
});
