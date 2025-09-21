const mongoose = require("mongoose");

async function connectToDb() {
  await mongoose.connect(
    "mongodb+srv://yaswanthvelagapudi_db_user:XAxS4wanLdB8bYNp@namastenode.80p2pef.mongodb.net/?retryWrites=true&w=majority&appName=NamasteNode"
  );
}

module.exports = { connectToDb };
