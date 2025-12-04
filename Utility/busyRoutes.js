const currentDate = new Date();

const year = currentDate.getFullYear();
const month = String(currentDate.getMonth() + 1).padStart(2, "0");
const day = String(currentDate.getDate()).padStart(2, "0");

const formattedDate = `${year}-${month}-${day}`;

const tomorrow = new Date();
tomorrow.setDate(currentDate.getDate() + 1);

const tYear = tomorrow.getFullYear();
const tMonth = String(tomorrow.getMonth() + 1).padStart(2, "0");
const tDay = String(tomorrow.getDate()).padStart(2, "0");

const oneDayAfter = `${tYear}-${tMonth}-${tDay}`;


export const busyRoutes = [
  // 1. Delhi ↔ Mumbai
  {
    origin: "DEL",
    destination: "BOM",
    startDate: formattedDate,
    endDate:oneDayAfter ,
  },

  // 2. Bengaluru ↔ Delhi
  {
    origin: "BLR",
    destination: "DEL",
    startDate: formattedDate,
    endDate: oneDayAfter,
  },

  // 3. Bengaluru ↔ Mumbai
  {
    origin: "BLR",
    destination: "BOM",
    startDate: formattedDate,
    endDate: oneDayAfter,
  },

  // 4. Hyderabad ↔ Delhi
  {
    origin: "HYD",
    destination: "DEL",
    startDate: formattedDate,
    endDate: oneDayAfter,
  },

  // 5. Chennai ↔ Mumbai
  {
    origin: "MAA",
    destination: "BOM",
    startDate: formattedDate,
    endDate: oneDayAfter,
  },

  // 6. Kolkata ↔ Delhi
  {
    origin: "CCU",
    destination: "DEL",
    startDate: formattedDate,
    endDate: oneDayAfter,
  },

  // 7. Chennai ↔ Bengaluru
  {
    origin: "MAA",
    destination: "BLR",
    startDate: formattedDate,
    endDate: oneDayAfter,
  },

  // 8. Pune ↔ Delhi
  {
    origin: "PNQ",
    destination: "DEL",
    startDate: formattedDate,
    endDate: oneDayAfter,
  },

  // 9. Pune ↔ Bengaluru
  {
    origin: "PNQ",
    destination: "BLR",
    startDate: formattedDate,
    endDate: oneDayAfter,
  },

  // 10. Hyderabad ↔ Mumbai
  {
    origin: "HYD",
    destination: "BOM",
    startDate: formattedDate,
    endDate: oneDayAfter,
  },
];
