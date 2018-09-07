var express = require('express');
var router = express.Router();
var visionGestures = require('../data/visioncodes.json');
const LiveCam = require('livecam');
const webcam_server = new LiveCam({
  'start' : function() {
    console.log('WebCam server started!');
  }
});

webcam_server.broadcast();

router.get('/', function(req, res, next) {
  res.render('vision', {
    buttons: visionGestures.gestures
  });
  //res.render('vision2');
});



/*
var socketIO = require('socket.io');
var fs = require('fs');
var path = require('path');
var server = [];
var sockets = [];

var io = socketIO(server);

io.on('connection', function(socket){
  console.log("io connected!");

  socket.emit('add-users', {
    users: sockets
  });

  socket.broadcast.emit('add-users', {
    users: [socket.id]
  });

  socket.on('make-answer', function(data)  {
    socket.to(data.to).emit('answer-made', {
      socket: socket.id,
      answer: data.answer
    });
  });

  socket.on('disconnect', function() {
    sockets.splice(sockets.indexOf(socket.id), 1);
    io.emit('remove-user', socket.id);
  });

  sockets.push(socket.id);
});
*/
/*router.get('/', function(req, res, next) {
  res.render('index', { title: 'Telepresence', currentKey: scenario, scenarioKeys: Object.keys(gestures.scenarios),
  buttons: gestures.scenarios[scenario] });
});*/
module.exports = router;
