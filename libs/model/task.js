var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Task = new Schema(
  {
    title: { type: String, required: true },
    email: { type: String, required: true },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

Task.path("title").validate(function (v) {
  return v.length > 5 && v.length < 70;
});

module.exports = mongoose.model("Task", Task);
