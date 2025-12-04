const currentDate = new Date();

const year = currentDate.getFullYear();
const month = String(currentDate.getMonth() + 1).padStart(2, "0");
const day = String(currentDate.getDate()).padStart(2, "0");

const formattedDate = `${year}-${month}-${day}`;

const oneMonth = String(currentDate.getMonth() + 2).padStart(2, "0");
const oneMonthAfterDate = `${year}-${oneMonth}-${day}`;

export const ScrapingRoutes = [

  // Pune Routes (Major IT hub)
  {
    origin: "PNQ",
    destination: "DEL",
    startDate: formattedDate,
    endDate: oneMonthAfterDate,
  },
  {
    origin: "PNQ",
    destination: "BLR",
    startDate: formattedDate,
    endDate: oneMonthAfterDate,
  },

  // Ahmedabad Routes (Major business hub)
  {
    origin: "AMD",
    destination: "BOM",
    startDate: formattedDate,
    endDate: oneMonthAfterDate,
  },
  {
    origin: "AMD",
    destination: "DEL",
    startDate: formattedDate,
    endDate: oneMonthAfterDate,
  },

  // Goa Routes (High tourist traffic)
  {
    origin: "GOI",
    destination: "BOM",
    startDate: formattedDate,
    endDate: oneMonthAfterDate,
  },
  {
    origin: "GOI",
    destination: "DEL",
    startDate: formattedDate,
    endDate: oneMonthAfterDate,
  },

  // Jaipur Routes (Tourist destination)
  {
    origin: "JAI",
    destination: "BOM",
    startDate: formattedDate,
    endDate: oneMonthAfterDate,
  },

  // Kochi Routes (South India connectivity)
  {
    origin: "COK",
    destination: "BOM",
    startDate: formattedDate,
    endDate: oneMonthAfterDate,
  },

  // Reverse routes (important for pricing differences)
  {
    origin: "BLR",
    destination: "DEL",
    startDate: formattedDate,
    endDate: oneMonthAfterDate,
  },
  {
    origin: "HYD",
    destination: "DEL",
    startDate: formattedDate,
    endDate: oneMonthAfterDate,
  },
  {
    origin: "MAA",
    destination: "DEL",
    startDate: formattedDate,
    endDate: oneMonthAfterDate,
  },
  {
    origin: "CCU",
    destination: "BOM",
    startDate: formattedDate,
    endDate: oneMonthAfterDate,
  },
  {
    origin: "DEL",
    destination: "BLR",
    startDate: formattedDate,
    endDate: oneMonthAfterDate,
  }, // Delhi - Bengaluru
  {
    origin: "BOM",
    destination: "LKO",
    startDate: formattedDate,
    endDate: oneMonthAfterDate,
  }, {
    origin: "LKO",
    destination: "BOM",
    startDate: formattedDate,
    endDate: oneMonthAfterDate,
  }, 
    {
    origin: "DEL",
    destination: "HYD",
    startDate: formattedDate,
    endDate: oneMonthAfterDate,
  }, // Delhi - Hyderabad
  {
    origin: "DEL",
    destination: "MAA",
    startDate: formattedDate,
    endDate: oneMonthAfterDate,
  }, // Delhi - Chennai
  {
    origin: "BOM",
    destination: "BLR",
    startDate: formattedDate,
    endDate: oneMonthAfterDate,
  }, // Mumbai - Bengaluru
  {
    origin: "BOM",
    destination: "HYD",
    startDate: formattedDate,
    endDate: oneMonthAfterDate,
  }, // Mumbai - Hyderabad
  {
    origin: "BLR",
    destination: "HYD",
    startDate: formattedDate,
    endDate: oneMonthAfterDate,
  }, // Bengaluru - Hyderabad
  {
    origin: "DEL",
    destination: "CCU",
    startDate: formattedDate,
    endDate: oneMonthAfterDate,
  }, // Delhi - Kolkata
  {
    origin: "DEL",
    destination: "BOM",
    startDate: formattedDate,
    endDate: oneMonthAfterDate,
  }, // Delhi - Mumbai
  {
    origin: "BOM",
    destination: "DEL",
    startDate: formattedDate,
    endDate: oneMonthAfterDate,
  }, // Delhi - Mumbai
  {
    origin: "BLR",
    destination: "BOM",
    startDate: formattedDate,
    endDate: oneMonthAfterDate,
    // bengaluru-mumbai
  },
  {
    origin: "BOM",
    destination: "MAA",
    startDate: formattedDate,
    endDate: oneMonthAfterDate,
  }
  // mumbai-chennai
  , {
    origin: "HYD",
    destination: "MAA",
    startDate: formattedDate,
    endDate: oneMonthAfterDate,
  },
  // hyderabad-chennai
   {
    origin: "BOM",
    destination: "CCU",
    startDate: formattedDate,
    endDate: oneMonthAfterDate,
  }
  //  mumbai-kolkata
];





// export const ScrapingRoutes=[// ...existing code...
// // mumbai-chennai
// , {
//   origin: "HYD",
//   destination: "MAA",
//   startDate: formattedDate,
//   endDate: oneMonthAfterDate,
// }
// // hyderabad-chennai
// , {
//   origin: "GAU",
//   destination: "DEL",
//   startDate: formattedDate,
//   endDate: oneMonthAfterDate,
// }, // Guwahati - Delhi
// {
//   origin: "NAG",
//   destination: "BOM",
//   startDate: formattedDate,
//   endDate: oneMonthAfterDate,
// }, // Nagpur - Mumbai
// {
//   origin: "BOM",
//   destination: "PNQ",
//   startDate: formattedDate,
//   endDate: oneMonthAfterDate,
// }, // Mumbai - Pune
// {
//   origin: "DEL",
//   destination: "GOI",
//   startDate: formattedDate,
//   endDate: oneMonthAfterDate,
// }, // Delhi - Goa
// {
//   origin: "BLR",
//   destination: "GOI",
//   startDate: formattedDate,
//   endDate: oneMonthAfterDate,
// }, // Bangalore - Goa
// {
//   origin: "DEL",
//   destination: "SXR",
//   startDate: formattedDate,
//   endDate: oneMonthAfterDate,
// }, // Delhi - Srinagar
// {
//   origin: "PNQ",
//   destination: "HYD",
//   startDate: formattedDate,
//   endDate: oneMonthAfterDate,
// }, // Pune - Hyderabad
// {
//   origin: "COK",
//   destination: "HYD",
//   startDate: formattedDate,
//   endDate: oneMonthAfterDate,
// }, // Kochi - Hyderabad
// {
//   origin: "VNS",
//   destination: "DEL",
//   startDate: formattedDate,
//   endDate: oneMonthAfterDate,
// }, // Varanasi - Delhi
// {
//   origin: "CCU",
//   destination: "BLR",
//   startDate: formattedDate,
//   endDate: oneMonthAfterDate,
// } // Kolkata - Bangalore
// ]