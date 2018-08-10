const speech = require('@google-cloud/speech');
const fs = require('fs');
var net = require('net');
var Lame = require("node-lame").Lame;
const client = new speech.SpeechClient({
  keyFilename: '/Users/nulm/.config/gcloud/application_default_credentials.json'
});

const encoding = 'LINEAR16';
const sampleRateHertz = 24000;
//24000
var config = {
  encoding: 'LINEAR16',
  sampleRateHertz: 24000,
  languageCode: 'en-US',
};

const recognizeStream = (filename) => {
  console.log("Reading: " + filename);
  const decoder = new Lame({
    "output": "./filename.wav"
  }).setFile("./filename.mp3");

  decoder.decode()
  .then(() => {
    console.log("Decoding finished.");
  })
  .catch((error) =>{
    console.log(error);
  });
  console.log(filename);
  const filename1 = './filename.wav';
  const audio = {
    content: fs.readFileSync(filename1).toString('base64'),
  };
  var config = {
    encoding: 'LINEAR16',
    sampleRateHertz: 24000,
    languageCode: 'en-US',
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
};

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
  process.on('uncaughtException', function (err) {
      console.log(err);
    });
}

module.exports = recognizeStream;
