var express = require('express');
var router = express.Router();
var gestures = require('../data/gestures.json');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', gestures: gestures });
});

module.exports = router;
