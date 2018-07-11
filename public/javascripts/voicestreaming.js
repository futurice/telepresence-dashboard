(function ($) {

  var Stream = null;
  let Stream2 = null;
  var audioContext = window.AudioContext;
  var context = new audioContext();
  var binaryClient;
  var binaryClient2;


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
      //Stream2 = null;
    }
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

  function initializeRecorder2(audioStream) {
    var audioInput = context.createMediaStreamSource(audioStream);
    var bufferSize = 2048;

    console.log(context.sampleRate);
    var recorder = context.createScriptProcessor(bufferSize, 1, 1);
    recorder.onaudioprocess = recorderProcess2;
    audioInput.connect(recorder);
    recorder.connect(context.destination);
    $(document).unbind("keyup")
      .keyup(function() {
        if (event.code == 'KeyS') {
          console.log(Stream2);
          Stream2.end();
          Stream2 = null;
          console.log("KeyS released.");
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
    //worker.postMessage({cmd: 'resample', buffer: left});
    //drawBuffer(left);
    if (Stream2 !== null) {
    Stream2.write(convertFloat32toInt16(left));
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

  var Dolby=Dolby||{};!function(){"use strict";Dolby.supportDDPlus=!1;var e=new Audio;""!=e.canPlayType('audio/mp4;codecs="ec-3"')&&(-1==navigator.userAgent.indexOf("CPU iPhone OS 9_3")&&-1==navigator.userAgent.indexOf("CPU OS 9_3")||-1==navigator.userAgent.indexOf("Safari")||-1==navigator.userAgent.indexOf("Version/9")||
  (Dolby.supportDDPlus=!0),-1!=navigator.userAgent.indexOf("MacOSX10_1")&&-1!=navigator.userAgent.indexOf("Safari")&&-1!=navigator.userAgent.indexOf("Version/9")&&(Dolby.supportDDPlus=!0),-1!=
  navigator.userAgent.indexOf("Edge")&&(Dolby.supportDDPlus=!0),-1!=navigator.userAgent.indexOf("Windows Phone 10")&&(Dolby.supportDDPlus=!1)),Dolby.checkDDPlus=function(){return Dolby.supportDDPlus}}();
  var dolbySupported = Dolby.checkDDPlus();

  var voice = new Pizzicato.Sound({ source: 'input', options: {release: 0, attack: 0} }, function(err) {
  	if (!err) return;
  	document.getElementById('play-voice').setAttribute('disabled', 'disabled');
  	document.getElementById('volume-voice').setAttribute('disabled', 'disabled');
  	document.getElementById('microphone-error').style.display = 'block';
  });

  var segments = [
  	{
  		audio: voice,
  		playButton: document.getElementById('play-voice'),
  		stopButton: document.getElementById('stop-voice'),
  		volumeSlider: document.getElementById('volume-voice')
  	}
  ]

  for (var i = 0; i < segments.length; i++) {
  	(function(segment) {

  		segment.audio.on('play', function() {
  			segment.playButton.classList.add('pause');
  		});

  		segment.audio.on('stop', function() {
  			segment.playButton.classList.remove('pause');
  		});

  		segment.audio.on('pause', function() {
  			segment.playButton.classList.remove('pause');
  		});

  		segment.playButton.addEventListener('click', function(e) {
  			if (segment.playButton.classList.contains('pause'))
  				segment.audio.pause();
  			else
  				segment.audio.play();
  		});

  		segment.volumeSlider.addEventListener('input', function(e) {
  			var volumeDisplay = segment.volumeSlider.parentNode.getElementsByClassName('slider-value')[0];
  			volumeDisplay.innerHTML = segment.audio.volume = e.target.valueAsNumber;
  		});

  		if (segment.releaseSlider) {
  			segment.releaseSlider.addEventListener('input', function(e) {
  				var releaseDisplay = segment.releaseSlider.parentNode.getElementsByClassName('slider-value')[0];
  				releaseDisplay.innerHTML = segment.audio.release = e.target.valueAsNumber;
  			});
  		}

  		if (!segment.effects || !segment.effects.length)
  			return;

  		for (var i = 0; i < segment.effects.length; i++) {
  			var effect = segment.effects[i];

  			for (var key in effect.parameters) {
  				(function(key, slider, instance){

  					var display = slider.parentNode.getElementsByClassName('slider-value')[0];

  					slider.addEventListener('input', function(e) {
  						display.innerHTML = instance[key] = e.target.valueAsNumber;
  					});

  				})(key, effect.parameters[key], effect.instance);
  			}
  		}

  	})(segments[i]);
  }

})(jQuery);
