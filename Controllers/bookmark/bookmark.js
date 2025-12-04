import { supabase } from "../../Config/supabaseClient.js";
import nodemailer from "nodemailer";

const currentDate = new Date();

const year = currentDate.getFullYear();
const month = String(currentDate.getMonth() + 1).padStart(2, "0");
const day = String(currentDate.getDate()).padStart(2, "0");

const formattedDate = `${year}-${month}-${day}`;

const oneMonth = String(currentDate.getMonth() + 2).padStart(2, "0");
const oneMonthAfterDate = `${year}-${oneMonth}-${day}`;

export const CreateBookmark = async (req, res) => {
  //date is optional and airline is optional too
  try {
    const { route, date, airline, id, target_price } = req.body;
    const { origin, destination } = route;
    if (!origin || !date || !airline || !target_price || !id || !destination) {
      return res.status(400).json({ message: "all fields are required" });
    }

    const { data, error } = await supabase.rpc("insert_bookmark", {
      p_user_id: id,
      p_origin: origin,
      p_destination: destination,
      p_target_price: target_price,
      p_airline: airline,
      p_date: date,
    });

    if (error) {
      return res.status(400).json({ message: error });
    }
    return res.status(200).json({ message: "bookmark created" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const DeleteBookmark = async (req, res) => {
  try {
    const { id, route } = req.body;
    const { origin, destination } = route;
    if (!id || !route) {
      return res.status(500).json({ message: "invalid" });
    }

    const { data: routeData, error: routeError } = await supabase
      .from("routes")
      .select("id")
      .eq("origin_iata_code", origin)
      .eq("destination_iata_code", destination)
      .single();

    if (routeError || !routeData) {
      return res.status(500).json({ message: "this route doesnt exists" });
    }

    const { data, error } = await supabase
      .from("bookmarks")
      .delete()
      .eq("user_id", id)
      .eq("route_id", routeData.id)
      .select();

    if (error) {
      return res.status(500).json({ message: error.message });
    }
    if (!data || data.length === 0) {
      return res.status(404).json({ message: "bookmark not found" });
    }
    return res.status(204).json({ message: "successfull" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAllBookmarks = async (req, res) => {
  try {
    const { userId } = req.body;

    const { data: bookmarks, error: bookmarksError } = await supabase
      .from("bookmarks")
      .select()
      .eq("user_id", userId);

    if (bookmarksError) throw bookmarksError;
    if (!bookmarks || bookmarks.length === 0) {
      return res.status(404).json({ message: "No bookmarks found" });
    }

    const bookmark = bookmarks[0]; 

    const { data: routes, error: routesError } = await supabase
      .from("routes")
      .select()
      .eq("id", bookmark.route_id);

    if (routesError) throw routesError;
    if (!routes || routes.length === 0) {
      return res.status(404).json({ message: "Route not found" });
    }

    const route = routes[0];

    return res.status(200).json({
      target_price: bookmark.target_price,
      route_info: route,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// TODO this is the actual price check function which will check any drop in prices
export const PriceDropCheck = async () => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "anrav277@gmail.com",
        pass: process.env.GOOGLE_APP_PASSWORD,
      },
    });

    const { data: bookmarks, error: firstError } = await supabase
      .from("bookmarks")
      .select("user_id, target_price,route_id");

    if (firstError) throw firstError;

    bookmarks.forEach(async (bookmark) => {
      const { data: flightData, error: secondError } = await supabase
        .from("flight_prices")
        .select("price,airline_id,departure_date")
        .eq("route_id", bookmark.route_id);

      if (secondError) throw secondError;

      flightData.forEach(async (indFlight) => {
        if (indFlight.price < bookmark.target_price) {
          //TODO here comes email logic

          const { data: email, error: thirdError } = await supabase
            .from("auth.users")
            .select("email")
            .eq("id", bookmark.user_id);
          if (thirdError) throw thirdError;

          const userEmail = email?.[0]?.email;

          transporter.sendMail({
            from: "anrav277@gmail.com",
            to: userEmail,
            subject: `PRICE DROPPED FOR YOUR BOOKMARKED ROUTE BELOW ${indFlight.price}`,
            text: `Hello from SKYMATE !!Your bookmarked route for the route id ${bookmark.route_id} has dropped below your target price to ${indFlight.price}.Hurry up and book your flight now!!!`,
          });

          console.log("email sent");
        }
      });
    });
  } catch (error) {
    throw error;
  }
};
