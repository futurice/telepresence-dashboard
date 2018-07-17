(function ($) {

  var Stream = null;
  var Stream2 = null;
  var Stream3 = null;
  var Stream4 = null;
  var audioContext = window.AudioContext;
  var context = new audioContext();
  var binaryClient;
  var binaryClient2;
  var binaryClient3;
  var binaryClient4;


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

  $(document).keydown(function(){
    if (Stream4 === null && event.code == 'KeyF') {
      var session = {
        audio: true,
        video: false
      };
      binaryClient4 = new BinaryClient('ws://localhost:9005');
      navigator.getUserMedia(session, initializeRecorder4, onError);
      binaryClient4.on('open', function() {
        Stream4 = binaryClient4.createStream();
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
    var distortion = context.createWaveShaper();
    var biquadFilter = context.createBiquadFilter();
    var compressor = context.createDynamicsCompressor();
    compressor.threshold.setValueAtTime(-50, context.currentTime);
    compressor.knee.setValueAtTime(40, context.currentTime);
    compressor.ratio.setValueAtTime(12, context.currentTime);
    compressor.attack.setValueAtTime(0, context.currentTime);
    compressor.release.setValueAtTime(0.25, context.currentTime);
    var doppler = context.listener;
    doppler.dopplerFactor = 1;
    biquadFilter.type = "lowshelf";
    biquadFilter.frequency.value = 200;
    biquadFilter.gain.value = 5;
    biquadFilter.detune.value = -4000;
    var bufferSize = 2048;
    if (counter == 0) {
    console.log(context.sampleRate);
    var recorder = context.createScriptProcessor(bufferSize, 1, 1);
    recorder.onaudioprocess = recorderProcess2;
    audioInput.connect(distortion);
    distortion.connect(biquadFilter);
    biquadFilter.connect(compressor);
    compressor.connect(recorder);
    distortion.curve = makeDistortionCurve(400);
    distortion.oversample = 'none';
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

  function makeDistortionCurve(amount) {
  var k = typeof amount === 'number' ? amount : 0,
    n_samples = 44100,
    curve = new Float32Array(n_samples),
    deg = Math.PI / 180,
    i = 0,
    x;
  for ( ; i < n_samples; ++i ) {
    x = i * 2 / n_samples - 1;
    curve[i] = ( 3 + k ) * x * 20 * deg / ( Math.PI + k * Math.abs(x) );
  }
  return curve;
};

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

  counter4 = 0
  function initializeRecorder4(audioStream) {
    var audioInput = context.createMediaStreamSource(audioStream);
    var bufferSize = 2048;
    var pitchShift = PitchShift(context);
    pitchShift.transpose = 12;
    pitchShift.wet.value = 2;
    pitchShift.dry.value = 0.5;
    if (counter4 == 0) {
    console.log(context.sampleRate);
    var recorder = context.createScriptProcessor(bufferSize, 1, 1);
    recorder.onaudioprocess = recorderProcess4;
    audioInput.connect(pitchShift);
    pitchShift.connect(recorder);
    recorder.connect(context.destination);
  }
    $(document).unbind("keyup")
      .keyup(function() {
        if (event.code == 'KeyF') {
          console.log(Stream4);
          Stream4.end();
          Stream4 = null;
          console.log("KeyF released.");
          counter4 += 1;
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

  function recorderProcess4(e) {
    var left = e.inputBuffer.getChannelData(0);
    if (Stream4 !== null) {
    Stream4.write(convertFloat32toInt16(left));
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
  /*
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

  var ringModulator = new Pizzicato.Effects.RingModulator({
    speed: 1800,
    distortion: 10,
    mix: 0.5
  });

  voice.addEffect(ringModulator);

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
  }*/

})(jQuery);
