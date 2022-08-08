let dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const app = require("./midlweare/app");

process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  console.log("Uncaught Exception. sync ");
  process.exit(1);
});

const sequalize = require("./model");

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// process.on("unhandledRejection", (err) => {
//   console.log(err.name, err.message);
//   console.log("unhandledRejection   async");
//   process.exit(1);
// });
