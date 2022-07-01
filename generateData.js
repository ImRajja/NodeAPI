var faker = require("faker");

var libs = process.cwd() + "/libs/";

var log = require(libs + "log")(module);
var db = require(libs + "db/mongoose");
var config = require(libs + "config");

var User = require(libs + "model/user");
var Client = require(libs + "model/client");
var AccessToken = require(libs + "model/accessToken");
var RefreshToken = require(libs + "model/refreshToken");

config.get("default:user").forEach((userin) => {
  User.deleteMany({ username: userin.username }, function (err) {
    var user = new User(userin);
    console.log("user-->");
    console.log(user);

    user.save(function (err, user) {
      if (!err) {
        log.info("New user - %s:%s", user.username, user.password);
      } else {
        return log.error(err);
      }
    });
  });
});

// User.deleteMany({}, function (err) {
//     var user = new User({
//         username: config.get('default:user:username'),
//         password: config.get('default:user:password')
//     });

//     user.save(function (err, user) {
//         if (!err) {
//             log.info('New user - %s:%s', user.username, user.password);
//         } else {
//             return log.error(err);
//         }
//     });
// });

config.get("default:client").forEach((clientin) => {
  Client.deleteMany({ clientId: clientin.clientId }, function (err) {
    var client = new Client(clientin);

    client.save(function (err, client) {
      if (!err) {
        log.info("New client - %s:%s", client.clientId, client.clientSecret);
      } else {
        return log.error(err);
      }
    });
  });
});

AccessToken.deleteMany({}, function (err) {
  if (err) {
    return log.error(err);
  }
});

RefreshToken.deleteMany({}, function (err) {
  if (err) {
    return log.error(err);
  }
});

setTimeout(function () {
  db.disconnect();
}, 3000);
