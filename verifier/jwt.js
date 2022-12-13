var express = require("express");
const jwt = require("jsonwebtoken");
var router = express.Router();

require("dotenv").config();

const verifyJwt = (req, res, next) => {
  const authHeader = req.headers.authorization;
  // console.log(authHeader);
  if (!authHeader) {
    return res.status(401).json({
      status: 401,
      message: "Unauthorized Access 1",
    });
  }

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.SECRET_ACCESS_TOKEN, function (err, decoded) {
    if (err) {
      return res.status(401).json({
        status: 401,
        message: "Unauthorized Access 2",
        error: err,
      });
    }

    req.decoded = decoded;
    next();
  });
  // next();
};

router.get("/", function (req, res, next) {
  res.send("Hello JWT!");
});

router.post("/", verifyJwt, async function (req, res, next) {
  const user = req.body;

  const token = jwt.sign(user, process.env.SECRET_ACCESS_TOKEN, {
    expiresIn: "1h",
  });

  const decoded = req.decoded;
  // console.log("decoded", decoded);

  if (decoded.email !== user.email && decoded.password !== user.password) {
    return res.status(401).json({
      status: 401,
      message: "Unauthorized Access 3",
      decoded,
      user,
    });
  }
  res.send({ token, decoded, user });
  console.log({ token, ...decoded });

  // console.log({ ...user, token });
});

module.exports = router;
