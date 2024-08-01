require("dotenv").config()
const jwt = require("jsonwebtoken")
const usersModel = require("../models/usersModel")
const resetPasswordModel = require("../models/resetPasswordModel")
const {
  loginSchema,
  createAccountSchema,
  passwordResetSchema,
  emailSchema,
  forgotPasswordResetSchema,
  updateAccountSchema,
} = require("../lib/validationShemas")
const connectDB = require("../lib/db")
const bcrypt = require("bcrypt")
const passwordResetEmail = require("../lib/emailTemplates/passwordReset")
const sendEmail = require("../lib/sendEMAIL")
const crypto = require("crypto")
const saltRounds = 10

// ============== login controller
const login = async (req, res) => {
  try {
    const data = loginSchema.safeParse(req.body)
    if (!data.success) {
      return res.status(400).json({ error: data.error.flatten() })
    }
    userData = data.data
    const { email, password } = userData
    await connectDB()
    const user = await usersModel.findOne({ email })
    if (!user) {
      return res
        .status(404)
        .json({ error: "User does not exist check the emaila and try again" })
    }

    const { password: hashedPassword } = user
    const isPasswordMatch = bcrypt.compare(password, hashedPassword)

    if (!isPasswordMatch) {
      // if password do not match
      return res.status(404).json({ error: "Email or password wrond" })
    }
    // generate jwt token
    const token = jwt.sign(
      {
        data: { userID: user._id, role: user.role },
      },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    )
    console.log(token)
    res.cookie("JWT_TOKEN", token, {
      maxAge: 7200000, // Cookie will expire after 2hours
      httpOnly: true, // Cookie is not accessible via JavaScript (for security)
      secure: process.env.NODE_ENV === "production", // Cookie will only be sent over HTTPS in production
      sameSite: "strict", // Cookie will only be sent in first-party context
    })
    res.json({ message: "Login Sucessful" })
  } catch (err) {
    res.json({})
    console.log(err)
  }
}

// ============ creating account controller
const createAccount = async (req, res) => {
  try {
    const data = createAccountSchema.safeParse(req.body)
    if (!data.success) {
      return res.status(400).json({ error: data.error.flatten() })
    }
    userData = data.data
    let { password } = req.body
    password = await bcrypt.hash(password, saltRounds)
    const insertData = { ...userData, password }
    await connectDB()
    const results = await usersModel.create(insertData)
    console.log(results)
    return res.json({ message: "Account created sucessfully" })
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" })
    console.log(err)
  }
}

//================== change password
const changePassword = async (req, res) => {
  try {
    const data = passwordResetSchema.safeParse(req.body)
    if (!data.success) {
      return res.status(400).json({ error: data.error.flatten() })
    }
    userData = data.data
    console.log(userData)
    const { currentPassword, newPassword } = userData
    const { userID } = req.user

    await connectDB()
    // find the user using the token
    const user = await usersModel.findById(userID)
    if (!user) {
      return res.status(404).json({ error: "User does not exist " })
    }

    const { password } = user
    const isPasswordMatch = await bcrypt.compare(currentPassword, password)

    if (!isPasswordMatch) {
      // if password do not match
      return res
        .status(400)
        .json({ error: "The current password entered is wrong " })
    }
    // hash the new password
    const passwordHashed = await bcrypt.hash(newPassword, saltRounds)
    const result = await usersModel.findByIdAndUpdate(userID, {
      password: passwordHashed,
    })
    res.json({ message: "Password updated sucessfuly" })
  } catch (err) {
    res.json({})
    console.log(err)
  }
}

//TODO: password reset
const resertPassword = async (req, res) => {
  try {
    const data = emailSchema.safeParse(req.body)
    if (!data.success) {
      return res.status(400).json({ error: data.error.flatten() })
    }
    userData = data.data
    const { email } = userData
    console.log(email)
    await connectDB()
    // check if the user exists
    const user = await usersModel.findOne({ email })
    if (!user) {
      return res
        .status(404)
        .json({ error: "User does not exist check the emaila and try again" })
    }

    // generate token
    const resetToken = crypto.randomBytes(32).toString("hex")
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000) // Token expires 30 mins

    const result = resetPasswordModel.create({
      userID: user._id,
      resetToken,
      expiresAt,
    })
    res.json({
      message: `A password reset link has been send to your email :  ${email}`,
    })

    res.on("finish", () => {
      const emailHtml = passwordResetEmail(
        user.firstname,
        `${process.env.CLIENT_URL}/auth/reset-password/change-password?token=${resetToken}`
      )
      // send an email
      sendEmail(
        `"${process.env.APPNAME}" <${process.env.EMAIL_ADDRESS}> `,
        email,
        "Forgot Password reset",
        emailHtml
      )
    })
  } catch (err) {
    res.json({ error: "Internal Server Error" })
    console.log(err)
  }
}
// function to verify the token
const verifyResetToken = async (token) => {
  const user = await resetPasswordModel.findOne({ resetToken: token })
  if (!user) {
    return { error: "Invalid token provided or has already been used  " }
  }
  if (user.expiresAt < Date.now()) {
    return { error: "Token expired please try reseting the password again" }
  }
  return { user }
}

