"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let PostSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  message: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'Author'
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft'
  },
  comments: [
    {
      nickname: String,
      comment: String,
      date: {
        type: Date,
        default: Date.now
      },
    }
  ]
});

module.exports = mongoose.model("Post", PostSchema);