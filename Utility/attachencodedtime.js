/**
 * Attaches fixed encoded time T23%3A00%3A52%2B05%3A30 to any YYYY-MM-DD date string
 */
const attachEncodedTime = (dateString) => {
  const encodedTime = "T23%3A00%3A52%2B05%3A30";
  return `${dateString}${encodedTime}`;
};

export default attachEncodedTime;
