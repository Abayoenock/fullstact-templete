const jwt = require("jsonwebtoken")

// Middleware to authenticate JWT token
const authenticateJWT =
  (role = []) =>
  (req, res, next) => {
    const token = req.cookies.JWT_TOKEN
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication failed: No token provided",
      })
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return res.status(403).json({
            success: false,
            message:
              "Authentication failed: Token has expired login again to continue using the system",
          })
        } else {
          return res.status(403).json({
            success: false,
            message: "Authentication failed: Failed to authenticate token",
          })
        }
      }
      const userData = user.data

      // Check if the user's role matches the required role
      if (role.length > 0 && !role.includes(userData.role)) {
        return res.status(403).json({
          success: false,
          message:
            "Authorization failed: User does not have the required privileges",
        })
      }

      req.user = userData
      next()
    })
  }

module.exports = authenticateJWT
