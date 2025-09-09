const jwt = require("jsonwebtoken");
const Token = require("../models/Token");

const verifyToken = async (req, res, next) => {
  const accessToken = req.headers.authorization?.split(" ")[1];
  const refreshToken = req.headers["x-refresh-token"];
  if (!accessToken) {
    return res.status(401).json({ message: "Access token missing" });
  }

  try {
    const decoded = jwt.verify(accessToken, process.env.ACCESS_SECRET);
    req.user = decoded;
    console.log("access token2 ");

    return next();
  } catch (err) {
    if (err.name === "TokenExpiredError" && refreshToken) {
      try {
        console.log("access token3");
        const storedToken = await Token.findOne({ refreshToken });
        if (!storedToken) {
          return res
            .status(403)
            .json({ message: "Refresh token not found in DB" });
        }
        const refreshDecoded = jwt.verify(
          refreshToken,
          process.env.REFRESH_SECRET
        );

        const newAccessToken = jwt.sign(
          { provider_id: refreshDecoded.provider_id },
          process.env.JWT_ACCESS_SECRET,
          { expiresIn: "1h" }
        );

        req.user = refreshDecoded;

        res.setHeader("x-access-token", newAccessToken);
        return next();
      } catch (refreshErr) {
        return res
          .status(401)
          .json({ message: "Refresh token expired or invalid" });
      }
    }

    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = verifyToken;
