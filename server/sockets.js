const _ = require('underscore');
const socketInit = require('./socketInit');

module.exports = function () {
  const io = socketInit.io;
  io.sockets.on('connection', socket => {
    console.log('user connected!');

    socket.on('disconnect', () => {
      console.log('socket disconnected');
    });

  });

};

