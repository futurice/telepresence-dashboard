(function ($) {

  var Stream = null;
  var audioContext = window.AudioContext;
  var context = new audioContext();

  //$('#start-record').click(function(event){
  $(document).keydown(function(){
    if (Stream === null && event.code == 'Space') {
      var session = {
        audio: true,
        video: false
      };
      var binaryClient = new BinaryClient('ws://localhost:9002');
      console.log("space pressed.");
      navigator.getUserMedia(session, initializeRecorder, onError);
      binaryClient.on('open', function() {
        Stream = binaryClient.createStream();

      });
    }
  });

  $(document).keyup(function(){
    if (event.code == 'Space') {
      console.log("space released");
    }
  });

  function onError(error) {
    // TODO: IMPLEMENT
  }

  function initializeRecorder(stream) {
    var audioInput = context.createMediaStreamSource(stream);
    var bufferSize = 2048;

    console.log(context.sampleRate);
    var recorder = context.createScriptProcessor(bufferSize, 1, 1);
    recorder.onaudioprocess = recorderProcess;
    audioInput.connect(recorder);
    recorder.connect(context.destination);
  }

  function recorderProcess(e) {
    var left = e.inputBuffer.getChannelData(0);
    Stream.write(convertFloat32toInt16(left));
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
