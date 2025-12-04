import {supabase} from '../../Config/supabaseClient.js'

const  getHistory = async (req, res) => {
    try {
         const { from, to, departure } = req.body;
// TODO departure will be added later
    if (!from || !to || !from) {
        return res.status(500).json({ message: "missing parameters" });
    }
    
        const { data: routeId, error:IdError } = await supabase.from("routes").select("id").eq("origin_iata_code", from).eq("destination_iata_code", to).single();

        if (IdError) {
            return res.status(500).json({message:error});
        }
        const { data, error } = await supabase.from("historic_price").select("departure_date,price").eq("route_id", routeId.id);

        if (error) {
            return res.status(500).json({ message: error.message });
        }
        
        return res.status(200).json({ data });

        
    } catch (error) {
        return res.status(400).json({message:error.message})
    }
   
    


}

export default getHistory;