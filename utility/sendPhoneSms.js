const dotenv = require("dotenv");
dotenv.config({ path: "../config.env" });
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

module.exports = async (phone, sms) => {
  let son = await client.messages.create({
    body: `Sizning kod raqamingiz ${sms}`,
    from: "+18124585725",
    to: phone,
  });
  console.log("salomsalsaamsa");
  console.log(son);
  return son;
};

// const Vonage = require("@vonage/server-sdk");

// const vonage = new Vonage({
//   apiKey: "a1915eec",
//   apiSecret: "q2ix1oohJMjT7gg8",
// });

// // module.exports =
// const data = async (phone, sms) => {
//   const from = "Vonage APIs";
//   const to = "998906460351";
//   const text = "A text message sent using the Vonage SMS API";

//   vonage.message.sendSms(from, to, text, (err, responseData) => {
//     if (err) {
//       console.log(err);
//     } else {
//       if (responseData.messages[0]["status"] === "0") {
//         console.log("Message sent successfully.");
//       } else {
//         console.log(
//           `Message failed with error: ${responseData.messages[0]["error-text"]}`
//         );
//       }
//     }
//   });
// };

// data();
