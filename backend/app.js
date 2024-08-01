const express = require("express")
const cookieParser = require("cookie-parser")
const app = express()
require("dotenv").config()
const authRoute = require("./routes/auth.js")
//use the body
app.use(express.json())
//midleware for cookies
app.use(cookieParser())

// auth route
app.use("/api/auth", authRoute)

app.get("/", (req, res) => {
  console.log("app is listening")
})

const port = process.env.PORT || process.env.MYPORT
app.listen(port, () => console.log(` Your app is runnnig on port ${port}`))
