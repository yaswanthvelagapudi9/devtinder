const express = require("express");
const bcrypt = require("bcrypt");
const profileRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const { validateEditProfileData } = require("../utils/validation");
const cookieParser = require("cookie-parser");

profileRouter.use(express.json());

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(401).send("Unauthorized: No token provided");
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid Edit Request");
    }

    const loggedInUser = req.user;
    console.log(loggedInUser);

    Object.keys(req.body).forEach(
      (each) => (loggedInUser[each] = req.body[each])
    );

    await loggedInUser.save();

    res.json({
      message: `${loggedInUser.firstName} profile updated successfully`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const { password } = req.body;
    const loggedInUser = req.user;

    const hashedPassword = await bcrypt.hash(password, 10);

    loggedInUser.password = hashedPassword;
    await loggedInUser.save();

    res.json({
      message: `${loggedInUser.firstName} password updated successfully`,
    });
  } catch (err) {
    res.status(400).send("Error: ", err.message);
  }
});

module.exports = profileRouter;
