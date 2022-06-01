const crypto = require("crypto");
const asyncHandler = require("express-async-handler");

module.exports = asyncHandler((req, res, next) => {
  if (req.headers.api_key) {
    try {
      const hash = crypto.createHash("sha512");
      if (crypto.timingSafeEqual(
        hash.copy().update(req.headers.api_key).digest(),
        hash.copy().update(process.env.API_KEY).digest()
      )) {
        next();
      } else {
        res.status(401).json({error: "Not Authorized, invalid API Key"});
        throw new Error("Not authorized, invalid API Key");
      }
    } catch (err) {
      res.status(401).json({error: "Not Authorized, no API key"});
      throw new Error("Not authorized, no API key");
    }
  } else {
    res.status(401).json({error: "Not Authorized"});
  }
});