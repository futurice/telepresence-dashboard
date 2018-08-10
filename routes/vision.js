var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('vision');
});

router.get('/', function(req, res, next){
  res.render('vision2');
});

module.exports = router;
