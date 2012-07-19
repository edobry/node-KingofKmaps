var io = require('socket.io').listen(8080);

io.sockets.on('connection', function (socket) {
  console.log("Client connected");

  socket.on('message', function (msg){
  	console.log(msg);
  })

  socket.on('disconnect', function () {
    console.log("Client disconnected");
  });
});