var express = require('express');
var mongoose = require('mongoose');

var growlSchema = mongoose.Schema({
  content: String,
  date: Date,
  username: String,
  profilePic: String
});

var Growl = mongoose.model('Growl', growlSchema);

module.exports = Growl;
