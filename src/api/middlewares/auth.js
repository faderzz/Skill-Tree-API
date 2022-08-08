const crypto = require("crypto");
const asyncHandler = require("express-async-handler");
const config = require("../../config");

module.exports = asyncHandler((req, res, next) => {
  if (!req.headers.api_key) {
    return res.status(401).json({
      reponse: "error",
      error: "Not Authorized"
    });
  }

  try {
    const hash = crypto.createHash("sha512");
    const isValid = crypto.timingSafeEqual(
      hash.copy().update(req.headers.api_key).digest(),
      hash.copy().update(config.apiKey).digest()
    );

    if (!isValid) {
      return res.status(401).json({
        response: "error",
        error: "Not Authorized, invalid API Key"
      });
    }

    next();
  } catch (err) {
    console.error(err);

    res.status(401).json({
      response: "error",
      error: "Not Authorized, no API key"
    });
  }
});