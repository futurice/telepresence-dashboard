(function ($) {

  var Stream = null;
  var audioContext = window.AudioContext;
  var context = new audioContext();
  var binaryClient;

  //$('#start-record').click(function(event){
  $(document).keydown(function(){
    if (Stream === null && event.code == 'Space') {
      var session = {
        audio: true,
        video: false
      };
      binaryClient = new BinaryClient('ws://localhost:9002');
      console.log("space pressed.");
      navigator.getUserMedia(session, initializeRecorder, onError);
      binaryClient.on('open', function() {
        Stream = binaryClient.createStream();
      });
    }
  });

  function onError(error) {
    console.log("An error has occurred.");
  }

  function initializeRecorder(audioStream) {
    var audioInput = context.createMediaStreamSource(audioStream);
    var bufferSize = 2048;

    console.log(context.sampleRate);
    var recorder = context.createScriptProcessor(bufferSize, 1, 1);
    recorder.onaudioprocess = recorderProcess;
    audioInput.connect(recorder);
    recorder.connect(context.destination);
    $(document).unbind("keyup")
      .keyup(function() {
        if (event.code == 'Space') {
          console.log(Stream);
          Stream.end();
          Stream = null;
          console.log("Space released");
      }
    });
  }

  function recorderProcess(e) {
    var left = e.inputBuffer.getChannelData(0);
    if (Stream !== null) {
      Stream.write(convertFloat32toInt16(left));
    }
  }

  function convertFloat32toInt16(buffer) {
    bl = buffer.length;
    buf = new Int16Array(bl);
    while (bl--) {
      buf[bl] = Math.min(1, buffer[bl])*0x7FFF;
    }
    return buf.buffer;
  }


})(jQuery);

//Clear the wav file after having stopped recording.
