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
  return son;
};
