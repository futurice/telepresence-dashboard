var express = require('express');
var router = express.Router();
var path = require('path');
var net = require('net');
var gestures = require('../data/gestures.json');
var fs = require('fs');

/* GET home page. */
router.post('/run/preset/:buttonClicked', function (request, response){
  let buttonName = request.params.buttonClicked;
  if (gestures.hasOwnProperty(buttonName)){
    fs.readFile(gestures[buttonName].filename, 'utf8', function(error, data){
      if (error) throw error;
      console.log(data);
      sendOverSocket(data);
      response.json({success: true});
    });
  }
});

router.post('/run/speech', function (request, response){
  sendOverSocket('momotalk("'+request.body.speech+'")');
  response.json({success: true});
});

router.post('/run/code', function (request, response){
  sendOverSocket(request.body.code);
  response.json({success: true});
});

function sendOverSocket(message){
  var client = new net.Socket();
  client.connect(15000, function(){
    console.log('Connected');
  });
  client.on('data', function (reply) {
    console.log("From robot: " + reply);
  });
  console.log("Sending to robot: " + message);
  client.write(message);
  client.end();
}

module.exports = router;
