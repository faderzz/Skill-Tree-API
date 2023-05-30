// const crypto = require("crypto");
// const asyncHandler = require("express-async-handler");
const config = require("../../config");
const { expressjwt } = require("express-jwt");

// module.exports = asyncHandler((req, res, next) => {
//   if (!req.headers.api_key) {
//     return res.status(401).json({
//       reponse: "error",
//       error: "Not Authorized"
//     });
//   }

//   try {
//     const hash = crypto.createHash("sha512");
//     const isValid = crypto.timingSafeEqual(
//       hash.copy().update(req.headers.api_key).digest(),
//       hash.copy().update(config.apiKey).digest()
//     );

//     if (!isValid) {
//       return res.status(401).json({
//         response: "error",
//         error: "Not Authorized, invalid API Key"
//       });
//     }

//     next();
//   } catch (err) {
//     console.error(err);

//     res.status(401).json({
//       response: "error",
//       error: "Not Authorized, no API key"
//     });
//   }
// });

module.exports = expressjwt({
  // TODO: make the sercret configurable
  secret: "skilltest",
  algorithms: ["HS256"],
  credentialsRequired: false,
  getToken: (req) => {
    if (!req.headers.authorization && !req.headers.api_key) return null;

    if (req.headers.authorization.split(" ")[0] === "Bearer") {
      return req.headers.authorization.split(" ")[1];
    } else if (req.headers.api_key === config.apiKey) {
      return "";
    }
    return null;
  },
});
