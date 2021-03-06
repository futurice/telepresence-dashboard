var binaryServer = require('binaryjs').BinaryServer;
var wav = require('wav');
const speech = require('@google-cloud/speech');
const fs = require('fs');
var net = require('net');
var express = require('express');
var router = express.Router();
languageCode = 'fi-FI';
var Speaker = require('speaker');

//Don't crash even if MyRobotLab is down
process.on('uncaughtException', function (err) {
  console.log(err);
});

module.exports = function createServer() {

  var server = binaryServer({port:9002});
    // Imports the Google Cloud client library

  var server2 = binaryServer({port:9003});

  var server3 = binaryServer({port:9004});

  // Creates a client
  const client = new speech.SpeechClient({
    keyFilename: '/Users/nulm/.config/gcloud/application_default_credentials.json'
  });

  const filename = 'testi.wav';
  const encoding = 'LINEAR16';
  const sampleRateHertz = 44100;

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
  console.log("Server 2 opened.");
  binaryClient2.on('stream', function(stream2, speaker, meta){
    var speaker = new Speaker({
      channels: 1,
      sampleRate: 44100,
      bitDepth: 16
    });
    console.log("Client 2 opened");
    stream2.pipe(speaker);
    sendOverSocket("openjaw()");
    stream2.on('end', function() {
      console.log('Stream 2 closed.');
      binaryClient2.close();
    });
  });
  binaryClient2.on('close', function(){
    console.log('Client 2 closed.');
    sendOverSocket("closejaw()");
  });
});

server3.on('connection', function(binaryClient3){
  console.log("Server 3 opened.");
  binaryClient3.on('stream', function(stream3, speaker, meta){
    var speaker = new Speaker({
      channels: 1,
      sampleRate: 44100,
      bitDepth: 16
    });
    console.log("Client 3 opened.");
    stream3.pipe(speaker);
    stream3.on('end', function() {
      console.log('Stream 3 closed.');
      binaryClient3.close();
    });
  });
  binaryClient3.on('close', function(){
    console.log('Client 3 closed.');
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

} // module.exports
