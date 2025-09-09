const jwt = require("jsonwebtoken");

const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.ACCESS_SECRET, {
    expiresIn: "1h",
  });
  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_SECRET, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
};

module.exports = { generateTokens };
