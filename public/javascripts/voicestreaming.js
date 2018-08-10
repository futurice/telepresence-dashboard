(function ($) {
  var Stream = null;
  var Stream2 = null;
  var Stream3 = null;
  var audioContext = window.AudioContext;
  var context = new audioContext();
  var binaryClient;
  var binaryClient2;
  var binaryClient3;
  var streams = [];
  var streams2 = [];
  var streams3 = [];

  $('#tele-finnish').click(function(){
    var languageCode = "fi-FI";
    $.post('api/run/languageCode', {languageCode:languageCode}, function(data){
      console.log(data);
    });
  });

  $('#tele-english').click(function(){
    var languageCode = 'en-US';
    $.post('api/run/languageCode', {languageCode:languageCode}, function(data){
      console.log(data);
    });
  });

  $(document).ready(function() {
    var session = {
      audio: true,
      video: false
    };
    navigator.getUserMedia(session, initializeRecorder, onError);
  });

  $(document).keydown(function(){
    if (streams.length == 0 && event.code == 'Space') {
      $('#stream-alert').css("display", "inline");
      binaryClient = new BinaryClient('ws://localhost:9002');
      console.log("space pressed.");
      binaryClient.on('open', function() {
        streams.push(binaryClient.createStream());
      });
    };
  });

  $(document).keyup(function() {
    if (event.code == 'Space') {
      $('#stream-alert').css("display", "none");
      console.log("Space released");
      var stream = streams.pop();
      while (stream !== undefined) {
        stream.end();
        stream = streams.pop();
        console.log(streams);
      }
    }
  });

  $(document).keydown(function(){
    if (streams2.length == 0 && event.code == 'KeyS') {
      $('#stream-alert').css("display", "inline");
      binaryClient2 = new BinaryClient('ws://localhost:9003');
      binaryClient2.on('open', function() {
        streams2.push(binaryClient2.createStream());
      });
    };
  });

  $(document).keyup(function() {
      if (event.code == 'KeyS') {
        $('#stream-alert').css("display", "none");
        console.log("KeyS released.");
        var stream2 = streams2.pop();
        while (stream2 !== undefined) {
          stream2.end();
          stream2 = streams2.pop();
          console.log(streams2);
        }
      }
    });

  $(document).keydown(function(){
    if (streams3.length == 0 && event.code == 'KeyD') {
      $('#stream-alert').css("display", "inline");
      binaryClient3 = new BinaryClient('ws://localhost:9004');
      binaryClient3.on('open', function() {
        streams3.push(binaryClient3.createStream());
      });
    };
  });

  $(document).keyup(function() {
    if (event.code == 'KeyD') {
      $('#stream-alert').css("display", "none");
      var stream3 = streams3.pop();
      while (stream3 !== undefined) {
        stream3.end();
        stream3 = streams3.pop();
        console.log(streams3);
      }
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
  }

  function initializeRecorder2(audioStream) {
    var audioInput = context.createMediaStreamSource(audioStream);
    var pitchShift = PitchShift(context);
    var biquadFilter = context.createBiquadFilter();
    var bufferSize = 2048;
    pitchShift.transpose = 1;
    pitchShift.wet.value = 0.5;
    pitchShift.dry.value = 0;
    biquadFilter.frequency.value = 200;
    biquadFilter.type = "highshelf";
    biquadFilter.gain.value = 20;
    console.log(context.sampleRate);
    var recorder = context.createScriptProcessor(bufferSize, 1, 1);
    recorder.onaudioprocess = recorderProcess;
    audioInput.connect(pitchShift);
    pitchShift.connect(biquadFilter);
    biquadFilter.connect(recorder);
    recorder.connect(context.destination);
  }

  function recorderProcess(e) {
    var left = e.inputBuffer.getChannelData(0);
    if (streams.length !== 0) {
      streams[0].write(convertFloat32toInt16(left));
    }
    if (streams2.length !== 0) {
      streams2[0].write(convertFloat32toInt16(left));
    }
    if (streams3.length !== 0) {
    streams3[0].write(convertFloat32toInt16(left));
    }
  }

  function convertFloat32toInt16(buffer) {
    var bl = buffer.length;
    var buf = new Int16Array(bl);
    while (bl--) {
      buf[bl] = Math.min(1, buffer[bl])*0x7FFF;
    }
    return buf.buffer;
  }

})(jQuery);
