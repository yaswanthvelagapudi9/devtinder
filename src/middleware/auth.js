const jwt = require("jsonwebtoken");
const { User } = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      throw new Error("Unauthorized: No token provided");
    }

    const decodedData = await jwt.verify(token, "secret");

    const { _id } = decodedData;

    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).send("User not found");
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send("Unauthorized: No token provided" + error.message);
  }
};

module.exports = { userAuth };
