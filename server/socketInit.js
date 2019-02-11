const sockets = {};

sockets.init = function(server) {
  this.io = require('socket.io').listen(server);
};

module.exports = sockets;