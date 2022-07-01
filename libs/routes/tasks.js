var express = require("express");
var passport = require("passport");
var router = express.Router();

var libs = process.cwd() + "/libs/";
var log = require(libs + "log")(module);

var db = require(libs + "db/mongoose");
var Task = require(libs + "model/task");

// List all tasks
router.get(
  "/:email",
  passport.authenticate("bearer", { session: false }),
  function (req, res) {
    Task.find({ email: req.params.email }, function (err, tasks) {
      if (!err) {
        return res.json(tasks);
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

// Create task
router.post(
  "/:email",
  passport.authenticate("bearer", { session: false }),
  function (req, res) {
    var task = new Task({
      title: req.body.title,
      email: req.body.email,
    });

    console.log("task-->");
    console.log(task);

    task.save(function (err) {
      if (!err) {
        log.info("New task created with id: %s", task.id);
        return res.json({
          status: "OK",
          task: task,
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

// Get task
router.get(
  "/:email/:id",
  passport.authenticate("bearer", { session: false }),
  function (req, res) {
    Task.findById(req.params.id, function (err, task) {
      if (!task) {
        res.statusCode = 404;

        return res.json({
          error: "Not found--task route",
        });
      }

      if (!err) {
        return res.json({
          status: "OK",
          task: task,
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

// Update task
router.put(
  "/:email/:id",
  passport.authenticate("bearer", { session: false }),
  function (req, res) {
    var taskId = req.params.id;

    Task.findById(taskId, function (err, task) {
      if (!task) {
        res.statusCode = 404;
        log.error("Task with id: %s Not Found", taskId);
        return res.json({
          error: "Not found - tasks route second",
        });
      }

      if (req.body.title) {
        task.title = req.body.title;
      }
      if (req.body.email) {
        task.email = req.body.email;
      }
      if (req.body.completed) {
        task.completed = req.body.completed;
      }

      task.save(function (err) {
        if (!err) {
          log.info("Task with id: %s updated", task.id);
          return res.json({
            status: "OK",
            task: task,
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

// Get task
router.delete(
  "/:email/:id",
  passport.authenticate("bearer", { session: false }),
  function (req, res) {
    Task.findById(req.params.id, function (err, task) {
      if (!task) {
        res.statusCode = 404;

        return res.json({
          error: "Not found - task route third",
        });
      }

      task.delete(function (err) {
        if (!err) {
          log.info("Task with id: %s deleted", task.id);
          return res.json({
            status: "OK",
            task: task,
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