// request to verify the token
const verifyToken = async (req, res) => {
  const token = req.query.token
  try {
    await connectDB()
    const verify = await verifyResetToken(token)
    if (verify.error) {
      return res.status(403).json({ error: verify.error })
    }
    return res.status(200).json({
      message: `Token verifed You can now reset your password `,
    })
  } catch (err) {
    console.log(err)
  }
}

// change the password when someone has requested for a password change
const changePasswordReset = async (req, res) => {
  try {
    const data = forgotPasswordResetSchema.safeParse(req.body)
    if (!data.success) {
      return res.status(400).json({ error: data.error.flatten() })
    }
    userData = data.data
    const { newPassword } = userData
    const token = req.query.token
    await connectDB()
    const verify = await verifyResetToken(token)
    if (verify.error) {
      return res.status(403).json({ error: verify.error })
    }
    const userID = verify.user._id

    // hash the new password
    const passwordHashed = await bcrypt.hash(newPassword, saltRounds)

    const result = await usersModel.findByIdAndUpdate(userID, {
      password: passwordHashed,
    })
    res.status(200).json({ message: "Password updated sucessfuly" })
    res.on("finish", async () => {
      const result = await resetPasswordModel.findByIdAndDelete(userID)
      console.log("deleted", result)
    })
  } catch (err) {
    res.json({})
    console.log(err)
  }
}

// route for getting all users
const getAllUsers = async (req, res) => {
  try {
    await connectDB()
    const users = await usersModel.find().select("-password")
    return res.status(200).json({ data: users })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: "Internal server error" })
  }
}

// get single user
const getSingleUser = async (req, res) => {
  try {
    const userID = req.params?.userID
    await connectDB()
    const user = await usersModel.findById(userID).select("-password")
    return res.status(200).json({ data: user })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: "Internal server error" })
  }
}
// get profile information
const getProfileInformation = async (req, res) => {
  try {
    const userID = req?.user?.userID
    await connectDB()
    const user = await usersModel.findById(userID).select("-password")
    return res.status(200).json({ data: user })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: "Internal server error" })
  }
}

// update  profile information
const updateProfile = async (req, res) => {
  try {
    const data = updateAccountSchema.safeParse(req.body)
    if (!data.success) {
      return res.status(400).json({ error: data.error.flatten() })
    }
    userData = data.data
    await connectDB()
    const userID = req?.user?.userID

    const userExists = await usersModel.find({
      email: userData.email,
      _id: { $ne: userID },
    })

    if (userExists.length > 0) {
      return res
        .status(400)
        .json({ error: "User with that email address already exists" })
    }

    const results = await usersModel.findByIdAndUpdate(userID, userData)

    return res.json({ message: "Your profile hs been sucessfuly updated" })
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" })
    console.log(err)
  }
}

// admin update user   profile information
const updateuserProfile = async (req, res) => {
  try {
    const data = updateAccountSchema.safeParse(req.body)
    if (!data.success) {
      return res.status(400).json({ error: data.error.flatten() })
    }
    userData = data.data
    await connectDB()
    const userID = req.params.userID
    const userExists = await usersModel.find({
      email: userData.email,
      _id: { $ne: userID },
    })

    if (userExists.length > 0) {
      return res
        .status(400)
        .json({ error: "User with that email address already exists" })
    }

    const results = await usersModel.findByIdAndUpdate(userID, userData)

    return res.json({
      message: `${userData.firstname} account information has been sucessfuly updated`,
    })
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" })
    console.log(err)
  }
}

// delete user from the database

const deleteUser = async (req, res) => {
  try {
    const userID = req.params.userID
    await connectDB()
    const user = await usersModel.findByIdAndDelete(userID)

    res.status(200).json({ message: "User deleted successfully" })
    res.on("finish", async () => {
      // perfoms deletes in other tables when the delete was sucessful
      await resetPasswordModel.deleteMany({ userID: userID })
      console.log("deleting user from the database")
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: "Internal Server Error" })
  }
}
const changeIsBlocked = async (req, res) => {
  try {
    const userID = req.params.userID
    await connectDB()
    const user = await usersModel.findByIdAndUpdate(
      userID,
      [
        {
          $set: {
            isBlocked: { $not: "$isBlocked" },
          },
        },
      ],
      { new: true } // Return the updated document
    )
    if (!user) {
      return res
        .status(404)
        .json({ error: "User does not exist in the database " })
    }

    res.status(200).json({
      message: `${user.firstname}'s account  has been successfuly ${
        user.isBlocked == true ? " blocked" : "unblocked"
      } `,
    })
    res.on("finish", async () => {
      // perfoms deletes in other tables when the delete was sucessful
      await resetPasswordModel.deleteMany({ userID: userID })
      console.log("deleting user from the database")
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: "Internal Server Error" })
  }
}
module.exports = {
  login,
  createAccount,
  changePassword,
  resertPassword,
  verifyToken,
  changePasswordReset,
  updateProfile,
  updateuserProfile,
  getProfileInformation,
  getSingleUser,
  getAllUsers,
  deleteUser,
  changeIsBlocked,
}
