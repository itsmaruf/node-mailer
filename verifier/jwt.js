var express = require("express");
const jwt = require("jsonwebtoken");
var router = express.Router();

require("dotenv").config();

const verifyJwt = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send("Unauthorized request");
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.SECRET_ACCESS_TOKEN, function (err, decoded) {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized request",
        error: err,
      });
    }
    req.decoded = decoded;
    next();
  });
};

// router.get("/", function (req, res, next) {
//   res.send("Hello JWT!");
// });

router.post("/jwt", (req, res) => {
  const user = req.body;
  const token = jwt.sign(user, process.env.SECRET_ACCESS_TOKEN, {
    expiresIn: "1h",
  });
  res.send({ token });
  console.log({ ...user, token });
});

// router.post("/", verifyJwt, async function (req, res, next) {
//   const user = req.body;

//   const decoded = req.decoded;
//   // console.log("decoded", decoded);

//   if (decoded.email !== user.email && decoded.password !== user.password) {
//     return res.status(401).json({
//       status: 401,
//       message: "Unauthorized Access 3",
//       decoded,
//       user,
//     });
//   }
//   res.send({ token, decoded, user });
//   console.log({ token, ...decoded });

//   // console.log({ ...user, token });
// });

router.get("/", verifyJwt, function (req, res, next) {
  const decoded = req.decoded;
  const user = req.query;

  if (decoded.email !== user.email) {
    return res.status(401).json({
      status: 401,
      message: "Unauthorized Access 3",
    });
  }
  res.send({ message: "Welcome, You are Authorized to access" });
});

module.exports = router;
