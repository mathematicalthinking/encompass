const sockets = {};

sockets.init = function (server) {
  this.io = require('socket.io')(server);
};

module.exports = sockets;
