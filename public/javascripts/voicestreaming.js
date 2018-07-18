(function ($) {

  var Stream = null;
  var Stream2 = null;
  var Stream3 = null;
  var audioContext = window.AudioContext;
  var context = new audioContext();
  var binaryClient;
  var binaryClient2;
  var binaryClient3;

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

  $(document).keydown(function(){
    if (Stream2 === null && event.code == 'KeyS') {
      var session = {
        audio: true,
        video: false
      };
      binaryClient2 = new BinaryClient('ws://localhost:9003');
      navigator.getUserMedia(session, initializeRecorder2, onError);
      binaryClient2.on('open', function() {
        Stream2 = binaryClient2.createStream();
      });
    };
  });

  $(document).keydown(function(){
    if (Stream3 === null && event.code == 'KeyD') {
      var session = {
        audio: true,
        video: false
      };
      binaryClient3 = new BinaryClient('ws://localhost:9004');
      navigator.getUserMedia(session, initializeRecorder3, onError);
      binaryClient3.on('open', function() {
        Stream3 = binaryClient3.createStream();
      });
    };
  });

  $('#tele-english').click(function(){
    const languageCode = 'en-US';
    console.log("English");
    $.post('voice/run/language/'+languageCode, function(data)
      {console.log(data);
      },"json")
      .fail(function(error){console.log(error)});
    });

  $('#tele-finnish').click(function(){
    const languageCode = 'fi-FI';
    $.post('voice/run/language/'+languageCode, function(data)
      {console.log(data);
      },"json")
      .fail(function(error){console.log(error)});
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
  counter = 0
  function initializeRecorder2(audioStream) {
    var audioInput = context.createMediaStreamSource(audioStream);
    var pitchShift = PitchShift(context);
    pitchShift.transpose = 12;
    pitchShift.wet.value = 2;
    pitchShift.dry.value = 0.5;
    var bufferSize = 2048;
    if (counter == 0) {
    console.log(context.sampleRate);
    var recorder = context.createScriptProcessor(bufferSize, 1, 1);
    recorder.onaudioprocess = recorderProcess2;
    audioInput.connect(pitchShift);
    pitchShift.connect(recorder);
    recorder.connect(context.destination);
  }
    $(document).unbind("keyup")
      .keyup(function() {
        if (event.code == 'KeyS') {
          console.log(Stream2);
          Stream2.end();
          Stream2 = null;
          console.log("KeyS released.");
          counter += 1;
        }
      });
  }

  counter3 = 0
  function initializeRecorder3(audioStream) {
    var audioInput = context.createMediaStreamSource(audioStream);
    var bufferSize = 2048;
    if (counter3 == 0) {
    console.log(context.sampleRate);
    var recorder = context.createScriptProcessor(bufferSize, 1, 1);
    recorder.onaudioprocess = recorderProcess3;
    audioInput.connect(recorder);
    recorder.connect(context.destination);
  }
    $(document).unbind("keyup")
      .keyup(function() {
        if (event.code == 'KeyD') {
          console.log(Stream3);
          Stream3.end();
          Stream3 = null;
          console.log("KeyD released.");
          counter3 += 1;
        }
      });
  }

  function recorderProcess(e) {
    var left = e.inputBuffer.getChannelData(0);
    if (Stream !== null) {
      Stream.write(convertFloat32toInt16(left));
    }
  }

  function recorderProcess2(e) {
    var left = e.inputBuffer.getChannelData(0);
    if (Stream2 !== null) {
    Stream2.write(convertFloat32toInt16(left));
    }
  }

  function recorderProcess3(e) {
    var left = e.inputBuffer.getChannelData(0);
    if (Stream3 !== null) {
    Stream3.write(convertFloat32toInt16(left));
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
