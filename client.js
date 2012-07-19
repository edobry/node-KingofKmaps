var io = require('socket.io-client');
var socket = io.connect("http://localhost:8080");
var stdin = process.stdin;
var stdout = process.stdout;

socket.on('connect', function () {
  console.log("Connected");
  stdin.resume();
  stdin.on('data', function(input){
  	  	socket.send(input.toString().trim());

  });
});
socket.on('message', function (msg) {
  console.log(msg);
});
socket.on('disconnect', function () {
  console.log("Disconnected");
});