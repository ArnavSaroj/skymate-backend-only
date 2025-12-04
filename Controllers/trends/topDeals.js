import {supabase} from '../../Config/supabaseClient.js'

const topDeals = async (req, res) => {
 try {
     const { data, error } = await supabase.rpc('get_top_deals');
     if (error) {
         return res.status(500).json({message:error})
     }
     return res.status(200).json({top_Deals_found:data,count:data.length})
 } catch (error) {
    return res.status(500).json({message:error.message})
 }   
}
export default topDeals;