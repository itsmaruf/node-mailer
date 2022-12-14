// dotenv
require("dotenv").config();

const { MongoClient, ServerApiVersion } = require("mongodb");
module.exports = {
  DB_PORT: 4300,
  DB_URL: `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.teirbdg.mongodb.net/?retryWrites=true&w=majority`,
};
