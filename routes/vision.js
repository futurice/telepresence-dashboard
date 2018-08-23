var express = require('express');
var router = express.Router();
var visionGestures = require('../data/visioncodes.json');

/*router.get('/', function(req, res, next) {
  res.render('index', { title: 'Telepresence', currentKey: scenario, scenarioKeys: Object.keys(gestures.scenarios),
  buttons: gestures.scenarios[scenario] });
});*/

router.get('/', function(req, res, next) {
  res.render('vision', {
    buttons: visionGestures.gestures
  });
  //res.render('vision2');
});

module.exports = router;
