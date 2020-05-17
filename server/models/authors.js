"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let AuthorSchema = new Schema({
  firstname: String,
  lastname: String,
  email: {
    type: String,
    required: true,
    trim: true
  }
});

module.exports = mongoose.model("Author", AuthorSchema);