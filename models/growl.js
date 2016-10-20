var express = require('express');
var mongoose = require('mongoose');

var growlSchema = mongoose.Schema({
  content: String,
  date: Date,
  userId: String,
  username: String,
  profilePic: String
});

var Growl = mongoose.model('Growl', growlSchema);

module.exports = Growl;
