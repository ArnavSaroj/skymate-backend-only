import { supabase } from "../../Config/supabaseClient.js";

export const getNames = async (req, res) => {
  const q = req.query.q || "";
  try {
    let query = supabase
      .from("airports_iata")
      .select("airport_name, city, iata_code") 
      .eq("country", "India")
      .limit(8);

    if (q) {
      query = query.or(`airport_name.ilike.%${q}%,iata_code.ilike.%${q}%,city.ilike.%${q}%`);
    }
    const { data, error } = await query;
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ "server error": err.message });
  }
};