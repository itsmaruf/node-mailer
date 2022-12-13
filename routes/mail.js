var express = require("express");
var router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("Mail sender function will be here soon");
});

router.post("/", function (req, res, next) {
  console.log(req.body);
});

module.exports = router;
