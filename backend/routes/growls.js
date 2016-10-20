var express = require('express');
var router = express.Router();
var _ = require('lodash');
var mongoose = require('mongoose');
var Growl = require('../models/growl');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index');
});

module.exports = router;
