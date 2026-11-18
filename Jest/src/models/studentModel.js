const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const StudentSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "please enter your name"],
    },
    slug: {
      type: String,
      trim: true,
      lowercase: true,
    },
    city: {
      type: String,
      required: true,
    },
    age: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: "image",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const StudentModel = mongoose.model("student", StudentSchema);

module.exports = StudentModel;
