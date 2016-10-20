var express = require('express');
var router = express.Router();
var _ = require('lodash');
var mongoose = require('mongoose');
var Growl = require('../models/growl');

// GET specific user's growls
// router.use('/', function (req, res, next) {
//   var userId = req.sub;
//   Growl.find({username: userId}, function (err, growls) {
//     res.json(growls);
//   });
// });

/* GET home page. */
router.get('/', function(req, res, next) {
  Growl.find({}, function (err, growls) {
    if(err) {
      res.status(500).send();
    } else {
      res.json(growls);
    }
  });
});


// POST route
router.post('/', function (req, res, next) {
  req.body = _.pick(req.body, ['content', 'date', 'userId', 'username', 'profilePic'])
  /* ^^^ Actually, username and profile pic will come from Auth0's req.user, and date will come from
  the browser...but whatever, this is fine for now */
  var newGrowl = new Growl(req.body);

  newGrowl.save(function (err) {
    if(err) {
      res.status(500).send();
    } else {
      res.status(204).send();
    }
  });
});

// DELETE route
router.delete('/:Id', function (req, res, next) {
 Growl.findById(req.params.Id, function (err, growl) {
   if(err) {
     res.status(500).send();
   } else if (!growl) {
     res.status(404).send();
   } else {
     growl.remove(function (err) {
       if (err) {
         res.status(500).send()
       } else {
         res.status(204).send()
       }
     });
   }
 });
});

module.exports = router;
