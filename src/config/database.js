const mongoose = require("mongoose");

async function connectToDb() {
  await mongoose.connect(process.env.DB_CONNECTION_SECRET);
}

module.exports = { connectToDb };
