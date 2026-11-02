require("dotenv").config({ quiet: true });

const app = require("./app");
const mongoose = require("mongoose");
const connectDatabase = require("./config/database");
const port = process.env.PORT || 3000;

mongoose.connection.on("error", () => {
  console.error("MongoDB connection error");
});

async function start() {
  require("./config/auth").getSecret();
  require("./config/auth").getPasswordPolicy();
  await connectDatabase(process.env.MONGO_URI);
  await require("./models/User").init();
  console.log("🍃 MongoDB connected");
  const server = app.listen(port);
  server.on("error", failStartup);
  server.on("listening", () => {
    console.log(
      `🚀 Server listening on http://localhost:${server.address().port}`,
    );
  });
}

async function failStartup() {
  // エラー本文には接続先や認証情報が含まれる可能性があるため表示しない。
  console.error(
    "Server startup failed. Check JWT_SECRET, PASSWORD_MIN_LENGTH, MONGO_URI, MongoDB availability and PORT.",
  );
  process.exitCode = 1;
  await mongoose.disconnect();
}

start().catch(failStartup);
