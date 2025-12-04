const  validateFlightRequest = async (req, res, next) => {
  const { origin, destination, startDate, endDate } = req.body;
  const errors = [];

  if (!origin || !destination) {
    errors.push("pls fill all the fields");
  }
  if (!startDate || !endDate) {
    errors.push("start and end date fields are req");
  }

  if (errors.length > 0) {
    return res
      .status(400)
      .json({ message: "all the fields are required", status: "error" });
  }

  next();
};
export default validateFlightRequest;