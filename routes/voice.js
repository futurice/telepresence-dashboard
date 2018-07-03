var binaryServer = require('binaryjs').BinaryServer;
var wav = require('wav');
const speech = require('@google-cloud/speech');
const fs = require('fs');
var net = require('net');
var express = require('express');
var router = express.Router();
var languageCode = 'fi-FI';
const Speaker = require('speaker');


module.exports = function createServer() {

  var server = binaryServer({port:9002});
    // Imports the Google Cloud client library

  var server2 = binaryServer({port:9003});

  // Creates a client
  const client = new speech.SpeechClient({
    keyFilename: '/Users/nulm/.config/gcloud/application_default_credentials.json'
  });

  const filename = 'testi.wav';
  const encoding = 'LINEAR16';
  const sampleRateHertz = 44100;
  router.post('/run/language/:languageCode', function(request, response){
    console.log("signal received");
    languageCode = request.params.languageCode;
  })
  //const languageCode = 'fi-FI';

  var config = {
      encoding: encoding,
      sampleRateHertz: sampleRateHertz,
      languageCode: languageCode,
    };

  const recognizeStream = (filename) => {
    const audio = {
      content: fs.readFileSync(filename).toString('base64'),
    };
    const request = {
      config: config,
      audio: audio,
    };
    return client
      .recognize(request)
      .then(data => {
        const response = data[0];
        const transcription = response.results
          .map(result => result.alternatives[0].transcript)
          .join('\n');
        console.log(`Transcription: `, transcription);
        sendOverSocket('momotalk("'+transcription+'")');
      })
      .catch(err => {
        console.error('ERROR:', err);
      });
  }

    server.on('connection', function(binaryClient){
      var fileWriter = null;

      binaryClient.on('stream', function(stream, meta){
        console.log(`Stream opened. Starting a new file to ${filename}`);
        var  fileWriter = new wav.FileWriter(filename, {
          channels: 1,
          sampleRate: 44100,
          bitDepth: 16
        });
        stream.pipe(fileWriter);
        stream.on('end', function() {
          console.log('Stream closed.');
          fileWriter.end();
          var stats = fs.statSync(filename);
          console.log(`${filename} size: ${stats.size}`);
          fileWriter = null;
          recognizeStream(filename);
        });
      });

      binaryClient.on('close', function(){
        console.log('Client closed.');
        if (fileWriter != null) {
          fileWriter.end();
          console.log(`${filename} size: ${stats.size}`);
        }
      });

});
server2.on('connection', function(binaryClient2){
  binaryClient2.on('stream', function(stream2, meta){ //tää ei välttämättä toimi jos tää on Google Cloud spesifi jollain tasolla??
    const speaker = new Speaker({
        channels: 1,
        bitDepth: 16,
        sampleRate: 44100
      });

    //process.stdin.pipe(speaker);
    stream2.pipe(speaker);
    stream2.on('end', function(){
      speaker.end();
      console.log("Live stream closed!")
    });
  });
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

}
