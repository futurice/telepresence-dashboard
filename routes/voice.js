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

  const filename = 'testi.wav'
  const encoding = 'LINEAR16';
  const sampleRateHertz = 44100;
  const languageCode = 'en-US';

  const config = {
      encoding: encoding,
      sampleRateHertz: sampleRateHertz,
      languageCode: languageCode,
    };
  const audio = {
    content: fs.readFileSync(filename).toString('base64'),
    };
  const request = {
    config: config,
    audio: audio,
    };

  const recognizeStream = client
    .recognize(request)
    .then(data => {
      const response = data[0];
      const transcription = response.results
        .map(result => result.alternatives[0].transcript)
        .join('\n');
      console.log(`Transcription: `, transcription);
    })
    .catch(err => {
      console.error('ERROR:', err);
    });

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

    //TODO: transcript pitää siirtää voicestreamingiin jonka jälkeen se voidaan post-komennolla syöttää
          // socketin kautta myrobotlabiin

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
