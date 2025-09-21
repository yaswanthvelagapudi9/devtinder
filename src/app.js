const express = require("express");
const { connectToDb } = require("./config/database");
const { User } = require("./models/user");
const { adminAuth, userAuth } = require("./middleware/auth");

const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    res.send("User addded successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong");
  }
});

connectToDb()
  .then(() => {
    console.log("Connected to DB");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err) => console.error("DB Connection Error:", err));
