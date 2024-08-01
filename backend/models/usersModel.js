const mongoose = require("mongoose")
const resetPasswordModel = require("./resetPasswordModel")
const usersSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      message: "Email is required and must be a string",
    },
    phone: {
      type: String,
      required: true,
      message: "Phone number is required ",
    },
    firstname: {
      type: String,
      required: true,
      message: " Firstname must be a string",
    },
    lastname: {
      type: String,
      required: true,
      message: " Lastname must be a string",
    },
    password: {
      type: String,
      required: true,
      message: "Password is required ",
    },
    profileImage: {
      type: String,
      message: "Profile image must be a string or null",
    },
    role: {
      type: Number,
      default: 0,
    },

    isverified: {
      type: Boolean,
      default: true,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

const users = mongoose.models.users || mongoose.model("users", usersSchema)

module.exports = users
