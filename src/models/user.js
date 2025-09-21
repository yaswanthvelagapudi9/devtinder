const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true, minlength: 4 },
    lastName: { type: String, trim: true },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 6 },
    age: { type: Number, min: 18, max: 100 },
    gender: {
      type: String,
      validate(value) {
        if (
          ![
            "male",
            "female",
            "other",
            "Male",
            "Female",
            "Other",
            "Others",
          ].includes(value)
        ) {
          throw new Error("Invalid gender");
        }
      },
      runValidators: true,
    },
    photoURL: {
      type: String,
      default:
        "https://pixabay.com/vectors/blank-profile-picture-mystery-man-973460/",
    },
    about: {
      type: String,
      default: "This is a default description of the user",
    },
    skills: { type: [String] },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = { User };
