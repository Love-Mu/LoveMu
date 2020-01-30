const socket_io = require('socket.io');
const io = socket_io();
let socketApi = {};

socketApi = io;

io.on('connection', (socket) => {
  console.log('User has Connected');
  socket.on('message', (msg) => {
    io.emit('message', msg);
  });
});

module.exports = socketApi;
