var express = require('express');
var router = express.Router();
var gestures = require('../data/gestures.json');

/* GET home page. */
router.get('/:scenario?', function(req, res, next) {
  let scenario = req.params.scenario || "signlanguage";
  res.render('index', { title: 'Express', currentKey: scenario, scenarioKeys: Object.keys(gestures.scenarios),
  buttons: gestures.scenarios[scenario] });
});

module.exports = router;
