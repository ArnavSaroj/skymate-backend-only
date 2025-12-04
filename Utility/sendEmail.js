import nodemailer from 'nodemailer'

export const BookmarkEmail = async (price, target_price) => {
    
    if (price < target_price) {
    
const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false, 
  auth: {
    user: "clement.jacobi@ethereal.email",
    pass: "rEucBT7rCgabvDFs4y",
  },
});

(async () => {
  const info = await transporter.sendMail({
    from: '"SKYMATE team" <skymate@.email>',
    to: "clement.jacobi@ethereal.email",
    subject: "Hello ✔",
    text: "The price of your favourite route has dropped ", 
    html: "<b>The price of your favourite route has dropped </b>",
  });

  console.log("Message sent:", info.messageId);
})();
}


}