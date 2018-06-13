var binaryServer = require('binaryjs').BinaryServer;
var wav = require('wav');
const speech = require('@google-cloud/speech');
const fs = require('fs');

module.exports = function createServer() {


  var server = binaryServer({port:9002});
    // Imports the Google Cloud client library


  // Creates a client
  const client = new speech.SpeechClient({
    keyFilename: '/Users/nulm/.config/gcloud/application_default_credentials.json'
  });

  const filename = '/Users/nulm/Desktop/telepresence-dashboard/testi.wav'
  const encoding = 'LINEAR16';
  const sampleRateHertz = 16000;
  const languageCode = 'en-US';

  const request = {
    config: {
      encoding: encoding,
      sampleRateHertz: sampleRateHertz,
      languageCode: languageCode,
    },
    interimResults: false, // If you want interim results, set this to true
  };

  // Create a recognize stream
  const recognizeStream = client
    .streamingRecognize(request)
    .on('error', console.error)
    .on('data', data => {
      console.log(`Transcription: ${data.results[0].alternatives[0].transcript}`);
    });

    server.on('connection', function(binaryClient){
      var fileWriter = null;

      binaryClient.on('stream', function(stream, meta){
        var  fileWriter = new wav.FileWriter('testi.wav', {
          channels: 1,
          sampleRate: 44100,
          bitDepth: 16
        });
        stream.pipe(fileWriter);
        stream.on('end', function() {
          fileWriter.end();
          fs.createReadStream(filename).pipe(recognizeStream);
        });
      });

      binaryClient.on('close', function() {
        if (fileWriter != null) {
          fileWriter.end();
        }
      });
})


  // Instantiates a client. If you don't specify credentials when constructing
  // the client, the client library will look for credentials in the
  // environment.

  //server.on('connection', function(binaryClient) {
    //binaryClient.on('stream', function (stream, meta) {
    //  console.log('Opening new stream');
      //stream.on('error', console.error)
        //.on('end', function() {
          //console.log('Binary stream from frontend ended.')
        //})
      //  .pipe(recognizeStream);
    //});
  //});


}
