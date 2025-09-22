const express = require("express");
const { connectToDb } = require("./config/database");
const { User } = require("./models/user");
const { userAuth } = require("./middleware/auth");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);
    const { firstName, lastName, emailId, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashedPassword,
    });

    await user.save();
    res.send("User addded successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong");
  }
});

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId });

    if (!user) {
      throw new Error("EmailId not found");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      const token = await jwt.sign({ _id: user._id }, "secret", {
        expiresIn: "1d",
      });
      console.log(token);
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.status(200).send("Login successful");
    } else {
      throw new Error("Invalid password");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong");
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(401).send("Unauthorized: No token provided");
  }
});

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user.firstName + " sent the connection request");
  } catch (error) {
    res.status(500).send("Something went wrong");
  }
});

// app.get("/user/:emailId", async (req, res) => {
//   const email = req.params.emailId;
//   console.log(email);
//   try {
//     const user = await User.find({ emailId: email });
//     if (!user) {
//       return res.status(404).send("User not found");
//     }
//     if (user.length === 0) {
//       return res.status(404).send("User not found");
//     }
//     res.send(user);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Something went wrong");
//   }
// });

// app.get("/feed", async (req, res) => {
//   try {
//     const users = await User.find({});
//     res.send(users);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Something went wrong");
//   }
// });

// app.delete("/user", async (req, res) => {
//   const userId = req.body._id;
//   try {
//     const user = await User.findByIdAndDelete(userId);
//     if (!user) {
//       return res.status(404).send("User not found");
//     }
//     res.send("User deleted successfully");
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Something went wrong");
//   }
// });

// app.patch("/user", async (req, res) => {
//   const userId = req.body._id;
//   const data = req.body;

//   try {
//     const allowedData = [
//       "userId",
//       "photoUrl",
//       "about",
//       "skills",
//       "gender",
//       "age",
//     ];

//     const isUpdateAllowed = Object.keys(data).every((key) =>
//       key.includes(allowedData)
//     );

//     if (!isUpdateAllowed) {
//       return res.status(400).send("Updates not allowed!");
//     }

//     if (data.skills.length > 10) {
//       throw new Error("Skills cannot be more than 10");
//     }

//     const user = await User.findByIdAndUpdate({ _id: userId }, data);
//     if (!user) {
//       return res.status(404).send("User not found");
//     }
//     res.send("User updated successfully");
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Something went wrong");
//   }
// });

connectToDb()
  .then(() => {
    console.log("Connected to DB");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err) => console.error("DB Connection Error:", err));
