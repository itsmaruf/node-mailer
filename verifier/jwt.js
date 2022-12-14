var express = require("express");
const jwt = require("jsonwebtoken");
var router = express.Router();

const nodeMailer = require("nodemailer");
// const { response } = require("../app");
require("dotenv").config();

// import model
const userModel = require("../models/user.model");

const transporter = nodeMailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

console.log(process.env.SMTP_USER, process.env.SMTP_PASSWORD);

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

// register new user API

router.post("/jwt", (req, res, next) => {
  const user = req.body;
  const token = jwt.sign(user, process.env.SECRET_ACCESS_TOKEN, {
    expiresIn: "1h",
  });

  let newUserData = new userModel({ ...user, token });

  newUserData.save(function (err, newUser) {
    if (err) {
      console.log(err);
      return next(err);
    } else {
      res.send({
        status: "200",
        message: "user info saved successfully",
        contactObj: newUser,
        success: true,
      });
    }
  });
});

// verify and login user API

router.get("/", verifyJwt, function (req, res, next) {
  const decoded = req.decoded;
  const user = req.query;

  if (decoded.email !== user.email) {
    return res.status(401).json({
      status: 401,
      message: "Unauthorized Access 3",
      // decoded,
      // user,
    });
  }
  // const userData = new loginModel(user);

  const options = {
    from: process.env.SMTP_USER,
    to: user.email,
    subject: "Welcome",
    text: "Hello, I'm from nodemailer",
  };

  // find user by email from mongoose
  userModel.findOne(
    { email: user.email, password: user.password },
    function (err, user) {
      if (err) {
        console.log(err);
        return next(err);
      }
      if (!user) {
        return res.status(401).json({
          status: 401,
          message: "Sorry, We could't recognize you. maybe you are a bot",
          // decoded,
          // user,
        });
      } else {
        res.send({ message: "Welcome, You are Authorized to access" });
        transporter.sendMail(options, function (err, info) {
          if (err) {
            console.error(err);
            return;
          }

          console.log("sent", info.response);
        });
        console.log(user);
      }
    }
  );

  //
});

module.exports = router;
