var mongoose = require("mongoose");
require("dotenv").config();

var libs = process.cwd() + "/libs/";

var log = require(libs + "log")(module);
var config = require(libs + "config");

// mongoose.connect(config.get('mongoose:uri'));
mongoose.connect(process.env.MONGODB_URI);

var db = mongoose.connection;

db.on("error", function (err) {
  log.error("Connection error:", err.message);
});

db.once("open", function callback() {
  log.info("Connected to DB!");
});

module.exports = mongoose;
