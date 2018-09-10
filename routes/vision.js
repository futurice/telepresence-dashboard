var express = require('express');
var router = express.Router();
var visionGestures = require('../data/visioncodes.json');
const LiveCam = require('livecam');
const webcam_server = new LiveCam({
  'start' : function() {
    console.log('WebCam server started!');
  }
});

webcam_server.broadcast();

router.get('/', function(req, res, next) {
  res.render('vision', {
    buttons: visionGestures.gestures
  });
});

module.exports = router;
