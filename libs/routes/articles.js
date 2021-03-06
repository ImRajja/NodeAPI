var express = require("express");
var passport = require("passport");
var router = express.Router();

var libs = process.cwd() + "/libs/";
var log = require(libs + "log")(module);

var db = require(libs + "db/mongoose");
var Article = require(libs + "model/article");

// List all articles
router.get(
  "/",
  passport.authenticate("bearer", { session: false }),
  function (req, res) {
    Article.find(function (err, articles) {
      if (!err) {
        return res.json(articles);
      } else {
        res.statusCode = 500;

        log.error("Internal error(%d): %s", res.statusCode, err.message);

        return res.json({
          error: "Server error",
        });
      }
    });
  }
);

// Create article
router.post(
  "/",
  passport.authenticate("bearer", { session: false }),
  function (req, res) {
    var article = new Article({
      title: req.body.title,
      author: req.body.author,
      description: req.body.description,
      images: req.body.images,
    });

    article.save(function (err) {
      if (!err) {
        log.info("New article created with id: %s", article.id);
        return res.json({
          status: "OK",
          article: article,
        });
      } else {
        if (err.name === "ValidationError") {
          res.statusCode = 400;
          res.json({
            // error: "Validation error1",
            error: err,
          });
        } else {
          res.statusCode = 500;

          log.error("Internal error(%d): %s", res.statusCode, err.message);

          res.json({
            error: "Server error",
          });
        }
      }
    });
  }
);

// Get article
router.get(
  "/:id",
  passport.authenticate("bearer", { session: false }),
  function (req, res) {
    Article.findById(req.params.id, function (err, article) {
      if (!article) {
        res.statusCode = 404;

        return res.json({
          error: "Not found article",
        });
      }

      if (!err) {
        return res.json({
          status: "OK",
          article: article,
        });
      } else {
        res.statusCode = 500;
        log.error("Internal error(%d): %s", res.statusCode, err.message);

        return res.json({
          error: "Server error",
        });
      }
    });
  }
);

// Update article
router.put(
  "/:id",
  passport.authenticate("bearer", { session: false }),
  function (req, res) {
    var articleId = req.params.id;

    Article.findById(articleId, function (err, article) {
      if (!article) {
        res.statusCode = 404;
        log.error("Article with id: %s Not Found", articleId);
        return res.json({
          error: "Not found - article two",
        });
      }

      if (req.body.title) {
        article.title = req.body.title;
      }
      if (req.body.description) {
        article.description = req.body.description;
      }
      if (req.body.author) {
        article.author = req.body.author;
      }
      if (req.body.images) {
        article.images = req.body.images;
      }

      article.save(function (err) {
        if (!err) {
          log.info("Article with id: %s updated", article.id);
          return res.json({
            status: "OK",
            article: article,
          });
        } else {
          if (err.name === "ValidationError") {
            res.statusCode = 400;
            return res.json({
              error: "Validation error2",
            });
          } else {
            res.statusCode = 500;

            return res.json({
              error: "Server error",
            });
          }
          log.error("Internal error (%d): %s", res.statusCode, err.message);
        }
      });
    });
  }
);

// Get article
router.delete(
  "/:id",
  passport.authenticate("bearer", { session: false }),
  function (req, res) {
    Article.findById(req.params.id, function (err, article) {
      if (!article) {
        res.statusCode = 404;

        return res.json({
          error: "Not found - article three",
        });
      }

      article.delete(function (err) {
        if (!err) {
          log.info("Article with id: %s deleted", article.id);
          return res.json({
            status: "OK",
            article: article,
          });
        } else {
          if (err.name === "ValidationError") {
            res.statusCode = 400;
            return res.json({
              error: "Validation error3",
            });
          } else {
            res.statusCode = 500;

            return res.json({
              error: "Server error",
            });
          }
          log.error("Internal error (%d): %s", res.statusCode, err.message);
        }
      });
    });
  }
);

module.exports = router;
