var express = require('express');
var router = express.Router();
var path = require('path');
var net = require('net');
var gestures = require('../data/gestures.json');
var fs = require('fs');
var binaryServer = require('binaryjs').BinaryServer;
var server = binaryServer({port:9001});
const record = require('node-record-lpcm16');
const speech = require('@google-cloud/speech');
const clientvoice = new speech.SpeechClient();

const encoding = 'LINEAR16';
const sampleRateHertz = 16000;
const languageCode = 'en-US';

/* GET home page. */
router.post('/run/preset/:scenario/:buttonClicked', function (request, response){
  let scenario = request.params.scenario;
  let buttonName = request.params.buttonClicked;
  if (gestures.scenarios[scenario].hasOwnProperty(buttonName)){
    fs.readFile(gestures.scenarios[scenario][buttonName].filename, 'utf8', function(error, data){
      if (error) throw error;
      console.log(data);
      sendOverSocket(data);
      response.json({success:true});
      showSuccess();
    });
  } else {
    response.json({success:false});
    showError();
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

router.post('/run/vision', function (request, response){
  let x = request.body.perX;
  let y = request.body.perY;
  sendOverSocket('turnhead("'+x+'/'+y+'")');
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
