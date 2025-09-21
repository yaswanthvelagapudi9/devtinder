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

app.get("/user/:emailId", async (req, res) => {
  const email = req.params.emailId;
  console.log(email);
  try {
    const user = await User.find({ emailId: email });
    if (!user) {
      return res.status(404).send("User not found");
    }
    if (user.length === 0) {
      return res.status(404).send("User not found");
    }
    res.send(user);
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong");
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong");
  }
});

app.delete("/user", async (req, res) => {
  const userId = req.body._id;
  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.send("User deleted successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong");
  }
});

app.patch("/user", async (req, res) => {
  const userId = req.body._id;
  const data = req.body;

  try {
    const allowedData = [
      "userId",
      "photoUrl",
      "about",
      "skills",
      "gender",
      "age",
    ];

    const isUpdateAllowed = Object.keys(data).every((key) =>
      key.includes(allowedData)
    );

    if (!isUpdateAllowed) {
      return res.status(400).send("Updates not allowed!");
    }

    if (data.skills.length > 10) {
      throw new Error("Skills cannot be more than 10");
    }

    const user = await User.findByIdAndUpdate({ _id: userId }, data);
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.send("User updated successfully");
  } catch (error) {
    console.error(error);
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
