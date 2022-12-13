var express = require("express");
const jwt = require("jsonwebtoken");
var router = express.Router();

require("dotenv").config();

router.get("/", function (req, res, next) {
  res.send("Hello JWT!");
});

router.post("/", async function (req, res, next) {
  const user = req.body;

  const token = jwt.sign(user, process.env.SECRET_ACCESS_TOKEN, {
    expiresIn: "1h",
  });

  res.send({ token });

  console.log({ ...user, token });
});

module.exports = router;
